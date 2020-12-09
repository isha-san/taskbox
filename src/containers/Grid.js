import Chunk from './Chunk.js';
import React, {Component, useEffect} from 'react';
import Actionmenu from './ActionMenu.js';
import Colorlist from './ColorList.js';
import Colorprompt from './ColorPrompt.js'
import './App.css';
import { post } from 'jquery';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/calendar.readonly";
var CLIENT_ID = '10850774893-34a5778a4t7is6pkmqm6n6dpvuv9g77u.apps.googleusercontent.com';
var API_KEY = 'AIzaSyBKe62PdVD_AFoFugnc4cX7umBvygSWk8w';
function increment(num) {
  if (num < 10) {
    return num.toString() + '0';
  }
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
      
      this.state = {
        taskList: props.initList,
        events: [], 
        focusNum: [-1, -1],
        calendarId: 'ishamsangani@gmail.com',
        dayDuration: [12, 46],
        colorTagsList: props.initColors
      };
    } 
    //how to get the grid to update without user actions? / when the grid displays for the first time? 
    componentDidMount() {
      this.updateGrid(); 
      if (this.state.calendarId != '') {
        this.getEvents(); 
      }
    }
    
    //Uses GCal API to pull calendar events into grid
    getEvents() {
      let that = this;
      function initClient() {
        gapi.client.init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: DISCOVERY_DOCS,
          scope: SCOPES
        })
      function handleClientLoad() {
        gapi.load('client:auth2', initClient);
      } 
      function start() {
        handleClientLoad().then(function() {
          return gapi.client.request({
            'path': `https://www.googleapis.com/calendar/v3/calendars/${this.state.calendarId}/events`
          })
        }).then ((response => {
            let events = response.results.items;
            console.log(events);
            //need to fix setState
            //that.setState({events});
            //console.log(that.state.events);
        }))
      }
      gapi.load('client', start);
    }
  }
    //Sets API key when user puts their calendar ID in the input box
    setCalendarId() {
      window.addEventListener('DOMContentLoaded', function() {
        let box = document.getElementById('calendar-id');
        box.addEventListener('submit', function() {
          this.state.calendarId = box.value;
          this.getEvents(); 
        });
      });
    }

    //Updates grid with tasks already in database
    updateGrid() {      
      fetch('/tasks', {method: "GET"})
      .then(response =>response.json())
      .then(v => {
        if (v.title === null) {
          return; 
        }
        for (let i = 0; i < 48; i++) {
          for (const key in v){
            console.log(`key: ${key}`);
            const value = v[key];
            //console.log(value);
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
      const today = new Date(); 
      //YYYY-MM-DD
      const month = increment(today.getMonth() + 1); 
      const date = increment(today.getDate() + 1); 
      const year = today.getFullYear().toString(); 
      const myDate = `${year}-${month}-${date}`
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
    
    shiftForward() {
      let taskList = this.state.taskList;
      taskList.unshift({checked: false, color: 0, title:"", subtasks: [{checked:false, title:""}]});
      //TODO: take care of end stuff
      taskList.splice(48, 1);
      this.setState({taskList:taskList});
      fetch("/shiftTasks");
      this.updateGrid(); 
    }
    
    onFocusChangeState(ind) {
      let focusNum = this.state.focusNum;
      focusNum.shift();
      focusNum.push(ind);
      this.setState({focusNum:focusNum});
    }
    
    carryOver() {
      let taskList = this.state.taskList;
      let toBePushed = this.state.focusNum;
      
      console.log(taskList[toBePushed].text);
      
      if (taskList[toBePushed].text == ""){
        return;
      }
      
      if (taskList[toBePushed + 1].text == ""){
        taskList[toBePushed + 1].text = taskList[toBePushed].text;
      }
      else {
        taskList[toBePushed + 1].subtasks.unshift({checked:false, title:taskList[toBePushed].text});
      }
      
      //document.getElementsByClassName("task--title")[this.state.focus + 1].focus();
      //TODO take care of subtasks
      
      taskList[toBePushed].text = "";
      
      this.setState({focusNum:this.state.focusNum+1});
      this.setState({taskList:taskList});
      
      // the subtasks should remain open
      
      /*
      if (taskList[toBePushed].subtasks.length > 1){
        taskList[toBePushed - 1].subtasks.concat(taskList[toBePushed].subtasks);
      }
      */
    }
     
    /*for (var i = 0; i < colorSquareObjs.length; i++)
    {
      colorSquareObjs[i].addEventListener("click", function() {
        alert("hello");
    });*/
    
    changeColor(focusIndex) {
      let taskList = this.state.taskList;
      /*let t = taskList[time];
      taskList[this.state.focusNum[1]].color = focusIndex;
      const requestOptions = {
        method: 'POST', 
        body: JSON.stringify({'text': t.text, 'color': t.color, 'time': time, 'date': myDate,'checked': t.checked})
      };
      fetch("/updateTask")
        .then*/
      this.setState({taskList:taskList});
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
          if (text == 12)
           {
              dayDuration[0] = 0;
           }
          this.setState({dayDuration: dayDuration})
        }
    }
    
    updateEndHour(e) {
      let dayDuration = this.state.dayDuration;
      var text = e.target.value;
      if (1 <= text && text <= 11 || text == "")
        {
          dayDuration[1] = text * 2 + 24;
          this.setState({dayDuration: dayDuration});
        }
    }
    render() {   
      this.updateGrid();      
       const taskList = this.state.taskList.map((task, index) => 
        <>
          {(index) % 2 == 0 && <div className="grid--label" style={{display: ((index) >= this.state.dayDuration[0] && (index) < this.state.dayDuration[1]) ? "block" : "none"}}><span>{parseInt(index)/2 % 12 == 0 ? 12 : parseInt(index)/2 % 12}{((index) <= 22) ? "am" : "pm"}</span></div>}
          <Chunk
            time={index} text={task.text} checked={task.checked} color={task.color} subtasks={task.subtasks} dayDuration={this.state.dayDuration} focusNum={this.state.focusNum} colorTagsList = {this.state.colorTagsList}
            onTextChange = {this.onTextChange} onSubTextChange={this.onSubTextChange} onSubDelete={this.onSubDelete} onSubCheckOff={this.onSubCheckOff} onFocusChangeState={this.onFocusChangeState} checkTask = {this.checkTask}/>
          </>);
      
      
       return(
         <div className="app">
           
              <p>Write the tasks you intend to complete in the grid's half-hour chunks.
                If you want to shift a task over, you can press the right arrow on the left panel. 
              </p>
              <p>Want to see your Google Calendar events here as well? Follow these steps:
                1. Open your Google Calendar app.  
                2. Make ONE of the calendars public. 
                3. Find your Google Calendar ID using <a href="https://docs.simplecalendar.io/find-google-calendar-id/">this link.</a>
                Paste it into the text box below. 
              </p>
              <form>
                <input type="text" id="calendar-id" onSubmit={this.setCalendarId}/>
              </form> 
             <Actionmenu shiftForward={this.shiftForward} carryOver={this.carryOver} />
          
             <div className="sidebar" id="sidebar">
                   <Colorlist colorTagsList = {this.state.colorTagsList} focusNum = {this.state.focusNum} changeColor={this.changeColor} />
             </div>
             <Colorprompt colorTagsList = {this.state.colorTagsList} updateColorTags = {this.updateColorTags}/>
             <div className="marker start-hour"><input value={this.state.dayDuration[0] / 2 == 0 ? "" : this.state.dayDuration[0] / 2} onChange={(e) => this.updateStartHour(e)} /><div>AM</div></div>
             <div id="grid" className="grid" onClick={this.clearEmptySubtasks}>{taskList}</div>
             <div className="marker end-hour"><input value={((this.state.dayDuration[1] - 24) / 2  == 0) ? "" : ((this.state.dayDuration[1] - 24) / 2)} onChange={(e) => this.updateEndHour(e)} /><div>PM</div></div>
          </div>
       );
    }
  }

  export default Grid; 