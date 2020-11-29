import NavBar from '../components/NavBar.js';
import {useState } from 'react';
import { Redirect } from 'react-router-dom';
function Signup() {
    const [auth, setAuth] = useState(false);
    const [formData, setFormData] = useState({
        email: '', 
        password: '', 
        confirmPassword: ''
    });
    //const [auth, setAuth] = useState(false);
    const { email, password, confirmPassword } = formData; 

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
    
    const onSubmit = e => {
        e.preventDefault();
        sendForm();
    };

   //Sends a POST request to the server with the form data
    const sendForm = () => {
        const requestOptions = {
            method: 'POST',
            cache: 'no-cache',
            body: JSON.stringify(formData)
        };
        fetch('/signup', requestOptions)
            .then(response => response.json())
            .then(data => {
                setAuth(data.isAuthenticated);
            });
    };
    //console.log(checkAuth);
    if (auth)
        return <Redirect to='/authhome'/>;
    return (
        <div>
            <NavBar/>
            <h1>Nothing to see here!</h1>
            <p id="login-summary"></p>
            <form id="signup-form" onSubmit={e => onSubmit(e)} >
                <label>Email</label>
                <input 
                    className="form-control" 
                    type="text" 
                    name="email"
                    value={email}
                    required
                    onChange={e => onChange(e)}
                >
                </input>
                <label>Password</label>
                <input 
                    className="form-control" 
                    type="password" 
                    name="password"
                    value={password}
                    required
                    onChange={e => onChange(e)} 
                >
                </input>
                <label>Confirm Password</label>
                <input
                    className="form-control" 
                    type="password" 
                    name="confirmPassword"
                    value={confirmPassword}
                    required
                    onChange={e => onChange(e)} 
                >
                </input>
                <button type="submit" value="submit">Submit</button>
            </form>
        </div>
    );
}
export default Signup; 