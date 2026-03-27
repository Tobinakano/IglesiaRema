// Backend Express para autenticación y protección de rutas
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = 4000;

// Configuración de la base de datos
const dbPath = path.join(__dirname, 'db', 'personas.db');
const db = new sqlite3.Database(dbPath);

// Middlewares
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(session({
  secret: 'remanente-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, httpOnly: true }
}));

// Inicializar la base de datos si no existe
const fs = require('fs');
const initSql = path.join(__dirname, 'db', 'init.sql');
if (!fs.existsSync(dbPath)) {
  const initScript = fs.readFileSync(initSql, 'utf8');
  db.exec(initScript);
}

// Endpoint de login
app.post('/api/login', (req, res) => {
  const { usuario, contrasena } = req.body;
  db.get(
    'SELECT * FROM personas WHERE usuario = ? AND contrasena = ?',
    [usuario, contrasena],
    (err, user) => {
      if (err) return res.status(500).json({ error: 'Error en el servidor' });
      if (!user) return res.status(401).json({ error: 'Credenciales incorrectas' });
      req.session.user = { id: user.id, usuario: user.usuario, rol: user.rol };
      res.json({ ok: true, usuario: user.usuario, rol: user.rol });
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

// Middleware de protección
function requireAuth(req, res, next) {
  if (req.session.user) return next();
  res.status(401).json({ error: 'No autorizado' });
}

// Endpoint protegido de ejemplo
app.get('/api/solo-admin', requireAuth, (req, res) => {
  res.json({ mensaje: 'Acceso permitido solo si estás logueado' });
});

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
