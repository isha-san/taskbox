import React, {Component} from 'react';
import './App.css';

class Colorprompt extends React.Component {
    constructor(props)
    {
      super(props);
      this.state = {
        colorTagsList:props.colorTagsList,
        focusList: [-1, -1]
      }
    }
    
    tagTitleChange = (e, ind) =>
    {
      //let colorPalette = ["#FCAB64", "#C32B09", "#B8D4E3", "#7FB069", "#585D89", "#98C9A3", "#CB958E"];
      let colorPalette = ["#EDEEC9", "#DDE7C7", "#BFD8BD", "#98C9A3", "#77BFA3"];
      let colorTagsList = this.state.colorTagsList;
      colorTagsList[ind].title = e.target.value;
      this.setState({colorTagsList: colorTagsList});
    }
    
    exitColorPrompt = (lis) =>
    {
      this.props.updateColorTags(lis);
      document.getElementById("color-prompt-container").style.display = "none";
    }
    
    focusChange = (ind) =>
    {
      let focusList = this.state.focusList;
      focusList.shift();
      focusList.push(ind);
      this.setState({focusList:focusList});
    }
    
    render()
    { 
      const customizeTagsList = this.state.colorTagsList.map
    ((color, index) => 
     <>
       <div className="tag-color" style={{backgroundColor:color.hexcode}}><div className="tag-checkbox"></div></div>
       <div><input className="tag-title" value={color.title} onChange={(e) => this.tagTitleChange(e, index)} onFocus={() => this.focusChange(index)} /></div>
    </>);
    return (
      <div id="color-prompt-container">
       <div className="exit-prompt" onClick={() => this.exitColorPrompt(this.state.colorTagsList)}>X</div>
       <div className="color-prompt">
       {customizeTagsList}
     </div>
       </div>
    )
      }
  }

  export default Colorprompt;
  