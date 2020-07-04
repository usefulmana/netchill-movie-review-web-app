package com.example.springsocial.controller;

import com.example.springsocial.exception.ResourceNotFoundException;
import com.example.springsocial.model.Movie;
import com.example.springsocial.model.MovieRating;
import com.example.springsocial.model.User;
import com.example.springsocial.repositories.MovieRatingRepository;
import com.example.springsocial.repositories.MovieRepository;
import com.example.springsocial.repositories.UserRepository;
import com.example.springsocial.security.CurrentUser;
import com.example.springsocial.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class MovieRatingController {

    @Autowired
    private MovieRatingRepository movieRatingRepository;
    @Autowired
    private MovieRepository movieRepository;
    @Autowired
    private UserRepository userRepository;

    @GetMapping("/ratings/avg")
    public ResponseEntity<?> getAverageRatingsOfAMovie(@RequestParam(name = "movie_id") Long movie_id)
            throws ResourceNotFoundException
    {
        Movie movie = movieRepository.findById(movie_id).orElseThrow(
                ResourceNotFoundException::new
        );
        HashMap<String, Double> res = new  HashMap<>();
        res.put("counts", (double) movieRatingRepository.getNumberOfVotes(movie_id));
        res.put("result", movieRatingRepository.getAverageRatingsOfAMovie(movie_id));
        return ResponseEntity.ok(res);
    }

    @GetMapping("/ratings")
    public MovieRating getMovieRatingOfAUser(@RequestParam(name = "movie_id") Long movie_id,
                                             @RequestParam(name = "user_id") Long user_id){
        return movieRatingRepository.getRatingByMovieIdAndUserId(movie_id, user_id);
    }

    @GetMapping("/ratings/user")
    @Secured({"ROLE_USER", "ROLE_MODERATOR", "ROLE_ADMIN"})
    public MovieRating getRatingHistoryOfAUser(@CurrentUser UserPrincipal userPrincipal,
                                                     @RequestParam(name = "movie_id") Long movie_id
    )
        throws ResourceNotFoundException
    {
        User user = userRepository.findById(userPrincipal.getId()).orElseThrow(
                ResourceNotFoundException::new
        );
        return movieRatingRepository.getRatingByMovieIdAndUserId(movie_id, user.getId());
    }

    @RequestMapping(value = "/ratings", method = {RequestMethod.POST, RequestMethod.PATCH})
    @Secured({"ROLE_USER", "ROLE_MODERATOR", "ROLE_ADMIN"})
    public MovieRating createARating(@RequestParam(name = "movie_id") Long movie_id,
                                     @CurrentUser UserPrincipal userPrincipal,
                                     @RequestParam(name = "rating") double rating)
    throws ResourceNotFoundException{
        Movie movie = movieRepository.findById(movie_id).orElseThrow(
                ResourceNotFoundException::new
        );
        User user = userRepository.findById(userPrincipal.getId()).orElseThrow(
                ResourceNotFoundException::new
        );
        MovieRating movieRating = movieRatingRepository.findByMovie_IdAndUser_Id(movie.getId(), user.getId());
        if (Objects.isNull(movieRating)){
            return movieRatingRepository.save(new MovieRating(movie, user, rating));
        }
        else {
            movieRating.setRating(rating);
            return movieRatingRepository.save(movieRating);
        }
    }

//    @PatchMapping("/ratings")
//    @Secured({"ROLE_USER", "ROLE_MODERATOR", "ROLE_ADMIN"})
//    public MovieRating updateRating(@RequestParam(name = "rating_id") Long rating_id,
//                                    @RequestParam(name = "rating") double rating)
//            throws ResourceNotFoundException
//    {
//        MovieRating movieRating = movieRatingRepository.findById(rating_id).orElseThrow(
//                () -> new ResourceNotFoundException("Could not find rating with id = ", rating_id)
//        );
//        movieRating.setRating(rating);
//        return movieRatingRepository.save(movieRating);
//    }
}
