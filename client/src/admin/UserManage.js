import React, { useState, useEffect } from "react";
import Layout from "../core/Layout";
import "../css/UserManage.css"

const UserManage = (props) => {
    function handleClick(e) {
        e.preventDefault();
        console.log('Search clicked.');
    }
    return (
        <Layout>
            <div className="position-relative overflow-auto full-height">
                <div className="row z-content-center logo-for-movie animated finite slideInDown faster">
                    <div className="user_manage">
                        <div className="header-col">
                            <div className="laber-col">
                                <div className="col-laber">User Manage</div>
                            </div>
                            <div className="right-col">
                                <div className="right-search">
                                    <input class="form-control form-control-sm" type="text" id="form-search" placeholder="Search"/>
                                    <button type="button" class="btn btn-default btn-sm btn-search" onClick={handleClick}>Search</button>
                                </div>
                                <div className="right-button">
                                    <button type="button" class="btn btn-default btn-sm">New</button>
                                </div> 
                            </div>
                        </div>
                        <div className="user-col">
                            <div className="name-col">
                                <div>Name</div>
                            </div>
                            <div className="username-col">
                                <div>Username</div>
                            </div>
                            <div className="time-col">
                                <div>Created</div>
                            </div>
                            <div className="action-col">
                                <div>Action</div>
                            </div>
                        </div>
                        <div className="user-col">
                            <div className="name-col">
                                <div>Alex</div>
                            </div>
                            <div className="username-col">
                                <div>user@gmail.com</div>
                            </div>
                            <div className="time-col">
                                <div>2019-11-15</div>
                            </div>
                            <div className="action-col">
                                <button type="button" class="btn btn-default btn-sm">Edit</button>
                                <button type="button" class="btn btn-danger btn-sm">Delete</button>
                            </div>
                        </div>
                        <div className="user-col">
                            <div className="name-col">
                                <div>Name</div>
                            </div>
                            <div className="username-col">
                                <div>user@gmail.com</div>
                            </div>
                            <div className="time-col">
                                <div>2019-11-15</div>
                            </div>
                            <div className="action-col">
                                <button type="button" class="btn btn-default btn-sm">Edit</button>
                                <button type="button" class="btn btn-danger btn-sm">Delete</button>
                            </div>
                        </div>
                        <div className="user-col">
                            <div className="name-col">
                                <div>Name</div>
                            </div>
                            <div className="username-col">
                                <div>user@gmail.com</div>
                            </div>
                            <div className="time-col">
                                <div>2019-11-15</div>
                            </div>
                            <div className="action-col">
                                <button type="button" class="btn btn-default btn-sm">Edit</button>
                                <button type="button" class="btn btn-danger btn-sm">Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="movie-page-background"></div>
            </div>
        </Layout>
    )

}

export default UserManage