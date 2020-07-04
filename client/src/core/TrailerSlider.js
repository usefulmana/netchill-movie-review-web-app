import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route, withRouter, Redirect, Link } from "react-router-dom";
import Layout from "./Layout";
import MovieCarousel from "./MovieCarousel"
import 'aos/dist/aos.css'; // You can also use <link> for styles
import ScrollAnimation from 'react-animate-on-scroll';
import Slider from "react-slick";
import '../css/HomeSlider.css'
import $ from 'jquery';




const TrailerSlider = ({ trailerArr = [] }) => {

    const [trailers, setTrailers] = useState(trailerArr)
    useEffect(() => {
        setTrailers(trailerArr)
    }, [trailerArr])

    $('.slick-dots button').click(function () {
        var iframes = document.querySelectorAll('iframe');
        Array.prototype.forEach.call(iframes, iframe => {
            iframe.contentWindow.postMessage('{"event":"command","func":"' + 'pauseVideo' + '","args":""}', '*');
        });
    });

    $('.home-slider .slick-arrow').click(function () {
        var iframes = document.querySelectorAll('iframe');
        Array.prototype.forEach.call(iframes, iframe => {
            iframe.contentWindow.postMessage('{"event":"command","func":"' + 'pauseVideo' + '","args":""}', '*');
        });
    });

    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        cssEase: 'cubic-bezier(0.7, 0, 0.3, 1)',
        fade: true,
        arrows: false,
    };

    const showTrailer = (trailer_url) => {
        var splited = trailer_url.split("=");
        var embedUrl = "https://www.youtube.com/embed/" + splited[1] + "?version=3&enablejsapi=1"
        return (
            <iframe className="youtube-video" src={embedUrl} frameBorder="0" allowfullscreen="allowfullscreen">
            </iframe>
        )
    }
    console.log("trailerArr :", trailerArr)
    return (
        <div className="home-slider">
            <Slider {...settings}>
                {trailers.map((c) => {
                    return showTrailer(c)
                })}
            </Slider>
        </div>
    )
}

export default TrailerSlider