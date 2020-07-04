// Core API for fetching move and review and comment.
import { API_BASE_URL } from "../config";
import { async } from "q";
import {SHOWTIME_URL} from '../config'
const API_URL = API_BASE_URL + '/api'


export const getMovies = ({ page = 1, size = 20 }) => {
    return fetch(`${API_URL}/movies?page=${page}&size=${size}`, {
        method: "GET"
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

//http://127.0.0.1:8080/api/movies?name=frozen&page=1&size=10

export const getMoviesByQuery = ({ genre = "", title = "", director = "", actor = "", page = 1, size = 20 }) => {

    if (title !== "") {
        return fetch(`${API_URL}/movies?page=${page}&size=${size}&name=${title}`
            // return fetch(`${API_URL}/movies/query?page=${page}&size=3`
            , {
                method: "GET"
            })
            .then(response => {
                return response.json();
            })
            .catch(err => console.log(err));
    }
    return fetch(`${API_URL}/movies/query?page=${page}&size=${size}&genre=${genre}&title=${title}&director=${director}&actor=${actor}`
        // return fetch(`${API_URL}/movies/query?page=${page}&size=3`
        , {
            method: "GET"
        })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));



};

export const getTopRatedMovies = ({ page = 1, size = 15 }) => {
    return fetch(`${API_URL}/movies/list/top_rated?page=${page}&size=${size}`, {
        method: "GET"
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
}

export const getNowPlayingMovies = ({ page = 1, size = 20 }) => {
    return fetch(`${API_URL}/movies/list/now_playing?page=${page}&size=${size}`, {
        method: "GET"
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
}

export const getPopularMovies = ({ page = 1, size = 15 }) => {
    return fetch(`${API_URL}/movies/list/popular?page=${page}&size=${size}`, {
        method: "GET"
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
}

export const getUpcomingMovies = () => {
    return fetch(`${API_URL}/movies/list/upcoming`, {
        method: "GET"
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
}

export const getSimilarMovies = (movieName) => {
    return fetch(`${API_URL}/movies/recommendation/similar?movie=${movieName}`, {
        method: "GET"
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
}

export const loadSingleMovie = (id) => {
    return fetch(`${API_URL}/movies/${id}`, {
        method: "GET"
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
}
/*===========
COMMENT
===========*/

export const getAllCommentOfMovie = ({ movieId, page = 1, size = 3 }) => {
    console.log("whatis id : ", movieId)
    console.log("page : ", page)
    return fetch(`${API_URL}/comments?movie_id=${movieId}&sortBy=createdAt&page=${page}&size=${size}`, {
        method: "GET"
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
}

export const createComment = (body, id, parentId = "") => {
    var token = localStorage.getItem('accessToken')


    return fetch(`${API_URL}/comments?movie_id=${id}&parent_id=${parentId}`, {
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

/*===========
    Rating
===========*/
export const leaveRate = (rating, id) => {
    var token = localStorage.getItem('accessToken')
    return fetch(`${API_URL}/ratings?movie_id=${id}&rating=${rating}`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: ""
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
}

export const getUsersRate = (movieId) => {
    if (!localStorage.getItem('accessToken')) {
        return Promise.reject("User is not logged in.");
    }

    var token = localStorage.getItem('accessToken')
    // var userId = JSON.parse(localStorage.getItem('USER')).id

    return fetch(`${API_URL}/ratings/user?movie_id=${movieId}`, {
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
}

export const upvoteOrDownvote = (commentId, method) => {
    if (!localStorage.getItem('USER') && !localStorage.getItem('accessToken')) {
        return Promise.reject("User is not logged in.");
    }

    var token = localStorage.getItem('accessToken')
    // comments/1?method=downvote
    return fetch(`${API_URL}/comments/${commentId}?method=${method}`, {
        method: "PATCH",
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

// TODO CHANGE THIS
// const showtime_url = "https://node-showtimes.herokuapp.com"
const showtime_url = "https://ft7c1foodj.execute-api.ap-southeast-1.amazonaws.com/latest"
// teather list in differnet location in vietnam
// https://node-showtimes.herokuapp.com/theaters
export const getTheaterList = () => {
    return fetch(`${SHOWTIME_URL}/theaters`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        }
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
}

// https://node-showtimes.herokuapp.com/showtime/:movie_name/:date/:theater?
// showtime
// export const getShowTime = async ({ theater = "", date, movieName }) => {

//     return await fetch(`${showtime_url}/showtime/${movieName}/${date}/${theater}`, {
//         method: "GET",
//         headers: {
//             Accept: "application/json",
//             "Content-Type": "application/json",
//         }
//     })
//         .then(async (response) => {
//             return await response.json();
//         })
//         .catch(err => console.log(err));
// }



export async function getShowTime({ theater = "", date, movieName }) {
    // await response of fetch call
    let response = await fetch(`${SHOWTIME_URL}/showtime/${movieName}/${date}/${theater}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        }
    })
    // only proceed once promise is resolved
    let data = await response.json();
    // only proceed once second promise is resolved
    return data;
}

/*============
Movie list
============*/
// {{bit}}/api/list/user/1
export const getMovieListByUserId = () => {
    if (!localStorage.getItem('USER') && !localStorage.getItem('accessToken')) {
        return Promise.reject("User is not logged in.");
    }

    var token = localStorage.getItem('accessToken')
    var userId = JSON.parse(localStorage.getItem('USER')).id

    console.log("url  L ", `${API_URL}/api/list/user/${userId}`)
    return fetch(`${API_URL}/list/user/${userId}`, {
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
}

export const getMovieListByUser = () => {
    if (!localStorage.getItem('USER') && !localStorage.getItem('accessToken')) {
        return Promise.reject("User is not logged in.");
    }

    var token = localStorage.getItem('accessToken')

    return fetch(`${API_URL}/list/user`, {
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
}

// {{bit}}/api/list
export const addNewMovieList = (body) => {
    var token = localStorage.getItem('accessToken')
    return fetch(`${API_URL}/list`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
    })
        .then(response => {
            console.log("response in addNewMovieList : ", response)
            return response.json();
        })
        .catch(err => console.log(err));
}

/*===========
Play list
============*/

// {{bit}}/api/list?list_id=1&movie_id=2&method=add
export const patchMovieToList = (listId, movieId, method) => {
    if ( !localStorage.getItem('accessToken')) {
        return Promise.reject("User is not logged in.");
    }

    var token = localStorage.getItem('accessToken')
    return fetch(`${API_URL}/list?list_id=${listId}&movie_id=${movieId}&method=${method}`, {
        method: "PATCH",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log("err : ", err));
}

export const getUserPlayList = (userId) => {
    var token = localStorage.getItem('accessToken')
    return fetch(`${API_URL}/list/user/${userId}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            // Authorization: `Bearer ${token}`
        }
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const getPlayListById = (id) => {
    var token = localStorage.getItem('accessToken')

    return fetch(`${API_URL}/list/${id}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            // Authorization: `Bearer ${token}`
        }
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const deletePlayListById = (userID, listId) => {
    var token = localStorage.getItem('accessToken')
    return fetch(`${API_URL}/list?user_id=${userID}&list_id=${listId}`, {
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
};


// {{bit}}/api/list/edit/24?name=christmasss&description=TestDescription
export const patchListInfo = (listId, newName) => {
    if (!localStorage.getItem('USER') && !localStorage.getItem('accessToken')) {
        return Promise.reject("User is not logged in.");
    }

    var token = localStorage.getItem('accessToken')
    return fetch(`${API_URL}/list/edit/${listId}?name=${newName}&description=`, {
        method: "PATCH",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log("err : ", err));
}