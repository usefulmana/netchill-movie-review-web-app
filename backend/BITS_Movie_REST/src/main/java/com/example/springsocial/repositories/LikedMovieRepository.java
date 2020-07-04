package com.example.springsocial.repositories;

import com.example.springsocial.model.LikedMovie;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LikedMovieRepository extends JpaRepository<LikedMovie, Long> {

    List<LikedMovie> findByUser_Id(Long id);
    LikedMovie findByMovie_IdAndUser_Id(Long movie_id, Long user_id);
}
