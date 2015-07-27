var AppDispatcher = require('../Dispatcher/AppDispatcher');

var GridActions = {

  /**
   * @param  {string} text
   */
  create: function(text) {
    AppDispatcher.handleGridAction({
      actionType: 'RANDOM_ACTION',
      text: text
    });
  }
};

module.exports = GridActions;
