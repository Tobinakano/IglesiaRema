package com.iglesiarema.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class MarcarAsistenciaRequest {
    private String fecha;

    @JsonProperty("persona_id")
    private Long personaId;

    private boolean asistio;
}
