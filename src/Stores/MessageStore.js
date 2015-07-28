import AppDispatcher from 'Dispatcher/AppDispatcher';
import {EventEmitter} from 'events';
import merge from 'react/lib/merge';

let messages = [];

const MessageStore = merge(EventEmitter.prototype, {
  getMessages() {
    return messages;
  },
});

function _addMessage(msg) {
  messages.push({
    timeStamp: Date.now(),
    message: msg,
  });
}

AppDispatcher.register((payload) => {
  if (payload.source !== 'MESSAGE_ACTION' && payload.source !== 'OBJECT_ACTION') {
    return true;
  }

  const action = payload.action;
  const data = action.data;

  switch (action.actionType) {
    case 'NEW_MESSAGE':
      _addMessage(data);
      break;
    default:
      break;
  }

  MessageStore.emit('change');
  return true;
});

module.exports = MessageStore;
