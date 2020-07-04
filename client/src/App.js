import React from 'react';
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import Home from "./core/Home";
import MovieDetail from "./core/MovieDetailTest";
import OAuth2RedirectHandler from './user/oauth2/OAuth2RedirectHandler'
import Signup from './user/login/Signup';
import Login from './user/login/Login';
import Modal from './core/Modal'
import Movies from './core/Movies';
import NoAccess from './core/NoAccess';
import PrivateRoute from './user/PrivateRoute';

// ADMIN
import AdminRoute from './admin/AdminRoute';
import MovieManage from './admin/MovieManage';
import UserManage from './admin/UserManage';

// import module.

// ipmort css.
import './App.css'
import PageNotFound from './core/PageNotFound';
import OauthError from './core/OauthError';
import Profile from './user/Profile';
import Playlist from './user/Playlist';
import UserPlayLists from './user/UserPlayLists';
import ChangePW from './user/ChangePW';
import RetrievePW from './user/RetrievePW';
import TokenRequest from './user/TokenRequest';



function App() {
  const handleClick = () => {
    // document.querySelector(".login-modal").classList.add("login-modal-deactive")
    document.querySelector(".login-modal").classList.add("login-modal-active")
  }

  const handleClick2 = () => {
    // document.querySelector(".login-modal").classList.add("login-modal-deactive")
    document.querySelector(".signup-modal").classList.add("signup-modal-active")
  }
  return (
    <div>
      <Modal className="login" children={<Login />} />
      <Modal className="signup" children={<Signup />} />
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/oauth2/redirect" component={OAuth2RedirectHandler}></Route>
          <Route path="/movie/:movieId" component={MovieDetail}></Route>
          <Route path="/movies" component={Movies}></Route>
          <Route path="/oauth2/error" component={OauthError}></Route>
          <Route path="/token" exact component={TokenRequest}></Route>
          <Route path="/forgot/:token" component={RetrievePW}></Route>
          {/* <Route path="/profile" component={Profile}></Route> */}
          <PrivateRoute path="/user/profile" exact component={Profile} />
          <PrivateRoute path="/user/pw" exact component={ChangePW} />
          <Route path="/user/playlists/:userId" exact component={UserPlayLists} />
          <Route path="/user/playlist/:listId" exact component={Playlist} />
          {/* <AdminRoute path="/admin/manage/movies" exact component={MovieManage} />
          <AdminRoute path="/admin/manage/user" exact component={UserManage} /> */}

          <Route exact path="/noAccess" component={NoAccess} />
          <Route path='*' component={PageNotFound} />
        </Switch>
      </BrowserRouter>
    </div>


  );
}

export default App;
