import React, { useState, useEffect, Component } from "react";
import Layout from "../core/Layout";
import { getPlayListById, patchMovieToList } from '../core/ApiCore'
import { getCurrentUser } from './APIUtils'
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import "../css/PlayList.scss"

const Playlist = ({ match }) => {

    const [listInfo, setListInfo] = useState()
    const [error, setError] = useState('')
    const [isOwner, setIsOwner] = useState(false)
    const [dummy, setDummy] = useState(0)

    useEffect(() => {


        getPlayListById(match.params.listId).then(res_listInfo => {
            console.log("res_listInfo :", res_listInfo)
            setListInfo(res_listInfo)

            getCurrentUser().then(res_user => {
                if (res_user.id === res_listInfo.user.id) {
                    setIsOwner(true)
                }
            }).catch(err => {
                setError(err)
            })
        }).catch((err) => {
            setError(err)
        }
        )
    }, [dummy])

    const handleDelete = (movieId) => () => {
        patchMovieToList(listInfo.id, movieId, 'remove').then(res => {
            setDummy(dummy + 1)
        }).catch()
    }

    const render = (movie, index) => {
        return (
            <div className="col-lg-2 col-md-3 col-sm-4 playList">
                {isOwner && <i class="fas fa-times deletee-btn" onClick={handleDelete(movie.id)}></i>}

                <article className="card">
                    <Link to={`/movie/${movie.id}`}>
                        <img className="" src={movie.poster} alt="Movie" />
                    </Link>
                    <div className="movie-title mt-1">
                        {movie.title}
                    </div>
                </article>
            </div>
        )
    }

    return listInfo ? (
        <Layout>
            <div className="playList-box position-relative overflow-auto full-height">
                <div className="z-content-center animated finite slideInDown faster">
                    <div className="list-title">
                        Title : {listInfo.listName}
                    </div>
                    <div className="row"  >
                        {listInfo.movies.map((movie, index) => (
                            render(movie, index)
                        ))}
                    </div>
                </div>
            </div>
        </Layout>) : <div></div>
}

export default Playlist