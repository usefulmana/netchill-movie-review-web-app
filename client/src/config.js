require("dotenv").config();

const MY_BASE_URL = window.location.origin
// console.log("MY_BASE_URL: ", MY_BASE_URL)

// first AWS server
// export const API_BASE_URL = 'https://www.bits-movie.info'

// export const API_BASE_URL = 'http://localhost:8080'
// 2.second heroku server
// export const API_BASE_URL = 'https://bits-movie-backend.herokuapp.com'
// export const API_BASE_URL = 'http://cc-a2-jra.ap-southeast-1.elasticbeanstalk.com'
export const API_BASE_URL = 'https://api.bits-movie.info'
export const SHOWTIME_URL = "https://ft7c1foodj.execute-api.ap-southeast-1.amazonaws.com/latest"

export const ACCESS_TOKEN = 'accessToken';

// Redirect url when app is on local : when app is deployed on heroku
// export const OAUTH2_REDIRECT_URI = MY_BASE_URL+'/oauth2/redirect'

export const OAUTH2_REDIRECT_URI = MY_BASE_URL + '/oauth2/redirect'
export const GOOGLE_AUTH_URL = API_BASE_URL + '/oauth2/authorize/google?redirect_uri=' + OAUTH2_REDIRECT_URI;
// export const FACEBOOK_AUTH_URL = API_BASE_URL + '/oauth2/authorize/facebook?redirect_uri=' + OAUTH2_REDIRECT_URI+'&STATE_PARAMETER = False';
export const FACEBOOK_AUTH_URL = API_BASE_URL + '/oauth2/authorize/facebook?redirect_uri=' + OAUTH2_REDIRECT_URI;
export const GITHUB_AUTH_URL = API_BASE_URL + '/oauth2/authorize/github?redirect_uri=' + OAUTH2_REDIRECT_URI;
