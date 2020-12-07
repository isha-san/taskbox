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
            <h1>Landing</h1>
        </div>
    );
}
export default Landing; 