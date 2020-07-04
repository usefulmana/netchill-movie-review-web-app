import Layout from "./Layout"
import React, { useState, useEffect } from "react";
import '../css/Home.css'

const PageNotFound = ({ location, history }) => {
    return (
        <Layout>
            <div className="page-not-found mt-5"></div>
        </Layout>
    )

}

export default PageNotFound