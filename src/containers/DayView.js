import NavBar from '../components/NavBar.js';
import {useState, useEffect} from 'react';
import { Redirect } from 'react-router-dom';
import ReactDOM from 'react-dom';
import Grid from '../containers/Grid.js';
import './App.css';

const DayView = () => {
    const [auth, setAuth] = useState(true);
    useEffect(() => {
        let mounted = true;
        if (mounted) {
            fetch('/authentication')
                .then(response => response.json())
                .then(data => setAuth(data.isAuthenticated));
        }
        return function cleanup() {
            mounted = false;
        };
    });
    const colorPalette = ["#D0D4CD", "#EDDCD4", "#E9C6C9","#DDB5C1", "#BBA3A7"];
    var tagColors = [];
    for (let color of colorPalette){
      tagColors.push({hexcode:color, title:"", checked:false})
    }
    
    const data = []; 
    let i = 0; 
    for (i; i < 48; i++) {
      data.push({text: "", color: 1, checked: ""})
    }
    //TODO: Delete dummy data
    /*data[10].text = "Take out trash";
    data[10].color = 1;
    data[11].text = "Listen to music";
    data[12].text = "Do third problem";
    data[47].text = "Lovejkalsdkla";*/

    //ReactDOM.render(<DayView />, document.getElementById("root"));
    
    if (auth === false) {
        return <Redirect exact to="/login"/>;
    }
    return (
      <div class="dayview-container">
        <NavBar></NavBar>
        <Grid initList={data} initColors = {tagColors}/>
      </div>
    );
  }

export default DayView;