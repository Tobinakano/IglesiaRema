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

-- DATOS DE PRUEBA - NIÑOS (10)
INSERT INTO asistencia (nombre_completo, numero, sexo, grupo, fecha_nacimiento, direccion, barrio)
VALUES 
('Juan Carlos Martínez', 1, 'M', 'Niños', '2014-03-15', 'Calle Principal 123', 'Centro'),
('María José López', 2, 'F', 'Niños', '2015-07-22', 'Calle Secundaria 456', 'Norte'),
('Diego Fernando Pérez', 3, 'M', 'Niños', '2014-11-08', 'Avenida Nueva 789', 'Sur'),
('Sofía Hernández García', 4, 'F', 'Niños', '2015-01-30', 'Calle Vieja 101', 'Este'),
('Carlos Andrés Rodríguez', 5, 'M', 'Niños', '2014-05-12', 'Carrera Principal 202', 'Oeste'),
('Laura María Sánchez', 6, 'F', 'Niños', '2015-09-25', 'Calle Paz 303', 'Centro'),
('Alejandro José Torres', 7, 'M', 'Niños', '2014-02-18', 'Avenida Libertad 404', 'Norte'),
('Valentina Ramirez', 8, 'F', 'Niños', '2015-06-07', 'Calle Flores 505', 'Sur'),
('Santiago Morales', 9, 'M', 'Niños', '2014-10-14', 'Carrera Segunda 606', 'Este'),
('Camila Díaz', 10, 'F', 'Niños', '2015-04-21', 'Avenida Central 707', 'Oeste');

-- DATOS DE PRUEBA - JÓVENES (15)
INSERT INTO asistencia (nombre_completo, numero, sexo, grupo, fecha_nacimiento, direccion, barrio)
VALUES 
('Mateo González Ruiz', 11, 'M', 'Jóvenes', '2008-12-05', 'Calle Amistad 808', 'Centro'),
('Daniela Castillo', 12, 'F', 'Jóvenes', '2009-03-17', 'Avenida Paz 909', 'Norte'),
('Lucas Fernández', 13, 'M', 'Jóvenes', '2008-08-29', 'Calle Esperanza 1010', 'Sur'),
('Isabella Vargas', 14, 'F', 'Jóvenes', '2009-05-11', 'Carrera Joven 1111', 'Este'),
('Pablo Mendez', 15, 'M', 'Jóvenes', '2008-01-23', 'Avenida Futuro 1212', 'Oeste'),
('Mariana Silva', 16, 'F', 'Jóvenes', '2009-07-08', 'Calle Estrellas 1313', 'Centro'),
('Andrés Felipe Gómez', 17, 'M', 'Jóvenes', '2008-06-14', 'Avenida Sueños 1414', 'Norte'),
('Catalina Muñoz', 18, 'F', 'Jóvenes', '2009-09-26', 'Calle Esperanza 1515', 'Sur'),
('Ricardo Acosta', 19, 'M', 'Jóvenes', '2008-04-10', 'Carrera Vida 1616', 'Este'),
('Valentina López', 20, 'F', 'Jóvenes', '2009-11-03', 'Avenida Luz 1717', 'Oeste'),
('Felipe Herrera', 21, 'M', 'Jóvenes', '2008-09-19', 'Calle Brisa 1818', 'Centro'),
('Natalia Ortiz', 22, 'F', 'Jóvenes', '2009-02-25', 'Avenida Cielo 1919', 'Norte'),
('Miguel Ángel Rojas', 23, 'M', 'Jóvenes', '2008-07-31', 'Calle Montaña 2020', 'Sur'),
('Paula Medina', 24, 'F', 'Jóvenes', '2009-10-13', 'Carrera Rica 2121', 'Este'),
('Cristian Benavides', 25, 'M', 'Jóvenes', '2008-03-22', 'Avenida Valle 2222', 'Oeste');

