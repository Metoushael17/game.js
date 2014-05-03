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
    var messages = this.state.messages.slice(Math.max(this.state.messages.length - 10, 0), this.state.messages.length);
    var loaderStyle = {
      display: messages.length > 0 ? "block" : "none",
    };

    var arrayOfMessages = messages.map(function(m, i) {
      return <div
        key={"message_" + i}
        className="message"
        style={{opacity:(i + 3)/messages.length}}>
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
