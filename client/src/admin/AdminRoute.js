import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import { isAuthenticated, getUserRole } from "../user/APIUtils";

const AdminRoute = ({ component, ...rest }) => {
    // const role = getUserRole()
    // console.log("whati is ore : ", role)
    // return isAuthenticated() && role === "admin"? 
    // <Route {...rest} component={component} />: <Redirect to={'/'}/>

    return <Route {...rest} component={component} />
};

export default AdminRoute;
