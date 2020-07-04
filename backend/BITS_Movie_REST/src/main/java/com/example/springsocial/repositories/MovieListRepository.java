package com.example.springsocial.repositories;

import com.example.springsocial.model.MovieList;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface MovieListRepository extends JpaRepository<MovieList, Long> {
    Page<MovieList> findByListNameIgnoreCaseContaining(String name, Pageable pageable);
    MovieList findByListNameIgnoreCaseAndUser_Id(String name, Long id);
    Page<MovieList> findByUser_IdAndPublicStatusTrue(Long id, Pageable pageable);
    Page<MovieList> findByUser_Id(Long id, Pageable pageable);
    List<MovieList> findByUser_Id(Long id);
}
