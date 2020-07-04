import Layout from "./Layout"
import React, { useState, useEffect } from "react";
import queryString from 'query-string';

const OauthError = ({location}) => {
    var query = queryString.parse(location.search)
    var errorMessage= query.error
    console.log("Wahtis eror :  ", query.error)

    return (
        <Layout>
            {/* {JSON.stringify(error)} */}
            <div className="">{errorMessage}</div>
        </Layout>
    )

}

export default OauthError