import React, { useState, useEffect, Component } from "react";
import Layout from "./Layout";
import { getCurrentUser, isAuthenticated } from '../user/APIUtils';

class ChangePassword extends Component {
    constructor(props) {
        super(props);
        // alert("hu?")
        this.state = {
            authenticated: false,
            userRole: undefined,
            userEmail: undefined,
            userName: undefined,
            userAvatar: undefined,
            userID: undefined
        }
        getCurrentUser().then(res => {
            localStorage.setItem('USER', JSON.stringify(res))
            this.setState({ authenticated: true, userRole: res.role , userName: res.name, userEmail: res.email, userAvatar: res.imageUrl, userID:res.id})
        })
    }
    render() {
        return (
            <Layout>
                <div className="position-relative overflow-auto full-height">
                    <div className="row z-content-center logo-for-movie animated finite slideInDown faster">
                        <div className="profile">
                            <div className="profile-image">
                                <img className="image" src={this.state.userAvatar} alt="User avatar"/>
                                <button type="button" class="form-control btn-warning btn-block font-size-profile">Update avatar</button>
                            </div>
                            <div className="profile-form">
                                <form className="form-profile">
                                    <div className="form-ele">
                                        <div className="ele-laber">
                                            <div className="font-size-profile">Old Password:</div>
                                        </div>
                                        <div className="ele-input">
                                            <input type="text" className="form-control btn-block font-size-profile" />
                                        </div>
                                    </div>
                                    <div className="form-ele">
                                        <div className="ele-laber">
                                            <div className="font-size-profile">New Password:</div>
                                        </div>
                                        <div className="ele-input">
                                            <input type="text" className="form-control btn-block font-size-profile" />
                                        </div>
                                    </div>
                                    <div className="form-ele">
                                    </div>
                                    <div className="form-ele">
                                        <div className="ele-laber">
                                        </div>
                                        <div className="ele-input">
                                            <a href="profile">Need change profile?</a>
                                        </div>
                                    </div>
                                    <div className="form-ele">
                                        <div className="ele-laber">
                                        </div>
                                        <div className="ele-input">
                                            <button type="button" class="form-control btn-warning btn-block font-size-profile">Update password</button>
                                        </div>
                                    </div>
                                    <div className="form-ele">
                                    </div>
                                </form>
                            </div>
                        </div> 
                    </div>
                    <div className="movie-page-background"></div>
                </div>
            </Layout>
        )
    }
}

export default ChangePassword