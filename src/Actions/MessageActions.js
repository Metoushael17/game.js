import AppDispatcher from '../Dispatcher/AppDispatcher';

const ObjectActions = {
  sendMessage(message) {
    AppDispatcher.handleMessageAction({
      actionType: 'NEW_MESSAGE',
      data: message,
    });
  },
};

module.exports = ObjectActions;
