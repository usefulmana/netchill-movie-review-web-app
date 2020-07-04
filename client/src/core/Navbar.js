// import { BrowserRouter, Switch, Route, withRouter, Redirect, Link } from "react-router-dom";
import Login from "../user/login/Login";
import React, { Component } from 'react';
import { Link, NavLink , withRouter} from 'react-router-dom';
import '../css/Navbar.css';
import { API_BASE_URL, ACCESS_TOKEN } from '../config';
import { getCurrentUser, isAuthenticated } from '../user/APIUtils';
import Signup from "../user/login/Signup";
import Modal from './Modal'
import ScrollAnimation from 'react-animate-on-scroll';

class Navbar extends Component {

    constructor(props) {
        super(props);
        console.log(JSON.parse(localStorage.getItem('USER')))
        this.state = {
            authenticated: localStorage.getItem('accessToken') ? true: false,
            userRole: localStorage.getItem('USER')? JSON.parse(localStorage.getItem('USER')).role:"ROLE_USER"
        }
    }

    handleLogout() {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('USER')
        this.setState({
            authenticated: false
        });
        window.location.reload()
    }

    openModal() {
        document.querySelector(".login-modal").classList.add("login-modal-active")
    }

    openSignup() {
        document.querySelector(".signup-modal").classList.add("signup-modal-active")
    }

    activateSearch = (e) => {
        // console.log( e.target.parentNode)
        // console.log( e.target)
        document.querySelector('.search-bar').classList.toggle('search-bar-active')
    }

    showOptions = () => {
        if (this.state.authenticated &&  this.state.userRole == "ROLE_USER" ) {
            return (
                <ul>
                    <li>
                        <NavLink to="/user/profile"><button className="btn btn-warning" >Profile</button></NavLink>
                    </li>
                    <li>
                        <button className="btn btn-warning" onClick={() => { this.handleLogout() }}>Logout</button>
                    </li>
                </ul>
            )
        }
        if (this.state.authenticated && this.state.userRole == "ROLE_ADMIN") {
            return (
                <ul>
                    <li>
                        <NavLink to="/user/profile"><button className="btn btn-warning" >Admin</button></NavLink>
                    </li>
                    <li>
                        <button className="btn btn-warning" onClick={() => { this.handleLogout() }}>Logout</button>
                    </li>
                </ul>
            )
        } else {
            return (
                <ul>
                    <li>
                        <button className="btn btn-danger" value="Open" onClick={() => this.openSignup()} >Sign Up</button>
                    </li>
                    <li>
                        <button className="btn btn-danger" value="Open" onClick={() => this.openModal()} >Sign In</button>
                    </li>
                </ul>
            )
        }
    }

    handleEnter=(e)=>{
        e.preventDefault()
        var value = e.target.querySelector("input").value
        // console.log( this.props.history.location)
        this.props.history.push(`/movies?title=${value}`)
    }

    render() {
        return (
            <header className="app-header navbar">
                <div className="navbar-container row justify-content-between align-items-center">
                    <ScrollAnimation animateIn="fadeInDown" duration="0.5" delay="0.5" offset="0" >
                        <div className="app-branding m-0 px-3 row align-items-center">
                            <Link to="/" className="app-title">Netflix&Chill</Link>
                            <Link to="/movies"><div className="ml-2">Movies</div></Link>
                            <div onClick={this.activateSearch} className="row search-container align-items-center">
                                <i class="fas fa-search m-4"></i>
                                <form className="search-bar position-relative " onSubmit={this.handleEnter}>
                                    <input className="" />
                                    <span class="input-label">Search Movie</span>
                                </form>
                            </div>
                        </div>
                    </ScrollAnimation>
                    <ScrollAnimation animateIn="fadeInUp" duration="0.7" delay="0.5" offset="0" >
                        <div className="app-options mx-3 ">
                            <nav className="app-nav">
                                {this.showOptions()}
                            </nav>
                        </div>
                    </ScrollAnimation>
                </div>
            </header >
        )
    }
}

export default withRouter(Navbar);