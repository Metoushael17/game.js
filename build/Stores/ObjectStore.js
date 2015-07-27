var AppDispatcher = require('../Dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');

// Add data + functions here

var objectMap = {};

var ObjectStore = merge(EventEmitter.prototype, {
  getObject: function(id) {
    if(!objectMap[id]) {
      throw "Requested obj doesn't exist for id: " + id;
    }
    return objectMap[id];
  },

  addObjet: function(obj) {
    var id = Date.now();
    if(!!objectMap[id]) {
      throw "trying to add two objects with same id: " + id + " obj: "+ JSON.stringify(obj) + " current object: " + JSON.stringify(objectMap[id]);
    }
    objectMap[id] = obj;

    return id;
  },
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
  ObjectStore.emit('change');

  return true; // No errors.  Needed by promise in Dispatcher.
})

module.exports = ObjectStore;
