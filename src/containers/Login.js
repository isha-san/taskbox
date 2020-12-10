import {useState, useEffect} from 'react';
import NavBar from '../components/NavBar.js';  
import { Redirect } from 'react-router-dom';
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";


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
      <NavBar />
      <Grid
        container
        className="top-margin"
        justify="center"
        alignItems="center"
      >
        <Grid item xs={6}>
          <Paper className="padding">
            <Typography variant="h3">Login</Typography>
            <form onSubmit={e => onSubmit(e)}>
              <Box m={3}>
                <TextField
                  className="form-control"
                  type="text"
                  name="email"
                  value={email}
                  onChange={e => onChange(e)}
                  required
                  variant="outlined"
                  label="Username"
                  fullWidth
                ></TextField>
              </Box>
              <Box m={3}>
                <TextField
                  className="form-control"
                  type="password"
                  name="password"
                  value={password}
                  onChange={e => onChange(e)}
                  variant="outlined"
                  label="Password"
                  required
                  fullWidth
                ></TextField>
              </Box>
              <Grid container justify="center">
                <Button
                  type="submit"
                  onClick={handleClick}
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

export default Login; 