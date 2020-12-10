import {useState, useEffect} from 'react';
import NavBar from '../components/NavBar.js';
import { Redirect } from 'react-router-dom';

function AuthHome() {
    const [auth, setAuth] = useState(true);
    //check if user is authenticated by sending a request to the server
    //(had to put it in container files because had trouble exporting it to a different file)
    useEffect(() => {
        let mounted = true;
        if (mounted) {
            fetch('/authentication')
                .then(response => response.json())
                .then(data => setAuth(data.isAuthenticated));
                console.log(auth);
        }
        return function cleanup() {
            mounted = false;
        };
    });
    //if the user is not logged in, they see the login page
    if (auth === false) {
        return <Redirect exact to="/login"/>;
    }
    return (
        <div>
            <NavBar></NavBar>
            <h1>Welcome to timebox!</h1>
            <p>The app that lets you schedule your tasks. Developed by Isha Sangani, 
                Clare Morris, and Shay Li for CS50 (and beyond).
            </p>
        </div>
    );
}
export default AuthHome; 