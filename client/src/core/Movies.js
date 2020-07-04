import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route, withRouter, Redirect, Link } from "react-router-dom";
import { loadSingleMovie } from './ApiCore'
import Layout from "./Layout";
import "../css/Movies.css"
import "../css/Transition.css"
import "../css/myscss.scss"
import Review from "./Review";
import { getMoviesByQuery, getTopRatedMovies, getNowPlayingMovies, getMovies } from './ApiCore'
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Card from "./Card2";
import PageButton from "./PageButton";
import Loader from "./Loader";
import queryString from 'query-string';
import Filter from "./Filter";
import Input from "./Input";
import { previewInit } from "./previewJquery"
import DropBox from "./DropBox";

// rating, actor, director,metascore, imdbscore,genre

const Movies = ({ location, history }) => {
    previewInit()
    const [movies, setMovies] = useState([]);
    const [myFilters, setMyFilters] = useState({});
    const [relatedProduct, setRelatedProduct] = useState([]);
    const [totalPages, setTotalPages] = useState();
    const [error, setError] = useState();
    const [loading, setLoading] = useState(true)
    const [options, setOptions] = useState({
        information: true,
        review: false
    })

    const init = () => {
        var query = queryString.parse(location.search)

        var genre = query.genre ? query.genre : ""
        // var price = query.price ? JSON.parse(query.price) : []
        var title = query.title ? query.title : ""
        var actor = query.actor ? query.actor : ""
        var rating = query.rating ? query.rating : ""
        var director = query.director ? query.director : ""

        var page = query.page ? query.page : 1
        var size = query.size ? query.size : 42
        var keyword = query.keyword ? query.keyword : ""

        var newFilters = {
            genre,
            title,
            director,
            actor,
            size,
            page
        }

        setMyFilters(newFilters)
        setLoading(true)

        if (newFilters['genre'] === "All") newFilters['genre'] = ""
        switch (newFilters['genre']) {
            case "New Movies":
                getNowPlayingMovies({ ...newFilters }).then((res) => {
                    setMovies(res.content)
                    setTotalPages(res.totalPages)
                    setLoading(false)
                })
                break;

            case "Trend Movies":
                getTopRatedMovies({ ...newFilters }).then((res) => {
                    setMovies(res.content)
                    setTotalPages(res.totalPages)
                    setLoading(false)
                })
                break;

            default:
                console.log("newfileter : ", newFilters)
                getMoviesByQuery({ ...newFilters }).then((res) => {
                    setMovies(res.content)
                    setTotalPages(res.totalPages)
                    setLoading(false)
                })
        }
    }

    const handleFilters = (value, filterBy) => {
        var newFilters = {}
        for (var key in myFilters) {
            newFilters[key] = myFilters[key]
        }

        if (filterBy === "page") { newFilters['page'] = value; } else { newFilters['page'] = 1 }

        if (filterBy === "genre") { newFilters['genre'] = value; newFilters['title'] = ""; newFilters['actor'] = ""; newFilters['director'] = "" }

        if (filterBy === "title") { newFilters['title'] = value; newFilters['actor'] = ""; newFilters['director'] = ""; newFilters['genre'] = "" }

        if (filterBy === "actor") { newFilters['actor'] = value; newFilters['title'] = ""; newFilters['director'] = ""; newFilters['genre'] = "" }

        if (filterBy === "director") { newFilters['director'] = value; newFilters['title'] = ""; newFilters['actor'] = ""; newFilters['genre'] = "" }

        var sendQuery = queryString.stringify(newFilters)
        console.log("sendQuery : ", sendQuery)
        history.push(`/movies?${sendQuery}`)
        // setMyFilters(newFilters)
    }

    useEffect(() => {
        init()
    }, [history.location]);

    const handleClick = () => {

    }

    const scrollToTop = () => {
        window.scrollTo({
            top: 400,
            behavior: 'smooth',
        })
    }

    const closeAlert = () => {
        document.querySelector('.my-alert').classList.remove('my-alert-active')
    }
    const alertFromRight = () => {
        return (
            <div className="my-alert my-alert-active">
                Drag movie and add it to your custom movie list!!
                <i class="fas fa-times close-btn" onClick={closeAlert}></i>
            </div>
        )
    }

    return (
        <Layout>
            <div className="position-relative overflow-auto">
                <div>{alertFromRight()}</div>
                <div className="row justify-content-center logo-for-movie animated finite slideInDown faster">
                    <div className="">
                        <img src="/img/logo-for-movie-page.jpeg" />
                        {/* <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do do eiusmod tempor incididunt</p>
                        <p>ut labore et dolore magna aliqua. Ut enim ad minim </p>
                        <p>veniam, quis nostrud exercitation</p> */}
                    </div>
                </div>
                <div className="movie-page-background"></div>

                <div className="row movie-page mt-5 align-items-center justify-content-center">

                    <Filter handleFilters={handleFilters} myFilters={myFilters} />
                    <div className="mx-4">
                        <Input handleFilters={handleFilters} title={myFilters.title} />
                    </div>
                    <PageButton totalPages={totalPages} page={myFilters.page} handleFilters={handleFilters} />
                </div>

                <DropBox />
                <div className="position-relative">
                    <TransitionGroup>
                        {movies === undefined ? null:
                            <CSSTransition
                                key={movies[0] && movies[0].id}
                                classNames="mytransition"
                                timeout={1000}
                            >
                                <div className="row justify-content-center mx-2">
                                    {movies.map((c) =>
                                        <div className="movie-page-card col-2  px-1 my-1">
                                            <Card movie={c} />
                                        </div>
                                    )}
                                </div>
                            </CSSTransition>                     
                        }
                       
                    </TransitionGroup>
                </div>
                <div className="row justify-content-center logo-for-movie animated finite slideInDown faster">
                    <div className="">
                        {/* <img src="/img/logo-for-movie-page.jpeg" /> */}
                        <div className="scroll-to-top-icon" onClick={scrollToTop}><i class="fas fa-angle-double-up"></i></div>
                        <div>Scroll to top</div>
                    </div>
                </div>
            </div>
            <Loader visible={loading} />
        </Layout>
    )

}

export default Movies