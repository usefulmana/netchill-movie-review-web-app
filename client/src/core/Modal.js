import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import '../css/Modal.css'
import { useAlert } from 'react-alert'
// import '../css/myscss.scss'

const Modal = ({
    children,
    className
}) => {

    const clickAway = (e) => {
        if (!e.target.closest(`.${className}-container`)) {
            document.querySelector(`.${className}-modal`).classList.remove(`${className}-modal-active`)
        }
    }

    const alert = useAlert()

    return (
        <div>
            <div id="style-1" className={`my-modal-container row justify-content-center align-items-center ${className}-modal`}
                onClick={clickAway}
            >
                <div className="my-modal-content animated finite slideInDown faster row justify-content-center align-items-center">
                    {children}
                </div>
            </div>
        </div >

    )
}

export default Modal