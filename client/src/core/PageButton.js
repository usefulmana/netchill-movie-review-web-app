import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import '../css/PageButton.css'
const PageButton = ({ myFilters, handleFilters, totalPages=0, page=1 }) => {

    const init = () => {
        if (totalPages !== 0) {
            var currentPage = page
            console.log("currentPage received : ", currentPage)
            console.log("totalPages received : ", totalPages)
            var b = document.querySelector(`.page-button-${currentPage}`)
            var allBtn = document.querySelectorAll(`.page-button`)
            console.log("b 11 : ", b)
            console.log("allBtn : ", allBtn)

            var allPageButton = document.querySelectorAll('.page-button')
            allPageButton.forEach((c) => {
                c.classList.remove('page-button-active')
            })
            b.classList.add('page-button-active')
        }
    }

    useEffect(() => {
        init()
    })

    const handleClick = (filterBy) => (e) => {
        const pageNumber = e.target.title
        handleFilters(pageNumber, "page")
    }

    const showPageButton = () => {
        let pageNumberNeeded = parseInt(totalPages)
        var returnArr = []
        var currentPage = parseInt(page)


        // case0 : when pageNeeded is less than 6
        if (pageNumberNeeded <= 6) {
            for (var i = 1; i <= pageNumberNeeded; i++) {
                returnArr.push(
                    <div className={`page-button page-button-${i}`} onClick={handleClick('skip')} title={i}>
                        {i}
                    </div>
                )
            }
        }

        // case1 : when current page is NOT last 2 pages
        if (currentPage < pageNumberNeeded - 2 && pageNumberNeeded > 6) {
            for (var i = currentPage - 1; i <= currentPage + 1; i++) {
                if (i > 0 && i <= pageNumberNeeded) {
                    returnArr.push(
                        <div className={`page-button page-button-${i}`} onClick={handleClick('skip')} title={i}>
                            {i}
                        </div>
                    )
                }
            }

            if (currentPage === 1) {
                returnArr.push(
                    <div className={`page-button page-button-3`} onClick={handleClick('skip')} title={3}>
                        {i}
                    </div>
                )
            }

            returnArr.push(
                <div className="page-dots-button">
                    ...
                </div>
            )

            for (var i = pageNumberNeeded - 1; i <= pageNumberNeeded; i++) {
                if (i > 0 && i <= pageNumberNeeded) {
                    returnArr.push(
                        <div className={`page-button page-button-${i}`} onClick={handleClick('skip')} title={i}>
                            {i}
                        </div>
                    )
                }

            }

        }
        // Case2:  when current page IS last 2 pages
        if (currentPage >= pageNumberNeeded - 2 && pageNumberNeeded > 6) {
            for (var i = 1; i <= 3; i++) {
                if (i > 0 && i <= pageNumberNeeded) {
                    returnArr.push(
                        <div className={`page-button page-button-${i}`} onClick={handleClick('skip')} title={i}>
                            {i}
                        </div>
                    )
                }
            }

            returnArr.push(
                <div className="page-dots-button" >
                    ...
                </div>
            )

            if (currentPage === pageNumberNeeded) {
                returnArr.push(
                    <div className={`page-button page-button-${pageNumberNeeded - 2}`} onClick={handleClick('skip')} title={pageNumberNeeded - 2}>
                        {pageNumberNeeded - 2}
                    </div>
                )
            }

            for (var i = currentPage - 1; i <= currentPage + 1; i++) {
                if (i > 0 && i <= pageNumberNeeded) {
                    returnArr.push(
                        <div className={`page-button page-button-${i}`} onClick={handleClick('skip')} title={i}>
                            {i}
                        </div>
                    )
                }
            }
        }
        return (
            <div className="row align-items-center justify-content-end page-button-container">
                {returnArr}
            </div>
        )
    }

    return (
        <div className="row justify-content-center">
            {showPageButton()}
        </div>
    );
}

export default PageButton                                