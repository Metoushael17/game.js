/** @jsx React.DOM */

"use strict";
var React = require("react");

// View store contains all the data and logic for the View
var ViewStore = require('../Stores/ViewStore');
var ObjectStore = require('../Stores/ObjectStore');

var Loader = require("./Loader.react");

var Grid = require("./Grid.react");
console.log(Grid)
// var Toolbar = require("./Toolbar");
// var Title = require("./Title");
// var Bottom = require("./Bottom");
// var SideBar = require("./SideBar");

function getViewState() {
  return {
    moveArray: ViewStore.getMoveArray(),
    attackArray: ViewStore.getAttackArray(),
    fogOfWar: ViewStore.getMoveArray(),
    selectedShip: ViewStore.getSelectedShip(),
    selectedWeapon: ViewStore.getSelectedWeapon(),
    isLoaded: ViewStore.getLoadedState(),
    allObjects: ObjectStore.getAllObjects()
  }
}

var View = React.createClass({displayName: 'View',
  getInitialState: function() {
    return {
    };
  },

  componentWillMount: function(){
    window.onresize = this.onResize;

    this.onResize();
  },

  onResize: function() {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight
    });
  },

  componentDidMount: function() {

  },

  render: function() {
    var width = this.state.width;
    var height = this.state.height;
    // if(!this.state.isLoaded) {
    //   return <Loader width={width} height={height} />;
    // }
    var ViewStyle = {};
    var Title = React.DOM.div(null );
    var Toolbar = React.DOM.div(null );
    var SideBar = React.DOM.div(null );

    return (
      React.DOM.div( {id:"view", style:ViewStyle} , 
        Title,
        Grid(
          {width:width,
          height:height,
          moveArray:this.state.moveArray,
          attackArray:this.state.attackArray,
          fogOfWar:this.state.fogOfWar,
          allObjects:this.state.allObjects}
        ),
        Toolbar,
        SideBar
      )
    );
  },

  _onChange: function() {
    this.setState(getViewState());
  }
});


module.exports = View;
