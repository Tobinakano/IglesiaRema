// Backend Express para autenticación y protección de rutas
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const session = require('express-session');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const app = express();
const PORT = 4000;

// Configuración de la base de datos
const dbPath = path.join(__dirname, 'db', 'personas.db');
const db = new sqlite3.Database(dbPath);

// Middlewares
app.use(cors({ 
  origin: ['http://localhost:5173', 'http://localhost:80', 'http://localhost'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());
app.use(session({
  secret: 'remanente-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, 
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 // 24 horas
  }
}));

// Inicializar la base de datos si no existe
const initSql = path.join(__dirname, 'db', 'init.sql');
const initializeDB = () => {
  console.log('📦 Verificando base de datos...');
  const initScript = fs.readFileSync(initSql, 'utf8');
  
  // Usar exec para ejecutar todo el script
  try {
    db.exec(initScript);
    console.log('✅ BD inicializada correctamente');
  } catch (err) {
    console.error('❌ Error inicializando BD:', err);
  }
};

// Verificar si la tabla personas existe y tiene datos
db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='personas'", (err, row) => {
  if (err) {
    console.error('Error verificando BD:', err);
  } else if (!row) {
    console.log('Tabla personas no existe, inicializando...');
    initializeDB();
  } else {
    // Tabla existe, verificar si tiene datos
    db.get('SELECT COUNT(*) as count FROM personas', (err, row) => {
      if (err || row.count === 0) {
        console.log('Tabla personas vacía, reinicializando...');
        initializeDB();
      }
    });
  }
});

// Configurar carpeta de uploads para flayers
const uploadsDir = path.join(__dirname, 'uploads', 'flayers');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configurar multer para carga de imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen'));
    }
  }
});

// Servir archivos estáticos de uploads
app.use('/uploads/flayers', express.static(uploadsDir));

// Endpoint de login
app.post('/api/login', (req, res) => {
  const { usuario, contrasena } = req.body;
  db.get(
    'SELECT * FROM personas WHERE usuario = ? AND contrasena = ?',
    [usuario, contrasena],
    (err, user) => {
      if (err) return res.status(500).json({ error: 'Error en el servidor' });
      if (!user) return res.status(401).json({ error: 'Credenciales incorrectas' });
      req.session.user = { id: user.id, usuario: user.usuario, nombre: user.nombre, rol: user.rol };
      res.json({ ok: true, usuario: user.usuario, nombre: user.nombre, rol: user.rol });
    }
  );
});

// Endpoint para saber si está autenticado
app.get('/api/auth', (req, res) => {
  if (req.session.user) {
    res.json({ ok: true, user: req.session.user });
  } else {
    res.status(401).json({ ok: false });
  }
});

// Endpoint de logout
app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: 'Error al cerrar sesión' });
    res.json({ ok: true });
  });
});

// Middleware de protección
function requireAuth(req, res, next) {
  if (req.session.user) return next();
  res.status(401).json({ error: 'No autorizado' });
}

// Obtener todas las personas registradas
app.get('/api/personas', requireAuth, (req, res) => {
  db.all('SELECT id, nombre, apellido, rol FROM personas', (err, rows) => {
    if (err) return res.status(500).json({ error: 'Error en el servidor' });
    res.json(rows || []);
  });
});

// Crear una nueva persona
app.post('/api/personas', requireAuth, (req, res) => {
  const { nombre, apellido, usuario, contrasena, rol } = req.body;
  
  // Validar que todos los campos sean requeridos
  if (!nombre || !apellido || !usuario || !contrasena || !rol) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }
  
  // Verificar que el usuario no sea duplicado
  db.get('SELECT id FROM personas WHERE usuario = ?', [usuario], (err, row) => {
    if (err) return res.status(500).json({ error: 'Error en el servidor' });
    if (row) return res.status(400).json({ error: 'El usuario ya existe' });
    
    // Insertar nueva persona
    db.run(
      'INSERT INTO personas (nombre, apellido, usuario, contrasena, rol) VALUES (?, ?, ?, ?, ?)',
      [nombre, apellido, usuario, contrasena, rol],
      function(err) {
        if (err) return res.status(500).json({ error: 'Error al crear el usuario' });
        res.json({ ok: true, id: this.lastID });
      }
    );
  });
});

// Obtener una persona por ID
app.get('/api/personas/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  db.get('SELECT id, nombre, apellido, usuario, contrasena, rol FROM personas WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: 'Error en el servidor' });
    if (!row) return res.status(404).json({ error: 'Persona no encontrada' });
    res.json(row);
  });
});

