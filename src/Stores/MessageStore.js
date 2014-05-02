var AppDispatcher = require('../Dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');

var messages = [];

var MessageStore = merge(EventEmitter.prototype, {
  getMessages: function() {
    return messages;
  }
});

function _addMessage(msg) {
  messages.push({
    timeStamp: Date.now(),
    message: msg
  });
}

AppDispatcher.register(function(payload) {
  if(payload.source !== "MESSAGE_ACTION" && payload.source !== "OBJECT_ACTION") {
    return true;
  }

  var action = payload.action;
  var data = action.data;

  switch(action.actionType) {
    case 'NEW_MESSAGE':
      _addMessage(data);
      break;
  }

  MessageStore.emit("change");

  return true;
});

module.exports = MessageStore;
