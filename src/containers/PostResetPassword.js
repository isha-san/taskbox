import NavBar from '../components/NavBar.js';

function PostResetPassword() {
    fetch('/resetPassword')

return (
    <div> 
    <h1>Change your password below:</h1>
    <form role="form" method="POST">
        <div class="form-group">
            <label for="password">Password</label>
            <input type="password" class="form-control" id="password" name="password" placeholder="New password" required autocomplete="off">
            <input type="password" class="form-control" id="password2" name="password2" placeholder="Confirm new password" required autocomplete="off">
        </div>
        <button type="submit" class="btn btn-default" onsubmit="PostResetPassword()">Submit</button>
    </form>
    </div>
    );
}
export default PostResetPassword; 