// Actualizar una persona
app.put('/api/personas/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, contrasena, rol } = req.body;
  
  // Validar que los campos requeridos estén presentes
  if (!nombre || !apellido || !rol) {
    return res.status(400).json({ error: 'Los campos nombre, apellido y rol son requeridos' });
  }
  
  // Verificar que la persona exista
  db.get('SELECT id FROM personas WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: 'Error en el servidor' });
    if (!row) return res.status(404).json({ error: 'Persona no encontrada' });
    
    // Si contrasena es proporcionada, actualizar con contraseña, de lo contrario sin cambiarla
    if (contrasena) {
      db.run(
        'UPDATE personas SET nombre = ?, apellido = ?, contrasena = ?, rol = ? WHERE id = ?',
        [nombre, apellido, contrasena, rol, id],
        function(err) {
          if (err) return res.status(500).json({ error: 'Error al actualizar el usuario' });
          res.json({ ok: true });
        }
      );
    } else {
      db.run(
        'UPDATE personas SET nombre = ?, apellido = ?, rol = ? WHERE id = ?',
        [nombre, apellido, rol, id],
        function(err) {
          if (err) return res.status(500).json({ error: 'Error al actualizar el usuario' });
          res.json({ ok: true });
        }
      );
    }
  });
});

// Eliminar una persona
app.delete('/api/personas/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  
  // Verificar que la persona exista
  db.get('SELECT id FROM personas WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: 'Error en el servidor' });
    if (!row) return res.status(404).json({ error: 'Persona no encontrada' });
    
    // Eliminar la persona
    db.run(
      'DELETE FROM personas WHERE id = ?',
      [id],
      function(err) {
        if (err) return res.status(500).json({ error: 'Error al eliminar el usuario' });
        res.json({ ok: true });
      }
    );
  });
});

// Endpoint protegido de ejemplo
app.get('/api/session', (req, res) => {
  if (req.session.user) {
    res.json(req.session.user);
  } else {
    res.status(401).json({ error: 'No hay sesión activa' });
  }
});

// Endpoint para obtener el listado de asistencia
app.get('/api/asistencia', requireAuth, (req, res) => {
  db.all('SELECT id, nombre_completo, numero, sexo, grupo FROM asistencia ORDER BY grupo, LOWER(nombre_completo)', (err, rows) => {
    if (err) return res.status(500).json({ error: 'Error en el servidor' });
    res.json(rows || []);
  });
});

// Endpoint para crear nuevas personas en asistencia
app.post('/api/asistencia', requireAuth, (req, res) => {
  const { nombre_completo, numero, sexo, grupo } = req.body;
  
  if (!nombre_completo || !numero || !sexo || !grupo) {
    return res.status(400).json({ error: 'Nombre completo, número, sexo y grupo son requeridos' });
  }
  
  db.run(
    'INSERT INTO asistencia (nombre_completo, numero, sexo, grupo) VALUES (?, ?, ?, ?)',
    [nombre_completo, numero, sexo, grupo],
    function(err) {
      if (err) return res.status(500).json({ error: 'Error al crear la persona' });
      res.json({ ok: true, id: this.lastID, nombre_completo, numero, sexo, grupo });
    }
  );
});

// Endpoint para guardar las asistencias marcadas
app.post('/api/asistencia/registrar', requireAuth, (req, res) => {
  const { asistencias } = req.body;
  
  if (!asistencias || !Array.isArray(asistencias)) {
    return res.status(400).json({ error: 'Lista de asistencias requerida' });
  }
  
  const fecha = new Date().toISOString().split('T')[0];
  console.log(`[REGISTRAR] Guardando asistencias para fecha: ${fecha}`);
  console.log(`[REGISTRAR] Cantidad de asistencias a guardar: ${asistencias.length}`);
  console.log(`[REGISTRAR] Datos:`, asistencias);
  
  let guardadas = 0;
  
  const insertar = (index) => {
    if (index >= asistencias.length) {
      console.log(`[REGISTRAR] Guardadas ${guardadas} de ${asistencias.length}`);
      return res.json({ ok: true, guardadas });
    }
    
    const asistencia = asistencias[index];
    
    // Verificar si este registro ya existe para hoy
    db.get(
      'SELECT id FROM asistencia_registros WHERE fecha = ? AND persona_id = ?',
      [fecha, asistencia.id],
      (err, row) => {
        if (err) {
          console.error(`[REGISTRAR ERROR] Error al verificar duplicado: ${err.message}`);
          insertar(index + 1);
          return;
        }
        
        if (row) {
          // Ya existe, no guardar
          console.log(`[REGISTRAR] ${asistencia.nombre_completo} ya fue registrado hoy, saltando...`);
          insertar(index + 1);
          return;
        }
        
        // No existe, insertar
        db.run(
          'INSERT INTO asistencia_registros (fecha, persona_id, nombre_completo, numero, sexo, grupo) VALUES (?, ?, ?, ?, ?, ?)',
          [fecha, asistencia.id, asistencia.nombre_completo, asistencia.numero, asistencia.sexo, asistencia.grupo],
          function(err) {
            if (err) {
              console.error(`[REGISTRAR ERROR] Error al guardar asistencia ${index}: ${err.message}`);
            } else {
              console.log(`[REGISTRAR] Guardada asistencia ${index + 1}: ${asistencia.nombre_completo}`);
              guardadas++;
            }
            insertar(index + 1);
          }
        );
      }
    );
  };
  
  insertar(0);
});

