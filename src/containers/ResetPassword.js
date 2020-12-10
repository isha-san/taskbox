import NavBar from '../components/NavBar.js';
import {useState} from 'react';

function ResetPassword() {
	const [email, setEmail] = useState(''); 
	const sendEmail = () => {

		//Store email user enters
		let input; 
		window.addEventListener('DOMContentLoaded', function() {
			input = document.getElementById('email'); 
			this.setEmail(input.value);
		});
		const requestOptions = {
			method: 'POST', 
			body: {'email' : email}
		}
		fetch('/resetPassword')
			.then(response => response.json())
	}
return (
	<div>
		<h1>Reset Your Password</h1>
		<form method="post">
			<div className="form-group">
				<label for='email'>Enter your email address:</label>
				<input type='email' className='form-control' id='email' placeholder='Email address' required autocomplete='off'></input>
			</div>
			<button type='submit' className='btn btn-default' onSubmit={sendEmail}>Submit</button>
		</form>
	</div>
    );
}
export default ResetPassword; 
