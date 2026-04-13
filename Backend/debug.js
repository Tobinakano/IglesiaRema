const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'db', 'personas.db');
const db = new sqlite3.Database(dbPath);

console.log('Buscando usuario erikuser...\n');

db.all('SELECT id, usuario, nombre, rol, contrasena FROM personas', (err, rows) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('Todos los usuarios en la BD:');
    console.table(rows);
    
    console.log('\n\nBuscando erikuser específicamente...');
    db.get('SELECT id, usuario, nombre, rol FROM personas WHERE usuario = ?', ['erikuser'], (err, row) => {
      if (err) {
        console.error('Error:', err);
      } else {
        console.log('Resultado:', row);
      }
      
      db.close();
    });
  }
});
