var AppDispatcher = require('../Dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');

// Add data + functions here

// Array grid to have easy collision detection
// grid: this._makeArray(sizeX, sizeY),

var GridStore = merge(EventEmitter.prototype, {
  // Put getters in here
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
  GridStore.emit('change');

  return true; // No errors.  Needed by promise in Dispatcher.
})

module.exports = GridStore;
