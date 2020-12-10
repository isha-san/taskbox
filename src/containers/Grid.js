import Chunk from './Chunk.js';
import React, {Component, useEffect} from 'react';
import Actionmenu from './ActionMenu.js';
import Colorlist from './ColorList.js';
import Colorprompt from './ColorPrompt.js'
import './App.css';
import { post } from 'jquery';

var gapi = window.gapi; 
var CLIENT_ID = '10850774893-34a5778a4t7is6pkmqm6n6dpvuv9g77u.apps.googleusercontent.com';
var API_KEY = 'AIzaSyA6XBTP57rgtoCB3VRgipfXYIAiwxakZcc'; 
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
var SCOPES = "https://www.googleapis.com/auth/calendar.readonly";
var today = new Date(); 
      //YYYY-MM-DD
      var month = increment(today.getMonth() + 1); 
      var date = increment(today.getDate() + 1); 
      var year = today.getFullYear().toString(); 
      var myDate = `${year}-${month}-${date}`
function increment(num) {
  if (num < 10) {
    return num.toString() + '0';
  }
}
function roundCalendarTime(d, s) {
  const minutes = d.getMinutes(); 
  const hours = d.getHours();  
  if (0 < minutes && minutes < 30) {
    if (s == 'start') {
      d.setMinutes(0);
    }
    else { (d.setMinutes(30)) }
  }
  else if (30 < minutes && minutes <= 59) {
    if (s == 'start') {
      d.setMinutes(30);
    }
    else { d.setMinutes(0); d.setHours(hours + 1); }
  }
  return d; 
}
function generateTimeSlot(d) {
  if (d.getMinutes() == 30) {
    return (2*d.getHours()) + 1; 
  }
  else return 2*d.getHours(); 
}
class Grid extends React.Component {
  
    constructor(props){
      super(props);
      
      this.onTextChange = this.onTextChange.bind(this);
      this.onSubTextChange = this.onSubTextChange.bind(this);
      this.onSubDelete = this.onSubDelete.bind(this);
      this.onSubCheckOff = this.onSubCheckOff.bind(this);
      this.clearEmptySubtasks = this.clearEmptySubtasks.bind(this);
      this.shiftForward = this.shiftForward.bind(this);
      this.carryOver = this.carryOver.bind(this);
      this.changeColor = this.changeColor.bind(this);
      this.getEvents = this.getEvents.bind(this);
      this.updateGrid = this.updateGrid.bind(this);
  
      this.state = {
        taskList: props.initList,
        calendarApi: false, 
        eventTimes: [[]], 
        focusNum: [-1, -1],
        dayDuration: [12, 46],
        colorTagsList: props.initColors
      };
    } 
    //how to get the grid to update without user actions? / when the grid displays for the first time? 
    componentDidMount() {
      this.updateGrid(); 
    }

