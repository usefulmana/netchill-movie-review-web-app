package com.example.springsocial.controller;


import com.example.springsocial.model.Role;
import com.example.springsocial.exception.ResourceAlreadyExistsException;
import com.example.springsocial.exception.ResourceNotFoundException;
import com.example.springsocial.exception.ResourceOwnerDoesNotMatchException;
import com.example.springsocial.model.Movie;
import com.example.springsocial.model.MovieList;
import com.example.springsocial.model.User;
import com.example.springsocial.repositories.MovieListRepository;
import com.example.springsocial.repositories.MovieRepository;
import com.example.springsocial.repositories.UserRepository;
import com.example.springsocial.security.CurrentUser;
import com.example.springsocial.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;


import java.util.HashMap;
import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/api")
@CrossOrigin
public class MovieListController {

    @Autowired
    private MovieListRepository movieListRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MovieRepository movieRepository;

    @PostMapping(value = "/list")
    @Secured({"ROLE_USER", "ROLE_MODERATOR", "ROLE_ADMIN"})
    public MovieList addNewMovieList(@CurrentUser UserPrincipal userPrincipal,
                                     @RequestBody MovieList movieList)
            throws ResourceNotFoundException {
        User user = userRepository.findById(userPrincipal.getId()).orElseThrow(
                ResourceNotFoundException::new
        );
        movieList.setUser(user);
        return movieListRepository.save(movieList);
    }

    @PutMapping(value = "/list/{id}")
    @Secured({"ROLE_USER", "ROLE_MODERATOR", "ROLE_ADMIN"})
    public ResponseEntity<?> updateAMovieList(@PathVariable(value = "id") Long list_id,
                                              @CurrentUser UserPrincipal userPrincipal,
                                              @RequestBody MovieList movieList)
            throws ResourceNotFoundException, ResourceOwnerDoesNotMatchException {
        MovieList tempList = movieListRepository.findById(list_id).orElseThrow(
                ResourceNotFoundException::new
        );
        User user = userRepository.findById(userPrincipal.getId()).orElseThrow(
                ResourceNotFoundException::new
        );
        if (!tempList.getUser().getId().equals(userPrincipal.getId())) {
            throw new ResourceOwnerDoesNotMatchException();
        }
        tempList = movieList;
        return ResponseEntity.ok(movieListRepository.save(tempList));
    }

//    @PatchMapping(value = "/list/liked")
//    public ResponseEntity<?> likeAndUnlikeAMovie(@CurrentUser UserPrincipal userPrincipal,
//                                                 @RequestParam(value = "movie_id") Long movie_id,
//                                                 @RequestParam(value = "method") String method)
//            throws ResourceNotFoundException, ResourceOwnerDoesNotMatchException, ResourceAlreadyExistsException{
//
//        MovieList likedList = movieListRepository.findByListNameIgnoreCaseAndUser_Id("Liked Movies",
//                userPrincipal.getId());
//        return addAndRemoveMovieFromAList(userPrincipal, likedList.getId(), movie_id, method);
//    }

    @PatchMapping(value = "/list")
    @Secured({"ROLE_USER", "ROLE_MODERATOR", "ROLE_ADMIN"})
    public ResponseEntity<?> addAndRemoveMovieFromAList(@CurrentUser UserPrincipal userPrincipal,
                                                        @RequestParam(value = "list_id") Long list_id,
                                                        @RequestParam(value = "movie_id") Long movie_id,
                                                        @RequestParam(value = "method") String method)
            throws ResourceNotFoundException, ResourceOwnerDoesNotMatchException, ResourceAlreadyExistsException {
        MovieList tempList = movieListRepository.findById(list_id).orElseThrow(
                ResourceNotFoundException::new
        );
        User user = userRepository.findById(userPrincipal.getId()).orElseThrow(
                ResourceNotFoundException::new
        );
        Movie movie = movieRepository.findById(movie_id).orElseThrow(
                ResourceNotFoundException::new
        );

        if (!tempList.getUser().getId().equals(userPrincipal.getId())) {
            throw new ResourceOwnerDoesNotMatchException();
        }
        if (method.equals("remove")) {
            if (checkIfMovieExistsInAList(list_id, movie_id)) {
                tempList.getMovies().remove(movie);
                return ResponseEntity.ok(movieListRepository.save(tempList));
            } else {
                throw new ResourceNotFoundException();
            }
        } else if (method.equals("add")) {
            if (!checkIfMovieExistsInAList(list_id, movie_id)) {
                tempList.getMovies().add(movie);
                return ResponseEntity.ok(movieListRepository.save(tempList));
            } else {
                throw new ResourceAlreadyExistsException();
            }
        }
        return null;
    }

