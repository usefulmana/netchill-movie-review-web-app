import React, { Component } from 'react';
import { ACCESS_TOKEN } from '../../config';
import { Redirect } from 'react-router-dom'
import { withRouter } from "react-router-dom";
import { getCurrentUser } from '../APIUtils'
import { API_BASE_URL } from "../../config";
const API_URL = API_BASE_URL + '/api'

class OAuth2RedirectHandler extends Component {
    constructor(props) {
        super(props);

        var previous_location = JSON.parse(localStorage.getItem('CURRENT_LOCATION'))
        localStorage.removeItem('CURRENT_LOCATION')
        this.setState({ previous_location: previous_location })
        console.log("what is previous_location : ", previous_location)

        var token = this.getUrlParameter('token');
        localStorage.setItem(ACCESS_TOKEN, token);
        console.log(token)
        this.state = {
            previous_location: previous_location,
            token
        }
    }


    getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');

        var results = regex.exec(this.props.location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };

    async setCurrentUser() {
        var token = localStorage.getItem('accessToken')
        var response = await fetch(
            `${API_BASE_URL}/user/me`, {
            method: 'GET',

            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })
        var user= undefined
        await response.json().then((res)=>{
            console.log("what isr se : ",res)
            user = res
        })

        localStorage.setItem('USER', JSON.stringify(user))
    }

   

    render() {
        const error = this.getUrlParameter('error');

        if (this.state.token) {

            return <Redirect to={{
                pathname: this.state.previous_location,
                state: { from: this.props.location }
            }} />;

        } else {
            return <Redirect to={
                `/oauth2/error?error=${error}`
            } />;
        }
    }
}
export default withRouter(OAuth2RedirectHandler);