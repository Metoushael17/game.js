var AppDispatcher = require('../Dispatcher/AppDispatcher');

var objectPool = (function () {
  var objectPool = [];
  var SIZE = 500;
  var index = 0;

  for (var i = 0; i < SIZE; i++) {
    objectPool.push({
      actionType: "",
      data: null
    });
  }

  return {
    getObject: function() {
      index = (index + 1) % SIZE;
      return objectPool[index];
    }
  }
})();

var ObjectActions = {
  // removeShip: function(s) {
  //   var packet = objectPool.getObject();
  //   packet.actionType = 'REMOVE_SHIP';
  //   packet.data = s;
  //   AppDispatcher.handleObjectAction(packet);
  // },

  start: function(player, enemy) {
    var packet = objectPool.getObject();
    packet.actionType = 'START';
    packet.data = {
      player: player,
      enemy: enemy
    }
    AppDispatcher.handleObjectAction(packet);
  },

  playerAttack: function(player, enemy) {
    var packet = objectPool.getObject();
    packet.actionType = 'PLAYER_ATTACK';
    packet.data = {
      player: player,
      enemy: enemy
    }
    AppDispatcher.handleObjectAction(packet);
  },

  playerDodge: function(player) {
    var packet = objectPool.getObject();
    packet.actionType = 'PLAYER_DODGE';
    packet.data = player;
    AppDispatcher.handleObjectAction(packet);
  },

  playerBlock: function(player, bool) {
    var packet = objectPool.getObject();

    packet.actionType = bool ? 'PLAYER_BLOCK' : 'PLAYER_UNBLOCK';
    packet.data = player;
    AppDispatcher.handleObjectAction(packet);
  }
};

module.exports = ObjectActions;
