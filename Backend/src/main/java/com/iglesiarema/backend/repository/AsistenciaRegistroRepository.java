package com.iglesiarema.backend.repository;

import com.iglesiarema.backend.model.AsistenciaRegistro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface AsistenciaRegistroRepository extends JpaRepository<AsistenciaRegistro, Long> {

    boolean existsByFechaAndPersonaId(String fecha, Long personaId);

    @Query("SELECT ar.fecha as fecha, COUNT(ar) as total FROM AsistenciaRegistro ar GROUP BY ar.fecha ORDER BY ar.fecha DESC")
    List<RegistroResumen> findResumenGroupedByFecha();

    @Query("SELECT ar FROM AsistenciaRegistro ar WHERE ar.fecha = :fecha ORDER BY ar.grupo, ar.nombreCompleto")
    List<AsistenciaRegistro> findByFechaOrdered(@Param("fecha") String fecha);

    @Transactional
    @Modifying
    @Query("DELETE FROM AsistenciaRegistro ar WHERE ar.fecha = :fecha")
    void deleteByFecha(@Param("fecha") String fecha);

    @Transactional
    @Modifying
    @Query("DELETE FROM AsistenciaRegistro ar WHERE ar.fecha = :fecha AND ar.personaId = :personaId")
    void deleteByFechaAndPersonaId(@Param("fecha") String fecha, @Param("personaId") Long personaId);

    List<AsistenciaRegistro> findByFechaStartingWith(String mesPattern);

    // Interface projection for grouping query
    interface RegistroResumen {
        String getFecha();
        Long getTotal();
    }
}
