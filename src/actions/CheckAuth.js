import { useState } from 'react';

//Checks if the user has logged in
export default function CheckAuth() {
    const [auth, setAuth] = useState(false);
    fetch('/authentication')
        .then(response => {
            setAuth(response.json().isAuthenticated);
            console.log(auth);
        });
    return auth; 
};

