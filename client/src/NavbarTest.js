import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";


const NavbarTest = () => {

    const init = () => {

    }

    useEffect(() => {
        init();
    }, [])
    return (
        <div>
            <nav className="navbar navbar-expand-lg py-0">
                <ul className="col-xl-3 col-ld-1 col-md-4 col-sm-6 col-10 my-0 px-0">
                    <li className="d-inline-block"><img src="/img/logo-image.png" style={{ width: 110, height: 50 }}></img></li>
                    <li className="drop-down-btn py-3 d-inline-block mx-4 position-relative"><i class="fas fa-th grey-text mr-2"></i>Category
                        <ul className="drop-down">

                            <li >Web programming
                                        <ul className="submenu-ul">
                                    <li ><a href="#">React</a>
                                        <ul className="submenu-ul2">
                                            <li ><a href="#">Javascript</a></li>
                                            <li ><a href="#">Css</a></li>
                                            <li ><a href="#">Html</a></li>
                                        </ul>
                                    </li>
                                    <li >PHP
                                            <ul className="submenu-ul2">
                                            <li >JAVA</li>
                                            <li >JSP</li>
                                            <li >HIBERNATE</li>
                                        </ul>
                                    </li>
                                    <li >NODE JS</li>
                                </ul>
                            </li>
                            <li >Web programming
                                    <ul className="submenu-ul">
                                    <li >IOT
                                               <ul className="submenu-ul2">
                                            <li >PI</li>
                                            <li >PYTHON</li>
                                            <li >FLASK</li>
                                        </ul>
                                    </li>
                                    <li >APP
                                            <ul className="submenu-ul2">
                                            <li >ANDROIT STUDIO</li>
                                            <li >SWIFT</li>
                                            <li >KOTLIN</li>
                                        </ul>
                                    </li>
                                    <li >NODE JS</li>
                                </ul>
                            </li>
                            <li >Web programming</li>
                        </ul>
                    </li>
                </ul>
                <button class="navbar-toggler mt-2" type="button" data-toggle="collapse" data-target="#basicExampleNav"
                    aria-controls="basicExampleNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"><i class="fas fa-bars"></i></span>
                </button>
                <div class="collapse navbar-collapse" id="basicExampleNav">
                    <div className="col-md-5">
                        <div class="md-form form-sm my-0">
                            <input type="text" id="inputSMEx" class="form-control form-control-sm m-0 w-75 d-inline-block" placeholder="Search for anything" />
                            <button className="btn btn-primary m-0 px-3 py-2"><i class="fas fa-search fa-xs "></i></button>
                        </div>
                    </div>

                    <div className="col-md-7">
                        <div className="d-inline-block mx-2">Teach on Udemy</div>
                        <div className="d-inline-block mx-2">My courses<i class="fas fa-angle-double-down ml-1"></i></div>
                        <div className="d-inline-block mx-2">home</div>
                        <div className="d-inline-block mx-2"><i class="fab grey-text fa-medapps fa-1x mx-2"></i></div>
                        <div className="d-inline-block mx-2"><i class="fas grey-text fa-luggage-cart fa-1x mx-2"></i></div>
                        <div className="d-inline-block mx-2"><i class="far grey-text fa-bell fa-1x mx-2"></i></div>
                    </div>
                </div>
            </nav >
        </div>
    )
};

export default NavbarTest;
