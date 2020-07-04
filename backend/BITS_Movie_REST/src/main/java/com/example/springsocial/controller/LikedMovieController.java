package com.example.springsocial.controller;


import com.example.springsocial.exception.ResourceNotFoundException;
import com.example.springsocial.model.LikedMovie;
import com.example.springsocial.model.Movie;
import com.example.springsocial.model.MovieList;
import com.example.springsocial.model.User;
import com.example.springsocial.repositories.LikedMovieRepository;
import com.example.springsocial.repositories.MovieListRepository;
import com.example.springsocial.repositories.MovieRepository;
import com.example.springsocial.repositories.UserRepository;
import com.example.springsocial.security.CurrentUser;
import com.example.springsocial.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;


@RestController
@CrossOrigin
@RequestMapping("/api")
public class LikedMovieController {

    @Autowired
    private LikedMovieRepository likedMovieRepository;

    @Autowired
    private MovieListRepository movieListRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MovieRepository movieRepository;

    @GetMapping(value = "/liked/user")
    @Secured({"ROLE_USER", "ROLE_MODERATOR", "ROLE_ADMIN"})
    public MovieList getAListOfLikedMovie(@CurrentUser UserPrincipal userPrincipal){
        MovieList likedList = createLikedMovieListIfNotExists(userPrincipal);
        return movieListRepository.findByListNameIgnoreCaseAndUser_Id("Liked Movies", userPrincipal.getId());
    }

    @GetMapping(value = "/liked")
    @Secured({"ROLE_USER", "ROLE_MODERATOR", "ROLE_ADMIN"})
    public LikedMovie getLikedMovie(
            @CurrentUser UserPrincipal userPrincipal,
            @RequestParam(value = "movie_id") Long movie_id){
        return likedMovieRepository.findByMovie_IdAndUser_Id(movie_id, userPrincipal.getId());
    }

    @PostMapping(value = "/liked")
    @Secured({"ROLE_USER", "ROLE_MODERATOR", "ROLE_ADMIN"})
    public MovieList likeAMovie(@CurrentUser UserPrincipal userPrincipal,
                                @RequestParam(value = "movie_id") Long movie_id){
        MovieList likedList = createLikedMovieListIfNotExists(userPrincipal);
        User user = userRepository.findById(userPrincipal.getId()).orElseThrow(
                ResourceNotFoundException::new);
        Movie movie = movieRepository.findById(movie_id).orElseThrow(ResourceNotFoundException::new);
        LikedMovie likedMovie = new LikedMovie(movie,user);
        likedMovieRepository.save(likedMovie);
        likedList.getMovies().add(movie);
        return movieListRepository.save(likedList);
    }


    @DeleteMapping(value = "/liked/{id}")
    @Secured({"ROLE_USER", "ROLE_MODERATOR", "ROLE_ADMIN"})
    public MovieList unlikeAMovie(@CurrentUser UserPrincipal userPrincipal,
                                @PathVariable(value = "id") Long id,
                                @RequestParam(value = "movie_id") Long movie_id){
        MovieList likedList = createLikedMovieListIfNotExists(userPrincipal);
        User user = userRepository.findById(userPrincipal.getId()).orElseThrow(
                ResourceNotFoundException::new);
        Movie movie = movieRepository.findById(movie_id).orElseThrow(ResourceNotFoundException::new);
        LikedMovie likedMovie = likedMovieRepository.findById(movie_id).orElseThrow(ResourceNotFoundException::new);
        likedMovieRepository.delete(likedMovie);
        likedList.getMovies().remove(movie);
        return movieListRepository.save(likedList);
    }

    private MovieList createLikedMovieListIfNotExists(@CurrentUser UserPrincipal userPrincipal){
        MovieList likedList = movieListRepository.findByListNameIgnoreCaseAndUser_Id("Liked Movies",
                userPrincipal.getId());
        User user = userRepository.findById(userPrincipal.getId()).orElseThrow(
                ResourceNotFoundException::new);
        if (Objects.isNull(likedList)){
            MovieList likedMovieList = new MovieList("Liked Movies", "", true, user);
            movieListRepository.save(likedMovieList);
            return likedMovieList;
        }
        return likedList;
    }
}
