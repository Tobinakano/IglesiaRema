package com.iglesiarema.backend.repository;

import com.iglesiarema.backend.model.HerramientasRegistro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface HerramientasRegistroRepository extends JpaRepository<HerramientasRegistro, Long> {

    boolean existsByFechaAndPersonaId(String fecha, Long personaId);

    @Query("SELECT hr.fecha as fecha, COUNT(hr) as total FROM HerramientasRegistro hr GROUP BY hr.fecha ORDER BY hr.fecha DESC")
    List<RegistroResumen> findResumenGroupedByFecha();

    @Query("SELECT hr FROM HerramientasRegistro hr WHERE hr.fecha = :fecha ORDER BY hr.grupo, hr.nombreCompleto")
    List<HerramientasRegistro> findByFechaOrdered(@Param("fecha") String fecha);

    @Transactional
    @Modifying
    @Query("DELETE FROM HerramientasRegistro hr WHERE hr.fecha = :fecha")
    void deleteByFecha(@Param("fecha") String fecha);

    @Transactional
    @Modifying
    @Query("DELETE FROM HerramientasRegistro hr WHERE hr.fecha = :fecha AND hr.personaId = :personaId")
    void deleteByFechaAndPersonaId(@Param("fecha") String fecha, @Param("personaId") Long personaId);

    // Interface projection for grouping query
    interface RegistroResumen {
        String getFecha();
        Long getTotal();
    }
}
