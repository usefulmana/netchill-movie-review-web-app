import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route, withRouter, Redirect, Link } from "react-router-dom";
import '../css/DropBox.scss'
import { getMovieListByUser, patchMovieToList, addNewMovieList } from './ApiCore'

// 1. need to load user movie list
const DropBox = ({ movieId }) => {

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

    const handleAdd = (e) => {
        e.preventDefault()
        // const target = e.target
        var listId = e.target.title
        patchMovieToList(listId, movieId, 'add').then(res => {
            console.log("res : ", res)
        }).catch()
        alert("succesfully added")
    }

    const showEachMovieList = (eachMovieList) => {
        return (
            < div className="movie-list-box position-relative row mb-1" draggable='false'
                listId={eachMovieList.id}
            >
                <div className="col-2">
                    <Link to={`/user/playlist/${eachMovieList.id}`}>
                        <i class="fas fa-chevron-left "></i>
                    </Link>
                </div>
                <div className="col-10 " style={{cursor:"pointer"}} onClick={handleAdd} title={eachMovieList.id}>
                    {eachMovieList.listName}
                </div>
            </div>
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
                {movieList === undefined ? null : movieList.map((c) =>
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