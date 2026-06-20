package com.iglesiarema.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SessionUser implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;
    private String usuario;
    private String nombre;
    private String rol;
}
