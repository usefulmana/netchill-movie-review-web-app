import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route, withRouter, Redirect, Link } from "react-router-dom";
import { loadSingleMovie, getAllCommentOfMovie } from './ApiCore'
import Layout from "./Layout";
import moment from "moment";
import "../css/Review.css"
import CreateReview from "./CreateReview";
import Review from "./Review";
import SmallLoader from "./SmallLoader";

const ShowReviews = ({ movieId }) => {

    const [reviews, setReviews] = useState([])
    const [dummy, setDummy] = useState(0)
    const [totalPage, setTotalPage] = useState(0)
    const [totalElements, setTotalElements] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [loading , setLoading] = useState(false)

    const handleDummy = () => {
        setDummy(dummy + 1)
    }
    const init = () => {
        console.log("movieId : ", movieId)
        getAllCommentOfMovie({ movieId }).then(res => {
            setReviews(res.content)
            setTotalPage(res.totalPages)
            setTotalElements(res.totalElements)
            setCurrentPage(1)
        }
        )
    }

    window.onscroll = function (ev) {
        if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight) {
            // you're at the bottom of the page
            //   alert("Bottom of page");
            console.log(currentPage , totalPage , currentPage <= totalPage )
            if(currentPage <= totalPage){
                var nextPage=currentPage+1
                setLoading(true)
                getAllCommentOfMovie({ movieId, page:nextPage }).then(res => {
                    var newReviews = reviews.concat(res.content)
                    // alert("!")
                    console.log("whatis new reivew : ", newReviews)
                    setReviews(newReviews)
                    setCurrentPage(nextPage)
                    setLoading(false)
                })
            }
        }
    };
    console.log("What si review :", reviews)


    useEffect(() => {
        init()
    }, [dummy, movieId])


    const showAllReviews = () => {
        console.log("reviews :" ,reviews)
        return (
            <div>
                {reviews.map((c) => {
                    return <Review movieId={movieId} review={c} handleDummy={handleDummy} />
                }
                )}
            </div>
        )
    }
    const showCreateReview = () => {
        return <CreateReview movieId={movieId} handleDummy={handleDummy} />
    }
    return (
        <div className="p-4">
            <div className="totalNumOfReviews">{`${totalElements} comments`}</div>
            {showCreateReview()}
            {showAllReviews()}
            <SmallLoader visible={loading} />
        </div>
    )
}

export default ShowReviews