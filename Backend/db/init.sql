-- Script completo de inicialización para PostgreSQL
CREATE TABLE IF NOT EXISTS personas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    rol VARCHAR(50) NOT NULL
);

INSERT INTO personas (nombre, apellido, usuario, contrasena, rol)
VALUES ('Nicolas', 'Hernandez', 'nicolasuser', '1234', 'Administrador')
ON CONFLICT (usuario) DO NOTHING;

INSERT INTO personas (nombre, apellido, usuario, contrasena, rol)
VALUES ('Erik', 'Hernández', 'erikuser', '9430', 'Asistencias')
ON CONFLICT (usuario) DO NOTHING;

CREATE TABLE IF NOT EXISTS asistencia (
    id SERIAL PRIMARY KEY,
    nombre_completo VARCHAR(150) NOT NULL,
    numero BIGINT,
    sexo VARCHAR(10),
    grupo VARCHAR(50) DEFAULT 'Adultos',
    fecha_nacimiento VARCHAR(50),
    direccion VARCHAR(255),
    barrio VARCHAR(100)
);

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

-- ESTA ES LA TABLA QUE FALTABA Y POR ESO DA ERROR EN /api/flayers
CREATE TABLE IF NOT EXISTS flayers (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    imagen_path VARCHAR(255) NOT NULL,
    orden INTEGER DEFAULT 0
);