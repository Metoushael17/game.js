/** @jsx React.DOM */

"use strict";
var React = require("react");

var MessageStore = require("../Stores/MessageStore");
var ObjectStore = require("../Stores/ObjectStore");

function getMessageState() {
  return {
    messages: MessageStore.getMessages()
  }
}

var Message = React.createClass({
  getInitialState: function() {
    return getMessageState();
  },

  componentDidMount: function() {
    MessageStore.on("change", this._onChange);
  },

  componentWillUnount: function() {
    MessageStore.removeListener("change", this._onChange);
  },

  render: function() {
    var windowWidth = this.props.width;
    var windowHeight = this.props.height;
    var cellNumber = this.state.cellNumber;
    var cellSize = Math.round(windowHeight / cellNumber);
    var gridWidth = cellSize * cellNumber;

    var left = windowWidth/2 + gridWidth/2 + 55;
    var top = windowHeight/5 + 85;

    var messages = this.state.messages.slice(Math.max(this.state.messages.length - 6, 0), this.state.messages.length);
    var loaderStyle = {
      top: top,
      left: left,
      display: messages.length > 0 ? "block" : "none",
      width: windowWidth / 7,
      border: "4px solid #000",
      borderRadius: "5px"
    };

    var arrayOfMessages = messages.map(function(m, i) {
      return <div
        key={"message_" + i}
        className="message"
        style={{opacity:(i + 1)/messages.length}}>
        {m.message}
      </div>;
    });

    return (
      <div id="messageBox" style={loaderStyle} >
      {arrayOfMessages}
      </div>
    );
  },

  _onChange: function() {
    this.setState(getMessageState());
  }
});


module.exports = Message;
