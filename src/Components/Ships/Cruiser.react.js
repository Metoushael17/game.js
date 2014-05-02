/** @jsx React.DOM */

"use strict";
var React = require("react");

var CruiserStyle = {
  left: 0,
  top: 0,
  backgroundImage: "",
  opacity: 0.0,
  width: 0,
  height: 0,
  WebkitTransform: "",
  MozTransform: "",
  OTransform: "",
  MsTransform: "",
  transform: "",
  transformOrigin: "",
  MsTransformOrigin: "",
  WebkitTransformOrigin: ""
}

var ReactCruiser = React.createClass({
  getInitialState: function() {
    return {
      frameNumber: 0
    };
  },

  render: function() {
    var CruiserProperties = this.props.properties;
    var cellSize = this.props.cellSize,
        size = CruiserProperties.size,
        height = size * cellSize;

    var top = cellSize * CruiserProperties.y,
        left = cellSize * CruiserProperties.x,
        // The default is south, so the angle is 0
        angle = 0;

    if(CruiserProperties.direction === "north") {
      angle = 180;
    } else if(CruiserProperties.direction === "east") {
      angle = -90;
    } else if(CruiserProperties.direction === "west") {
      angle = 90;
    }

    // if(!!CruiserProperties.__superSecretAngle__) {
    //   angle = CruiserProperties.__superSecretAngle__;
    // }
    //
    CruiserStyle.left = left - 1;
    CruiserStyle.top = top;
    CruiserStyle.backgroundImage = CruiserProperties.alliance === "ally" && !this.props.selected ? "url('./resources/img/cruiser_blue.png')" : "url('./resources/img/cruiser_red.png')";
    CruiserStyle.opacity = CruiserProperties.speed === 0 ? 0.5 : 1;
    CruiserStyle.width = cellSize + 2;
    CruiserStyle.height = height;
    CruiserStyle.WebkitTransform = "rotate(" + angle + "deg)";
    CruiserStyle.MozTransform = "rotate(" + angle + "deg)";
    CruiserStyle.OTransform = "rotate(" + angle + "deg)";
    CruiserStyle.MsTransform = "rotate(" + angle + "deg)";
    CruiserStyle.transform = "rotate(" + angle + "deg)";
    CruiserStyle.transformOrigin = "50% " + 50/size + "%";
    CruiserStyle.MsTransformOrigin = "50% " + 50/size + "%";
    CruiserStyle.WebkitTransformOrigin = "50% " + 50/size + "%";

    var array = [<div className="cruiser ship object" style={CruiserStyle} onMouseEnter={this.onHover} onMouseLeave={this.onHover} key={CruiserProperties.__id__}>
      </div>];

    var topRelative = 0;
    var leftRelative = 0;

    //array.push(<div className="rotate_left" style={RotateStyleLeft} onMouseEnter={this.rotateLeftHover} onMouseLeave={this.rotateLeftLeave} onClick={this.props.rotateLeftOnClick}></div>);
    //array.push(<div className="rotate_right" style={RotateStyleRight} onMouseEnter={this.rotateRightHover} onMouseLeave={this.rotateRightLeave} onClick={this.props.rotateRightOnClick}></div>);
    if(CruiserProperties.speed !== 0) {
      array = array.concat(CruiserProperties.damaged.map(function (dam, i) {

        //Determine the damage in comparison to the base position of the boat.
        var damage = 0;
        if(dam.y === 0) {
          damage = dam.x;
        } else {
          damage = dam.y;
        }

        switch(CruiserProperties.direction) {
          case "south":
            topRelative = (CruiserProperties.y + damage);
            leftRelative = CruiserProperties.x;
            break;
          case "north":
            topRelative = (CruiserProperties.y - damage);
            leftRelative = CruiserProperties.x;
            break;
          case "east":
            topRelative = CruiserProperties.y;
            leftRelative = (CruiserProperties.x + damage) ;
            break;
          case "west":
            topRelative = CruiserProperties.y;
            leftRelative = (CruiserProperties.x - damage) ;
            break;
        }

        var DamagedStyle = {
          top: topRelative * cellSize - 3,
          left: leftRelative * cellSize,
          backgroundImage: dam.hit >= CruiserProperties.armour ? "url('./resources/img/Fire_"+this.state.frameNumber+".png')" : "url('./resources/img/Smoke_"+this.state.frameNumber+".png')",
          width: cellSize,
          height: cellSize
        }
        return <div className="damageBoat" style={DamagedStyle} key={"damage_" + CruiserProperties.__id__ + i}/>
      }.bind(this)));
    }

    // if(array.length > 1 && !animation) {
    //   animation = setInterval(function(){
    //     this.setState({
    //       frameNumber: ++this.state.frameNumber % 4
    //     });
    //   }.bind(this), 300);
    // }

    // var rotate_right = {
    //   position: "absolute",
    //   left: left,
    //   top: top,
    //   width: "30px",
    //   float: "right",
    //   marginRight: "-30px",
    // };

    // var rotate_left = {
    //   position: "absolute",
    //   left: left,
    //   top: top,
    //   width: "30px",
    //   float: "left",
    //   marginLeft: "-30px",
    //   MozTransform: "scaleX(-1)",
    //   OTransform: "scaleX(-1)",
    //   WebkitTransform: "scaleX(-1)",
    //   transform: "scaleX(-1)",
    //   zIndex: 10
    // };
    // <img src="https://cdn1.iconfinder.com/data/icons/defaulticon/icons/png/256x256/redo.png" style={rotate_left} />
      // <img src="https://cdn1.iconfinder.com/data/icons/defaulticon/icons/png/256x256/redo.png" style={rotate_right} />
      //console.log('RotateStyleLeft: ' + RotateStyleLeft.transform);
    return (<div>{array}</div>);
  }
});

module.exports = ReactCruiser;

