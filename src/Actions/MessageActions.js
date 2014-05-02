var AppDispatcher = require('../Dispatcher/AppDispatcher');

var ObjectActions = {
  sendMessage: function(message) {
    AppDispatcher.handleMessageAction({
      actionType: 'NEW_MESSAGE',
      data: message
    });
  }
};

module.exports = ObjectActions;
