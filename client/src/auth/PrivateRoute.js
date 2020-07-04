import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import { isAuthenticated } from "./index";

const PrivateRoute = ({ component, ...rest }) => {
    return isAuthenticated() && isAuthenticated().user.role === 0? 
    <Route {...rest} component={component} />: <Redirect to={'/noAccess'}/>
};

export default PrivateRoute;
