import AppDispatcher from '../Dispatcher/AppDispatcher';

const ObjectActions = {
  playerAttack(player, enemy) {
    AppDispatcher.handleObjectAction({
      actionType: 'PLAYER_ATTACK',
      data: {
        player: player,
        enemy: enemy,
      },
    });
  },

  playerDodge(player) {
    AppDispatcher.handleObjectAction({
      actionType: 'PLAYER_DODGE',
      data: player,
    });
  },

  playerBlock(player, bool) {
    AppDispatcher.handleObjectAction({
      actionType: bool ? 'PLAYER_BLOCK' : 'PLAYER_UNBLOCK',
      data: player,
    });
  },
};

module.exports = ObjectActions;
