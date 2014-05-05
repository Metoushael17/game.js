/** @jsx React.DOM */

"use strict";
var React = require("react");

var DevTools = require("./DevTools.react");
var PlayerView = require("./PlayerView.react");

var MainView = React.createClass({
  render: function() {
    return (
      <div id="main">
        <PlayerView />
        <DevTools />
      </div>
    );
  }
});


module.exports = MainView;
