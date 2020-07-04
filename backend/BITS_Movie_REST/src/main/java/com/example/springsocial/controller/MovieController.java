package com.example.springsocial.controller;

import com.example.springsocial.exception.ResourceAlreadyExistsException;
import com.example.springsocial.exception.ResourceNotFoundException;
import com.example.springsocial.model.*;
import com.example.springsocial.repositories.*;
import kong.unirest.Unirest;
import kong.unirest.json.JSONArray;
import kong.unirest.json.JSONObject;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@CrossOrigin
@RequestMapping("/api/movies")
@Getter
public class MovieController {

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private CachedMovieRepository cachedMovieRepository;

    @Autowired
    private MovieListRepository movieListRepository;

    @Autowired
    private MovieRatingRepository movieRatingRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private UserCommentRepository userCommentRepository;

    @Value("${omdb_api_key}")
    private String omdb_key;

    @Value("${tmdb_api_key}")
    private String tmdb_key;

    @Value("${tmdbUrl}")
    private String tmdbUrl;

    @Value("${omdbUrl}")
    private String omdbUrl;

    @GetMapping(value = "/{id}")
    public Movie getMovieById(@PathVariable(value = "id") Long id) throws ResourceNotFoundException {
        return movieRepository.findById(id)
                .orElseThrow(ResourceNotFoundException::new);
    }
    
    @GetMapping(value = "")
    public Page<Movie> getAllMoviesOrByName(@RequestParam(value = "name", required = false) String name, Pageable pageable) {
        if (name == null) {
            return movieRepository.findAll(pageable);
        }

        String formattedName = name.replace(" ", "%20").replace(":", "")
                .replace("&", "and");

        JSONObject omdbRes = Unirest.get(this.getTmdbUrl() + "search/movie")
                .queryString("api_key", this.getTmdb_key())
                .queryString("language", "en-US")
                .queryString("query", formattedName)
                .queryString("page", "1")
                .queryString("include_adult", "false")
                .asJson()
                .getBody()
                .getObject();

        JSONArray movieJsonArray = (JSONArray) omdbRes.get("results");

        for (int i = 0; i < movieJsonArray.length(); i++) {
            JSONObject movieInfo = (JSONObject) movieJsonArray.get(i);
            StringBuilder movieUrl = new StringBuilder();
            // Fetching Videos
            JSONObject trailerRes = Unirest.get(this.getTmdbUrl() + "movie/{id}")
                    .routeParam("id", String.valueOf(movieInfo.get("id")))
                    .queryString("api_key", this.getTmdb_key())
                    .queryString("language", "en-US")
                    .queryString("append_to_response", "videos")
                    .asJson()
                    .getBody()
                    .getObject();
            if (!trailerRes.has("status_code")){
                JSONObject trailerObject = (JSONObject) trailerRes.get("videos");
                JSONArray trailerArray = (JSONArray) trailerObject.get("results");

                JSONObject res = Unirest.get(this.getOmdbUrl())
                        .queryString("apikey", this.getOmdb_key())
                        .queryString("i",trailerRes.get("imdb_id"))
                        .queryString("plot", "full")
                        .queryString("type", "movie")
                        .asJson()
                        .getBody()
                        .getObject();

                if (!res.has("Error")) {
                    if (!Objects.isNull(movieInfo.get("backdrop_path"))) {

                        List<String> trailers = new ArrayList<>();
                        if (trailerArray.length() > 0){
                            for (int j = 0; j < trailerArray.length(); j++) {
                                JSONObject trailerInfo = (JSONObject) trailerArray.get(j);
                                trailers.add(String.format("https://www.youtube.com/watch?v=%s", trailerInfo.get("key")));
                            }
                        }

                        Movie newMovie = addNewMovieViaJson(res, movieInfo, movieInfo.get("backdrop_path").toString(), trailers);
                        boolean exists = checkIfMovieExistsInDatabase(newMovie);
                        if (!exists) {
                            movieRepository.save(newMovie);
                        }
                    } else {
                        Movie newMovie = addNewMovieViaJson(res, movieInfo, null, null);
                        // Preventing duplicate entries
                        boolean exists = checkIfMovieExistsInDatabase(newMovie);
                        if (!exists) {
                            movieRepository.save(newMovie);
                        }
                    }

                }
            }

        }

        return movieRepository.findByTitleIgnoreCaseContaining(name, pageable);
    }