-- DATOS DE PRUEBA - ADULTOS (20)
INSERT INTO asistencia (nombre_completo, numero, sexo, grupo, fecha_nacimiento, direccion, barrio)
VALUES 
('Roberto Francisco García', 26, 'M', 'Adultos', '1980-05-15', 'Calle Principal 2323', 'Centro'),
('Ana María López Rodríguez', 27, 'F', 'Adultos', '1982-08-22', 'Avenida Mayor 2424', 'Norte'),
('Jorge Enrique Díaz', 28, 'M', 'Adultos', '1979-11-30', 'Calle Segunda 2525', 'Sur'),
('Patricia González', 29, 'F', 'Adultos', '1981-02-14', 'Carrera Principal 2626', 'Este'),
('Fernando Martínez', 30, 'M', 'Adultos', '1978-07-08', 'Avenida Nueva 2727', 'Oeste'),
('Sandra Pérez', 31, 'F', 'Adultos', '1983-04-19', 'Calle Vieja 2828', 'Centro'),
('Ramón Hernández', 32, 'M', 'Adultos', '1977-09-27', 'Avenida Principal 2929', 'Norte'),
('Silvia Ramírez', 33, 'F', 'Adultos', '1984-01-11', 'Calle Nueva 3030', 'Sur'),
('Juan Miguel Torres', 34, 'M', 'Adultos', '1980-06-23', 'Carrera Central 3131', 'Este'),
('María del Carmen Sánchez', 35, 'F', 'Adultos', '1982-10-05', 'Avenida Libertad 3232', 'Oeste'),
('Pedro Luis Ruiz', 36, 'M', 'Adultos', '1979-03-17', 'Calle Paz 3333', 'Centro'),
('Lucía Rojas', 37, 'F', 'Adultos', '1981-12-08', 'Avenida Esperanza 3434', 'Norte'),
('Gustavo Castro', 38, 'M', 'Adultos', '1978-08-14', 'Calle Flores 3535', 'Sur'),
('Rosa María Flores', 39, 'F', 'Adultos', '1983-05-29', 'Carrera Vida 3636', 'Este'),
('Antonio Rivera', 40, 'M', 'Adultos', '1976-11-21', 'Avenida Cielo 3737', 'Oeste'),
('Juana Mendoza', 41, 'F', 'Adultos', '1984-09-10', 'Calle Montaña 3838', 'Centro'),
('Humberto Vargas', 42, 'M', 'Adultos', '1980-02-25', 'Avenida Valle 3939', 'Norte'),
('Magdalena Acosta', 43, 'F', 'Adultos', '1982-07-13', 'Calle Brisa 4040', 'Sur'),
('Guillermo Molina', 44, 'M', 'Adultos', '1979-04-06', 'Carrera Rica 4141', 'Este'),
('Carmen Suárez', 45, 'F', 'Adultos', '1983-10-31', 'Avenida Luz 4242', 'Oeste');

-- REGISTROS DE ASISTENCIA POR FECHA
-- ENERO (2 fechas - 6 y 7 personas cada una = 13 registros)
INSERT INTO asistencia_registros (fecha, persona_id, nombre_completo, numero, sexo, grupo)
VALUES 
('2026-01-12', 1, 'Juan Carlos Martínez', 1, 'M', 'Niños'),
('2026-01-12', 2, 'María José López', 2, 'F', 'Niños'),
('2026-01-12', 11, 'Mateo González Ruiz', 11, 'M', 'Jóvenes'),
('2026-01-12', 16, 'Mariana Silva', 16, 'F', 'Jóvenes'),
('2026-01-12', 26, 'Roberto Francisco García', 26, 'M', 'Adultos'),
('2026-01-12', 27, 'Ana María López Rodríguez', 27, 'F', 'Adultos'),
('2026-01-19', 3, 'Diego Fernando Pérez', 3, 'M', 'Niños'),
('2026-01-19', 4, 'Sofía Hernández García', 4, 'F', 'Niños'),
('2026-01-19', 5, 'Carlos Andrés Rodríguez', 5, 'M', 'Niños'),
('2026-01-19', 12, 'Daniela Castillo', 12, 'F', 'Jóvenes'),
('2026-01-19', 13, 'Lucas Fernández', 13, 'M', 'Jóvenes'),
('2026-01-19', 28, 'Jorge Enrique Díaz', 28, 'M', 'Adultos'),
('2026-01-19', 29, 'Patricia González', 29, 'F', 'Adultos');

