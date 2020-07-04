import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route, withRouter, Redirect, Link } from "react-router-dom";
import Layout from "./Layout";
import '../css/Home.css'
import '../css/slickCustom.css'
import '../css/myscss.scss'
import Loader from "./Loader";
import MovieCarousel from "./MovieCarousel"
import { getPopularMovies, getUpcomingMovies, getTopRatedMovies, getNowPlayingMovies } from './ApiCore'
import 'aos/dist/aos.css'; // You can also use <link> for styles
import ScrollAnimation from 'react-animate-on-scroll';
import RecMovieSlider from "./RecMovieSlider"
import TrailerSlider from "./TrailerSlider";
import { previewInit } from "./previewJquery"

const Home = () => {


    const [movies, setMovies] = useState([])
    const [topRatedMovies, setTopRatedMovies] = useState([])
    const [nowPlayingMovies, setNowPlayingMovies] = useState([])
    const [upcomingMovies, setUpcomingMovies] = useState([])
    const [loading, setLoading] = useState(true)

    const init = async () => {
        getPopularMovies({}).then((res) => {
            console.log("movie list : ", res.content)
            setMovies(res.content)
            previewInit()
        })

        getTopRatedMovies({}).then((res) => {
            console.log("Res1 : ", res)
            setTopRatedMovies(res.content)
            previewInit()
        })

        // getNowPlayingMovies({}).then((res) => {
        //     setNowPlayingMovies(res.content)
        //     previewInit()

        // })

        getUpcomingMovies({}).then((res) => {
            console.log("Res3 : ", res)
            setUpcomingMovies(res.content)
            previewInit()

        })
    }

    useEffect(() => {
        init()
    }, [])

    var isLoading = true
    if (
        // upcomingMovies.length!==0 
        // && nowPlayingMovies.length !== 0
        true
        && movies.length !== 0
        && topRatedMovies.length !== 0
        && upcomingMovies.length !== 0 
        ) {
        isLoading = false
    }

    return (
        <Layout>
            <div className="home">
                {/* <Loader/> */}
                <div class="home-background-wallpaper row align-items-center">
                    <div className="m-5">
                        <div className="wallpaper-text my-3">Find the movies you want, and share your review!</div>
                        <Link to={'/movies'}><button className="btn btn-warning px-0 px-3 m-0 ">See all the movies</button></Link>
                    </div>
                </div>
                {/* <TrailerSlider/> */}

                <RecMovieSlider movies={topRatedMovies} />
                <ScrollAnimation animateIn="fadeIn" animateOnce="true">
                    <a class="ui orange ribbon label ml-4"><i class="fas fa-film m-1"></i><span class="label-text">Popular</span></a>
                    <MovieCarousel movies={movies} />
                </ScrollAnimation>

                <ScrollAnimation animateIn="fadeIn" animateOnce="true">
                    <a class="ui blue ribbon label ml-4"><i class="fas fa-upload m-1"></i><span class="label-text">Upcoming</span></a>
                    <MovieCarousel movies={upcomingMovies} />
                </ScrollAnimation>

                {/* <ScrollAnimation animateIn="fadeIn" offset="150" animateOnce="true">
                    <a class="ui red ribbon label ml-4"><i class="far fa-thumbs-up m-1"></i><span class="label-text">Top Rated</span></a>
                    <MovieCarousel movies={topRatedMovies} />
                </ScrollAnimation> */}

                {/* <ScrollAnimation animateIn="fadeIn" animateOnce="true">
                    <a class="ui teal ribbon label ml-4"><i class="fas fa-backward m-1"></i><span class="label-text">Now playing</span></a>
                    <MovieCarousel movies={nowPlayingMovies} />
                </ScrollAnimation> */}

                {/* <div>
                    <MovieCarousel movies={movies} />
                </div> */}
                <div className="home-gradient"></div>
            </div>
            <Loader visible={isLoading} />
        </Layout>

    )
}

export default Home