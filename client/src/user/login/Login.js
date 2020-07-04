import React, { Component } from 'react';
import './Login.css';
import './Signup.css';
import { GOOGLE_AUTH_URL, FACEBOOK_AUTH_URL, GITHUB_AUTH_URL, ACCESS_TOKEN } from '../../config';
import { login, signup, getCurrentUser, requestToken } from '../APIUtils';
import { Link, Redirect } from 'react-router-dom'
// import fbLogo from '../../../public/img/fb-logo.png';
// import googleLogo from '../../../public/img/google-logo.png';
// import githubLogo from '../../../public/img/github-logo.png';
import Alert from 'react-s-alert';
import Loader from '../../core/Loader';

class Login extends Component {
    constructor(props) {
        super(props);
        // this.openSignup=this.props.openSignup
        console.log(this.props)
    }

    componentDidMount() {
        // If the OAuth2 login encounters an error, the user is redirected to the /login page with an error.
        // Here we display the error and then remove the error query parameter from the location.
        // if (this.props.location.state && this.props.location.state.error) {
        //     setTimeout(() => {
        //         Alert.error(this.props.location.state.error, {
        //             timeout: 5000
        //         });
        //         this.props.history.replace({
        //             pathname: this.props.location.pathname,
        //             state: {}
        //         });
        //     }, 100);
        // }
    }

    openSignup = () => {
        document.querySelector(".login-modal").classList.remove("login-modal-active")
        document.querySelector(".signup-modal").classList.add("signup-modal-active")
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
            <div className="login-container row justify-content-center ">
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
                <div className="login-content right-content col-8" style={{ margin: 0 }}>
                    <div className="mb-4">
                        <span className="signin-link">Sign in</span>
                        <span className="slash-seperator">/</span>
                        <span className="signup-link"><a onClick={this.openSignup}>Sign up</a></span>
                    </div>
                    <div className="row  h-75">
                        <div className="col-6 pb-3 pr-4 pt-5">
                            <div className="text">We will need..</div>
                            <LoginForm {...this.props} />
                        </div>
                        {/* <div className="col-6 position-relative social-login-box pb-3 pl-4 pt-5">
                            <div className="or-seperator">Or</div>
                            <div className="text">Also, sign in with social account..</div>
                            
                            <SocialLogin />
                        </div> */}
                    </div>
                </div>
            </div >
        );
    }
}

class SocialLogin extends Component {

    saveCurrentLocation = () => {
        let current_location = window.location.pathname
        console.log("GOOGLE_AUTH_URL: ", GOOGLE_AUTH_URL)
        console.log("FACEBOOK_AUTH_URL: ", FACEBOOK_AUTH_URL)
        localStorage.setItem('CURRENT_LOCATION', JSON.stringify(current_location))
    }

    render() {
        return (
            <div className="social-login">
                <a className="btn btn-block social-btn google" onClick={this.saveCurrentLocation} href={`${GOOGLE_AUTH_URL}`}>
                    <img src="/img/google-logo.png" alt="Google" /> Log in with Google</a>
                {/* <a className="btn btn-block social-btn facebook" onClick={this.saveCurrentLocation} href={FACEBOOK_AUTH_URL}>
                    <img src="/img/fb-logo.png" alt="Facebook" /> Log in with Facebook</a>
                <a className="btn btn-block social-btn github" onClick={this.saveCurrentLocation} href={GITHUB_AUTH_URL}>
                    <img src="/img/github-logo.png" alt="Github" /> Log in with Github</a> */}
            </div>
        );
    }
}


class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            error: '',
            loading: false,
            pwRetrieveEmail: ""
        };
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

    closeLoginModal() {
        document.querySelector(`.login-modal`).classList.remove(`login-modal-active`)
    }

    handleSubmit(event) {
        event.preventDefault();
        const loginRequest = Object.assign({}, this.state);
        // let current_location = window.location.pathname
        // localStorage.setItem('CURRENT_LOCATION', JSON.stringify(current_location))
        this.setState({ loading: true })
        login(loginRequest)
            .then(response => {
                console.log("res?  :", response)

                localStorage.setItem(ACCESS_TOKEN, response.accessToken);
                this.closeLoginModal()
                window.location.reload(true);
            }).catch(error => {
                console.log("error?  :", error)
                this.setState({
                    error:  'Oops! Please check your email and password!',
                    loading: false
                })
            });
    }

    handleForgotPassword(e){
        e.preventDefault()
        var email = this.state.pwRetrieveEmail
        requestToken({email})
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <div className="form-item">
                        {this.state.error !== '' &&
                            < div className="error"><i class="fas fa-exclamation-circle px-2"></i>{this.state.error}</div>
                        }
                    </div>

                    <div className="form-item mb-4">
                        <input type="email" name="email"
                            className="form-control" placeholder="Email"
                            value={this.state.email} onChange={this.handleInputChange} required />
                    </div>
                    <div className="form-item mb-4">
                        <input type="password" name="password"
                            className="form-control" placeholder="Password"
                            value={this.state.password} onChange={this.handleInputChange} required />
                    </div>
                    <div className="form-item mb-4">
                        <button type="submit" className="btn btn-block btn-primary">Sign in</button>
                    </div>
                    <Loader visible={this.state.loading} />
                </form>
                <div className="form-item mb-4">
                    <h4>Forgot Your Password?</h4>
                </div>
                <div className="form-item mb-4">
                    <input type="email" name="pwRetrieveEmail"
                        className="form-control" placeholder="Email"
                        onChange={this.handleInputChange}/>
                </div>
                <div className="form-item mb-4">
                    <button type="submit" className="btn btn-block btn-primary" onClick={this.handleForgotPassword.bind(this)}>Request New Password</button>
                </div>
            </div>

        );
    }
}

export default Login
