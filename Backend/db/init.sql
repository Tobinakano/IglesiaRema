-- Script para crear la tabla de personas y el primer usuario
CREATE TABLE IF NOT EXISTS personas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    usuario TEXT NOT NULL UNIQUE,
    contrasena TEXT NOT NULL,
    rol TEXT NOT NULL
);

INSERT OR IGNORE INTO personas (nombre, apellido, usuario, contrasena, rol)
VALUES ('Nicolas', 'Hernandez', 'nicolasuser', '1234', 'Administrador');

INSERT OR IGNORE INTO personas (nombre, apellido, usuario, contrasena, rol)
VALUES ('Erik', 'Hernández', 'erikuser', '9430', 'Asistencias');

-- Tabla para el listado de asistencia
CREATE TABLE IF NOT EXISTS asistencia (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre_completo TEXT NOT NULL,
    numero INTEGER,
    sexo TEXT,
    grupo TEXT DEFAULT 'Adultos',
    fecha_nacimiento TEXT,
    direccion TEXT,
    barrio TEXT
);

-- Tabla para guardar los registros de asistencia por fecha
CREATE TABLE IF NOT EXISTS asistencia_registros (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fecha TEXT NOT NULL,
    persona_id INTEGER NOT NULL,
    nombre_completo TEXT NOT NULL,
    numero INTEGER,
    sexo TEXT,
    grupo TEXT NOT NULL,
    FOREIGN KEY (persona_id) REFERENCES asistencia(id)
);