-- FEBRERO (4 fechas - 6, 7, 6 y 7 personas = 26 registros)
INSERT INTO asistencia_registros (fecha, persona_id, nombre_completo, numero, sexo, grupo)
VALUES 
('2026-02-02', 6, 'Laura María Sánchez', 6, 'F', 'Niños'),
('2026-02-02', 7, 'Alejandro José Torres', 7, 'M', 'Niños'),
('2026-02-02', 8, 'Valentina Ramirez', 8, 'F', 'Niños'),
('2026-02-02', 14, 'Isabella Vargas', 14, 'F', 'Jóvenes'),
('2026-02-02', 17, 'Andrés Felipe Gómez', 17, 'M', 'Jóvenes'),
('2026-02-02', 30, 'Fernando Martínez', 30, 'M', 'Adultos'),
('2026-02-09', 9, 'Santiago Morales', 9, 'M', 'Niños'),
('2026-02-09', 10, 'Camila Díaz', 10, 'F', 'Niños'),
('2026-02-09', 15, 'Pablo Mendez', 15, 'M', 'Jóvenes'),
('2026-02-09', 18, 'Catalina Muñoz', 18, 'F', 'Jóvenes'),
('2026-02-09', 19, 'Ricardo Acosta', 19, 'M', 'Jóvenes'),
('2026-02-09', 31, 'Sandra Pérez', 31, 'F', 'Adultos'),
('2026-02-09', 32, 'Ramón Hernández', 32, 'M', 'Adultos'),
('2026-02-16', 1, 'Juan Carlos Martínez', 1, 'M', 'Niños'),
('2026-02-16', 3, 'Diego Fernando Pérez', 3, 'M', 'Niños'),
('2026-02-16', 20, 'Valentina López', 20, 'F', 'Jóvenes'),
('2026-02-16', 21, 'Felipe Herrera', 21, 'M', 'Jóvenes'),
('2026-02-16', 22, 'Natalia Ortiz', 22, 'F', 'Jóvenes'),
('2026-02-16', 33, 'Silvia Ramírez', 33, 'F', 'Adultos'),
('2026-02-23', 4, 'Sofía Hernández García', 4, 'F', 'Niños'),
('2026-02-23', 5, 'Carlos Andrés Rodríguez', 5, 'M', 'Niños'),
('2026-02-23', 6, 'Laura María Sánchez', 6, 'F', 'Niños'),
('2026-02-23', 23, 'Miguel Ángel Rojas', 23, 'M', 'Jóvenes'),
('2026-02-23', 24, 'Paula Medina', 24, 'F', 'Jóvenes'),
('2026-02-23', 34, 'Juan Miguel Torres', 34, 'M', 'Adultos'),
('2026-02-23', 35, 'María del Carmen Sánchez', 35, 'F', 'Adultos');

-- MARZO (3 fechas - 7, 6 y 8 personas = 21 registros)
INSERT INTO asistencia_registros (fecha, persona_id, nombre_completo, numero, sexo, grupo)
VALUES 
('2026-03-02', 7, 'Alejandro José Torres', 7, 'M', 'Niños'),
('2026-03-02', 8, 'Valentina Ramirez', 8, 'F', 'Niños'),
('2026-03-02', 9, 'Santiago Morales', 9, 'M', 'Niños'),
('2026-03-02', 25, 'Cristian Benavides', 25, 'M', 'Jóvenes'),
('2026-03-02', 11, 'Mateo González Ruiz', 11, 'M', 'Jóvenes'),
('2026-03-02', 36, 'Pedro Luis Ruiz', 36, 'M', 'Adultos'),
('2026-03-02', 37, 'Lucía Rojas', 37, 'F', 'Adultos'),
('2026-03-09', 10, 'Camila Díaz', 10, 'F', 'Niños'),
('2026-03-09', 1, 'Juan Carlos Martínez', 1, 'M', 'Niños'),
('2026-03-09', 2, 'María José López', 2, 'F', 'Niños'),
('2026-03-09', 12, 'Daniela Castillo', 12, 'F', 'Jóvenes'),
('2026-03-09', 13, 'Lucas Fernández', 13, 'M', 'Jóvenes'),
('2026-03-09', 38, 'Gustavo Castro', 38, 'M', 'Adultos'),
('2026-03-16', 3, 'Diego Fernando Pérez', 3, 'M', 'Niños'),
('2026-03-16', 4, 'Sofía Hernández García', 4, 'F', 'Niños'),
('2026-03-16', 5, 'Carlos Andrés Rodríguez', 5, 'M', 'Niños'),
('2026-03-16', 14, 'Isabella Vargas', 14, 'F', 'Jóvenes'),
('2026-03-16', 15, 'Pablo Mendez', 15, 'M', 'Jóvenes'),
('2026-03-16', 16, 'Mariana Silva', 16, 'F', 'Jóvenes'),
('2026-03-16', 39, 'Rosa María Flores', 39, 'F', 'Adultos'),
('2026-03-16', 40, 'Antonio Rivera', 40, 'M', 'Adultos');

