package com.iglesiarema.backend.controller;

import com.iglesiarema.backend.dto.LoginRequest;
import com.iglesiarema.backend.dto.SessionUser;
import com.iglesiarema.backend.model.Persona;
import com.iglesiarema.backend.repository.PersonaRepository;
import com.iglesiarema.backend.util.PasswordUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class AuthController {

    @Autowired
    private PersonaRepository personaRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest, HttpServletRequest request) {
        Optional<Persona> userOpt = personaRepository.findByUsuario(loginRequest.getUsuario());
        
        if (userOpt.isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Credenciales incorrectas");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
        
        Persona user = userOpt.get();
        
        // Verify BCrypt hashed password
        if (!PasswordUtil.verify(loginRequest.getContrasena(), user.getContrasena())) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Credenciales incorrectas");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
        
        // Set standard Servlet Session (creates cookie JSESSIONID)
        HttpSession session = request.getSession(true);
        SessionUser sessionUser = SessionUser.builder()
                .id(user.getId())
                .usuario(user.getUsuario())
                .nombre(user.getNombre())
                .rol(user.getRol())
                .build();
                
        session.setAttribute("user", sessionUser);
        
        Map<String, Object> response = new HashMap<>();
        response.put("ok", true);
        response.put("usuario", user.getUsuario());
        response.put("nombre", user.getNombre());
        response.put("rol", user.getRol());
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/auth")
    public ResponseEntity<?> checkAuth(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null && session.getAttribute("user") != null) {
            SessionUser sessionUser = (SessionUser) session.getAttribute("user");
            Map<String, Object> response = new HashMap<>();
            response.put("ok", true);
            response.put("user", sessionUser);
            return ResponseEntity.ok(response);
        } else {
            Map<String, Boolean> response = new HashMap<>();
            response.put("ok", false);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        Map<String, Boolean> response = new HashMap<>();
        response.put("ok", true);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/session")
    public ResponseEntity<?> getSession(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null && session.getAttribute("user") != null) {
            SessionUser sessionUser = (SessionUser) session.getAttribute("user");
            return ResponseEntity.ok(sessionUser);
        } else {
            Map<String, String> error = new HashMap<>();
            error.put("error", "No hay sesión activa");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }
}
