-- Script para crear la tabla de personas y el primer usuario (Versión PostgreSQL)
CREATE TABLE IF NOT EXISTS personas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    rol VARCHAR(50) NOT NULL
);

-- Insertar usuarios administradores si no existen
INSERT INTO personas (nombre, apellido, usuario, contrasena, rol)
VALUES ('Nicolas', 'Hernandez', 'nicolasuser', '1234', 'Administrador')
ON CONFLICT (usuario) DO NOTHING;

INSERT INTO personas (nombre, apellido, usuario, contrasena, rol)
VALUES ('Erik', 'Hernández', 'erikuser', '9430', 'Asistencias')
ON CONFLICT (usuario) DO NOTHING;

-- Tabla para el listado de asistencia
CREATE TABLE IF NOT EXISTS asistencia (
    id SERIAL PRIMARY KEY,
    nombre_completo VARCHAR(150) NOT NULL,
    numero BIGINT, -- Usamos BIGINT por si los números de teléfono son largos
    sexo VARCHAR(10),
    grupo VARCHAR(50) DEFAULT 'Adultos',
    fecha_nacimiento VARCHAR(50), -- Se mantiene como texto por compatibilidad con tu formulario actual
    direccion VARCHAR(255),
    barrio VARCHAR(100)
);

-- Tabla para guardar los registros de asistencia por fecha
CREATE TABLE IF NOT EXISTS asistencia_registros (
    id SERIAL PRIMARY KEY,
    fecha VARCHAR(50) NOT NULL,
    persona_id INTEGER NOT NULL,
    nombre_completo VARCHAR(150) NOT NULL,
    numero BIGINT,
    sexo VARCHAR(10),
    grupo VARCHAR(50) NOT NULL,
    FOREIGN KEY (persona_id) REFERENCES asistencia(id) ON DELETE CASCADE
);