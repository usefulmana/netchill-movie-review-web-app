import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Navbar from "./Navbar";
import ScrollAnimation from 'react-animate-on-scroll';

const Layout = ({
    children
}) => {
    return (
        <div>
            <div className="navbar-wrapper">
                <ScrollAnimation animateIn="fadeInDown" duration="0.5" offset="0" >
                    <Navbar />
                </ScrollAnimation>
            </div>
            <div>
                <div className="children-wrapper m-0 p-0">{children}</div>
            </div>
        </div>
    )
}

export default Layout