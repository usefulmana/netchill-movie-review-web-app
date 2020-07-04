import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import '../css/Input.css'
import queryString from 'query-string';

const Input = ({ handleFilters, title }) => {


    const [currentOption, setCurrentOption] = useState('title')
    const [keyword, setKeyword] = useState(title)

    useEffect(()=>{
        setKeyword(title)
    },[title])

    const handleClick = (e) => {
        setCurrentOption(e.target.title)
    }

    const toggleDropdown=()=>{
        console.log(document.querySelector(".search-form").querySelector(".drop-down"))
        document.querySelector(".search-form").querySelector(".drop-down").classList.toggle("drop-down-active")
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        handleFilters(keyword, currentOption)
    }

    const handleChange = (e) => {
        setKeyword(e.target.value)
    }
    const handleSelectChange = (e) => {
        setCurrentOption(e.target.value)
        setKeyword("")
    }

    return (
        <form className="search-form row align-items-center" onSubmit={handleSubmit}>
            <div className="select" onClick={toggleDropdown}> {currentOption}
                <div className="drop-down">
                    <div className="select-items" onClick={handleClick} title={"title"}>title</div>
                    <div className="select-items" onClick={handleClick} title={"actor"}>actor</div>
                    <div className="select-items" onClick={handleClick} title={"director"}>director</div>
                </div>
            </div>
            <input type="text" placeholder="Type your keyword..." value={keyword} onChange={handleChange} />
            <i class="fas fa-search" onClick={handleSubmit}></i>
        </form>
    )
}

export default Input