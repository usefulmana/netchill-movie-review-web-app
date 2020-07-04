import React, { Component } from 'react'
import { getCurrentUser, changeUserPassword } from './APIUtils';
import Layout from './../core/Layout';
import { Link } from 'react-router-dom';

export default class ChangePW extends Component {

    constructor(props) {
        super(props);
        // alert("hu?")
        this.state = {
            authenticated: false,
            userID: undefined,
            newPassword: "",
            oldPassword: "",
            retype: ""
        }
        getCurrentUser().then(res => {
            localStorage.setItem('USER', JSON.stringify(res))
            this.setState({
                authenticated: true,
                userID: res.id
            })
        })

        this.onChange = this.onChange.bind(this)
    }

    handlePasswordChange = (e) => {
        e.preventDefault()
        const  {newPassword, oldPassword, retype} = this.state;
        if (newPassword === retype){
            changeUserPassword({ newPassword, oldPassword })
        }
        else {
            window.alert("Passwords Do Not Match")
        }
       
    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    render() {
        return (
            <div>
                <div className="profile-form">
                    <form className="form-profile">
                        {/* <div className="form-ele">
                                        <div className="ele-laber">
                                            <div className="font-size-profile">ID:</div>
                                        </div>
                                        <div className="ele-input">
                                            <input type="text" className="form-control btn-block font-size-profile" disabled value={this.state.userID} />
                                        </div>
                                    </div> */}
                        <div className="form-ele">
                            <div className="ele-laber">
                                <div className="font-size-profile">Old Password:</div>
                            </div>
                            <div className="ele-input">
                                <input type="password" placeholder="Old Password" className="form-control btn-block font-size-profile" name="oldPassword" onChange={this.onChange}/>
                            </div>
                        </div>
                        <div className="form-ele">
                            <div className="ele-laber">
                                <div className="font-size-profile">New Password:</div>
                            </div>
                            <div className="ele-input">
                                <input type="password" placeholder="New Password" className="form-control btn-block font-size-profile" name="newPassword" onChange={this.onChange}/>
                            </div>
                        </div>
                        <div className="form-ele">
                            <div className="ele-laber">
                                <div className="font-size-profile">Retype New Password:</div>
                            </div>
                            <div className="ele-input">
                                <input type="password" placeholder="Retype New Password" className="form-control btn-block font-size-profile" name="retype" onChange={this.onChange}/>
                            </div>
                        </div>
                        <div className="form-ele">
                        </div>
                        <div className="form-ele">
                            <div className="ele-laber">
                            </div>
                            <div className="ele-input">
                                <button type="button" className="form-control btn-warning btn-block font-size-profile" onClick={this.handlePasswordChange.bind(this)}>Change Password</button>
                            </div>
                        </div>
                        <div className="form-ele">
                            <div className="ele-laber">
                            </div>
                            <Link to="/">Home</Link>
                        </div>
                        <div className="form-ele">
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}