-- ABRIL (4 fechas - 7, 8, 6 y 9 personas = 30 registros)
INSERT INTO asistencia_registros (fecha, persona_id, nombre_completo, numero, sexo, grupo)
VALUES 
('2026-04-06', 6, 'Laura María Sánchez', 6, 'F', 'Niños'),
('2026-04-06', 7, 'Alejandro José Torres', 7, 'M', 'Niños'),
('2026-04-06', 8, 'Valentina Ramirez', 8, 'F', 'Niños'),
('2026-04-06', 9, 'Santiago Morales', 9, 'M', 'Niños'),
('2026-04-06', 17, 'Andrés Felipe Gómez', 17, 'M', 'Jóvenes'),
('2026-04-06', 18, 'Catalina Muñoz', 18, 'F', 'Jóvenes'),
('2026-04-06', 41, 'Juana Mendoza', 41, 'F', 'Adultos'),
('2026-04-13', 10, 'Camila Díaz', 10, 'F', 'Niños'),
('2026-04-13', 1, 'Juan Carlos Martínez', 1, 'M', 'Niños'),
('2026-04-13', 2, 'María José López', 2, 'F', 'Niños'),
('2026-04-13', 3, 'Diego Fernando Pérez', 3, 'M', 'Niños'),
('2026-04-13', 4, 'Sofía Hernández García', 4, 'F', 'Niños'),
('2026-04-13', 19, 'Ricardo Acosta', 19, 'M', 'Jóvenes'),
('2026-04-13', 20, 'Valentina López', 20, 'F', 'Jóvenes'),
('2026-04-13', 42, 'Humberto Vargas', 42, 'M', 'Adultos'),
('2026-04-20', 5, 'Carlos Andrés Rodríguez', 5, 'M', 'Niños'),
('2026-04-20', 6, 'Laura María Sánchez', 6, 'F', 'Niños'),
('2026-04-20', 21, 'Felipe Herrera', 21, 'M', 'Jóvenes'),
('2026-04-20', 22, 'Natalia Ortiz', 22, 'F', 'Jóvenes'),
('2026-04-20', 23, 'Miguel Ángel Rojas', 23, 'M', 'Jóvenes'),
('2026-04-20', 43, 'Magdalena Acosta', 43, 'F', 'Adultos'),
('2026-04-27', 7, 'Alejandro José Torres', 7, 'M', 'Niños'),
('2026-04-27', 8, 'Valentina Ramirez', 8, 'F', 'Niños'),
('2026-04-27', 9, 'Santiago Morales', 9, 'M', 'Niños'),
('2026-04-27', 10, 'Camila Díaz', 10, 'F', 'Niños'),
('2026-04-27', 24, 'Paula Medina', 24, 'F', 'Jóvenes'),
('2026-04-27', 25, 'Cristian Benavides', 25, 'M', 'Jóvenes'),
('2026-04-27', 26, 'Roberto Francisco García', 26, 'M', 'Adultos'),
('2026-04-27', 44, 'Guillermo Molina', 44, 'M', 'Adultos'),
('2026-04-27', 45, 'Carmen Suárez', 45, 'F', 'Adultos');

-- MAYO (3 fechas - 6, 8 y 7 personas = 21 registros)
INSERT INTO asistencia_registros (fecha, persona_id, nombre_completo, numero, sexo, grupo)
VALUES 
('2026-05-04', 1, 'Juan Carlos Martínez', 1, 'M', 'Niños'),
('2026-05-04', 2, 'María José López', 2, 'F', 'Niños'),
('2026-05-04', 3, 'Diego Fernando Pérez', 3, 'M', 'Niños'),
('2026-05-04', 11, 'Mateo González Ruiz', 11, 'M', 'Jóvenes'),
('2026-05-04', 12, 'Daniela Castillo', 12, 'F', 'Jóvenes'),
('2026-05-04', 27, 'Ana María López Rodríguez', 27, 'F', 'Adultos'),
('2026-05-11', 4, 'Sofía Hernández García', 4, 'F', 'Niños'),
('2026-05-11', 5, 'Carlos Andrés Rodríguez', 5, 'M', 'Niños'),
('2026-05-11', 6, 'Laura María Sánchez', 6, 'F', 'Niños'),
('2026-05-11', 7, 'Alejandro José Torres', 7, 'M', 'Niños'),
('2026-05-11', 13, 'Lucas Fernández', 13, 'M', 'Jóvenes'),
('2026-05-11', 14, 'Isabella Vargas', 14, 'F', 'Jóvenes'),
('2026-05-11', 28, 'Jorge Enrique Díaz', 28, 'M', 'Adultos'),
('2026-05-11', 29, 'Patricia González', 29, 'F', 'Adultos'),
('2026-05-18', 8, 'Valentina Ramirez', 8, 'F', 'Niños'),
('2026-05-18', 9, 'Santiago Morales', 9, 'M', 'Niños'),
('2026-05-18', 10, 'Camila Díaz', 10, 'F', 'Niños'),
('2026-05-18', 15, 'Pablo Mendez', 15, 'M', 'Jóvenes'),
('2026-05-18', 16, 'Mariana Silva', 16, 'F', 'Jóvenes'),
('2026-05-18', 17, 'Andrés Felipe Gómez', 17, 'M', 'Jóvenes'),
('2026-05-18', 30, 'Fernando Martínez', 30, 'M', 'Adultos');
