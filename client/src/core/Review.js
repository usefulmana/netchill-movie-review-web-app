import React, { useState, useEffect } from "react";
import { upvoteOrDownvote } from './ApiCore'
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import moment from "moment";
import "../css/Review.css"
import CreateReview from "./CreateReview";

const Review = ({ review, movieId, parentId, handleDummy }) => {
    // if(parentId===undefined){ parentId = review.id}
    const [replyBoxActive, setReplyBoxActive] = useState(false)
    const [showChildCommentOrNot, setShowChildCommentOrNot] = useState(false)
    const [childComments, setChildComments] = useState([])

    const [upVoteDownVote, setUpVoteDownVote] = useState()

    useEffect(() => {
        setChildComments(review.childComments)

    }, [review])

    console.log("rerender haeppen and review : ", review)
    const showChildComments = () => {
        return (
            childComments.map((childComment) => {
                return <Review review={childComment} movieId={movieId} parentId={review.id} handleDummy={handleDummy} />
            })
        )
    }

    console.log("each review ; ", review)
    const time = (createdAt) => {
        var createdAt = moment(createdAt)

        var now = moment().format()
        var dateDifference = moment(now).diff(createdAt, 'days')
        var suffix = " days ago"

        if (dateDifference <= 0) {
            dateDifference = moment(now).diff(createdAt, 'hours')
            suffix = " hours ago"
        }

        if (dateDifference <= 0) {
            dateDifference = moment(now).diff(createdAt, 'minutes')
            suffix = " minutes ago"
        }

        return dateDifference + suffix
    }
    const handleReply = () => {
        setReplyBoxActive(!replyBoxActive)
    }

    const handleShowAllComment = () => {
        setShowChildCommentOrNot(!showChildCommentOrNot)
    }

    const expand = () => {
        if (childComments.length !== 0) {
            return (
                <div className="">
                    {!showChildCommentOrNot ?
                        <div className="see-all-replies-btn" onClick={handleShowAllComment}><i class="fas fa-caret-down"></i> see all replise</div>
                        :
                        <div className="see-all-replies-btn" onClick={handleShowAllComment}><i class="fas fa-caret-up"></i> close all replies</div>
                    }
                    {showChildCommentOrNot ? showChildComments() : ""}
                </div>
            )
        }
    }

    const handleVote = (method) => (e) => {
        upvoteOrDownvote(review.id, method).then((res) => {
            handleDummy()
        }).catch((err) => {
            console.log("err in handleVote : ", err)
        })
    }

    const renderReviewContent = (content) => {
       if(content === null){
           return ""
       }
       
        var array = content.split(" ")
        return array.map((c) => {
            if (c.includes("http://") || c.includes("https://")) {
                return <a href={c} target="_blank">{c}<span> </span></a>
            } else{
                return <span>{c} </span>
            }
        })
    }

    return (
        <div>
            <div className="row each-review  my-4">
                <div className=""><img className="user-image" src={review.user.imageUrl} /></div>
                <div className="col-10">
                    <div className="row align-items-center my-2 mx-0">
                        <Link to={`/user/playlists/${review.user.id}`}>
                            <div className="review-username mr-2">{review.user.name}</div>
                        </Link>
                        <div className="review-createdAt">{time(review.createdAt)}</div>
                    </div>
                    <div className="review-content">{renderReviewContent(review.content)}</div>
                    <div className="my-3">
                        <i class="fas fa-thumbs-up mr-2" onClick={handleVote("upvote")}></i>
                        {review.upVote !== 0 && <span className="upvote mr-2">{review.upVote} </span>}
                        <i class="fas fa-thumbs-down mr-2" onClick={handleVote("downvote")} ></i> <btn className="reply-btn" onClick={handleReply} >Reply</btn></div>
                    {replyBoxActive ? <CreateReview movieId={movieId} parentId={review.id} handleDummy={handleDummy} /> : " "}
                    {expand()}

                </div>
            </div>
        </div>

    )
}

export default Review