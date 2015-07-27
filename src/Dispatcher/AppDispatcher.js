/**
 *
 * AppDispatcher
 *
 * A singleton that operates as the central hub for application updates.
 */

var Dispatcher = require('./Dispatcher');

var merge = require('react/lib/merge');

var AppDispatcher = merge(Dispatcher.prototype, {
  handleObjectAction: function(action) {
    this.dispatch({
      source: 'OBJECT_ACTION',
      action: action
    });
  },

  handleAnimationAction: function(action) {
    this.dispatch({
      source: 'ANIMATION_ACTION',
      action: action
    });
  },

  handleMessageAction: function(action) {
    this.dispatch({
      source: 'MESSAGE_ACTION',
      action: action
    });
  },

  /**
   * Function called when a socket action comes in. Different from grid
   * action just to avoid inconsistencies later.
   *
   * @param  {Object} action The data coming from the view
   */
  handleSocketAction: function(action) {
    this.dispatch({
      source: 'SOCKET_ACTION',
      action: action
    });
  }
});

module.exports = AppDispatcher;
