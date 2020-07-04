import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route, withRouter, Redirect, Link } from "react-router-dom";
import Card from "./Card2";
import Slider from "react-slick";
import '../css/Carousel.css'
import { isArray } from "util";


// receive array of products that admin want to show in carousel
const MovieCarousel = ({ movies = [] }) => {
    console.log("movies in carousel : ", movies === null)
    const setting = {
        infinite: false,
        slidesToShow: 6,
        slidesToScroll: 6,
        speed: 500
    }

    const showCarousel = () => {
        return isArray(movies) && (
            <Slider {...setting} >
                {movies.map((c, index) => {
                    return (
                        <div className="my-3">
                            <Card movie={movies[index]} index={index} />
                        </div>
                    )
                }
                )}
            </Slider>
        )
    }


    return movies.length !== 0 && (
        <div className="mx-5">
            {/* <h3>Trend movies<i className='fab fa-amazon'></i></h3> */}
            <div className="movie-carousel customized-carousel carousel-wrapper position-relative">
                {showCarousel()}
            </div>
        </div>
    )
}

export default MovieCarousel