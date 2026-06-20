package com.iglesiarema.backend.controller;

import com.iglesiarema.backend.model.Persona;
import com.iglesiarema.backend.repository.PersonaRepository;
import com.iglesiarema.backend.util.PasswordUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/personas")
public class PersonaController {

    @Autowired
    private PersonaRepository personaRepository;

    @GetMapping
    public ResponseEntity<List<PersonaRepository.PersonaResumen>> listarPersonas() {
        return ResponseEntity.ok(personaRepository.findAllProjectedBy());
    }

    @PostMapping
    public ResponseEntity<?> crearPersona(@RequestBody Persona persona) {
        if (persona.getNombre() == null || persona.getNombre().trim().isEmpty() ||
            persona.getApellido() == null || persona.getApellido().trim().isEmpty() ||
            persona.getUsuario() == null || persona.getUsuario().trim().isEmpty() ||
            persona.getContrasena() == null || persona.getContrasena().trim().isEmpty() ||
            persona.getRol() == null || persona.getRol().trim().isEmpty()) {
            
            Map<String, String> error = new HashMap<>();
            error.put("error", "Todos los campos son requeridos");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        // Check if user already exists
        Optional<Persona> existing = personaRepository.findByUsuario(persona.getUsuario());
        if (existing.isPresent()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "El usuario ya existe");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        // Hash password before saving
        persona.setContrasena(PasswordUtil.hash(persona.getContrasena()));
        Persona saved = personaRepository.save(persona);

        Map<String, Object> response = new HashMap<>();
        response.put("ok", true);
        response.put("id", saved.getId());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPersona(@PathVariable Long id) {
        Optional<Persona> personaOpt = personaRepository.findById(id);
        if (personaOpt.isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Persona no encontrada");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
        
        Persona persona = personaOpt.get();
        // Hide password in GET response for security
        persona.setContrasena("");
        return ResponseEntity.ok(persona);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarPersona(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Optional<Persona> personaOpt = personaRepository.findById(id);
        if (personaOpt.isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Persona no encontrada");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        String nombre = body.get("nombre");
        String apellido = body.get("apellido");
        String rol = body.get("rol");
        String contrasena = body.get("contrasena");

        if (nombre == null || nombre.trim().isEmpty() ||
            apellido == null || apellido.trim().isEmpty() ||
            rol == null || rol.trim().isEmpty()) {
            
            Map<String, String> error = new HashMap<>();
            error.put("error", "Los campos nombre, apellido y rol son requeridos");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        Persona persona = personaOpt.get();
        persona.setNombre(nombre);
        persona.setApellido(apellido);
        persona.setRol(rol);

        // Update password only if provided
        if (contrasena != null && !contrasena.trim().isEmpty()) {
            persona.setContrasena(PasswordUtil.hash(contrasena));
        }

        personaRepository.save(persona);

        Map<String, Boolean> response = new HashMap<>();
        response.put("ok", true);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarPersona(@PathVariable Long id) {
        Optional<Persona> personaOpt = personaRepository.findById(id);
        if (personaOpt.isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Persona no encontrada");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        personaRepository.deleteById(id);

        Map<String, Boolean> response = new HashMap<>();
        response.put("ok", true);
        return ResponseEntity.ok(response);
    }
}
