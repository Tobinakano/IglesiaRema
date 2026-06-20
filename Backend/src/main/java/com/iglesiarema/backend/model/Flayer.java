package com.iglesiarema.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "flayers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Flayer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String titulo;

    @Column(name = "imagen_path", nullable = false, length = 255)
    private String imagenPath;

    @Column(nullable = false)
    @Builder.Default
    private Integer orden = 0;
}
