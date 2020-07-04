import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route, withRouter, Redirect, Link } from "react-router-dom";
// import Layout from "../css/Layout.css";
import '../css/Loader.css'

const Loader = ({visible=false}) => {
    console.log("visible : ", visible)
    return visible&&(
        <div className="graf-bg-container row align-items-center">
            <div className="graf-layout">
                <div className="graf-circle"></div>
                <div className="graf-circle"></div>
                <div className="graf-circle"></div>
                <div className="graf-circle"></div>
                <div className="graf-circle"></div>
                <div className="loading_message row align-items-center justify-content-center"><p>Loading...</p></div>
        
                {/* <div className="graf-circle"></div>
                <div className="graf-circle"></div> */}
                {/* <div className="graf-circle"></div>
                        <div className="graf-circle"></div>
                        <div className="graf-circle"></div>
                        <div className="graf-circle"></div> */}
            </div>
        </div>
    )
}

export default Loader