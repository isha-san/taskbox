function Actionmenu(props) {
    return (
      <div className="action-menu">
        <div id="shift-backward"><div>&#xab;</div></div>
        <div id="shift-forward" onClick={props.shiftForward}><div>&#187;</div></div>
        <div id="carry-over" onClick={props.carryOver}><div>&#8631;</div></div>
      </div>
    )
  }

  export default Actionmenu; 