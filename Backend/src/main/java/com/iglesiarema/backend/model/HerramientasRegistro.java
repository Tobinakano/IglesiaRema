package com.iglesiarema.backend.model;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "herramientas_registros")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HerramientasRegistro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String fecha;

    @Column(name = "persona_id", nullable = false)
    @JsonProperty("persona_id")
    private Long personaId;

    @Column(name = "nombre_completo", nullable = false, length = 150)
    @JsonProperty("nombre_completo")
    private String nombreCompleto;

    private Long numero;

    @Column(length = 10)
    private String sexo;

    @Column(nullable = false, length = 50)
    private String grupo;
}
