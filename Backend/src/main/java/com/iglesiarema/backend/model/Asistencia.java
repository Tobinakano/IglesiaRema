package com.iglesiarema.backend.model;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "asistencia")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Asistencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombre_completo", nullable = false, length = 150)
    @JsonProperty("nombre_completo")
    private String nombreCompleto;

    private Long numero;

    @Column(length = 10)
    private String sexo;

    @Column(length = 50)
    @Builder.Default
    private String grupo = "Adultos";

    @Column(name = "fecha_nacimiento", length = 50)
    @JsonProperty("fecha_nacimiento")
    private String fechaNacimiento;

    @Column(length = 255)
    private String direccion;

    @Column(length = 100)
    private String barrio;

    @Column(name = "herramientas", nullable = false)
    @Builder.Default
    @JsonProperty("herramientas")
    private Boolean herramientas = false;
}
