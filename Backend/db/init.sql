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
    grupo TEXT DEFAULT 'Adultos'
);

-- Registros de asistencia
INSERT OR IGNORE INTO asistencia (nombre_completo, numero, sexo, grupo) VALUES ('Nicola Hernandez', 3164763437, 'M', 'Jóvenes');
INSERT OR IGNORE INTO asistencia (nombre_completo, numero, sexo, grupo) VALUES ('Luisa Maria Hernandez', 3177204610, 'F', 'Jóvenes');
INSERT OR IGNORE INTO asistencia (nombre_completo, numero, sexo, grupo) VALUES ('Nicole Saray Agudelo', 3157226884, 'F', 'Jóvenes');
INSERT OR IGNORE INTO asistencia (nombre_completo, numero, sexo, grupo) VALUES ('Ana Maria Viveros', 3184485883, 'F', 'Adultos');
INSERT OR IGNORE INTO asistencia (nombre_completo, numero, sexo, grupo) VALUES ('Jhon Jairo Calderon', 3024099211, 'M', 'Adultos');
INSERT OR IGNORE INTO asistencia (nombre_completo, numero, sexo, grupo) VALUES ('Erik Hernandez Chaux', 3154762049, 'M', 'Adultos');
INSERT OR IGNORE INTO asistencia (nombre_completo, numero, sexo, grupo) VALUES ('Katherine Rodriguez Gallego', 3187951705, 'F', 'Adultos');
INSERT OR IGNORE INTO asistencia (nombre_completo, numero, sexo, grupo) VALUES ('Joseph Cardenas', 3217449713, 'M', 'Jóvenes');
INSERT OR IGNORE INTO asistencia (nombre_completo, numero, sexo, grupo) VALUES ('Juan Camilo Correa', 3104263205, 'M', 'Jóvenes');
INSERT OR IGNORE INTO asistencia (nombre_completo, numero, sexo, grupo) VALUES ('Karen Correa', 3122200005, 'F', 'Jóvenes');
INSERT OR IGNORE INTO asistencia (nombre_completo, numero, sexo, grupo) VALUES ('Juan David Gomez', 3158819519, 'M', 'Jóvenes');
INSERT OR IGNORE INTO asistencia (nombre_completo, numero, sexo, grupo) VALUES ('Deybi Gutierrez', 3226229296, 'M', 'Adultos');

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

-- Tabla para gestión de flayers
CREATE TABLE IF NOT EXISTS flayers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    imagen_path TEXT NOT NULL,
    orden INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
