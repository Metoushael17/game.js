var AppDispatcher = require('../Dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');

var AnimationStore = require("./AnimationStore");
AnimationStore.start();

var MessageActions = require("../Actions/MessageActions");

var styleBox = {
  top: 0,
  left: 0
}

var dagger = {
  attackSpeed: 2000,
  staminaDamage: 30,
  damage: 10,
  type: "dagger",
  name: "The Pussy Dagger"
}

var sword = {
  attackSpeed: 3000,
  staminaDamage: 50,
  damage: 50,
  type: "longsword",
  name: "LongLightSaber Sword"
}


var enemy = {
  currentAnimationTime: 0,
  attackFrequency: 6000,
  attackIntervalID: null,
  staminaIncreasing: 0,
  nextAttackTime: 0,
  health: 100,
  maxHealth: 100,
  state: "idle",
  stamina: 100,
  maxStamina: 100,
  staminaIncrease: 2000,
  equippedWeapon: sword
}

var player = {
  currentAnimationTime: 0,
  staminaIncreasing: 0,
  health: 100,
  maxHealth: 100,
  state: "idle",
  stamina: 100,
  maxStamina: 100,
  dodgeSpeed: 1,
  staminaIncrease: 2000,
  equippedWeapon: dagger
}

var timer = {
  t: 0
}

var allObjects = [];
var gameState = "";

function _getObject(id) {
  var obj = null;
  for (var i = 0; i < allObjects.length; i++) {
    if(allObjects[i].__id__ === id) {
      obj = allObjects[i];
      break;
    }
  }
  return obj;
}

function attack(attacker, attacked) {
  if(attacker.stamina < attacker.equippedWeapon.staminaDamage) {
    console.log("attacker: Can't attack because not enough stamina");
    return true;
  }

  if(attacker.state !== "idle" && attacker.state !== "blocking") {
    console.log("Can't attack because you're currently", player.state);
    return true;
  }

  attacker.state = "attacking";
  var anim = AnimationStore.createAnimation({currentAnimationTime: attacker.equippedWeapon.attackSpeed}, {currentAnimationTime: 0}, attacker, attacker.equippedWeapon.attackSpeed, function() {
    attacker.state = "idle";
    ObjectStore.emit("change");
  });

  AnimationStore.playAnimation(anim);

  attacker.stamina -= attacker.equippedWeapon.staminaDamage;

  staminaStartIncrease(attacker);

  if(attacked.state === "blocking") {
    console.log("blocked");
    return;
  }

  if(attacked.state === "dodging") {
    console.log("dodging");
    return;
  }

  if(attacked.state === "dead") {
    console.log("enemy is already dead");
    return;
  }


  attacked.health -= attacker.equippedWeapon.damage;

  if(attacked.health <= 0) {
    isDead(attacked);
  }
  ObjectStore.emit('change');
}

function isDead(guy) {
  guy.state = "dead";
}

function staminaStartIncrease(guy) {
  if(guy.staminaIncreasing) {
    AnimationStore.delete(guy.staminaIncreasing);
  }

  guy.staminaIncreasing = AnimationStore.createAnimation(timer, {t: guy.staminaIncrease}, timer, guy.staminaIncrease, function() {
      guy.staminaIncreasing = AnimationStore.createAnimation(guy, {stamina: guy.maxStamina}, guy, (guy.maxStamina - guy.stamina) / 10 * 1000);

      AnimationStore.playAnimation(guy.staminaIncreasing);
  });

  AnimationStore.playAnimation(guy.staminaIncreasing);
}

function enemyAttack(enemy, player) {
  if(player.state !== "dead" && enemy.state !== "dead") {
    attack(enemy, player);
    enemy.attackIntervalID = AnimationStore.createAnimation({nextAttackTime: enemy.attackFrequency}, {nextAttackTime: 0}, enemy, enemy.attackFrequency, function() {
      enemyAttack(enemy, player);
    });

    AnimationStore.playAnimation(enemy.attackIntervalID);
  }
}

var ObjectStore = merge(EventEmitter.prototype, {
  getGameState: function() {
    return gameState;
  },

  getPlayer: function() {
    return player;
  },

  getEnemy: function() {
    return enemy;
  },

  getStyleBox: function() {
    return styleBox;
  }
});

// Register to handle all updates
AppDispatcher.register(function(payload) {
  if(payload.source !== "OBJECT_ACTION") {
    // Return true just to tell the dispatcher that everything is fine
    return true;
  }

  var action = payload.action;
  var data = action.data;
  switch(action.actionType) {
    // case 'ON_CELL_CLICK':
    //   onCellClick(data);
    //   break;
      case 'START':
        data.enemy.attackIntervalID = AnimationStore.createAnimation({nextAttackTime: data.enemy.attackFrequency}, {nextAttackTime: 0}, data.enemy, data.enemy.attackFrequency, function() {
          enemyAttack(data.enemy, data.player);
        });

        AnimationStore.playAnimation(data.enemy.attackIntervalID);
        break;
      case 'PLAYER_ATTACK':
        attack(data.player, data.enemy);
        break;
      case 'PLAYER_DODGE':
        if(data.state !== "idle" && data.state !== "blocking") {
          console.log("Can't dodge because you're currently", player.state);
          return true;
        }
        data.state = "dodging";

        console.log("Dodging...");

        setTimeout(function() {
          data.state = "idle";
          ObjectStore.emit('change');
        }, data.dodgeSpeed);
        break;
      case 'PLAYER_BLOCK':
        if(data.state !== "idle") {
          console.log("Can't block because you're currently", data.state);
          return true;
        }
        data.state = "blocking";
        break;
      case 'PLAYER_UNBLOCK':
        if(data.state !== "blocking") {
          return true;
        }
        data.state = "idle";
        break;
  }

  // This often goes in each case that should trigger a UI change.
  // This store needs to trigger a UI change after every view action,
  // so we can dry up the code a bit by putting it here.
  ObjectStore.emit('change');

  return true; // No errors.  Needed by promise in Dispatcher.
}, "ObjectStore");

module.exports = ObjectStore;
