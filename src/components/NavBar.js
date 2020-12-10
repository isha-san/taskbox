import { Fragment, useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Button, Toolbar } from "@material-ui/core";
//import * from '@material-ui/core';

function NavBar() {
    const [auth, setAuth] = useState(false);
    useEffect(() => {
        window.addEventListener(('DOMContentLoaded'), function() {
            let btn = document.getElementById("logout-btn"); 
            if (btn) {
                btn.addEventListener('click', function() {
                    fetch("/logout");
                });
            } 
        });
        fetch('/authentication')
        .then(response => response.json())
        .then(data => setAuth(data.isAuthenticated));
    });
    //Logs the user out - makes a call to the backend
    function logout() {
        fetch('/logout')
        .then(response => response.json())
        .then(data => setAuth(data.isAuthenticated));
    }

    //The links that should be displayed if the user is authenticated
    const authlinks = 
    <Fragment>
        <Toolbar className="align-items-right">
            <NavLink exact to="/authhome">Home</NavLink>
            <NavLink exact to="/dayview">Schedule</NavLink>
            <button id="logout-btn" onClick={logout}>Log Out</button>
        </Toolbar>
    </Fragment>

    //The links that should be displayed if the user is unauthenticated
    const unauthlinks = 
    <Fragment>
        <Toolbar className="align-items-right">
            <NavLink exact to="/signup">Sign Up</NavLink>
            <NavLink exact to="/login">Log In</NavLink>
            <NavLink exact to="/landing">Home</NavLink>
        </Toolbar>
    </Fragment>
    return (
        <nav>
            <Fragment>
            { auth ? authlinks : unauthlinks }
            </Fragment>
        </nav>
    );
}

export default NavBar; 