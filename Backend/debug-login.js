const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'db', 'personas.db');
const db = new sqlite3.Database(dbPath);

console.log('Simulando login con erikuser / 9430\n');

const usuario = 'erikuser';
const contrasena = '9430';

db.get(
  'SELECT * FROM personas WHERE usuario = ? AND contrasena = ?',
  [usuario, contrasena],
  (err, user) => {
    if (err) {
      console.error('❌ Error en la BD:', err);
    } else if (!user) {
      console.error('❌ Usuario con esas credenciales no existe');
      console.log('Usuario:', usuario);
      console.log('Contraseña:', contrasena);
    } else {
      console.log('✅ Login exitoso!');
      console.log('Usuario encontrado:', {
        id: user.id,
        usuario: user.usuario,
        nombre: user.nombre,
        rol: user.rol
      });
    }
    
    db.close();
  }
);
