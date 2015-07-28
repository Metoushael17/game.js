import Dispatcher from './Dispatcher';

const AppDispatcher = Object.assign(Dispatcher.prototype, {
  handleObjectAction(action) {
    this.dispatch({
      source: 'OBJECT_ACTION',
      action: action,
    });
  },

  handleAnimationAction(action) {
    this.dispatch({
      source: 'ANIMATION_ACTION',
      action: action,
    });
  },

  handleMessageAction(action) {
    this.dispatch({
      source: 'MESSAGE_ACTION',
      action: action,
    });
  },

  /**
   * Function called when a socket action comes in. Different from grid
   * action just to avoid inconsistencies later.
   *
   * @param  {Object} action The data coming from the view
   */
  handleSocketAction(action) {
    this.dispatch({
      source: 'SOCKET_ACTION',
      action: action,
    });
  },
});

module.exports = AppDispatcher;