// Endpoint para obtener resumen de asistencias por fecha
app.get('/api/asistencia/registros', requireAuth, (req, res) => {
  console.log('[REGISTROS RESUMEN] Obteniendo resumen de registros');
  db.all(
    `SELECT fecha, COUNT(*) as total FROM asistencia_registros GROUP BY fecha ORDER BY fecha DESC`,
    (err, rows) => {
      if (err) {
        console.error('[REGISTROS RESUMEN ERROR]:', err.message);
        return res.status(500).json({ error: 'Error en el servidor' });
      }
      console.log('[REGISTROS RESUMEN] Datos obtenidos:', rows);
      res.json(rows || []);
    }
  );
});

// Endpoint para obtener detalles de asistencia por fecha
app.get('/api/asistencia/registros/:fecha', requireAuth, (req, res) => {
  const { fecha } = req.params;
  db.all(
    'SELECT id, persona_id, nombre_completo, numero, sexo, grupo FROM asistencia_registros WHERE fecha = ? ORDER BY grupo, nombre_completo',
    [fecha],
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'Error en el servidor' });
      res.json(rows || []);
    }
  );
});

// Endpoint para eliminar un registro de asistencia por fecha
app.delete('/api/asistencia/registros/:fecha', requireAuth, (req, res) => {
  const { fecha } = req.params;
  
  db.run('DELETE FROM asistencia_registros WHERE fecha = ?', [fecha], function(err) {
    if (err) return res.status(500).json({ error: 'Error al eliminar el registro' });
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Registro no encontrado' });
    }
    res.json({ ok: true });
  });
});

// Endpoint para eliminar una persona de asistencia
app.delete('/api/asistencia/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM asistencia WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ error: 'Error al eliminar la persona' });
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Persona no encontrada' });
    }
    res.json({ ok: true });
  });
});

// ═══════════════════════════════════════════
// ENDPOINTS PARA FLAYERS
// ═══════════════════════════════════════════

// Obtener todos los flayers ordenados
app.get('/api/flayers', (req, res) => {
  db.all(
    'SELECT id, titulo, imagen_path, orden FROM flayers ORDER BY orden ASC, id ASC',
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'Error en el servidor' });
      // Convertir rutas de imágenes a URLs públicas
      const flayers = (rows || []).map(f => ({
        id: f.id,
        titulo: f.titulo,
        orden: f.orden,
        imagen: `/uploads/flayers/${f.imagen_path}`
      }));
      res.json(flayers);
    }
  );
});

