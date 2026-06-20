package com.iglesiarema.backend.repository;

import com.iglesiarema.backend.model.Persona;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PersonaRepository extends JpaRepository<Persona, Long> {
    Optional<Persona> findByUsuario(String usuario);
    
    // Custom projection to return only non-sensitive columns
    List<PersonaResumen> findAllProjectedBy();
    
    interface PersonaResumen {
        Long getId();
        String getNombre();
        String getApellido();
        String getRol();
    }
}
