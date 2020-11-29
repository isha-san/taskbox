import {useState, useEffect} from 'react';
import NavBar from '../components/NavBar.js';  
import { Redirect } from 'react-router-dom';


function Login() {
    const [formData, setFormData] = useState({
        email: '', 
        password: '', 
    });
    const [auth, setAuth] = useState(false);
    const { email, password } = formData; 
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
    //Sends a POST request to the server with the form data
    const handleClick = () => {
        const requestOptions = {
            method: 'POST',
            body: JSON.stringify(formData)
        };
        fetch('/login', requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log(data.isAuthenticated);
                setAuth(data.isAuthenticated);
            });
        console.log(auth);
    };
    function onSubmit(e) {
        e.preventDefault();
    }
    if (auth) {
        return <Redirect exact to='/authhome'/>;
    }
    return (
        <div>
            <NavBar/>
            <p id="login-summary"></p>
            <form onSubmit={e => onSubmit(e)} >
                <label>Email</label>
                <input 
                    className="form-control" 
                    type="text" 
                    name="email"
                    value={email}
                    onChange={e => onChange(e)}
                    required
                >
                </input>
                <label>Password</label>
                <input
                    className="form-control" 
                    type="password" 
                    name="password"
                    value={password}
                    onChange={e => onChange(e)} 
                    required
                >
                </input>
                <button type="submit" onClick={handleClick}>Submit</button>
            </form>
        </div>
        
    );
    
}

export default Login; 