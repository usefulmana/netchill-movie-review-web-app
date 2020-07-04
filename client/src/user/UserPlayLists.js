import React, { useState, useEffect, Component } from "react";
import Layout from "../core/Layout";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import { getUserPlayList, deletePlayListById, patchListInfo } from '../core/ApiCore'
import "../css/UserPlayLists.scss"

const UserPlayLists = ({ match, userId = false }) => {

    const [user, setUser] = useState()
    const [lists, setLists] = useState([])
    const [error, setError] = useState('')
    const [dummy, setDummy] = useState(0)

    useEffect(() => {
        var userIdForFetch = undefined

        if (userId) {
            userIdForFetch = userId
        } if (match && match.params.userId) {
            userIdForFetch = match.params.userId
        }

        getUserPlayList(userIdForFetch).then(res => {
            setLists(res.content)
        }).catch((err) => {
            setError(err)
        }
        )

    }, [dummy])

    const handleDelete = (listId) => () => {
        deletePlayListById(userId, listId).then(res => {
            setDummy(dummy + 1)
        }).catch(err => {
            console.log("err in delete play list : ", err)
            setError(err)
        })
    }

    const HandleUpdate = () => {

    }

    const handleBlur = (e) => {
        var newValue = e.target.value
        var index = e.target.title
        var listId = lists[index].id
        console.log("whati slsit id and newValue : ", listId, newValue)
        patchListInfo(listId, newValue).then(res => {
            setDummy(dummy + 1)
        }).catch(err => {
            setError(err)
        })

    }

    const EnableInput = (e) => {
        var target = e.target.closest('.each-playlist').querySelector('.disabled-input')
        if (target) {
            target.disabled = false
            target.focus()
        }
    }

    const handleChange = (e) => {
        var index = e.target.title
        const newLists = [...lists]
        newLists[index].listName = e.target.value
        setLists(newLists)
    }

    const showUserPlayList = () => {
        return (
            <div className="user-playlists-box">
                <div>
                    <div className='user-name'>{lists[0].user.name}'s Playlist</div>
                    {lists.map((c, index) =>
                        <div className="each-playlist  row ">
                            <div className="row col-1 align-items-center justify-content-center go-btn">
                                <Link to={`/user/playlist/${c.id}`}>
                                    <i class="fas fa-chevron-left "></i>
                                </Link>
                            </div>

                            <div className="col-8 ">
                                <input className="disabled-input " disabled title={index} value={c.listName} placeholder={c.listName} onChange={handleChange} onBlur={handleBlur}></input>
                            </div>
                            {userId ? (
                                <div className="icon-box row align-items-center col-2">
                                    <i class="far fa-edit edit-btn" onClick={EnableInput}></i>
                                    <i class="fas fa-times delete-btn" onClick={handleDelete(c.id)}></i>
                                </div>) : <div></div>}
                        </div>
                    )}
                </div>
            </div>
        )
    }

    if (userId) {
        return lists.length !== 0 && (
            <div>
                {showUserPlayList()}
            </div>
        )
    } else {
        return lists.length !== 0 && (
            <Layout>
                {showUserPlayList()}
            </Layout>
        )
    }
}

export default UserPlayLists