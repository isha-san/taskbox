import { Fragment, useState, useEffect } from 'react';
import { Route, Link, BrowserRouter } from 'react-router-dom';
import Login from './containers/Login.js';
import AuthHome from './containers/AuthHome.js';
import Signup from './containers/Signup.js';
import Profile from './containers/Profile.js';
import Landing from './containers/Landing.js';
import DayView from './containers/DayView.js';

function App() {
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
        </BrowserRouter>
    </div>
  );
}

export default App;
