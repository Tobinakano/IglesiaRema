package com.iglesiarema.backend.repository;

import com.iglesiarema.backend.model.Flayer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FlayerRepository extends JpaRepository<Flayer, Long> {

    List<Flayer> findAllByOrderByOrdenAscIdAsc();

    @Query("SELECT COALESCE(MAX(f.orden), 0) FROM Flayer f")
    Integer findMaxOrden();

    // To find the flyer above (smaller order index)
    Optional<Flayer> findFirstByOrdenLessThanOrderByOrdenDesc(Integer orden);

    // To find the flyer below (greater order index)
    Optional<Flayer> findFirstByOrdenGreaterThanOrderByOrdenAsc(Integer orden);
}
