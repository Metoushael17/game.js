var AppDispatcher = require('../Dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');

/**
 * The ViewStore will contain all the data that will be shared among
 * everything contained inside the View. For example:
 * - moveArray
 * - attackArray
 * - fogOfWar
 * - selectedShip
 * - selectedWeapon
 */

// Add data + functions here
var moveArray = [];
var attackArray = [];
var fogOfWar = [];
var selectedShip = null;
var selectedWeapon = null;

var isLoaded = false;

var ViewStore = merge(EventEmitter.prototype, {
  /**
   * Compute the arrays lazily. We only compute them on demand.
   *
   * @return {Array} an array containing the x,y positions that should be
   *                    colored in the move color (and which correspond
   *                    to a move action)
   */
  getMoveArray: function() {
    return moveArray;
  },

  getAttackArray: function() {
    return attackArray;
  },

  getradarArray: function() {
    return fogOfWar;
  },

  getSelectedShip: function() {
    return selectedShip;
  },

  getSelectedWeapon: function() {
    return selectedWeapon;
  },

  getLoadedState: function() {
    return isLoaded;
  }
});

// Register to handle all updates
AppDispatcher.register(function(payload) {
  var action = payload.action;
  var text;

  switch(action.actionType) {
    case 'RANDOM_ACTION':
      break;
  }

  // This often goes in each case that should trigger a UI change.
  // This store needs to trigger a UI change after every view action,
  // so we can dry up the code a bit by putting it here.
  ViewStore.emit('change');

  return true; // No errors.  Needed by promise in Dispatcher.
})

module.exports = ViewStore;
