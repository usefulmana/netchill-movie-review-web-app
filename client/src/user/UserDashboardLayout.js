import React from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { BrowserRouter, Router, Switch, Route, Link, withRouter } from "react-router-dom";

const UserDashboardLayout = ({ children, history, location, keywordIn }) => {

    const isActive = (history, path) => {
        if (history.location.pathname === path) {
            return "dashboard-sidebar-item dashboard-sidebar-item-active ";
        } else {
            return  "dashboard-sidebar-item ";
        }
    };

    const showSideBar = () => {
        return (
            <div className="dashboard-sidebar" >
                <div className="dashboard-sidebar-title">Admin Options</div>
                <ul className="dashboard-sidebar-item-box">
                    <Link to={'/user/dashboard/profile'}>
                        <li className={isActive(history,'/user/dashboard/profile')}>Profile</li>
                    </Link>
                    <Link to={'/user/dashboard'}>
                        <li className={isActive(history, '/user/dashboard')}>Dashboard</li>
                    </Link>
                    <Link to={'/user/dashboard/history'}>
                        <li className={isActive(history, '/user/dashboard/history')}>History</li>
                    </Link>
                </ul>
            </div>
        )
    }

    return (
        <Layout keywordIn={keywordIn}>
            <div className="row mt-5">
                <div className="col-3">
                    {showSideBar()}
                </div>
                <div className="col-9">
                    {children}
                </div>
            </div>
        </Layout>
    )
}

export default withRouter(UserDashboardLayout)