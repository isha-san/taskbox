import NavBar from '../components/NavBar.js';
import {useState } from 'react';
import { Redirect } from 'react-router-dom';
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

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
    
    if (auth)
        return <Redirect to='/authhome'/>;
    return (
        <div>
      <NavBar />
      <Grid
        container
        className="top-margin"
        justify="center"
        alignItems="center"
      >
        <Grid item xs={6}>
          <Paper className="padding">
            <Typography variant="h3">Signup</Typography>
            <form id="signup-form" onSubmit={e => onSubmit(e)}>
              <Box m={3}>
                <TextField
                  className="form-control"
                  type="text"
                  name="email"
                  value={email}
                  required
                  onChange={e => onChange(e)}
                  variant="outlined"
                  label="Email"
                  fullWidth
                ></TextField>
              </Box>
              <Box m={3}>
                <TextField
                  className="form-control"
                  type="password"
                  name="password"
                  value={password}
                  required
                  onChange={e => onChange(e)}
                  variant="outlined"
                  label="Password"
                  fullWidth
                ></TextField>
              </Box>
              <Box m={3}>
                <TextField
                  className="form-control"
                  type="password"
                  name="confirmPassword"
                  value={confirmPassword}
                  required
                  onChange={e => onChange(e)}
                  variant="outlined"
                  label="Confirm Password"
                  fullWidth
                ></TextField>
              </Box>
              <Grid container justify="center">
                <Button
                  type="submit"
                  value="submit"
                  variant="contained"
                  color="primary"
                >
                  Submit
                </Button>
              </Grid>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </div>
    );
}
export default Signup; 