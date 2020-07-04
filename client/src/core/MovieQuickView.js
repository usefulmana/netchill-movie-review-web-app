import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route, withRouter, Redirect, Link } from "react-router-dom";
import { loadSingleMovie } from './ApiCore'

import "../css/MovieDetail.css"
import ShowReviews from "./ShowReviews";
import Loader from "./Loader";
import SimMovieCarousel from "./SimMovieCarousel";
import TrailerSlider from "./TrailerSlider";
import Rate from "./Rate";
import ShowMore from 'react-show-more';
import '../css/MovieQuickView.css'

// rating, actor, director,metascore, imdbscore,genre

const MovieQuickView = ({ movie }) => {

    const showRating = () => {
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

    const showMovieInfoOnBanner = () => {
        return (
            <div className="movie-info-on-banner">
                <div className="movie-title">
                    {movie.title}
                </div>
                <div>
                    {showRating()}
                </div>
                <div>
                    {movie.imdb_Votes} | {movie.year} | <span className="run-time">{movie.runtime}</span>
                </div>
                <div class="plot">
                    {/* {movie.plot.length > 500 ? movie.plot.slice(0, 500) + "(See more). . ." : movie.plot} */}
                    <ShowMore
                        lines={10}
                        more='Show more'
                        less='Show less'
                        anchorClass=''
                    >
                        {movie.plot}
                    </ShowMore>
                </div>
                <div class="director-info">
                    {movie.director} | {movie.genre} | {movie.country} | {movie.actor}
                </div>
            </div>
        )
    }

    // console.log("movie : ", movie)

    const backgroundImageStyle = {
        backgroundImage: `linear-gradient(to left, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.7) 80%, rgba(0, 0, 0, 0.1) 100%),url(${movie && movie.backdrop})`,
    }

    const showTrailerOrPoster = () => {
        // console.log("movie.trailers : ", movie.trailers)
        if (movie.trailers.length === 0) {
            return (<img src={movie.poster}></img>)
        } else {
            var newArr = []
            newArr.push(movie.trailers[0])
            if (document.querySelector('.movie-quick-view-box').classList.contains('moved-preview')) {
                return <TrailerSlider trailerArr={newArr} />
            }
        }
    }

    const parseUrl = (trailer_url) => {
        if (trailer_url) {
            var splited = trailer_url.split("=");
            var embedUrl = "https://www.youtube.com/embed/" + splited[1] + "?version=3&enablejsapi=1"
            // console.log("embedUrl : ", embedUrl)
            return embedUrl
        }
    }

    var trailerUrl = movie.trailers && movie.trailers.length!==0? parseUrl(movie.trailers[0]) : parseUrl("https://www.youtube.com/watch?v=Y6MGPSyKwiQ")

    return movie ? (
        <div>
            <div className="movie-detail movie-quick-view-box card-preview ">
                <div className={`banner p-5  ${movie.id} `} style={backgroundImageStyle}>
                    <button className="btn btn-primary close-btn">X</button>
                    <div className="row">
                        <div class="trailer-location col-6" title={trailerUrl}>

                        </div>
                        {/* {showTrailerOrPoster()} */}

                        <div className="mt-5 col">
                            {showMovieInfoOnBanner()}
                            <Link style={{ color: 'black' }} to={{ pathname: `/movie/${movie.id}` }}>
                                <div className="btn btn-primary mx-2 btn-in-quick-view">go to see more</div>
                            </Link>
                        </div>
                        {/* <Rate movieId={movie.id} /> */}
                    </div>
                </div>
            </div>
        </div>
    ) : ""

}

export default MovieQuickView