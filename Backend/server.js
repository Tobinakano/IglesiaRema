// Backend Express para autenticación y protección de rutas - Versión PostgreSQL
const express = require('express');
const { Pool } = require('pg'); // Cambiado de sqlite3 a pg
const cors = require('cors');
const session = require('express-session');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000; // Permitir que la nube asigne el puerto automáticamente

// Configuración de la base de datos PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

// Middlewares
const allowedOrigins = [
  'https://iglesia-rema.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000'
];

app.use(cors({ 
  origin: function (origin, callback) {
    // Permitir peticiones sin origen (como apps móviles o herramientas tipo Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'El origen CORS para este sitio no está permitido.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
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

// Inicializar la base de datos leyendo el nuevo init.sql
const initSql = path.join(__dirname, 'db', 'init.sql');
const initializeDB = async () => {
  console.log('📦 Verificando base de datos en la nube...');
  try {
    const initScript = fs.readFileSync(initSql, 'utf8');
    await pool.query(initScript);
    console.log('✅ BD inicializada correctamente en PostgreSQL');
  } catch (err) {
    console.error('❌ Error inicializando BD:', err);
  }
};

// Verificar e inicializar las tablas de forma asíncrona
(async () => {
  try {
    const res = await pool.query("SELECT to_regclass('public.personas') as existe;");
    if (!res.rows[0].existe) {
      console.log('Tabla personas no existe, inicializando...');
      await initializeDB();
    } else {
      const countRes = await pool.query('SELECT COUNT(*) FROM personas');
      if (parseInt(countRes.rows[0].count) === 0) {
        console.log('Tabla personas vacía, reinicializando...');
        await initializeDB();
      }
    }
  } catch (err) {
    console.error('Error verificando BD durante el inicio:', err);
  }
})();

// Configurar carpeta de uploads para flayers
const uploadsDir = path.join(__dirname, 'uploads', 'flayers');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configurar multer para carga de imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => { cb(null, uploadsDir); },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) { cb(null, true); } 
    else { cb(new Error('Solo se permiten archivos de imagen')); }
  }
});

app.use('/uploads/flayers', express.static(uploadsDir));

// Endpoint de login
app.post('/api/login', async (req, res) => {
  const { usuario, contrasena } = req.body;
  try {
    const result = await pool.query('SELECT * FROM personas WHERE usuario = $1 AND contrasena = $2', [usuario, contrasena]);
    if (result.rows.length === 0) return res.status(401).json({ error: 'Credenciales incorrectas' });
    const user = result.rows[0];
    req.session.user = { id: user.id, usuario: user.usuario, nombre: user.nombre, rol: user.rol };
    res.json({ ok: true, usuario: user.usuario, nombre: user.nombre, rol: user.rol });
  } catch (err) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

app.get('/api/auth', (req, res) => {
  if (req.session.user) { res.json({ ok: true, user: req.session.user }); } 
  else { res.status(401).json({ ok: false }); }
});

app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: 'Error al cerrar sesión' });
    res.json({ ok: true });
  });
});

function requireAuth(req, res, next) {
  if (req.session.user) return next();
  res.status(401).json({ error: 'No autorizado' });
}

// Obtener todas las personas registradas
app.get('/api/personas', requireAuth, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, nombre, apellido, rol FROM personas');
    res.json(result.rows || []);
  } catch (err) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Crear una nueva persona
app.post('/api/personas', requireAuth, async (req, res) => {
  const { nombre, apellido, usuario, contrasena, rol } = req.body;
  if (!nombre || !apellido || !usuario || !contrasena || !rol) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }
  try {
    const checkUser = await pool.query('SELECT id FROM personas WHERE usuario = $1', [usuario]);
    if (checkUser.rows.length > 0) return res.status(400).json({ error: 'El usuario ya existe' });
    
    const insertRes = await pool.query(
      'INSERT INTO personas (nombre, apellido, usuario, contrasena, rol) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [nombre, apellido, usuario, contrasena, rol]
    );
    res.json({ ok: true, id: insertRes.rows[0].id });
  } catch (err) {
    res.status(500).json({ error: 'Error al crear el usuario' });
  }
});

