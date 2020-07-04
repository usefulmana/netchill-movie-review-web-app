import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter, Switch, Route, withRouter, Redirect, Link } from "react-router-dom";
import { loadSingleMovie, getSimilarMovies } from './ApiCore'
import Layout from "./Layout";
import "../css/MovieDetail.css"
import ShowReviews from "./ShowReviews";
import Loader from "./Loader";
import CreateReview from "./CreateReview";
import SimMovieCarousel from "./SimMovieCarousel";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import TrailerSlider from "./TrailerSlider";
import Rate from "./Rate";

// receive array of products that admin want to show in carousel
const MovieDetail = (props) => {
    const [dummy, setDummy] = useState(0);
    const [movie, setMovie] = useState();
    const [similarMovies, setSimilarMovies] = useState([]);
    const [error, setError] = useState();
    const [loading, setLoading] = useState(true)
    const [options, setOptions] = useState({
        information: true,
        review: false
    })

    useEffect(() => {
        const movieId = props.match.params.movieId;
        setLoading(true)
        loadSingleMovie(movieId).then(res => {
            console.log("movie in movie detail :", res)
            setMovie(res)
            getSimilarMovies(res.tmdbId).then(res => {
                setSimilarMovies(res.content)
                console.log("RESPONSEEEEEEEEEEEEEEEEEEEEEEEEEEEE")
                console.log(res.content)
                setLoading(false)
            })
        });
        
        // window.scrollTo(0, 0);
    }, [dummy]);

    const isActive = () => {
        return "active-section"
    }

    const clickOption = (selected) => () => {
        var newOptions = {}
        for (var k in options) {
            if (k === selected) {
                newOptions[k] = true
            } else {
                newOptions[k] = false
            }
        }
        setOptions(newOptions)
    }

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
                    {movie.plot.length > 500 ? movie.plot.slice(0, 500) + "(See more). . ." : movie.plot}
                </div>
                <div class="director-info">
                    {movie.genre} | {movie.country}
                </div>
                <div class="director-info">
                    {movie.director} | {movie.actor}
                </div>
            </div>
        )
    }

    console.log("movie : ", movie)

    const backgroundImageStyle = {
        backgroundImage: `linear-gradient(to left, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.7) 80%, rgba(0, 0, 0, 0.1) 100%),url(${movie && movie.backdrop})`,
    }

    const handleClick = (movie) => {
        console.log("newly cliked movie from simCarousle  : ", movie)
        setMovie(movie)
    }

    const showTrailerOrPoster = () => {
        console.log("movie.trailers : ", movie.trailers)
        if (movie.trailers.length === 0) {
            return (<img src={movie.poster}></img>)
        } else {
            return <TrailerSlider trailerArr={movie.trailers} />

        }
    }

    return movie ? (
        <div className="movie-detail ">
            <Layout>
                <div className="position-relative t">
                    <TransitionGroup>
                        <CSSTransition
                            key={movie.id}
                            classNames="mytransition"
                        >
                            <div>

                                <div class={`banner  ${movie.id} `} style={backgroundImageStyle}>
                                    <div className="row ml-3 mr-3 pb-5 banner-inside-wrapper">
                                        <div className="ml-2 col-6" style={{ zIndex: 1 }}>
                                            {showTrailerOrPoster()}
                                        </div>
                                        <div className="col-5 ml-3">
                                            {showMovieInfoOnBanner()}
                                            <Rate movieId={movie.id} />

                                        </div>

                                    </div>
                                </div>
                            </div>
                        </CSSTransition>
                    </TransitionGroup>
                    <SimMovieCarousel movies={similarMovies} handleClick={handleClick} />

                    <div className="detail">
                        <Review movieId={movie.id} />
                    </div>
                </div>

                {/* <div className="detail">
                    <Review movieId={movie.id} />
                </div> */}
            </Layout>
            <Loader visible={loading} />
        </div>
    ) : ""
}

export default MovieDetail