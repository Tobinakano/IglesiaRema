package com.iglesiarema.backend.repository;

import com.iglesiarema.backend.model.Asistencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AsistenciaRepository extends JpaRepository<Asistencia, Long> {
    
    @Query("SELECT a FROM Asistencia a ORDER BY a.grupo, LOWER(a.nombreCompleto)")
    List<Asistencia> findAllOrdered();
}
