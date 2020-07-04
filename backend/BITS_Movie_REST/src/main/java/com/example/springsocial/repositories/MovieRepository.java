package com.example.springsocial.repositories;

import com.example.springsocial.model.Movie;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MovieRepository extends JpaRepository<Movie, Long> {
//    @Query(value = "SELECT * FROM movies m WHERE m.title REGEXP ?1 ORDER BY ?#{#pageable}"
//            , nativeQuery = true)
    Page<Movie> findByTitleIgnoreCaseContaining(String name, Pageable pageable);

//    @Query(value = "SELECT * FROM movies m WHERE m.title REGEXP ?1"
//            , nativeQuery = true)
    List<Movie> findByTitleIgnoreCaseContaining(String name);
    Movie findByTitleIgnoreCase(String name);
    Movie findByTitleAndReleasedIgnoreCase(String title, String released);
    Movie findTopByTitleAndReleasedIgnoreCase(String title, String released);
    Movie findByTmdbId(Long id);
    Movie findTopByTitleIgnoreCase(String name);
    @Query(value = "DELETE FROM list_movie WHERE movie_id=?1", nativeQuery = true)
    void deleteMovieInList(Long id);
    @Query(value = "DELETE FROM movie_ratings WHERE movie_id=?1", nativeQuery = true)
    void deleteMovieInRating(Long id);

    Page<Movie> findByGenreIgnoreCaseContaining(String genre, Pageable pageable);
    Page<Movie> findByDirectorIgnoreCaseContaining(String director, Pageable pageable);
    Page<Movie> findByMetascoreBetween(String lowerBound, String upperBound, Pageable pageable);

    @Query(value = "SELECT m FROM Movie m WHERE " +
            "(:meta IS NULL OR m.metascore >= :meta) AND" +
            "(:imdb IS NULL OR m.imdbScore >= :imdb) AND " +
            "(:genre IS NULL OR m.genre LIKE %:genre%) AND " +
            "(:rated IS NULL OR m.rated LIKE %:rated%) AND " +
            "(:actor IS NULL OR m.actor LIKE %:actor%) AND " +
            "(:director IS NULL OR m.director LIKE %:director%) AND" +
            "(:title IS NULL OR m.title LIKE %:title%)")
    Page<Movie> findBy(@Param("meta") String meta, @Param("imdb") String imdb,
                       @Param("genre") String genre, @Param("rated") String rated,
                       @Param("actor") String actor, @Param("director") String director,
                       @Param("title") String title,
                       Pageable pageable);
}
