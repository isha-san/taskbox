//Codepen that I reference often: https://codepen.io/shayli/pen/oNzjJjP?editors=0111
import { render } from '@testing-library/react';
import React, {Component} from 'react';
import './App.css';

class Chunk extends React.Component {
    constructor(props){
      super(props);
      this.onTextChangeHelper = this.onTextChangeHelper.bind(this);
      this.onSubTextChangeHelper = this.onSubTextChangeHelper.bind(this);
      this.onSubDeleteHelper = this.onSubDeleteHelper.bind(this);
      this.isEventPresent = this.isEventPresent.bind(this);
      this.onSubCheckOffHelper.bind(this);

      this.state = {
        calendarEvents: this.props.calendarEvents, 
        isEventPresent: false
      };
      
    };
    componentDidMount() {
      this.setState({
        isEventPresent: this.isEventPresent()
      });
    }
    // is there a GCal event present at a given timeslot
    isEventPresent = () => {
      var GCal = this.props.GCal;
      var index = this.props.time;
      for (var i = 0; i < GCal.length; i++){
        if (GCal[i][0] <= index && index < GCal[i][1]){
          return true;
        }
      }
      return false;
    }
    
    // all of these function calls are basically just: I pass in a function from Grid as a prop, and then I call those functions in Grid from Chunk to update the state in Grid.

    onTextChangeHelper(e) {
      this.props.onTextChange(e.target.value, this.props.time);
    }
    
    onSubTextChangeHelper(subIndex, e) {
      this.props.onSubTextChange(e.target.value, this.props.time, subIndex);
    }
    
    onSubDeleteHelper(subIndex){
      this.props.onSubDelete(this.props.time, subIndex);
    }
    
    onSubCheckOffHelper(subIndex){
      this.props.onSubCheckOff(this.props.time, subIndex);
    }
    
    /*showSubtasks = (ind, numOfSubtasks) => {
      this.props.onFocusChangeState(ind);*/
      
      /*var subtaskListObj = document.getElementsByClassName("subtask-list")[ind];
      
      var height = 30;
      var maxHeight = numOfSubtasks * 30;
      var id = setInterval(frame, 5);
      
      function frame() {
          if (height == maxHeight) {
            clearInterval(id);
          } else {
            height++;
            subtaskListObj.style.height = height + "px";
          }
        }
      }*/
    
     getRow = (num) => {
        if (num % 2 == 1)
          {
            num = num - 1;
          }
        num = num / 2;
        return num;
      }
      
    render() {
      let isFocusOn = false;
      if(this.props.time == this.props.focusNum[1])
      {
        isFocusOn = true;
      };
      let isFocusGone = false;
      if(this.props.time == this.props.focusNum[0])
        {
          isFocusGone = true;
        }
      
      let sameRowFocus = false;
      
      if (this.getRow(this.props.focusNum[0]) == this.getRow(this.props.focusNum[1]))
        {
          sameRowFocus = true;
        }
      
        // Generate subtasks. Feature present in Codepen, but not in this implementation.
        
      //let subtaskList; 
      /*if (this.props.subtasks) {
        subtaskList = this.props.subtasks.map((task, index) => 
        <>
          <div className="subtask--container" onClick={() => this.onSubCheckOffHelper(index)}>
            <div className={task.checked ? "subtask--checkbox filled" : "subtask--checkbox empty"}></div>
          </div>
          <span className={"subtask--wrapper" + (isFocusOn && this.props.focusNum[1] != this.props.focusNum[0] ? " expand-it" : "") + (isFocusGone && !sameRowFocus ? " shrink-it" : "")}>
            <input className="subtask--title" type="text" value={task.title} onChange={(e) => this.onSubTextChangeHelper(index, e)}/>
            {index < this.props.subtasks.length - 1 && <div className="subtask--edit noselect" onClick={() => this.onSubDeleteHelper(index)}>X</div>}
          </span>    
            </>);
      }
      else {subtaskList = null}; 
      */
       
      return (
      <>
        <div style={{display: ((this.props.time) >= this.props.dayDuration[0] && (this.props.time) < this.props.dayDuration[1]) ? "block" : "none"}}>
        </div>

        <div style={{display: ((this.props.time) >= this.props.dayDuration[0] && (this.props.time) < this.props.dayDuration[1]) ? "block" : "none"}}>
          <span className="task--wrapper">
          <input className={"task--title " + (this.props.checked ? "locked-title" : "highlight shown-title")} type="text" value={this.props.text} onChange={this.onTextChangeHelper} /*onClick={() => this.showSubtasks(this.props.time, this.props.subtasks.length)}*/ disabled={this.props.checked} style={{backgroundColor: isFocusOn ? "var(--light-color)" : "white", backgroundColor: this.isEventPresent() ? "gray" : ""}}/>
            <div className={this.props.checked ? "mid-lock" : "color-line"} style={{backgroundColor: this.props.colorTagsList[this.props.color].hexcode}}></div>
            <div className = {"circlebox " + (this.props.checked ? "task--lockbox" : "task--checkbox")} onClick = {() => this.props.checkTask(this.props.time)} style = {{backgroundColor:this.props.checked ? this.props.colorTagsList[this.props.color].hexcode : "white", visibility: isFocusOn ? "visible" : "hidden"}}></div>
          </span>
          
          <div className="subtask-list">
            {((!this.props.checked) && (isFocusOn || isFocusGone)) }
          </div>
        </div>
      </>
      );
    }
}
  export default Chunk; 
