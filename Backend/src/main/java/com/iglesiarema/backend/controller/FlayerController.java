package com.iglesiarema.backend.controller;

import com.iglesiarema.backend.model.Flayer;
import com.iglesiarema.backend.repository.FlayerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.*;

@RestController
@RequestMapping("/api/flayers")
public class FlayerController {

    @Autowired
    private FlayerRepository flayerRepository;

    private static final String UPLOAD_DIR = "uploads/flayers";

    // Obtener todos los flayers ordenados
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> listarFlayers() {
        List<Flayer> list = flayerRepository.findAllByOrderByOrdenAscIdAsc();
        List<Map<String, Object>> response = new ArrayList<>();
        
        for (Flayer f : list) {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("id", f.getId());
            map.put("titulo", f.getTitulo());
            map.put("orden", f.getOrden());
            map.put("imagen", "/uploads/flayers/" + f.getImagenPath());
            response.add(map);
        }
        
        return ResponseEntity.ok(response);
    }

    // Crear un nuevo flayer (Carga de imagen)
    @PostMapping
    public ResponseEntity<?> crearFlayer(
            @RequestParam("titulo") String titulo,
            @RequestParam("imagen") MultipartFile file) {

        if (titulo == null || titulo.trim().isEmpty() || file == null || file.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Collections.singletonMap("error", "Título e imagen son requeridos"));
        }

        // Validar tipo de archivo (solo imágenes)
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Collections.singletonMap("error", "Solo se permiten archivos de imagen"));
        }

        try {
            // Generar nombre de archivo único
            String originalName = file.getOriginalFilename();
            String ext = "";
            if (originalName != null && originalName.contains(".")) {
                ext = originalName.substring(originalName.lastIndexOf("."));
            }
            String uniqueName = System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 9) + ext;

            // Ruta de destino
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            
            Path filePath = uploadPath.resolve(uniqueName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Obtener el orden máximo y sumar 1
            Integer maxOrden = flayerRepository.findMaxOrden();
            int nuevoOrden = maxOrden + 1;

            // Guardar en BD
            Flayer flayer = Flayer.builder()
                    .titulo(titulo)
                    .imagenPath(uniqueName)
                    .orden(nuevoOrden)
                    .build();

            Flayer saved = flayerRepository.save(flayer);

            Map<String, Object> response = new LinkedHashMap<>();
            response.put("ok", true);
            response.put("id", saved.getId());
            response.put("titulo", saved.getTitulo());
            response.put("imagen", "/uploads/flayers/" + saved.getImagenPath());
            response.put("orden", saved.getOrden());

            return ResponseEntity.ok(response);
        } catch (IOException e) {
            System.err.println("Error guardando imagen de flayer: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "Error al procesar y guardar la imagen"));
        }
    }

    // Actualizar el título de un flayer
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarFlayer(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        
        String titulo = body.get("titulo");
        if (titulo == null || titulo.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Collections.singletonMap("error", "Título es requerido"));
        }

        Optional<Flayer> flayerOpt = flayerRepository.findById(id);
        if (flayerOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Collections.singletonMap("error", "Flayer no encontrado"));
        }

        Flayer flayer = flayerOpt.get();
        flayer.setTitulo(titulo);
        flayerRepository.save(flayer);

        return ResponseEntity.ok(Collections.singletonMap("ok", true));
    }

    // Reordenar flayers (arriba / abajo)
    @PutMapping("/{id}/reorder")
    @Transactional
    public ResponseEntity<?> reordenarFlayer(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        String direccion = body.get("direccion"); // "arriba" o "abajo"
        if (direccion == null || (!direccion.equals("arriba") && !direccion.equals("abajo"))) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Collections.singletonMap("error", "Dirección incorrecta o ausente"));
        }

        Optional<Flayer> flayerOpt = flayerRepository.findById(id);
        if (flayerOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Collections.singletonMap("error", "Flayer no encontrado"));
        }

        Flayer flayer = flayerOpt.get();
        int ordenActual = flayer.getOrden();
        Optional<Flayer> otroOpt;

        if (direccion.equals("arriba")) {
            otroOpt = flayerRepository.findFirstByOrdenLessThanOrderByOrdenDesc(ordenActual);
        } else {
            otroOpt = flayerRepository.findFirstByOrdenGreaterThanOrderByOrdenAsc(ordenActual);
        }

        if (otroOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Collections.singletonMap("error", "No hay flayer donde mover"));
        }

        Flayer otro = otroOpt.get();
        
        // Intercambiar orden
        flayer.setOrden(otro.getOrden());
        otro.setOrden(ordenActual);

        flayerRepository.save(flayer);
        flayerRepository.save(otro);

        return ResponseEntity.ok(Collections.singletonMap("ok", true));
    }

    // Eliminar un flayer
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarFlayer(@PathVariable Long id) {
        Optional<Flayer> flayerOpt = flayerRepository.findById(id);
        if (flayerOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Collections.singletonMap("error", "Flayer no encontrado"));
        }

        Flayer flayer = flayerOpt.get();
        
        // Intentar eliminar archivo físico
        try {
            Path filePath = Paths.get(UPLOAD_DIR).resolve(flayer.getImagenPath());
            File file = filePath.toFile();
            if (file.exists()) {
                boolean deleted = file.delete();
                if (deleted) {
                    System.out.println("🗑️ Archivo de imagen de flayer eliminado físicamente: " + flayer.getImagenPath());
                }
            }
        } catch (Exception e) {
            System.err.println("No se pudo eliminar el archivo físico del flayer: " + e.getMessage());
        }

        // Eliminar de base de datos
        flayerRepository.delete(flayer);

        return ResponseEntity.ok(Collections.singletonMap("ok", true));
    }
}
