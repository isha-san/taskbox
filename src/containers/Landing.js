import NavBar from '../components/NavBar.js';
import { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom'; 

function Landing() {
    const [auth, setAuth] = useState(false);
    useEffect(() => {
        fetch('/authentication')
        .then(response => response.json())
        .then(data => setAuth(data.isAuthenticated));
        console.log(auth);
    });
    if (auth === false) {
        return <Redirect exact to="/login"/>
    }
    return (
        <div>
            <NavBar></NavBar>
            <h1>Welcome to Timebox,</h1>
            <h6>the web application that helps you manage your time.</h6>
            <p>Developed by Isha Sangani, Shay Li, and Clare Morris for CS50 (but really, for busy college students).</p>
        </div>
    );
}
export default Landing; 