package com.iglesiarema.backend.controller;

import com.iglesiarema.backend.dto.RegistrarAsistenciaRequest;
import com.iglesiarema.backend.model.Asistencia;
import com.iglesiarema.backend.model.AsistenciaRegistro;
import com.iglesiarema.backend.repository.AsistenciaRepository;
import com.iglesiarema.backend.repository.AsistenciaRegistroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/asistencia")
public class AsistenciaController {

    @Autowired
    private AsistenciaRepository asistenciaRepository;

    @Autowired
    private AsistenciaRegistroRepository registrosRepository;

    // Obtener todas las personas registradas
    @GetMapping
    public ResponseEntity<List<Asistencia>> listarAsistencia() {
        return ResponseEntity.ok(asistenciaRepository.findAllOrdered());
    }

    // Crear personas en asistencia
    @PostMapping
    public ResponseEntity<?> crearAsistencia(@RequestBody Asistencia persona) {
        if (persona.getNombreCompleto() == null || persona.getNombreCompleto().trim().isEmpty() ||
            persona.getNumero() == null ||
            persona.getSexo() == null || persona.getSexo().trim().isEmpty()) {
            
            Map<String, String> error = new HashMap<>();
            error.put("error", "Nombre completo, número de teléfono y género son requeridos");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        if (persona.getGrupo() == null || persona.getGrupo().trim().isEmpty()) {
            persona.setGrupo("Adultos");
        }

        Asistencia saved = asistenciaRepository.save(persona);
        
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("ok", true);
        response.put("id", saved.getId());
        response.put("nombre_completo", saved.getNombreCompleto());
        response.put("numero", saved.getNumero());
        response.put("sexo", saved.getSexo());
        response.put("grupo", saved.getGrupo());
        response.put("fecha_nacimiento", saved.getFechaNacimiento());
        response.put("direccion", saved.getDireccion());
        response.put("barrio", saved.getBarrio());
        
        return ResponseEntity.ok(response);
    }

    // Registrar asistencias en lote (bulk)
    @PostMapping("/registrar")
    public ResponseEntity<?> registrarAsistencias(@RequestBody RegistrarAsistenciaRequest request) {
        if (request.getAsistencias() == null) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Lista de asistencias requerida");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        String fecha = LocalDate.now().toString(); // Formato YYYY-MM-DD
        int guardadas = 0;

        for (RegistrarAsistenciaRequest.AsistenciaItem item : request.getAsistencias()) {
            // Verificar duplicados para la fecha y persona_id
            boolean exists = registrosRepository.existsByFechaAndPersonaId(fecha, item.getId());
            if (!exists) {
                AsistenciaRegistro registro = AsistenciaRegistro.builder()
                        .fecha(fecha)
                        .personaId(item.getId())
                        .nombreCompleto(item.getNombreCompleto())
                        .numero(item.getNumero())
                        .sexo(item.getSexo())
                        .grupo(item.getGrupo())
                        .build();
                        
                registrosRepository.save(registro);
                guardadas++;
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("ok", true);
        response.put("guardadas", guardadas);
        return ResponseEntity.ok(response);
    }

    // Listado agrupado por fecha de asistencias tomadas
    @GetMapping("/registros")
    public ResponseEntity<List<AsistenciaRegistroRepository.RegistroResumen>> listarFechasRegistros() {
        return ResponseEntity.ok(registrosRepository.findResumenGroupedByFecha());
    }

    // Obtener registros de asistencia por fecha específica
    @GetMapping("/registros/{fecha}")
    public ResponseEntity<List<AsistenciaRegistro>> obtenerRegistrosPorFecha(@PathVariable String fecha) {
        return ResponseEntity.ok(registrosRepository.findByFechaOrdered(fecha));
    }

    // Eliminar registros de una fecha específica
    @DeleteMapping("/registros/{fecha}")
    public ResponseEntity<?> eliminarRegistrosPorFecha(@PathVariable String fecha) {
        registrosRepository.deleteByFecha(fecha);
        Map<String, Boolean> response = new HashMap<>();
        response.put("ok", true);
        return ResponseEntity.ok(response);
    }

    // Obtener una persona por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPersona(@PathVariable Long id) {
        Optional<Asistencia> personaOpt = asistenciaRepository.findById(id);
        if (personaOpt.isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Persona no encontrada");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
        return ResponseEntity.ok(personaOpt.get());
    }

    // Actualizar una persona
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarPersona(@PathVariable Long id, @RequestBody Asistencia personaData) {
        Optional<Asistencia> personaOpt = asistenciaRepository.findById(id);
        if (personaOpt.isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Persona no encontrada");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        if (personaData.getNombreCompleto() == null || personaData.getNombreCompleto().trim().isEmpty() ||
            personaData.getNumero() == null ||
            personaData.getSexo() == null || personaData.getSexo().trim().isEmpty()) {
            
            Map<String, String> error = new HashMap<>();
            error.put("error", "Nombre completo, número de teléfono y género son requeridos");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        Asistencia persona = personaOpt.get();
        persona.setNombreCompleto(personaData.getNombreCompleto());
        persona.setNumero(personaData.getNumero());
        persona.setSexo(personaData.getSexo());
        persona.setGrupo(personaData.getGrupo() != null ? personaData.getGrupo() : "Adultos");
        persona.setFechaNacimiento(personaData.getFechaNacimiento());
        persona.setDireccion(personaData.getDireccion());
        persona.setBarrio(personaData.getBarrio());

        Asistencia saved = asistenciaRepository.save(persona);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("ok", true);
        response.put("id", saved.getId());
        response.put("nombre_completo", saved.getNombreCompleto());
        response.put("numero", saved.getNumero());
        response.put("sexo", saved.getSexo());
        response.put("grupo", saved.getGrupo());
        response.put("fecha_nacimiento", saved.getFechaNacimiento());
        response.put("direccion", saved.getDireccion());
        response.put("barrio", saved.getBarrio());
        
        return ResponseEntity.ok(response);
    }

    // Eliminar una persona de asistencia
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarPersona(@PathVariable Long id) {
        Optional<Asistencia> personaOpt = asistenciaRepository.findById(id);
        if (personaOpt.isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Persona no encontrada");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        asistenciaRepository.deleteById(id);
        Map<String, Boolean> response = new HashMap<>();
        response.put("ok", true);
        return ResponseEntity.ok(response);
    }

    // Datos mensuales para las gráficas
    @GetMapping("/graficas/{mes}")
    public ResponseEntity<?> obtenerDatosGraficas(@PathVariable String mes) {
        // mes viene en formato YYYY-MM (e.g. 2026-06)
        List<AsistenciaRegistro> registros = registrosRepository.findByFechaStartingWith(mes);

        // Agrupar en memoria por fecha
        Map<String, List<AsistenciaRegistro>> groupedByFecha = registros.stream()
                .collect(Collectors.groupingBy(AsistenciaRegistro::getFecha));

        List<Map<String, Object>> result = groupedByFecha.entrySet().stream()
                .map(entry -> {
                    String fechaStr = entry.getKey();
                    List<AsistenciaRegistro> list = entry.getValue();

                    // Obtener el día a partir de la fecha (e.g. "2026-06-15" -> dia 15)
                    int dia = 1;
                    try {
                        String[] parts = fechaStr.split("-");
                        if (parts.length == 3) {
                            dia = Integer.parseInt(parts[2]);
                        }
                    } catch (NumberFormatException e) {
                        // ignore
                    }

                    long ninos = list.stream().filter(r -> "Niños".equalsIgnoreCase(r.getGrupo())).count();
                    long jovenes = list.stream().filter(r -> "Jóvenes".equalsIgnoreCase(r.getGrupo())).count();
                    long adultos = list.stream().filter(r -> "Adultos".equalsIgnoreCase(r.getGrupo())).count();

                    Map<String, Object> map = new LinkedHashMap<>();
                    map.put("fecha", fechaStr);
                    map.put("dia", dia);
                    map.put("niños", ninos);
                    map.put("jóvenes", jovenes);
                    map.put("adultos", adultos);
                    return map;
                })
                .sorted(Comparator.comparing(m -> (String) m.get("fecha")))
                .collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }
}
