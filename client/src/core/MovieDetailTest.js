import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter, Switch, Route, withRouter, Redirect, Link } from "react-router-dom";
import { loadSingleMovie, getSimilarMovies } from './ApiCore'
import Layout from "./Layout";
import "../css/MovieDetail.css"
import "../css/myscss.scss"
import ShowReviews from "./ShowReviews";
import Loader from "./Loader";
import CreateReview from "./CreateReview";
import SimMovieCarousel from "./SimMovieCarousel";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import TrailerSlider from "./TrailerSlider";
import Rate from "./Rate";
import ShowMore from 'react-show-more';
import ShowTime from "./ShowTime";
import queryString from 'query-string';
import ClickBox from "./ClickBox";


// receive array of products that admin want to show in carousel
const MovieDetail = ({ match, history }) => {
    const [dummy, setDummy] = useState(0);
    const [movie, setMovie] = useState();
    const [similarMovies, setSimilarMovies] = useState([]);
    const [error, setError] = useState();
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const movieId = match.params.movieId;
        var query = queryString.parse(history.location.search)
        var newMovieId = query.sim

        if (movie === undefined) {
            setLoading(true)
            loadSingleMovie(movieId).then(res => {
                console.log("movie in movie detail :", res)
                setMovie(res)
                getSimilarMovies(res.tmdbId).then(res => {
                    setSimilarMovies(res.content)

                    if (newMovieId) {
                        loadSingleMovie(newMovieId).then(res => {
                            setMovie(res)
                            setLoading(false)

                        })
                    } else {
                        setLoading(false)
                    }

                }).catch((err) => {
                    console.log("error in getsimilarmovies : ", err)
                })


            });
        } else if (newMovieId) {
            loadSingleMovie(newMovieId).then(res => {
                setMovie(res)
            })
            var a = document.querySelector(".display-toggle")
            a && (a.style.display = "block")
        }

    }, [history.location.search]);

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

    const parseActor = (string) => {
        var array = string.split(',')

        return array.map((c) => {
            c = c.trim()
            return <a target="_blank" href={`https://en.wikipedia.org/wiki/${c}`}><span className="mr-2">{c}</span></a>
        })
    }

    const dragStart = (e) => {
        document.querySelector('.drop-box').classList.add('drop-box-active')
        e.dataTransfer.setData('movie_id', `${movie.id}`)
    }

    const activateDropbox = () => {
        document.querySelector('.drop-box').classList.add('drop-box-active')
    }

    const showMovieInfoOnBanner = () => {
        return (
            <div className="movie-info-on-banner">
                <div className="row ">
                    <div className="movie-title">
                        <div>{movie.title}</div>
                    </div>
                    <div className="ml-2">{showRating()}</div>
                    <div onDragStart={dragStart} onClick={activateDropbox}>
                        <i class="fas fa-plus-circle add-to-list-icon" ></i>
                    </div>
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
                    Genre: {movie.genre}
                    <br></br>
                    Country: {movie.country}
                    <br></br>
                    Director: <a target="_blank" href={`https://en.wikipedia.org/wiki/${movie.director}`}>{movie.director}</a>
                    <br></br>
                    {console.log(movie.actor)}
                    Actor: {parseActor(movie.actor)}
                </div>
            </div>
        )
    }

    const backgroundImageStyle = {
        backgroundImage: `linear-gradient(to left, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.7) 80%, rgba(0, 0, 0, 0.1) 100%),url(${movie && movie.backdrop})`,
    }

    const handleClick = (newMovie) => {
        if (movie.id !== newMovie.id) {
            // document.querySelector(".slick-slide").style.width = "904px"

            document.querySelector(".display-toggle").style.display = "none"
            // setMovie(newMovie)

            history.push(`${history.location.pathname}?sim=${newMovie.id}`)
        }
    }

    const showTrailerOrPoster = () => {
        console.log("movie.trailers : ", movie.trailers)
        if (movie.trailers.length === 0) {
            return (<img src={movie.poster}></img>)
        } else {
            return <TrailerSlider trailerArr={movie.trailers} />

        }
    }

    const openShowTime = (e) => {
        e.target.closest('.movie-detail').querySelector(".show-time-background").style.display = "flex"
    }

    return movie ? (
        <div className="movie-detail ">
            <Layout>
                <div>
                    <div className={`banner  ${movie.id} `} style={backgroundImageStyle}>
                        <div className="animated fadeIn finite slower display-toggle ">
                            <div >
                                <div className="row ml-3 mr-3 pb-5 banner-inside-wrapper">
                                    <div className="ml-2 col-6" style={{ zIndex: 1 }}>
                                        {showTrailerOrPoster()}
                                    </div>
                                    <div className="col-5 ml-3">
                                        {showMovieInfoOnBanner()}
                                        <button className="my-popup-box btn btn-primary mx-0 my-2 infinite-progress-wave position-relative" onClick={openShowTime}>Show time
                                        <i class="fas fa-info-circle px-1"></i>
                                            <div className="my-popup">{`Check out ${movie.title} show time schedule!`}</div>
                                        </button>
                                        {/* tooltip */}
                                        <Rate movieId={movie.id} />
                                        {/* <div className="btn-primary" onDragStart={dragStart}>add it to list</div> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <SimMovieCarousel movies={similarMovies} handleClick={handleClick} />
                    </div>
                    <div className="detail">
                        <ShowReviews movieId={movie.id} />
                    </div>
                </div>
                {/* <div className="detail">
                    <Review movieId={movie.id} />
                </div> */}
            </Layout>
            <ShowTime movie={movie} />
            <Loader visible={loading} />
            <ClickBox movieId={movie.id} />
        </div>
    ) : ""
}

export default MovieDetail