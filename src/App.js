import { Fragment, useState, useEffect } from 'react';
import { Route, Link, BrowserRouter } from 'react-router-dom';
import Login from './containers/Login.js';
import AuthHome from './containers/AuthHome.js';
import Signup from './containers/Signup.js';
import Profile from './containers/Profile.js';
import NavBar from './components/NavBar.js';
import Landing from './containers/Landing.js';
import checkAuth from './actions/CheckAuth.js';
import DayView from './containers/DayView.js';
import ResetPassword from './containers/ResetPassword.js';

function App() {
  if (checkAuth()) {
    console.log(checkAuth());
  }
  else if (checkAuth() == false) {
    console.log("checkAuth = false");
  }
  return (
    
    <div>
      
        <BrowserRouter>
          <Route exact path='/' component={Landing}/>
          <Route exact path='/landing' component={Landing}/>
          <Route exact path='/login' component={Login}/>
          <Route exact path='/signup' component={Signup}/>
          <Route exact path="/dayview" component={DayView}/>
          <Route exact path='/authhome' component={AuthHome}/>
          <Route exact path='/profile' component={Profile}/>
          <Route exact path='/resetpassword' component={ResetPassword}/>
        </BrowserRouter>
    </div>
  );
}

export default App;
