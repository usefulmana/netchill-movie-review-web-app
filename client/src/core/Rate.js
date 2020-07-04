import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route, withRouter, Redirect, Link } from "react-router-dom";
import { leaveRate, getUsersRate } from "./ApiCore"
import { isAuthenticated } from "../user/APIUtils"
import "../css/Rate.css"

const Rate = ({ movieId }) => {
    var isUserLoggedIn = isAuthenticated()

    const [myRate, setMyRate] = useState(undefined)
    const [currentRate, setCurrentRate] = useState(0)
    const [dummy, setDummy]=useState(0)
    console.log("isUserLoggedIn : ", isUserLoggedIn)

    useEffect(() => {
        if (isUserLoggedIn) {
            getUsersRate(movieId).then((res) => {
                console.log("res : ", res)
                if (res !== undefined) { setMyRate(res.rating); }
            })
        }
    }, [dummy])

    const handleSubmit = (e) => {
        leaveRate(currentRate,movieId).then((res)=>{
            setDummy(dummy+1)
        })
    }

    const handleChange = (e) => {
        console.log(e.target.value)
        setCurrentRate(e.target.value)
    }

    const isChecked = (value) => {
        if (parseFloat(currentRate) === value) {
            return "checked"
        }
        else {
            return ""
        }
    }

    const showRatingScore = () => {
        return (
            <div className="row align-items-center">
                <div className="col-12 ">
                    {/* <span>Rating:</span> */}
                    <fieldset class="rating" onChange={handleChange}>
                        <input type="radio" id="star5" name="rating" value="5" checked={isChecked(5)} /><label class="full" for="star5" title="Awesome - 5 stars"></label>
                        <input type="radio" id="star4half" name="rating" value="4.5" checked={isChecked(4.5)} /><label class="half" for="star4half" title="Pretty good - 4.5 stars"></label>
                        <input type="radio" id="star4" name="rating" value="4" checked={isChecked(4)} /><label class="full" for="star4" title="Pretty good - 4 stars"></label>
                        <input type="radio" id="star3half" name="rating" value="3.5" checked={isChecked(3.5)} /><label class="half" for="star3half" title="Meh - 3.5 stars"></label>
                        <input type="radio" id="star3" name="rating" value="3" checked={isChecked(3)} /><label class="full" for="star3" title="Meh - 3 stars"></label>
                        <input type="radio" id="star2half" name="rating" value="2.5" checked={isChecked(2.5)} /><label class="half" for="star2half" title="Kinda bad - 2.5 stars"></label>
                        <input type="radio" id="star2" name="rating" value="2" checked={isChecked(2)} /><label class="full" for="star2" title="Kinda bad - 2 stars"></label>
                        <input type="radio" id="star1half" name="rating" value="1.5" checked={isChecked(1.5)} /><label class="half" for="star1half" title="Meh - 1.5 stars"></label>
                        <input type="radio" id="star1" name="rating" value="1" checked={isChecked(1)} /><label class="full" for="star1" title="Sucks big time - 1 star"></label>
                        <input type="radio" id="starhalf" name="rating" value="0.5" checked={isChecked(0.5)} /><label class="half" for="starhalf" title="Sucks big time - 0.5 stars"></label>
                    </fieldset>
                </div>
            </div>
        )
    }

    const showRatingForm = () => {
        return (
            <div className="row align-items-center">
                {showRatingScore()}
                {currentRate}
                <button className="btn btn-warning" disabled={!isUserLoggedIn && "disabled"} onClick={handleSubmit}>Submit</button>
            </div>
        )
    }

    const reviewAlreadyExist = () => {
        if (myRate) {
            return (
                <div className="my-3">Your previous rate : <span className="myRate">{myRate}</span></div>
            )
        } else if (!myRate && isUserLoggedIn) {
            return (
                <div className="my-3">Please leave your rate</div>
            )
        } else {
            return (
                <div className="my-3">Please sign in to rate</div>
            )
        }
    }

    return (
        <div>
            <div class="myRate-box">
                {reviewAlreadyExist()}
            </div>
            <div className="rating-box row align-items-center">
                <div className="rating-initial-box row align-items-center">
                    <i class="far fa-thumbs-up mr-2"></i>
                    Rate
                </div>
                <div className="rating-popup-box">
                    {showRatingForm()}
                </div>
                <div class="background-popup"></div>
            </div>
        </div>
    )
}

export default Rate 