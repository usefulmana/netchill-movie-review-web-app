package com.example.springsocial.repositories;

import com.example.springsocial.model.MovieRating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;


import java.util.List;

public interface MovieRatingRepository extends JpaRepository<MovieRating, Long> {

    @Query(value = "SELECT * FROM movie_ratings m where m.user_id = ?1", nativeQuery = true)
    List<MovieRating> findByUserId(Long id);

    @Query(value = "SELECT * FROM movie_ratings m where m.movie_id =?1 and m.user_id=?2", nativeQuery = true)
    MovieRating getRatingByMovieIdAndUserId(Long movie_id, Long user_id);

    @Query(value = "SELECT AVG (m.rating) from movie_ratings m where m.movie_id = ?1", nativeQuery = true)
    double getAverageRatingsOfAMovie(Long movie_id);

    @Query(value = "SELECT COUNT (m.id) from movie_ratings m where m.movie_id =?1", nativeQuery = true)
    int getNumberOfVotes(Long movie_id);

    List<MovieRating> findByMovie_Id(Long id);
    MovieRating findByMovie_IdAndUser_Id(Long movieId, Long userId);
    @Transactional
    void deleteByMovie_Id(Long id);
}
