import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route, withRouter, Redirect, Link } from "react-router-dom";
// import ShowImage from './ShowImage'
import moment from "moment";
import MovieCarousel from "./MovieCarousel";
// import CardPreview from "./CardPreview";
import '../css/Card2.css'
import MovieQuickView from "./MovieQuickView";

// this card contains movie name below poster and review rate on the top corner of poster
const Card2 = ({ movie }) => {

    const dragStart = (e) => {
        document.querySelector('.drop-box').classList.add('drop-box-active')

        e.dataTransfer.setData('movie_id', `${movie.id}`)
        // console.log(e.target)
        // e.dataTransfer.setData('movie_id', e.target.id)
        console.log("Darg start")
    }

    const dragOver = (e) => {
        e.stopPropagation()
    }

    const dragEnd=(e)=>{
    }

    return (
        <div className="card-box mb-4 position-relative"
            draggable='true'
            onDragStart={dragStart}
            onDragOver={dragOver}
            onDragEnd={dragEnd}
            id={`movieId_${movie.id}`}
        >
            <div className="rating-info">
                {movie.imdbScore}
            </div>
            <div className="card">

                <Link style={{ color: 'black' }} to={{ pathname: `/movie/${movie.id}` }}>
                    <img className="poster-img" src={movie.poster} />
                </Link>

            </div>
            <div className="title-info mt-2">
                {movie.title}
            </div>
            <MovieQuickView movie={movie} />
            <div className="open-quick-view-btn row align-items-center">
                <i class="fas fa-play" ></i>
                {/* <i class="fas fa-search mr-2"></i>  */}
                <div className="play-text">Play</div>
            </div>
            <div className="quick-view-loading">
            </div>
        </div>
    )
}

export default Card2