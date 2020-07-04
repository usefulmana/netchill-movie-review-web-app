import React, { Component } from 'react';
import './Signup.css';
import './Login.css';

// import './Login.css';

import { Link, Redirect } from 'react-router-dom'
import { GOOGLE_AUTH_URL, FACEBOOK_AUTH_URL, GITHUB_AUTH_URL, ACCESS_TOKEN } from '../../config';
import { login, signup } from '../APIUtils';
import Alert from 'react-s-alert';
import Loader from '../../core/Loader';

class Signup extends Component {
    openLogin = () => {
        document.querySelector(".signup-modal").classList.remove("signup-modal-active")
        document.querySelector(".login-modal").classList.add("login-modal-active")

    }

    render() {
        if (this.props.authenticated) {
            return <Redirect
                to={{
                    pathname: "/",
                    state: { from: this.props.location }
                }} />;
        }

        return (
            <div className="signup-container row justify-content-center ">
                <div className="col-4 left-content text-center row align-items-center">
                    <div>
                        <div className="row align-items-center justify-content-center">
                            <img src="/img/logo-for-movie-page.jpeg" />
                        </div>
                        {/* <p>Hey you!</p>
                        <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit, </div>
                        <div>tempor incididunt ut labore et dolore magna aliqua. Ut  </div>
                        <div>veniam, quis nostrud exercitation Ut enim ad minim </div> */}
                    </div>
                </div>
                <div className="signup-content right-content col-8">
                    <div className="mb-4">
                        <span className="signup-link">Sign up</span>
                        <span className="slash-seperator">/</span>
                        <span className="signin-link" onClick={this.openLogin}>Sign in</span>
                    </div>
                    <div className="row ">
                        <div className="col-6 pb-3 pr-4 pt-5">
                            <div className="text">We will need..</div>
                            <SignupForm {...this.props} />
                        </div>
                        {/* <div className="col-6 position-relative social-login-box pb-3 pl-4 pt-5">
                            <div className="or-seperator">Or</div>
                            <div className="text">Also, sign in with social account..</div>
                           
                            <SocialSignup />

                        </div> */}
                    </div>
                </div>
                <span className="login-link">Already have an account? <a onClick={this.openLogin}>Login!</a></span>
            </div>
        );
    }
}


class SocialSignup extends Component {
    render() {
        return (
            <div className="social-signup">
                <a className="btn-block social-btn google" href={GOOGLE_AUTH_URL}>
                    <img src='/img/google-logo.png' alt="Google" /> Sign up with Google</a>
                {/* <a className="btn-block social-btn facebook" href={FACEBOOK_AUTH_URL}>
                    <img src='/img/fb-logo.png' alt="Facebook" /> Sign up with Facebook</a>
                <a className="btn-block social-btn github" href={GITHUB_AUTH_URL}>
                    <img src='/img/github-logo.png' alt="Github" /> Sign up with Github</a> */}
            </div>
        );
    }
}

class SignupForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            password: '',
            confirmedPassword: '',
            error: '',
            success: '',
            loading: false
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const inputName = target.name;
        const inputValue = target.value;

        this.setState({
            [inputName]: inputValue
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        const signUpRequest = Object.assign({}, this.state);

        this.setState({
            error: '',
            success: ''
        })

        if (this.state.confirmedPassword !== this.state.password) {
            this.setState({
                error: 'Confirmed password is incorrect!',
                success: ''
            })
            return false
        }

        this.setState({ loading: true })
        signup(signUpRequest)
            .then(response => {
                // 200
                console.log("what is response in singup compo : ", response)
                if (response.error) {
                    this.setState({
                        error: response.message || 'Oops! Something went wrong. Please try again!',
                        success: '',
                        loading: false
                    })
                } else if (response.success) {
                    this.setState({
                        success: "You're successfully registered. Please login to continue!",
                        error: "",
                        loading: false
                    })
                }
            }).catch(error => {
                console.log("what is error : ", error)

            });
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <div className="form-item">
                    {this.state.error !== '' &&
                        < div className="error"><i class="fas fa-exclamation-circle px-2"></i>{this.state.error}</div>
                    }
                    {this.state.success !== '' &&
                        <div className="success"><i class="fas fa-check px-2"></i>{this.state.success}</div>
                    }

                </div>
                <div className="form-item">
                    <input type="text" name="name"
                        className="form-control" placeholder="Name"
                        value={this.state.name} onChange={this.handleInputChange} required />
                </div>
                <div className="form-item">
                    <input type="email" name="email"
                        className="form-control" placeholder="Email"
                        value={this.state.email} onChange={this.handleInputChange} required />
                </div>
                <div className="form-item">
                    <input type="password" name="password"
                        className="form-control" placeholder="Password"
                        value={this.state.password} onChange={this.handleInputChange} required />
                </div>

                <div className="form-item">
                    <input type="password" name="confirmedPassword"
                        className="form-control" placeholder="Confirm password"
                        value={this.state.confirmedPassword} onChange={this.handleInputChange} required />
                </div>

                <div className="form-item">
                    <button type="submit" className="btn btn-block btn-primary" >Sign Up</button>
                </div>
                <Loader visible={this.state.loading} />
            </form >

        );
    }
}

export default Signup