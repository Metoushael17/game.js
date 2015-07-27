/** @jsx React.DOM */

"use strict";
var React = require("react");

var Loader = React.createClass({displayName: 'Loader',
  getInitialState: function() {
    return {
    };
  },

  componentWillMount: function(){
  },

  onResize: function() {
  },

  componentDidMount: function() {

  },

  render: function() {
    var width = this.props.width;
    var height = this.props.height;

    var loaderStyle = {
      width: width,
      height: height
    };

    return (
      React.DOM.div( {id:"loader", style:loaderStyle} 
      )
    );
  }
});


module.exports = Loader;
