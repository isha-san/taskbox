// Codepen that I reference often: https://codepen.io/shayli/pen/oNzjJjP?editors=0111
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
  
          //taskList is a list of objects; and each object is a task.
          //focusNum is a list of two items: the second item is the "id" of the input you just clicked; and the first item is the "id" of the input that you clicked BEFORE your current click.
            // aka, focusNum[1] = num-id of the input you are focusing on currently; and focusNum[0] = num-id of the input you prev focused on.
            // the num-id is an arribute of each object in the taskList, called "time". The half-hour block on-screen that represents the 12:00am - 12:30am timeslot, for example, is 0.
          //dayDuration is a list of two items: the first is the "time" of when your day starts, and the second is the "time" of when it ends
          //colorTagsList is a list of objects; and each object represents a tag (with a hexcode color & a name)
          
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
    
      //edit Subtask. Not in this implementation, but in the Codepen.
    onSubTextChange(event, time, subIndex) {
      let taskList = this.state.taskList;
      taskList[time].subtasks[subIndex].title = event;
      if(subIndex == taskList[time].subtasks.length - 1){
        taskList[time].subtasks.push({checked:false, title:""});
      }
      this.setState({taskList:taskList});
    }
    
      // delete Subtask. Not in this implementation, but in the Codepen.
    onSubDelete(time, subIndex) {
      let taskList = this.state.taskList;
      taskList[time].subtasks.splice(subIndex, 1);
      this.setState({taskList:taskList});
    }
    
      // checkoff Subtask. Not in this implementation, but in the Codepen.
    onSubCheckOff(time, subIndex) {
      let taskList = this.state.taskList;
      taskList[time].subtasks[subIndex].checked = !taskList[time].subtasks[subIndex].checked;
      this.setState({taskList:taskList})
    }
      
      // if you backspace all the info out of a subtask, it auto-deletes
      
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
      
      // push on the focusNum array the current block you are focusing on
      
    onFocusChangeState(ind) {
      let focusNum = this.state.focusNum;
      focusNum.shift();
      focusNum.push(ind);
      this.setState({focusNum:focusNum});
    }
      
      // Different Action menu buttons (may not work, but work in Codepen)
      
      // Shift all tasks forward
    
   shiftForward = () => {
    let taskList = this.state.taskList;
    let lastItem = taskList[47];
    taskList.unshift({checked: false, color: 0, text:"", subtasks: [{checked:false, title:""}]});
    taskList[0] = lastItem;
    this.setState({taskList:taskList});
  }
   
      // Shift all tasks backward
    shiftBackwards = () => {
    let taskList = this.state.taskList;
    let firstItem = taskList[0];
    taskList.shift();
    taskList[-1] = firstItem;
    this.setState({taskList:taskList});
  }
    // Carryover one task
    
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
    
    // change the color of the task. Not in this implementation, but in the Codepen.
      
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

      //check off task. Not in this implementation, but in the Codepen.
    
    checkTask(timeIndex) {
      let taskList = this.state.taskList;
      taskList[timeIndex].checked = !taskList[timeIndex].checked;
      this.setState({taskList:taskList});
    }

      //unused, for future

    updateColorTags(lis) {
     this.setState({colorTagsList:lis});
    }

      // updateEndHour and updateStartHour are functions that help you focus in on part of the grid.
      // These functions are connected to inputs.
      // Input 3AM at the start, and 9PM at the end, for example... then the grid will only show blocks between those two times.
    
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
          //mapping the array of objects in taskList to HTML Objects, calling the React component Chunk (in another file, Chunk.js) and passing in many props.
       const taskList = this.state.taskList.map((task, index) => 
                                                // this is the part where we use dayDuration to figure out if Chunk should be shown or not.
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
             // add Events from Google Calendar button
              <button onClick={this.getEvents}>Add events from Google Calendar</button> 
              <p>Greyed out areas represent GCal events.</p>\
             // calls Actionmenu component from Actionmenu.js
             <Actionmenu shiftForward={this.shiftForward} carryOver={this.carryOver} shiftBackward={this.shiftBackwards} />
          //calls Colorprompt component from Colorprompt.js
             <Colorprompt colorTagsList = {this.state.colorTagsList} updateColorTags = {this.updateColorTags}/>
             // the input where you put what time you want to start at, when focusing in. Restricted to AM times, + 12PM. Might be a little wonky in this implement, check the Codepen.
             <div className="marker start-hour"><input value={this.state.dayDuration[0] / 2 == 0 ? "" : this.state.dayDuration[0] / 2} onChange={(e) => this.updateStartHour(e)} /><div>{this.state.dayDuration[0] === 12 ? "PM" : "AM"}</div></div>
             <div id="grid" className="grid" onClick={this.clearEmptySubtasks}>{taskList}</div>
            // the input where you put what time you want to end at, when focusing in. Restricted to PM times, + 12AM. Might be a little wonky in this implement, check the Codepen for the better version.
             <div className="marker end-hour"><input value={((this.state.dayDuration[1] - 24) / 2  == 0) ? "" : ((this.state.dayDuration[1] - 24) / 2)} onChange={(e) => this.updateEndHour(e)} /><div>{this.state.dayDuration[1] === 12 ? "AM" : "PM"}</div></div>
          </div>
       );
    }
  }

  export default Grid; 
