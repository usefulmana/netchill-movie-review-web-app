package com.example.springsocial.repositories;

import com.example.springsocial.model.CachedMovie;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface CachedMovieRepository extends CrudRepository<CachedMovie, Long> {
//    List<CachedMovie> findAll();
    boolean existsById(Long id);
}
