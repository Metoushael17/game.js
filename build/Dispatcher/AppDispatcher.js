/**
 *
 * AppDispatcher
 *
 * A singleton that operates as the central hub for application updates.
 */

var Dispatcher = require('./Dispatcher');

var merge = require('react/lib/merge');

var AppDispatcher = merge(Dispatcher.prototype, {

  /**
   * A bridge function between the views and the dispatcher, marking the
   * action as a view action.  Another variant here could be
   * handleServerAction.
   *
   * @param  {Object} action The data coming from the view.
   */
  handleGridAction: function(action) {
    this.dispatch({
      source: 'GRID_ACTION',
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