    @PostMapping(value = "")
    @Secured({"ROLE_ADMIN"})
    public ResponseEntity<?> addNewMovie(@RequestBody Movie newMovie) throws ResourceAlreadyExistsException {
        boolean exists = checkIfMovieExistsInDatabase(newMovie);
        if (exists) {
            throw new ResourceAlreadyExistsException();
        }
        return ResponseEntity.ok(movieRepository.save(newMovie));
    }

    @PutMapping(value = "/{id}")
    @Secured({"ROLE_ADMIN"})
    public Movie updateMovieInfo(@PathVariable(value = "id") Long id, @RequestBody Movie updatedMovie)
            throws ResourceNotFoundException {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException());
        movie = updatedMovie;
        return movieRepository.save(movie);
    }

    @DeleteMapping(value = "/{id}")
    @Secured({"ROLE_ADMIN"})
    public ResponseEntity<?> deleteAMovie(@PathVariable(value = "id") Long id) throws ResourceNotFoundException {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(ResourceNotFoundException::new);

        List<MovieList> tempList = movieListRepository.findAll();
        for (MovieList list :
                tempList) {
            if (list.getMovies().contains(movie)) {
                list.getMovies().remove(movie);
                movieListRepository.save(list);
            }
        }

        movieRatingRepository.deleteByMovie_Id(id);
        List<Comment> comments = commentRepository.findByMovie_Id(id);
        if (comments.size() > 0){
            for (Comment c :
                    comments) {
                userCommentRepository.deleteByComment_Id(c.getId());
                commentRepository.delete(c);
            }
        }

        movieRepository.delete(movie);
        HashMap<String, String> res = new HashMap<>();
        res.put("message", "Success!");
        return ResponseEntity.ok(res);
    }

    @GetMapping(value = "/list/{type}")
    public Page<Movie> getPopularOrUpcomingMovies(@PathVariable(value = "type") String type, Pageable pageable) {

        Iterable<CachedMovie> templist = cachedMovieRepository.findAll();
        List<CachedMovie> list = new ArrayList<>();

        for (CachedMovie mo: templist){
            if (mo.getType().equals(type)){
                list.add(mo);
            }
        }

        if (list.size() > 0){
            LocalDateTime oneDayAfter = list.get(1).getLocalDateTime().plusHours(24);
            if (oneDayAfter.isAfter(LocalDateTime.now())){
                List<Movie> results = new ArrayList<>();
                for (CachedMovie m: list) {
                    results.add(m.getMovie());
                }
                return arrayToPages(results, pageable);
            }
            else {
                cachedMovieRepository.deleteAll();
            }
        }

        JSONObject tmdbRes = Unirest.get(this.getTmdbUrl() + "movie/{type}")
                .routeParam("type", type)
                .queryString("api_key", this.getTmdb_key())
                .queryString("language", "en-US")
                .queryString("page", "1")
                .asJson()
                .getBody()
                .getObject();

        JSONArray jsonArray = (JSONArray) tmdbRes.get("results");

        List<Movie> movieList = new ArrayList<>();

        for (int i = 0; i < jsonArray.length(); i++) {
            JSONObject object = (JSONObject) jsonArray.get(i);
            Movie movie = movieRepository.findTopByTitleIgnoreCase((String) object.get("title"));
            if (Objects.isNull(movie)) {

                JSONObject trailerRes = Unirest.get(this.getTmdbUrl() + "movie/{id}")
                        .routeParam("id", String.valueOf(object.get("id")))
                        .queryString("api_key", this.getTmdb_key())
                        .queryString("language", "en-US")
                        .queryString("append_to_response", "videos")
                        .asJson()
                        .getBody()
                        .getObject();

                if (!trailerRes.has("status_code")){

                    JSONObject trailerObj = (JSONObject) trailerRes.get("videos");
                    JSONArray trailerArray = (JSONArray) trailerObj.get("results");

                    JSONObject omdbRes = Unirest.get(this.getOmdbUrl())
                            .queryString("apikey", this.getOmdb_key())
                            .queryString("i",trailerRes.get("imdb_id"))
                            .queryString("plot", "full")
                            .queryString("type", "movie")
                            .asJson()
                            .getBody()
                            .getObject();

                    if (!omdbRes.has("Error")) {
                        if (!Objects.isNull(object.get("backdrop_path"))) {

                            List<String> trailers = new ArrayList<>();
                            if(trailerArray.length() > 0){
                                for (int j = 0; j < trailerArray.length(); j++) {
                                    JSONObject trailerInfo = (JSONObject) trailerArray.get(j);
                                    trailers.add(String.format("https://www.youtube.com/watch?v=%s", trailerInfo.get("key")));
                                }
                            }

                            Movie newMovie = addNewMovieViaJson(omdbRes, object, object.get("backdrop_path").toString(), trailers);

                            boolean exists = checkIfMovieExistsInDatabase(newMovie);
                            if (!exists) {
                                cacheAMovie(movieRepository.save(newMovie), type);
                                movieList.add(newMovie);
                            }
                        } else {
                            Movie newMovie = addNewMovieViaJson(omdbRes, object, null, null);
                            // Preventing duplicate entries
                            boolean exists = checkIfMovieExistsInDatabase(newMovie);
                            if (!exists) {
                                cacheAMovie(movieRepository.save(newMovie), type);
                                movieList.add(newMovie);
                            }
                        }
                    }
                }
            } else {
                cacheAMovie(movie, type);
                movieList.add(movie);
            }
        }
        return arrayToPages(movieList, pageable);
    }


    @GetMapping(value = "/recommendation/{type}")
    public Page<Movie> getSimilarOrRecommendedMovies(
            @PathVariable(value = "type") String type,
            @RequestParam(name = "movie") String movie,
            Pageable pageable) {

        List<Movie> results = new ArrayList<>();


        JSONObject similarMovies = Unirest.get(this.getTmdbUrl() + "movie/{id}/{type}")
                .routeParam("id", movie)
                .routeParam("type", type)
                .queryString("api_key", this.getTmdb_key())
                .queryString("language", "en-US")
                .queryString("page", "1")
                .asJson()
                .getBody()
                .getObject();

        if (!similarMovies.has("status_code")){
            JSONArray similarMoviesArray = (JSONArray) similarMovies.get("results");
            // 70% similar movies only to reduce packet size

            for (int j = 0; j < Math.round(similarMoviesArray.length() * 0.5); j++) {

                JSONObject similarMovieInfo = (JSONObject) similarMoviesArray.get(j);

                Movie temp = movieRepository.findTopByTitleIgnoreCase((String) similarMovieInfo.get("title"));
                if (Objects.isNull(temp)) {

                    JSONObject trailerRes = Unirest.get(this.getTmdbUrl() + "movie/{id}")
                            .routeParam("id", String.valueOf(similarMovieInfo.get("id")))
                            .queryString("api_key", this.getTmdb_key())
                            .queryString("language", "en-US")
                            .queryString("append_to_response", "videos")
                            .asJson()
                            .getBody()
                            .getObject();
                    if (!trailerRes.has("status_code")){
                        JSONObject trailerObj = (JSONObject) trailerRes.get("videos");
                        JSONArray trailerArray = (JSONArray) trailerObj.get("results");

                        JSONObject omdbRes = Unirest.get(this.getOmdbUrl())
                                .queryString("apikey", this.getOmdb_key())
                                .queryString("i",trailerRes.get("imdb_id"))
                                .queryString("plot", "full")
                                .queryString("type", "movie")
                                .asJson()
                                .getBody()
                                .getObject();
                        if (!omdbRes.has("Error")) {
                            if (!Objects.isNull(similarMovieInfo.get("backdrop_path"))) {

                                List<String> trailers = new ArrayList<>();
                                if(trailerArray.length() > 0){
                                    for (int k = 0; k< trailerArray.length(); k++) {
                                        JSONObject trailerInfo = (JSONObject) trailerArray.get(k);
                                        trailers.add(String.format("https://www.youtube.com/watch?v=%s", trailerInfo.get("key")));
                                    }
                                }

                                Movie newMovie = addNewMovieViaJson(omdbRes, similarMovieInfo, similarMovieInfo.get("backdrop_path").toString(), trailers);
                                boolean exists = checkIfMovieExistsInDatabase(newMovie);
                                if (!exists) {
                                    movieRepository.save(newMovie);
                                    results.add(newMovie);
                                }
                            } else {
                                Movie newMovie = addNewMovieViaJson(omdbRes, similarMovieInfo, null, null);
                                // Preventing duplicate entries
                                boolean exists = checkIfMovieExistsInDatabase(newMovie);
                                if (!exists) {
                                    movieRepository.save(newMovie);
                                    results.add(newMovie);
                                }
                            }
                        }
                    }
                } else {
                    results.add(temp);
                }
            }
        }

        return arrayToPages(results, pageable);
    }

    //

    @GetMapping("/genre/{genre}")
    public Page<Movie> getListOfMoviesByGenre(@PathVariable(value = "genre") String genre, Pageable pageable) {
        return movieRepository.findByGenreIgnoreCaseContaining(genre, pageable);
    }

    @GetMapping("/director/{director}")
    public Page<Movie> getListOfMoviesByDirector(@PathVariable(value = "director") String director, Pageable pageable) {
        return movieRepository.findByDirectorIgnoreCaseContaining(director, pageable);
    }

    @GetMapping("/metascore")
    public Page<Movie> getListOfMoviesByMetascore(@RequestParam(value = "lower") String lower,
                                                  @RequestParam(value = "upper") String upper,
                                                  Pageable pageable) {
        return movieRepository.findByMetascoreBetween(lower, upper, pageable);
    }

    @GetMapping("/query")
    public Page<Movie> getListOfMovieByQuery(@RequestParam(value = "rated", required = false) String rated,
                                             @RequestParam(value = "imdb", required = false) String imdb_score,
                                             @RequestParam(value = "genre", required = false) String genre,
                                             @RequestParam(value = "meta", required = false) String metaScore,
                                             @RequestParam(value = "actor", required = false) String actor,
                                             @RequestParam(value = "director", required = false) String director,
                                             @RequestParam(value = "title", required = false) String title,
                                             Pageable pageable) {
//        if (title != null){
//            return getAllMoviesOrByName(title, pageable);
//        }
        //TODO Need Work here
        return movieRepository.findBy(metaScore, imdb_score, genre, rated, actor, director, title, pageable);
    }

    private boolean checkIfMovieExistsInDatabase(Movie newMovie) {
        Movie movie = movieRepository.findByTmdbId(newMovie.getTmdbId());
        return !Objects.isNull(movie);
    }

    private void cacheAMovie(Movie movie, String type){
        if (!cachedMovieRepository.existsById(movie.getTmdbId())){

            CachedMovie cachedMovie = new CachedMovie(movie.getTmdbId(), movie, type);
            cachedMovieRepository.save(cachedMovie);
        }
    }

    private Page<Movie> arrayToPages(List<Movie> movieList, Pageable pageable) {
        int start = (int) pageable.getOffset();
        int end = (start + pageable.getPageSize()) > movieList.size() ? movieList.size() : (start + pageable.getPageSize());
        Page<Movie> pages = new PageImpl<Movie>(movieList.subList(start, end), pageable, movieList.size());
        return pages;
    }

    private Movie addNewMovieViaJson(JSONObject object, JSONObject object1, String backdrop, List<String> trailers) {
        Movie movie = new Movie();
        movie.setTmdbId(Long.parseLong(object1.get("id").toString()));
        movie.setTitle(object.has("Title") ? (String) object.get("Title"): "N/A");
        movie.setBackdrop(backdrop != null ? String.format("https://image.tmdb.org/t/p/original/%s", backdrop):
                "https://img.wallpapersafari.com/desktop/1920/1080/51/11/pAFte5.jpg");
        movie.setYear(object.has("Year") ? (String) object.get("Year"): "N/A");
        movie.setRated(object.has("Rated") ? (String) object.get("Rated"): "N/A");
        movie.setReleased((String) object.get("Released"));
        movie.setRuntime(object.has("Runtime") ? (String) object.get("Runtime"): "N/A");
        movie.setGenre(object.has("Genre") ? (String) object.get("Genre"): "N/A");
        movie.setDirector(object.has("Director") ? (String) object.get("Director"): "N/A");
        movie.setWriter(object.has("Writer") ? (String) object.get("Writer"): "N/A");
        movie.setActor(object.has("Actors") ? (String) object.get("Actors"): "N/A");
        movie.setPlot(object.has("Plot") ?(String) object.get("Plot"): "N/A");
        movie.setLanguage(object.has("Language") ?(String) object.get("Language"): "N/A");
        movie.setCountry(object.has("Country") ?(String) object.get("Country"): "N/A");
        movie.setPoster(object.has("Poster") ? (String) object.get("Poster"): "N/A");
        movie.setMetascore(object.has("Metascore") ? (String) object.get("Metascore") : "N/A");
        movie.setImdbScore(object.has("imdbRating") ? (String) object.get("imdbRating") : "N/A");
        movie.setImdb_Votes(object.has("imdbVotes") ? (String) object.get("imdbVotes") : "N/A");
        movie.setTrailers(trailers);
        movie.setType(object.has("Type") ? (String) object.get("Type") : "N/A" );
        movie.setBoxOffice(object.has("BoxOffice") ? (String) object.get("BoxOffice") : "N/A" );
        movie.setProduction(object.has("Production") ? (String) object.get("Production") : "N/A" );
        return movie;
    }
}
