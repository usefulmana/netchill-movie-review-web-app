import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { retrieveUserPassword } from './APIUtils';

export default class RetrievePW extends Component {
    constructor(props){
        super(props)
        this.state = {
            "token": this.props.match.params.token,
            "newPassword": "",
            "retype":""
        }
        this.onChange = this.onChange.bind(this)
    }

    onChange(e){
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handlePasswordChange = (e) => {
        e.preventDefault()
        const { newPassword, token, retype } = this.state;
        if (newPassword === retype) {
            retrieveUserPassword(newPassword, token)
        }
        else {
            window.alert("Passwords Do Not Match")
        }

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
                                <div className="font-size-profile">New Password:</div>
                            </div>
                            <div className="ele-input">
                                <input type="password" placeholder="New Password" className="form-control btn-block font-size-profile" name="newPassword" onChange={this.onChange} />
                            </div>
                        </div>
                        <div className="form-ele">
                            <div className="ele-laber">
                                <div className="font-size-profile">Retype New Password:</div>
                            </div>
                            <div className="ele-input">
                                <input type="password" placeholder="Retype New Password" className="form-control btn-block font-size-profile" name="retype" onChange={this.onChange} />
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