// Crear nuevo flayer con imagen
// Helper para manejar errores de multer  
const handleMulterError = (handler) => (req, res, next) => {
  handler(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.error('❌ Error Multer:', err.message);
      return res.status(400).json({ error: 'Error al subir archivo: ' + err.message });
    } else if (err) {
      console.error('❌ Error:', err.message);
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};

app.post('/api/flayers', handleMulterError(upload.single('imagen')), (req, res) => {
  console.log('📥 POST /api/flayers - File:', req.file?.filename, 'Título:', req.body.titulo);
  
  const { titulo } = req.body;

  if (!titulo || !req.file) {
    console.log('❌ Validación fallida - Título:', !!titulo, 'Archivo:', !!req.file);
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(400).json({ error: 'Título e imagen son requeridos' });
  }

  // Obtener el orden más alto actual
  db.get('SELECT MAX(orden) as maxOrden FROM flayers', (err, row) => {
    if (err) {
      console.error('❌ Error obteniendo orden:', err);
      fs.unlinkSync(req.file.path);
      return res.status(500).json({ error: 'Error en el servidor' });
    }

    const nuevoOrden = (row.maxOrden || 0) + 1;
    console.log('📝 Insertando flayer con orden:', nuevoOrden);

    db.run(
      'INSERT INTO flayers (titulo, imagen_path, orden) VALUES (?, ?, ?)',
      [titulo, req.file.filename, nuevoOrden],
      function(err) {
        if (err) {
          console.error('❌ Error insertando en BD:', err);
          fs.unlinkSync(req.file.path);
          return res.status(500).json({ error: 'Error al crear el flayer' });
        }
        console.log('✅ Flayer guardado con ID:', this.lastID);
        res.json({
          ok: true,
          id: this.lastID,
          titulo,
          imagen: `/uploads/flayers/${req.file.filename}`,
          orden: nuevoOrden
        });
      }
    );
  });
});

// Eliminar flayer
app.delete('/api/flayers/:id', (req, res) => {
  const { id } = req.params;

  db.get('SELECT imagen_path FROM flayers WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: 'Error en el servidor' });
    if (!row) return res.status(404).json({ error: 'Flayer no encontrado' });

    // Eliminar archivo de imagen
    if (row.imagen_path && fs.existsSync(row.imagen_path)) {
      fs.unlinkSync(row.imagen_path);
    }

    // Eliminar registro de BD
    db.run('DELETE FROM flayers WHERE id = ?', [id], function(err) {
      if (err) return res.status(500).json({ error: 'Error al eliminar el flayer' });
      res.json({ ok: true });
    });
  });
});

// Cambiar orden de flayers (mover arriba/abajo)
app.put('/api/flayers/:id/reorder', (req, res) => {
  const { id } = req.params;
  const { direccion } = req.body; // 'arriba' o 'abajo'

  if (!direccion || !['arriba', 'abajo'].includes(direccion)) {
    return res.status(400).json({ error: 'Dirección debe ser "arriba" o "abajo"' });
  }

  db.get('SELECT orden FROM flayers WHERE id = ?', [id], (err, flayer) => {
    if (err) return res.status(500).json({ error: 'Error en el servidor' });
    if (!flayer) return res.status(404).json({ error: 'Flayer no encontrado' });

    const ordenActual = flayer.orden;
    let queryOrden;

    if (direccion === 'arriba') {
      // Buscar flayer con orden inmediatamente anterior (más bajo)
      queryOrden = 'SELECT id, orden FROM flayers WHERE orden < ? ORDER BY orden DESC LIMIT 1';
    } else {
      // Buscar flayer con orden inmediatamente siguiente (más alto)
      queryOrden = 'SELECT id, orden FROM flayers WHERE orden > ? ORDER BY orden ASC LIMIT 1';
    }

    db.get(queryOrden, [ordenActual], (err, otroFlayer) => {
      if (err) return res.status(500).json({ error: 'Error en el servidor' });
      if (!otroFlayer) {
        return res.status(400).json({ error: 'No hay flayer donde mover' });
      }

      const ordenOtro = otroFlayer.orden;
      const idOtro = otroFlayer.id;

      // Usar valor temporal para evitar conflictos de orden duplicado
      const tempOrden = -999;

      // 1. Actualizar flayer actual a valor temporal
      db.run('UPDATE flayers SET orden = ? WHERE id = ?', [tempOrden, id], (err) => {
        if (err) return res.status(500).json({ error: 'Error en paso 1 del reordenamiento' });

        // 2. Actualizar el otro flayer al orden del flayer actual
        db.run('UPDATE flayers SET orden = ? WHERE id = ?', [ordenActual, idOtro], (err) => {
          if (err) return res.status(500).json({ error: 'Error en paso 2 del reordenamiento' });

          // 3. Actualizar flayer actual al orden del otro flayer
          db.run('UPDATE flayers SET orden = ? WHERE id = ?', [ordenOtro, id], (err) => {
            if (err) return res.status(500).json({ error: 'Error en paso 3 del reordenamiento' });
            res.json({ ok: true });
          });
        });
      });
    });
  });
});

// Actualizar información de flayer
app.put('/api/flayers/:id', (req, res) => {
  const { id } = req.params;
  const { titulo } = req.body;

  if (!titulo) {
    return res.status(400).json({ error: 'Título es requerido' });
  }

  db.run(
    'UPDATE flayers SET titulo = ? WHERE id = ?',
    [titulo, id],
    function(err) {
      if (err) return res.status(500).json({ error: 'Error al actualizar el flayer' });
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Flayer no encontrado' });
      }
      res.json({ ok: true });
    }
  );
});

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
