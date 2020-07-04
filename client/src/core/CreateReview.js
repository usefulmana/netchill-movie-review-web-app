import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route, withRouter, Redirect, Link } from "react-router-dom";
import { createComment } from './ApiCore'
import { getCurrentUser } from '../user/APIUtils'
import Layout from "./Layout";
import moment from "moment";
import "../css/CreateReview.css"

const CreateReview = ({ movieId, handleDummy, parentId }) => {

    const [user, setUser] = useState({})
    const [comment, setComment] = useState()

    var token = localStorage.getItem('accessToken')
    const init = () => {
        if (token !== null) {
            getCurrentUser().then(res => {
                console.log("what is res : ", res)
                setUser(res)
            }).catch(err => console.log("err in createReview : ", err))
        }
    }

    useEffect(() => {
        init()
    }, [])

    const handleChange = (e) => {
        setComment(e.target.value)
    }

    const handleSubmit = () => {
        var requestBody = {
            content: comment
        }
        createComment(requestBody, movieId, parentId).then((res) => {
            console.log("res in submitting create review : ", res)
            setComment("")
            handleDummy()
        }).catch((err) => {
            console.log("err in createcomment : ", err)
        })
    }
    return (
        <div className="create-review-container row my-2">
            {console.log("wjat is user : ", user)}
            <div>
                <div><img className="user-image" src={user.imageUrl ? user.imageUrl : "//s.ytimg.com/yts/img/avatar_720-vflYJnzBZ.png"} /></div>
            </div>
            <div className="row col mx-0 ">
                {
                    token ? <input class="field__input a-field__input " value={comment} onChange={handleChange} placeholder={`Commenting publicly ${user.name}`}
                        required /> : <input class="field__input a-field__input " placeholder="Please sign in to comment"
                            disabled />
                }
                <span class="separator">  </span>

            </div>
            <div>
                <button className="btn btn-warning create-review-btn" onClick={handleSubmit}>COMMENT</button>
            </div>
        </div>
    )
}

export default CreateReview