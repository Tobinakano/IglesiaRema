-- Script para crear la tabla de personas y el primer usuario
CREATE TABLE IF NOT EXISTS personas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    usuario TEXT NOT NULL UNIQUE,
    contrasena TEXT NOT NULL,
    rol TEXT NOT NULL
);

INSERT INTO personas (nombre, apellido, usuario, contrasena, rol)
VALUES ('Nicolas', 'Hernandez', 'nicolasuser', '1234', 'Administrador');
