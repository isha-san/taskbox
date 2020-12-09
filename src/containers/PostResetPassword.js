import NavBar from '../components/NavBar.js';
import {useState} from 'react';

function ResetPassword() {
	const [email, password, setPassword, setEmail] = useState(''); 
	const newPassword = () => {

        let input; 
        let inputpassword;
   
        window.addEventListener('DOMContentLoaded', function() {
            input = document.getElementById('email');
            inputpassword = document.getElementById('password'); 
            this.setEmail(input.value);
            this.setPassword(inputpassword.value);
		});
		const requestOptions = {
			method: 'POST', 
			body: {'password' : password}
		}
		fetch('/changePassword')
			.then(response => response.json())
	}
return (
	<div>
		<h1>Reset Your Password</h1>
		<form method="post">
			<div className="form-group">
            <label for='email'>Enter your email address:</label>
				<input type='email' className='form-control' id='email' placeholder='Email address' required autocomplete='off'></input>
				<label for='password'>Enter your new password:</label>
				<input type='password' className='form-control' id='password' placeholder='New password' required autocomplete='off'></input>
                
            </div>
			<button type='submit' className='btn btn-default' onSubmit={newPassword}>Submit</button>
		</form>
	</div>
    );
}
export default PostResetPassword; 