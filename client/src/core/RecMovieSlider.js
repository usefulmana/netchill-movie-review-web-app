import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route, withRouter, Redirect, Link } from "react-router-dom";
import Layout from "./Layout";
import MovieCarousel from "./MovieCarousel"
import 'aos/dist/aos.css'; // You can also use <link> for styles
import ScrollAnimation from 'react-animate-on-scroll';
import Slider from "react-slick";
import '../css/HomeSlider.css'
import TrailerSlider from "./TrailerSlider";


const RecMovieSlider = ({ movies = [] }) => {

    if (movies.length > 0) {
        var inputMovies = movies
        movies = []
        movies.push(inputMovies[1]);
        movies.push(inputMovies[2]);
        movies.push(inputMovies[3]);
        movies.push(inputMovies[4]);
        movies.push(inputMovies[5]);
        movies.push(inputMovies[6]);

    }


    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        cssEase: 'cubic-bezier(0.7, 0, 0.3, 1)',
        fade: true,
        arrows: true,
    };

    const backgroundImageStyle = (movie) => {
        return { backgroundImage: `linear-gradient(to left, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.7) 80%, rgba(0, 0, 0, 0.1) 100%),url(${movie && movie.backdrop})` }
    }

    const showRating = (movie) => {
        let target = movie.imdbScore
        let arr = [];
        let avg = movie.imdbScore

        if (avg !== 0 && avg !== undefined) {
            let remain = Math.round(avg % 1 * 100) / 10
            for (let i = 0; i < Math.floor(avg); i++) {
                arr.push(<i class="fas fa-star" style={{ color: 'red' }}></i>)
            }
            if (remain >= 5) {
                arr.push(
                    <i class="fas fa-star-half-alt" style={{ color: 'red' }}></i>
                )
            }
            arr.push(
                <span>
                    <span className="mx-1 font-small average-rating" >{avg}</span>
                </span>
            )
        }
        return arr
    }

    const showMovieInfoOnBanner = (movie) => {
        return (
            <div className="movie-info-on-banner">
                <div className="movie-title" >
                    <Link to={`/movie/${movie.id}`} style={{color:'white'}}>
                        {movie.title}
                    </Link>
                </div>
                <div>
                    {showRating(movie)}
                </div>
                <div>
                    {movie.imdb_Votes} | {movie.year} | <span className="run-time">{movie.runtime}</span>
                </div>
                <div class="plot">
                    {movie.plot}
                </div>
                <div class="director-info">
                    {movie.director} | {movie.genre} | {movie.country} | {movie.actor}
                </div>
            </div>
        )
    }

    const showTrailerOrPoster = (movie) => {
        console.log("movie.trailers : ", movie.trailers)
        if (movie.trailers.length === 0 || movie.trailers.length === null) {
            return (<img src={movie.poster}></img>)
        } else {
            return <TrailerSlider trailerArr={movie.trailers} />

        }
    }

    return movies.length > 0 && (
        <div className="home-slider my-5 mx-5 animated fadeInDown finite">
            <Slider {...settings}>
                {movies.map((movie) => {
                    return (
                        <div className="movie-detail ">
                            <div class={`banner  ${movie.id} `} style={backgroundImageStyle(movie)}>
                                <div className="row ml-3 mr-3 pb-5 banner-inside-wrapper">
                                    <div className="ml-4 col-6" style={{ zIndex: 1 }}>
                                        {showTrailerOrPoster(movie)}
                                    </div>
                                    <div className="col-5 ml-3">
                                        {showMovieInfoOnBanner(movie)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </Slider>
        </div>
    )
}

export default RecMovieSlider