import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route, withRouter, Redirect, Link } from "react-router-dom";
import { getTheaterList, getShowTime } from './ApiCore'
import { CSSTransition, TransitionGroup } from "react-transition-group";

import "../css/ShowTime.css"
import SmallLoader from "./SmallLoader";
import Loader from "./Loader";
import "../css/Transition.css"

// search movie by theater name
// get all theater airing certain movie

const converDate = () => {
    var returnArr = []
    var today = new Date();
    for (var i = 0; i < 5; i++) {
        var nextDay = new Date();
        nextDay.setDate(today.getDate() + i);
        var dateInString = JSON.stringify(nextDay)
        dateInString = dateInString.slice(0, 11);
        dateInString = dateInString.replace('"', "")
        dateInString = dateInString.replace("-", "")
        dateInString = dateInString.replace("-", "")
        returnArr.push(dateInString)
    }

    return returnArr
}

const ShowTime = ({ movie }) => {
    var today = new Date();
    converDate()

    const [movieName, setMovieName] = useState(movie.title)
    const [currentDate, setCurrentDate] = useState(converDate()[0])
    const [currentCity, setCurrentCity] = useState({})
    const [currentTheater, setCurrentTheater] = useState("")
    const [cities, setCities] = useState([])
    const [loading, setLoading] = useState(false)

    const [showTimes, setShowTimes] = useState([{ showTimes: [{ _id: "" }] }])

    const init = () => {
        getTheaterList().then((res) => {
            console.log(res)
            var newArr = []
            newArr.push({ city: "All", theaters: [] })
            newArr = newArr.concat(res)
            setCities(newArr)
        }).catch((err) => {
            console.log("err in getTheaters : ", err)
        })
    }

    useEffect(() => {
        init()
        setCurrentCity({})
        document.querySelector('.show-city-list-box').classList.add('show-city-list-box-active')
        document.querySelector('.show-time-box').querySelector('.show-time-initial-box').style.display = "flex";
    }, [movie.id])

    const showDate = () => {
        var returnArr = []
        var today = new Date();
        for (var i = 0; i < 5; i++) {
            var nextDay = new Date();
            nextDay.setDate(today.getDate() + i);
            var dateInString = JSON.stringify(nextDay)
            dateInString = dateInString.slice(0, 11);
            dateInString = dateInString.replace('"', "")
            returnArr.push(dateInString)
        }

        return returnArr.map((c) => {
            if (c.slice(-2) === currentDate.slice(-2)) {
                return <div class="current-date-active" onClick={changeCurrentDate(c)}>{c}</div>
            } else {
                return <div class="date" onClick={changeCurrentDate(c)} >{c}</div>
            }
        }
        )
    }

    const showShowTime = () => {
        return showTimes.length > 1 && showTimes.map((theater) => {
            if (theater.showTimes.length === 0) {
                return showTimeNotAvailable(theater)
            }
            return (
                <div className="my-3 animated fadeInDown faster">
                    <div className="theater-name " >{theater.theater}</div>
                    <div className="row">
                        {theater.showTimes.map((eachShowTime, i) =>
                            <div className="col-1 mx-2 px-2">
                                <a href={eachShowTime.bookingLink} target="_blank"><div className="each-show-time">{eachShowTime.showTime}</div></a>
                            </div>
                        )}
                    </div>
                </div >
            )
        }
        )
    }

    const showTimeNotAvailable = (theater) => {
        return (
            <div className="my-3 animated fadeInDown faster">
            <div className="theater-name " >{theater.theater}</div>
            <div className="row ml-3 not-available-msg">
               Not available
            </div>
        </div >
        )
    }

    const fetchShowTimeByDateAndCity = async (city, date) => {
        var newArr = []
        setLoading(true)
        var count = 0
        await city.theaters.map(async (c, i) => {
            var respond = await getShowTime({ movieName, date: date, theater: c })
            newArr.push({
                theater: c,
                showTimes: respond
            })

            if (city.theaters.length - 1 === count) {
                console.log("condition met")
                setShowTimes(newArr)
                setLoading(false)

                document.querySelector('.show-city-list-box').classList.remove('show-city-list-box-active')
                document.querySelector('.show-time-box').querySelector('.show-time-initial-box').style.display = "none";
            } else {
                console.log("not met")
            }
            count = count + 1
        })

    }

    const changeCurrentCity = (newCity) => (e) => {
        setCurrentCity(newCity)
        fetchShowTimeByDateAndCity(newCity, currentDate)
    }

    const changeCurrentTheater = (newTheater) => (e) => {
        setCurrentTheater(newTheater)
    }

    const changeCurrentDate = (newDate) => (e) => {
        newDate = newDate.replace("-", "")
        newDate = newDate.replace("-", "")
        setCurrentDate(newDate)
        fetchShowTimeByDateAndCity(currentCity, newDate)
    }

    const showCityList = () => {
        return (
            <div className=" show-city-list-box show-city-list-box-active ">
                <div className="select-city-msg row justify-content-center align-items-center animated fadeInDown faster delay-1s">
                    {currentCity.city ? currentCity.city : "Please select your location"}

                    <i class="fas fa-caret-down ml-2"></i>
                </div>

                <div className="drop-down animated fadeInDown faster" >
                    <div className="row">
                        {cities.map((c) =>
                            <div className="col-2 each-theater" onClick={changeCurrentCity(c)}>{c.city}</div>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    const closeShowTime = (e) => {
        e.target.closest(".show-time-background").style.display = "none"
    }

    return (
        <div className="show-time-background row justify-content-center align-items-center ">
            <div className="show-time-box p-5 animated zoomIn faster">
                <button className="btn btn-warning close-btn" onClick={closeShowTime}>X</button>
                <div className="row justify-content-center align-items-center">
                    {showCityList()}
                    {/* {showTheaterList()} */}
                </div>
                <div className="row justify-content-between align-items-center my-2">
                    {showDate()}
                </div>
                {console.log(showTimes)}
                <TransitionGroup>
                    <CSSTransition
                        key={showTimes[0].showTimes.length > 0 && showTimes[0].showTimes[0]._id}
                        classNames="mytransition"
                    >
                        <div>
                            {showShowTime()}
                        </div>
                    </CSSTransition>
                </TransitionGroup>
                <Loader visible={loading} />
                <div className="show-time-initial-box row align-items-center justify-content-center ">
                    <img className="animated flipOutY faster delay-1s" src={movie.poster}></img>
                </div>
            </div>

        </div>
    )
}

export default ShowTime