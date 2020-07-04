import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import '../css/filter.css'

// rating, ,metascore, imdbscore,genre

// director,actor => ?keyword=actorname
// genre => ?genre=[horror] => genre=horror&genre=action 
// metascore / imdbscore => ?metascore=

const genreList = ['All', 'New Movies', 'Trend Movies', 'Horror', 'Action', "Animation", "Adventure", "Comedy", "Family", "Fantasy", "Musical", "Adventure", "Sci-Fi"]
const metascoreList = []
const imdbscore = []


const Filter = ({ myFilters, handleFilters }) => {
    const [categories, setCategories] = useState([]);
    console.log("myFilters : ", myFilters)

    const init = () => {
        var value = myFilters['genre']
        var list = document.querySelectorAll('.dropdown-item')
        // console.log("waht islist : ", list)
        list && list.forEach((c) => {
            c.classList.remove("dropdown-item-active")
            if (c.title === value) {
                c.classList.add("dropdown-item-active")
            }
        })

        if (categories.length === 0) {
        }

    }

    const handleClick = (e) => {
        handleFilters(e.target.title, "genre")
    }

    useEffect(() => {
        init()
    })

    const showGenre = () => {
        return (
            <div className="filter category-filter row">
                <i class="fas fa-tags mx-1"></i>
                {myFilters['genre']!== ""? myFilters['genre'] : "All"}
                <i class="fas fa-angle-down fa-1x ml-1"></i>
                <div className="filter-dropdown category-filter-dropdown">
                    {genreList.map((c) =>
                        c !== "All" ? <div className="category-filter-dropdown-item dropdown-item waves-effect" title={c} onClick={handleClick}>
                            {c}
                        </div> :
                            <div className="category-filter-dropdown-item dropdown-item waves-effect" title={""} onClick={handleClick}>
                                {c}
                            </div>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div>
            <div className="row justify-content-center my-3">
                {showGenre()}
            </div>
        </div>
    )
}

export default Filter