// Obtener una persona por ID
app.get('/api/personas/:id', requireAuth, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, nombre, apellido, usuario, contrasena, rol FROM personas WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Persona no encontrada' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Actualizar una persona
app.put('/api/personas/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, contrasena, rol } = req.body;
  if (!nombre || !apellido || !rol) return res.status(400).json({ error: 'Los campos nombre, apellido y rol son requeridos' });

  try {
    const check = await pool.query('SELECT id FROM personas WHERE id = $1', [id]);
    if (check.rows.length === 0) return res.status(404).json({ error: 'Persona no encontrada' });
    
    if (contrasena) {
      await pool.query('UPDATE personas SET nombre = $1, apellido = $2, contrasena = $3, rol = $4 WHERE id = $5', [nombre, apellido, contrasena, rol, id]);
    } else {
      await pool.query('UPDATE personas SET nombre = $1, apellido = $2, rol = $3 WHERE id = $4', [nombre, apellido, rol, id]);
    }
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
});

// Eliminar una persona
app.delete('/api/personas/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  try {
    const check = await pool.query('SELECT id FROM personas WHERE id = $1', [id]);
    if (check.rows.length === 0) return res.status(404).json({ error: 'Persona no encontrada' });
    await pool.query('DELETE FROM personas WHERE id = $1', [id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar el usuario' });
  }
});

app.get('/api/session', (req, res) => {
  if (req.session.user) { res.json(req.session.user); } 
  else { res.status(401).json({ error: 'No hay sesión activa' }); }
});

// Listado de asistencia
app.get('/api/asistencia', requireAuth, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, nombre_completo, numero, sexo, grupo, fecha_nacimiento, direccion, barrio FROM asistencia ORDER BY grupo, LOWER(nombre_completo)');
    res.json(result.rows || []);
  } catch (err) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Crear personas en asistencia
app.post('/api/asistencia', requireAuth, async (req, res) => {
  const { nombre_completo, numero, sexo, grupo, fecha_nacimiento, direccion, barrio } = req.body;
  if (!nombre_completo || !numero || !sexo) return res.status(400).json({ error: 'Nombre completo, número de teléfono y género son requeridos' });

  try {
    const insertRes = await pool.query(
      'INSERT INTO asistencia (nombre_completo, numero, sexo, grupo, fecha_nacimiento, direccion, barrio) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      [nombre_completo, numero, sexo, grupo, fecha_nacimiento || null, direccion || null, barrio || null]
    );
    res.json({ ok: true, id: insertRes.rows[0].id, nombre_completo, numero, sexo, grupo, fecha_nacimiento, direccion, barrio });
  } catch (err) {
    res.status(500).json({ error: 'Error al crear la persona' });
  }
});

// Registrar asistencias
app.post('/api/asistencia/registrar', requireAuth, async (req, res) => {
  const { asistencias } = req.body;
  if (!asistencias || !Array.isArray(asistencias)) return res.status(400).json({ error: 'Lista de asistencias requerida' });
  
  const fecha = new Date().toISOString().split('T')[0];
  let guardadas = 0;

  try {
    for (const item of asistencias) {
      const dupCheck = await pool.query('SELECT id FROM asistencia_registros WHERE fecha = $1 AND persona_id = $2', [fecha, item.id]);
      if (dupCheck.rows.length === 0) {
        await pool.query(
          'INSERT INTO asistencia_registros (fecha, persona_id, nombre_completo, numero, sexo, grupo) VALUES ($1, $2, $3, $4, $5, $6)',
          [fecha, item.id, item.nombre_completo, item.numero, item.sexo, item.grupo]
        );
        guardadas++;
      }
    }
    res.json({ ok: true, guardadas });
  } catch (err) {
    res.status(500).json({ error: 'Error procesando el lote de asistencia' });
  }
});

app.get('/api/asistencia/registros', requireAuth, async (req, res) => {
  try {
    const result = await pool.query('SELECT fecha, COUNT(*) as total FROM asistencia_registros GROUP BY fecha ORDER BY fecha DESC');
    res.json(result.rows || []);
  } catch (err) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

app.get('/api/asistencia/registros/:fecha', requireAuth, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, persona_id, nombre_completo, numero, sexo, grupo FROM asistencia_registros WHERE fecha = $1 ORDER BY grupo, nombre_completo', [req.params.fecha]);
    res.json(result.rows || []);
  } catch (err) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

app.get('/api/asistencia/:id', requireAuth, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, nombre_completo, numero, sexo, grupo, fecha_nacimiento, direccion, barrio FROM asistencia WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Persona no encontrada' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

app.put('/api/asistencia/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { nombre_completo, numero, sexo, grupo, fecha_nacimiento, direccion, barrio } = req.body;
  if (!nombre_completo || !numero || !sexo) return res.status(400).json({ error: 'Nombre completo, número de teléfono y género son requeridos' });

  try {
    const result = await pool.query(
      'UPDATE asistencia SET nombre_completo = $1, numero = $2, sexo = $3, grupo = $4, fecha_nacimiento = $5, direccion = $6, barrio = $7 WHERE id = $8',
      [nombre_completo, numero, sexo, grupo || 'Adultos', fecha_nacimiento || null, direccion || null, barrio || null, id]
    );
    res.json({ ok: true, id, nombre_completo, numero, sexo, grupo, fecha_nacimiento, direccion, barrio });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar la persona' });
  }
});

app.delete('/api/asistencia/registros/:fecha', requireAuth, async (req, res) => {
  try {
    await pool.query('DELETE FROM asistencia_registros WHERE fecha = $1', [req.params.fecha]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar el registro' });
  }
});

app.delete('/api/asistencia/:id', requireAuth, async (req, res) => {
  try {
    await pool.query('DELETE FROM asistencia WHERE id = $1', [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar la persona' });
  }
});

app.get('/api/asistencia/graficas/:mes', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT fecha, CAST(substr(fecha, 9, 2) AS INTEGER) as dia,
       SUM(CASE WHEN grupo = 'Niños' THEN 1 ELSE 0 END) as niños,
       SUM(CASE WHEN grupo = 'Jóvenes' THEN 1 ELSE 0 END) as jóvenes,
       SUM(CASE WHEN grupo = 'Adultos' THEN 1 ELSE 0 END) as adultos
       FROM asistencia_registros WHERE fecha LIKE $1 || '%' GROUP BY fecha ORDER BY fecha ASC`,
      [req.params.mes]
    );
    res.json(result.rows || []);
  } catch (err) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Flayers Endpoints
app.get('/api/flayers', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, titulo, imagen_path, orden FROM flayers ORDER BY orden ASC, id ASC');
    const flayers = (result.rows || []).map(f => ({
      id: f.id, titulo: f.titulo, orden: f.orden, imagen: `/uploads/flayers/${f.imagen_path}`
    }));
    res.json(flayers);
  } catch (err) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

const handleMulterError = (handler) => (req, res, next) => {
  handler(req, res, (err) => {
    if (err) return res.status(400).json({ error: 'Error al subir archivo: ' + err.message });
    next();
  });
};

app.post('/api/flayers', handleMulterError(upload.single('imagen')), async (req, res) => {
  const { titulo } = req.body;
  if (!titulo || !req.file) {
    if (req.file) fs.unlinkSync(req.file.path);
    return res.status(400).json({ error: 'Título e imagen son requeridos' });
  }
  try {
    const maxRes = await pool.query('SELECT MAX(orden) as maxorden FROM flayers');
    const nuevoOrden = (maxRes.rows[0].maxorden || 0) + 1;
    const insertRes = await pool.query('INSERT INTO flayers (titulo, imagen_path, orden) VALUES ($1, $2, $3) RETURNING id', [titulo, req.file.filename, nuevoOrden]);
    res.json({ ok: true, id: insertRes.rows[0].id, titulo, imagen: `/uploads/flayers/${req.file.filename}`, orden: nuevoOrden });
  } catch (err) {
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({ error: 'Error al crear el flayer' });
  }
});

app.delete('/api/flayers/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const check = await pool.query('SELECT imagen_path FROM flayers WHERE id = $1', [id]);
    if (check.rows.length === 0) return res.status(404).json({ error: 'Flayer no encontrado' });
    if (check.rows[0].imagen_path && fs.existsSync(check.rows[0].imagen_path)) fs.unlinkSync(check.rows[0].imagen_path);
    await pool.query('DELETE FROM flayers WHERE id = $1', [id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar el flayer' });
  }
});

app.put('/api/flayers/:id/reorder', async (req, res) => {
  const { id } = req.params;
  const { direccion } = req.body;
  try {
    const fRes = await pool.query('SELECT orden FROM flayers WHERE id = $1', [id]);
    if (fRes.rows.length === 0) return res.status(404).json({ error: 'Flayer no encontrado' });
    const ordenActual = fRes.rows[0].orden;
    
    let queryOtro = direccion === 'arriba' 
      ? 'SELECT id, orden FROM flayers WHERE orden < $1 ORDER BY orden DESC LIMIT 1'
      : 'SELECT id, orden FROM flayers WHERE orden > $1 ORDER BY orden ASC LIMIT 1';
      
    const otroRes = await pool.query(queryOtro, [ordenActual]);
    if (otroRes.rows.length === 0) return res.status(400).json({ error: 'No hay flayer donde mover' });
    
    const idOtro = otroRes.rows[0].id;
    const ordenOtro = otroRes.rows[0].orden;
    
    await pool.query('UPDATE flayers SET orden = -999 WHERE id = $1', [id]);
    await pool.query('UPDATE flayers SET orden = $1 WHERE id = $2', [ordenActual, idOtro]);
    await pool.query('UPDATE flayers SET orden = $1 WHERE id = $2', [ordenOtro, id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Error en el reordenamiento' });
  }
});

app.put('/api/flayers/:id', async (req, res) => {
  const { titulo } = req.body;
  if (!titulo) return res.status(400).json({ error: 'Título es requerido' });
  try {
    const result = await pool.query('UPDATE flayers SET titulo = $1 WHERE id = $2', [titulo, req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar el flayer' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en el puerto ${PORT}`);
});