    //Uses GCal API to pull calendar events into grid
    getEvents() {
      //set the APi as enabled in state
      this.state.calendarApi = true; 

      //initializes the Google API client
      gapi.load('client:auth2', () => {
        gapi.client.init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: DISCOVERY_DOCS,
          scope: SCOPES
        })
        gapi.client.load('calendar', 'v3');
        
        //Displays a pop-up for the user to sign in with Google
        gapi.auth2.getAuthInstance().signIn()
          .then(() => {
            
            var minHour = new Date(); 
            minHour.setHours(this.state.dayDuration[0]/2);
            var maxHour = new Date(); 
            maxHour.setHours(this.state.dayDuration[1]/2);

            //gets the calendar events with the API
            gapi.client.calendar.events.list({
              'calendarId': 'primary', 
              'timeMin': minHour.toISOString(), 
              'timeMax': maxHour.toISOString(),
              'singleEvents': true,
              'orderBy':'startTime'
            }).then(response =>{
              const events = response.result.items;
              events.forEach(event =>{
                let s = roundCalendarTime(new Date(event.start.dateTime), 'start');
                let e = roundCalendarTime(new Date(event.end.dateTime), 'end');
                this.state.eventTimes.push([generateTimeSlot(s), generateTimeSlot(e)]);
              })
              console.log('EVENTS: ', events);
              console.log(this.state.eventTimes);
            });
          });
      });
    }

    //Updates grid with tasks from backend
    updateGrid() {  
      fetch('/tasks', {method: "GET"})
      .then(response =>response.json())
      .then(v => {
        if (v.title === null) {
          return; 
        }
        for (let i = 0; i < 48; i++) {
          for (const key in v){
            const value = v[key];
            if (key != '-1' && value.time === i) {
              console.log("value reached");
              this.state.taskList[i] = {'checked': value.checked, 'color': value.color, 'text': value.title};
            }
          }
        }
        console.log(this.state.taskList);
      });
    }
    
    onTextChange(event, time) {
      //Adding text for a new task
      let taskList = this.state.taskList;
      let t = taskList[time];
      if (taskList[time].text == '') {
        t.text = event; 
        const requestOptions = {
          method: 'POST', 
          body: JSON.stringify({'text': t.text, 'color': 1, 'time': time, 'checked': false})
        };
        fetch('/tasks', requestOptions); 
      }
      //Editing an existing task's text
      else if (taskList[time].text != '' && event != "") {
        t.text = event; 
        const requestOptions = {
          method: 'POST', 
          body: JSON.stringify({'text': t.text, 'color': t.color, 'time': time, 'date': myDate,'checked': t.checked})
        };
        fetch('/updateTask', requestOptions); 
      }
      //Deleting an existing task's text
      else {
        if (event == "") {
          t.text = event; 
          const requestOptions = {
            method: 'POST', 
            body: JSON.stringify({'time': time, 'date': myDate})
          };
          fetch('/deleteTask', requestOptions);
        }
      }
      this.setState({taskList:taskList});
      this.updateGrid(); 
    }
    
    onSubTextChange(event, time, subIndex) {
      let taskList = this.state.taskList;
      taskList[time].subtasks[subIndex].title = event;
      if(subIndex == taskList[time].subtasks.length - 1){
        taskList[time].subtasks.push({checked:false, title:""});
      }
      this.setState({taskList:taskList});
    }
    
    onSubDelete(time, subIndex) {
      let taskList = this.state.taskList;
      taskList[time].subtasks.splice(subIndex, 1);
      this.setState({taskList:taskList});
    }
    
    onSubCheckOff(time, subIndex) {
      let taskList = this.state.taskList;
      taskList[time].subtasks[subIndex].checked = !taskList[time].subtasks[subIndex].checked;
      this.setState({taskList:taskList})
    }
    
    clearEmptySubtasks() {
      let taskList = this.state.taskList;
      let taskListLength = taskList.length;
      /*for(var i = 0; i < taskListLength; i++){
        let subtaskList = taskList[i].subtasks;
        let subtaskListLength = subtaskList.length;
        for(var j = 0; j < subtaskListLength - 1; j++){
          if(subtaskList[j].title == ""){
            taskList[i].subtasks.splice(j, 1);
          }
        }
      }*/
      this.setState({taskList:taskList});
    }
      
    onFocusChangeState(ind) {
      let focusNum = this.state.focusNum;
      focusNum.shift();
      focusNum.push(ind);
      this.setState({focusNum:focusNum});
    }
    
   shiftForward = () => {
    let taskList = this.state.taskList;
    let lastItem = taskList[47];
    taskList.unshift({checked: false, color: 0, text:"", subtasks: [{checked:false, title:""}]});
    taskList[0] = lastItem;
    this.setState({taskList:taskList});
  }
    shiftBackwards = () => {
    let taskList = this.state.taskList;
    let firstItem = taskList[0];
    taskList.shift();
    taskList[-1] = firstItem;
    this.setState({taskList:taskList});
  }
    
    carryOver = () => {
    let taskList = this.state.taskList;
    let f = this.state.focusNum[1];
    if(f === 47){
      if((taskList[0].text !== "") && (taskList[47].text !== "")){
        taskList[0].text = taskList[0].text + "," + taskList[47].text;
        taskList[47].text = "";
      } else if(taskList[47].text !== ""){
        taskList[0].text = taskList[47].text;
        taskList[47].text = "";
      }
    } else {
      if((taskList[f + 1].text !== "") && (taskList[f].text!== "")){
        taskList[f + 1].text = taskList[f + 1].text + ", " + taskList[f].text;
        taskList[f].text = "";
      } else if(taskList[f].text !== ""){
        taskList[f + 1].text = taskList[f].text;
        taskList[f].text = "";
      }
    }
    this.setState({taskList:taskList});
   }
      
    changeColor(focusIndex) {
      let taskList = this.state.taskList;
      taskList[this.state.focusNum[1]].color = focusIndex;
      this.setState({taskList:taskList});
      /*if (t.text != '') {
        t.color = focusIndex;
        const requestOptions = {
          method: 'POST', 
          body: JSON.stringify({'text': t.text, 'color': focusIndex, 'time': t.time, 'date': t.date,'checked': t.checked})
        };
        fetch("/updateTask", requestOptions); 
        this.setState({taskList:taskList});
      }*/
      
    }
    
    checkTask(timeIndex) {
      let taskList = this.state.taskList;
      taskList[timeIndex].checked = !taskList[timeIndex].checked;
      this.setState({taskList:taskList});
    }
    
    updateColorTags(lis) {
     this.setState({colorTagsList:lis});
    }
    
    updateStartHour(e) {
      let dayDuration = this.state.dayDuration;
      var text = e.target.value;
      if (1 <= text && text <= 12 || text == "")
        {
          dayDuration[0] = text * 2;
          this.setState({dayDuration: dayDuration})
        }
    }
    
    updateEndHour(e) {
      let dayDuration = this.state.dayDuration;
      var text = e.target.value;
      if (1 <= text && text <= 12 || text == "")
        {
          dayDuration[1] = text * 2 + 24;
          this.setState({dayDuration: dayDuration});
        }
    }
    render() {   
      this.updateGrid();      
       const taskList = this.state.taskList.map((task, index) => 
        <>{(index) % 2 == 0 && <div className="grid--label" style={{display: ((index) >= this.state.dayDuration[0] && (index) < this.state.dayDuration[1]) ? "block" : "none"}}><span>{parseInt(index)/2 % 12 == 0 ? 12 : parseInt(index)/2 % 12}{((index) <= 22) ? "am" : "pm"}</span></div>}
          <Chunk
            GCal={this.state.eventTimes} time={index} text={task.text} checked={task.checked} color={task.color} subtasks={task.subtasks} dayDuration={this.state.dayDuration} focusNum={this.state.focusNum} colorTagsList = {this.state.colorTagsList}
            onTextChange = {this.onTextChange} onSubTextChange={this.onSubTextChange} onSubDelete={this.onSubDelete} onSubCheckOff={this.onSubCheckOff} onFocusChangeState={this.onFocusChangeState} checkTask = {this.checkTask}/>
          </>);
            
       return(
         /*<div className="sidebar" id="sidebar">
                   <Colorlist colorTagsList = {this.state.colorTagsList} focusNum = {this.state.focusNum} changeColor={this.changeColor} />
             </div>*/
         <div className="app">
              <button onClick={this.getEvents}>Add events from Google Calendar</button> 
              <p>Greyed out areas represent GCal events.</p>
             <Actionmenu shiftForward={this.shiftForward} carryOver={this.carryOver} />
          
             <Colorprompt colorTagsList = {this.state.colorTagsList} updateColorTags = {this.updateColorTags}/>
             <div className="marker start-hour"><input value={this.state.dayDuration[0] / 2 == 0 ? "" : this.state.dayDuration[0] / 2} onChange={(e) => this.updateStartHour(e)} /><div>{this.state.dayDuration[0] === 12 ? "PM" : "AM"}</div></div>
             <div id="grid" className="grid" onClick={this.clearEmptySubtasks}>{taskList}</div>
             <div className="marker end-hour"><input value={((this.state.dayDuration[1] - 24) / 2  == 0) ? "" : ((this.state.dayDuration[1] - 24) / 2)} onChange={(e) => this.updateEndHour(e)} /><div>{this.state.dayDuration[1] === 12 ? "AM" : "PM"}</div></div>
          </div>
       );
    }
  }

  export default Grid; 
