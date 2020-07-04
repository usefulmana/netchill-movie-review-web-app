import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route, withRouter, Redirect, Link } from "react-router-dom";
import '../css/DropBox.scss'
import { getMovieListByUser, patchMovieToList, addNewMovieList } from './ApiCore'

// 1. need to load user movie list
const DropBox = ({ movie }) => {

    const [movieList, setMovieList] = useState([])
    const [dummy, setDummy] = useState(1)
    const [error, setError] = useState('')

    useEffect(() => {
        getMovieListByUser().then(res => {
            console.log("waht isres : ", res)
            setMovieList(res.content)
        }).catch(

        )
    }, [dummy])

    const drop = (e) => {
        e.preventDefault()
        // const target = e.target
        var target = e.target
        target.classList.add('progress-wave')
        const movieId = e.dataTransfer.getData('movie_id')
        if (movieId) {
            const card = document.querySelector(`#movieId_${movieId}`)

            const listId = e.target.closest('.movie-list-box').getAttribute('listid')
            console.log(e.target.closest('.movie-list-box'))
            patchMovieToList(listId, movieId, 'add').then(res => {
                console.log("res : ", res)
            }).catch()

            setTimeout(() => {
                target.classList.remove('progress-wave')
            }, 1000)
        }
    }

    const dragOver = (e) => {
        e.preventDefault()
    }

    const showEachMovieList = (eachMovieList) => {
        return (
            <Link to={`/user/playlist/${eachMovieList.id}`}>
                < div className="movie-list-box position-relative" draggable='false'
                    onDrop={drop}
                    onDragOver={dragOver}
                    listId={eachMovieList.id}
                >
                    {eachMovieList.listName}
                </div>
            </Link>
        )
    }

    const closeDropBox = () => {
        document.querySelector('.drop-box').classList.remove('drop-box-active')
    }
    console.log(movieList)


    const handleClick = (e) => {
        console.log("clicekd")
        // e.target.disabled = false
        var target = e.target.closest('.add-new-list')
        var inputTarget = target.querySelector('.my-input')
        if (inputTarget) {
            inputTarget.disabled = false;
        }
    }

    const handleBlur = (e) => {
        var target = e.target
        target.disabled = true;
        var value = target.value.trim()

        if (value !== '') {
            addNewMovieList({
                listName: value,
                description: ''
            }).then((res) => {
                target.value = ''
                setDummy(dummy + 1)
            }
            ).catch()
        }
    }

    return (
        <div className="drop-box mb-4 "
        >
            <i class="fas fa-times close-btn" onClick={closeDropBox}></i>
            <div className="mt-5">
                {movieList.map((c) =>
                    showEachMovieList(c)
                )
                }
            </div>
            <div className="add-new-list mb-5" onClick={handleClick}>
                <input className="my-input" disabled onBlur={handleBlur}  ></input>
                <span>+</span>
            </div>

        </div >
    )
}

export default DropBox