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
    if (auth == true) {
        return <Redirect exact to="/authhome"/>
    }
    return (
        <div>
            <NavBar></NavBar>
            <div className="top-margin fake-grid">
                <div>Welcome to Timebox!</div>
                <div>
                    Log in to start using Timebox to get things done efficiently.
                </div>
            </div>
        </div>
    );
}
export default Landing; 