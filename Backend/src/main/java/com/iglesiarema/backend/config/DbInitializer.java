package com.iglesiarema.backend.config;

import com.iglesiarema.backend.model.Persona;
import com.iglesiarema.backend.repository.PersonaRepository;
import com.iglesiarema.backend.util.PasswordUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.io.File;

@Component
public class DbInitializer implements CommandLineRunner {

    @Autowired
    private PersonaRepository personaRepository;

    @Override
    public void run(String... args) throws Exception {
        // 1. Create uploads folder if it doesn't exist
        File flayersDir = new File("uploads/flayers");
        if (!flayersDir.exists()) {
            boolean created = flayersDir.mkdirs();
            if (created) {
                System.out.println("📁 Carpeta 'uploads/flayers' creada exitosamente.");
            } else {
                System.err.println("❌ No se pudo crear la carpeta 'uploads/flayers'.");
            }
        }

        // 2. Seed default users if table is empty
        long userCount = personaRepository.count();
        if (userCount == 0) {
            System.out.println("🌱 Base de datos vacía. Sembrando usuarios por defecto...");
            
            Persona nicolas = Persona.builder()
                    .nombre("Nicolas")
                    .apellido("Hernandez")
                    .usuario("nicolasuser")
                    .contrasena(PasswordUtil.hash("1234"))
                    .rol("Administrador")
                    .build();

            Persona erik = Persona.builder()
                    .nombre("Erik")
                    .apellido("Hernández")
                    .usuario("erikuser")
                    .contrasena(PasswordUtil.hash("9430"))
                    .rol("Asistencias")
                    .build();

            personaRepository.save(nicolas);
            personaRepository.save(erik);
            
            System.out.println("✅ Usuarios iniciales sembrados exitosamente (con contraseñas encriptadas BCrypt).");
        } else {
            System.out.println("📦 La base de datos ya contiene " + userCount + " usuarios registrados.");
        }
    }
}
