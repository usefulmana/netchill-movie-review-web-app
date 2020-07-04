import { API_BASE_URL } from "../config";
const API_URL = API_BASE_URL + '/api'

export const deleteMovie = ({ id }) => {
    var token = localStorage.getItem('accessToken')

    return fetch(`${API_URL}/movies/${id}`, {
        method: "DELETE",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }

    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
}

export const getMovies = ({ page = 1, size = 20 }) => {
    return fetch(`${API_URL}/movies?page=${page}&size=${size}`, {
        method: "GET"
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const getMoviesPage = ({ page, size = 10 }) => {
    return fetch(`${API_URL}/movies?page=${page}&size=${size}`, {
        method: "GET"
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};
export const getPlayList = (id) => {
    var token = localStorage.getItem('accessToken')

    return fetch(`${API_URL}/list/user/${id}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};


export const newMovie = (body) => {
    var token = localStorage.getItem('accessToken')

    return fetch(`${API_URL}/movies`, {
        method: "POST",
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
export const updateMovie = (body, id) => {
    var token = localStorage.getItem('accessToken')

    return fetch(`${API_URL}/movies/${id}`, {
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
