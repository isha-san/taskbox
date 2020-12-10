import {useState, useEffect} from 'react';
import NavBar from '../components/NavBar.js';
import { Redirect } from 'react-router-dom';

function AuthHome() {
    const [auth, setAuth] = useState(true);
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