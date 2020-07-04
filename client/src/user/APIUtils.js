import { API_BASE_URL, ACCESS_TOKEN } from '../config';
const API_URL = API_BASE_URL + '/api'

const request = (options) => {
    const headers = new Headers({
        'Content-Type': 'application/json',
    })

    if (localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
    }

    const defaults = { headers: headers };
    options = Object.assign({}, defaults, options);

    return fetch(options.url, options)
        .then(response =>
            response.json().then(json => {
                if (!response.ok) {
                    return Promise.reject(json);
                }
                return json;
            })
        );
};

export function getCurrentUser() {
    if (!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/user/me",
        method: 'GET'
    });
}

export function changeUserPassword(passwords){
    var token = localStorage.getItem('accessToken')
    return fetch(`${API_BASE_URL}/user`, {
        method: "PATCH",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(passwords)

    })
    .then(response => {
        window.alert("Your password has been changed!")
        return response.json();
    })
    .catch(err => {
        window.alert("Your password is wrong!")
        console.log(err)
    }
    );
}

export function requestToken(email) {
    console.log(JSON.stringify(email))
    return fetch(`${API_BASE_URL}/user/forgot`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(email)

    })
        .then(response => {
            window.alert("Email Sent!")
            return response.json();
        })
        .catch(err => {
            console.log(err)
        }
        );
}

export function retrieveUserPassword(password, token) {
    var t= localStorage.getItem('accessToken')
    return fetch(`${API_BASE_URL}/user/forgot/token/${token}`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${t}`
        },
        body: JSON.stringify(password)

    })
        .then(response => {
            window.alert("Your password has been changed!")
            return response.json();
        })
        .catch(err => {
            console.log(err)
        }
        );
}

export function login(loginRequest) {
    return request({
        url: API_BASE_URL + "/auth/login",
        method: 'POST',
        body: JSON.stringify(loginRequest)
    });
}


export function signup(signupRequest) {
    signupRequest['role'] = "user"
    console.log("signupRequest : ", signupRequest)
    console.log("url for signup : ", `${API_BASE_URL}/auth/register`)

    return fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(signupRequest)

    })
        .then(response => {
            return response.json();
        })
        .catch(err => {
            console.log(err)
        }
        );
}

export function setAvatar(data) {
    return requestUpload({
        url: API_BASE_URL + "/api/upload",
        method: 'POST',
        body: data
    }).then(response => {
        return response.json();
    }).catch(err => console.log("Err in setAvatar : " , err));
}

const requestUpload = (options) => {
    const headers = new Headers({
    })

    if (localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
    }

    const defaults = { headers: headers };
    options = Object.assign({}, defaults, options);
    return fetch(options.url, options)
        .then(response =>
            response.json().then(json => {
                if (!response.ok) {
                    return Promise.reject(json);
                }
                return json;
            })
        );
};

export const updateUser = (body) => {
    var token = localStorage.getItem('accessToken')
    console.log("body in updateUser : ", body)
    return fetch(`${API_BASE_URL}/user`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)

    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
}



// export function signup(signupRequest) {
//     console.log("signup funciotn and paraetm : ", signupRequest)
//     return request({
//         url: API_BASE_URL + "/auth/signup",
//         method: 'POST',
//         body: JSON.stringify(signupRequest)
//     });
// }

export function isAuthenticated() {
    var token = localStorage.getItem('accessToken')

    if (token !== null) {
        return true
    } else {
        return false
    }
}

export function getUserRole() {
    var role = localStorage.getItem('USER').role

    if (role !== null) {
        return role
    } else {
        return false
    }
}