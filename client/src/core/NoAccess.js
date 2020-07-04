import React, { useState, useEffect } from "react";
import Layout from "./Layout";

const NoAccess = ({ location, history }) => {
    return (
        <Layout>
            <div className="">
                 <img src="/img/notAuthorized.png" className="no-access-img"/>
            </div>
        </Layout>
    )
}

export default NoAccess