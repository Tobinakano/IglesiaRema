package com.iglesiarema.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class RegistrarAsistenciaRequest {
    private List<AsistenciaItem> asistencias;

    @Data
    public static class AsistenciaItem {
        private Long id; // referring to the original attendee id
        
        @JsonProperty("nombre_completo")
        private String nombreCompleto;
        
        private Long numero;
        private String sexo;
        private String grupo;
    }
}