    @PatchMapping(value = "/list/edit/{id}")
    @Secured({"ROLE_USER", "ROLE_MODERATOR", "ROLE_ADMIN"})
    public MovieList changeListName(@RequestParam(name = "name", required = false) String name,
                                    @RequestParam(name = "description", required = false) String description,
                                    @CurrentUser UserPrincipal userPrincipal,
                                    @PathVariable(name = "id") Long id){
        Optional<MovieList> list = movieListRepository.findById(id);
        Optional<User> user = userRepository.findById(userPrincipal.getId());

        if (list.isPresent() && user.isPresent() && list.get().getUser().getId().equals(user.get().getId())){
            if (!name.isEmpty()){
                list.get().setListName(name);
            }
            if (!description.isEmpty()){
                list.get().setDescription(description);
            }
            return movieListRepository.save(list.get());
        }
        return null;
    }

    @GetMapping(value = "/list")
    public Page<MovieList> getListByName(@RequestParam(value = "name") String name, Pageable pageable) {
        return movieListRepository.findByListNameIgnoreCaseContaining(name, pageable);
    }

    @GetMapping(value = "/list/{id}")
    public MovieList getListInfo(@PathVariable(value = "id") Long id) throws ResourceNotFoundException {
        return movieListRepository.findById(id).orElseThrow(
                ResourceNotFoundException::new
        );
    }

    @GetMapping("/list/user")
    public Page<MovieList> getListOfCurrentUser(@CurrentUser UserPrincipal userPrincipal, Pageable pageable){
        return movieListRepository.findByUser_Id(userPrincipal.getId(), pageable);
    }

    @GetMapping(value = "/list/user/{id}")
    public Page<MovieList> getListsByUserId(@PathVariable(value = "id") Long id,
                                            Pageable pageable){
        User user = userRepository.findById(id)
                .orElseThrow(ResourceNotFoundException::new);
            return movieListRepository.findByUser_IdAndPublicStatusTrue(user.getId(), pageable);
    }

    @DeleteMapping(value = "/list")
    @Secured({"ROLE_USER", "ROLE_MODERATOR", "ROLE_ADMIN"})
    public ResponseEntity<?> deleteAList(@RequestParam(value = "user_id") Long user_id,
                                         @RequestParam(value = "list_id") Long list_id)
            throws ResourceNotFoundException, ResourceOwnerDoesNotMatchException {
        MovieList tempList = movieListRepository.findById(list_id).orElseThrow(
                ResourceNotFoundException::new
        );
        User user = userRepository.findById(user_id).orElseThrow(
                ResourceNotFoundException::new
        );
        if (!tempList.getUser().getId().equals(user_id)) {
            throw new ResourceOwnerDoesNotMatchException();
        }
        movieListRepository.delete(tempList);
        HashMap<String, String> res = new HashMap<>();
        res.put("message", String.format("Successfully deleted object with id = %s", list_id));
        return ResponseEntity.ok(res);
    }

    private boolean checkIfMovieExistsInAList(Long list_id, Long movie_id) throws ResourceNotFoundException {
        MovieList tempList = movieListRepository.findById(list_id).orElseThrow(
                ResourceNotFoundException::new
        );
        Movie movie = movieRepository.findById(movie_id).orElseThrow(
                ResourceNotFoundException::new
        );

        for (Movie m : tempList.getMovies()) {
            if (m.equals(movie)) {
                return true;
            }
        }
        return false;
    }
}
