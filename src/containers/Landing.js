import NavBar from '../components/NavBar.js';
import checkAuth from '../actions/CheckAuth.js';
import { Redirect } from 'react-router-dom'; 

function Landing() {
    if (checkAuth()) {
        return <Redirect to="/authhome"/>;
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