import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route, withRouter, Redirect, Link } from "react-router-dom";
import Slider from "react-slick";
import '../css/Carousel.css'
import '../css/SimCarousel.css'
import { isArray } from "util";

// receive array of products that admin want to show in carousel
const SimMovieCarousel = ({ movies = [], handleClick, history }) => {
    console.log("movies in carousel : ", movies)
    const setting = {
        infinite: false,
        slidesToShow: 6,
        slidesToScroll: 6,
        speed: 500,
        // centerMode: true
    }

    const changeMovie = (movies) => (e) => {
        handleClick(movies)
        e.preventDefault()
        // window.scrollTo({
        //     top: 0,
        //     behavior: 'smooth',
        //   })
    }

    const showCarousel = () => {
        return isArray(movies) && (
            <Slider {...setting} >
                {movies.map((c, index) => {
                    return (
                    
                            <div className="card-box " onClick={changeMovie(c)} >

                                <div className="card-box mb-4" >
                                    <div className="rating-info">
                                        {c.imdbScore}
                                    </div>
                                    <div className="card">

                                        <img src={c.poster} />

                                    </div>
                                    <div className="title-info mt-2">
                                        {c.title}
                                    </div>
                                </div>

                            </div>
           

                    )
                }
                )}
            </Slider>
        )
    }


    return movies.length !== 0 && (
        <div className=" ">
            <div className="sim-carousel customized-carousel carousel-wrapper position-relative mx-5 pt-3 ">
                {showCarousel()}
            </div>
            <div className="grad-wrapper"></div>
        </div>
    )
}

export default SimMovieCarousel