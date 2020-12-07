import Chunk from './Chunk.js';
import React, {Component, useEffect} from 'react';
import Actionmenu from './ActionMenu.js';
import Colorlist from './ColorList.js';
import Colorprompt from './ColorPrompt.js'
import './App.css';
import { post } from 'jquery';

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
        focusNum: [-1, -1],
        dayDuration: [12, 46],
        colorTagsList: props.initColors
      };
    }
    
    updateGrid() {
      fetch('/tasks')
      .then(response => {
        let i;
        var v = response.json();
        console.log(v)
        for (i = 0; i < 48; i++) {
          if (v.title) {
            v.array.forEach(element => {
              if (element.time === i) {
                console.log(element);
                this.state.taskList[i] = {checked: element.checked, color: 1, text: element.title};
              }
            });
          }
        }
      });
    }
    onTextChange(event, time) {
      //Adding a task
      let taskList = this.state.taskList; 
      if (taskList[time].text == '') {
        taskList[time].text = event;
        let t = taskList[time];
        const requestOptions = {
          method: 'POST', 
          body: JSON.stringify({'text': t.text, 'color': t.color, 'time': time, 'checked': t.checked})
        };
        fetch('/tasks', requestOptions); 
      }
      taskList[time].text = event;
      this.updateGrid(); 
      this.setState({taskList:taskList});
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
    }
    
    onFocusChangeState = (ind) => {
      let focusNum = this.state.focusNum;
      focusNum.shift();
      focusNum.push(ind);
      this.setState({focusNum:focusNum});
    }
    
    carryOver() {
      let taskList = this.state.taskList;
      let toBePushed = this.state.focusInd;
      
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
    
    changeColor(focusIndex)
    {
      let taskList = this.state.taskList;
      taskList[this.state.focusNum[1]].color = focusIndex;
      this.setState({taskList:taskList});
    }
    
    checkTask = (timeIndex) =>
    {
      let taskList = this.state.taskList;
      taskList[timeIndex].checked = !taskList[timeIndex].checked;
      this.setState({taskList:taskList});
    }
    
    updateColorTags = (lis) =>
    {
     this.setState({colorTagsList:lis});
    }
    
    updateStartHour = (e) =>
    {
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
    
    updateEndHour = (e) =>
    {
      let dayDuration = this.state.dayDuration;
      var text = e.target.value;
      if (1 <= text && text <= 11 || text == "")
        {
          dayDuration[1] = text * 2 + 24;
          this.setState({dayDuration: dayDuration});
        }
    }
    render(){        
       const taskList = this.state.taskList.map((task, index) => 
        <>
          {(index) % 2 == 0 && <div className="grid--label" style={{display: ((index) >= this.state.dayDuration[0] && (index) < this.state.dayDuration[1]) ? "block" : "none"}}><span>{parseInt(index)/2 % 12 == 0 ? 12 : parseInt(index)/2 % 12}{((index) <= 22) ? "am" : "pm"}</span></div>}
          <Chunk
            time={index} text={task.text} checked={task.checked} color={task.color} subtasks={task.subtasks} dayDuration={this.state.dayDuration} focusNum={this.state.focusNum} colorTagsList = {this.state.colorTagsList}
            onTextChange = {this.onTextChange} onSubTextChange={this.onSubTextChange} onSubDelete={this.onSubDelete} onSubCheckOff={this.onSubCheckOff} onFocusChangeState={this.onFocusChangeState} checkTask = {this.checkTask}/>
          </>);
        
       return(
         <div className="app">
          
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