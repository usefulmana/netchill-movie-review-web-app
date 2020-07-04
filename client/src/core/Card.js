import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route, withRouter, Redirect, Link } from "react-router-dom";
// import ShowImage from './ShowImage'
import moment from "moment";
import MovieCarousel from "./MovieCarousel";
// import CardPreview from "./CardPreview";
import '../css/Card.css'

const Card = ({ movie }) => {
    return (
        <div className="card-box " >
            <div className="card">
                <Link style={{ color: 'black' }} to={{ pathname:`/movie/${movie.id}`}}>
                    <img src={movie.poster} />
                </Link>
            </div>
        </div>
    )
}

export default Card