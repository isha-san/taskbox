import NavBar from '../components/NavBar.js';
import { Redirect } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Profile() {
    //console.log(checkAuth);
    const [auth, setAuth] = useState(true);
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
            <NavBar/>
            <h1>Nothing to see here!</h1>
        </div>
    );
}
export default Profile; 