import NavBar from '../components/NavBar.js';

function ResetPassword() {
	fetch 

return (
    <div>
	<h1>Reset your password </h1>
	</br>
	<form role="form" method="POST">
    	<div class="form-group">
        	<label for="email">Enter your email address:</label>
        	<input type="email" class="form-control" id="email" name="email" placeholder="Email address" required autocomplete="off"> 
    	</div>
    	<button type="submit" class="btn btn-default" onsubmit="ResetPassword()">Submit</button>
	</form>
	</div>
    );
}
export default ResetPassword; 