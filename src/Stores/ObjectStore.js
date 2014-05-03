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

var hands = {
  attackSpeed: 1000,
  staminaDamage: 20,
  damage: 5,
  type: "fists",
  name: "Bare hands"
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
  staminaDamage: 70,
  damage: 50,
  type: "longsword",
  name: "LongLightSaber Sword"
}


var enemy = {
  currentAnimationTime: 0,
  attackFrequency: 4000,
  attackIntervalID: null,
  staminaIncreasing: 0,
  nextAttackTime: 0,
  health: 100,
  maxHealth: 100,
  state: "idle",
  stamina: 100,
  maxStamina: 100,
  dodgeSpeed: 2000,
  dodgeStamina: 60,
  staminaIncrease: 4000,
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
  dodgeSpeed: 2000,
  dodgeStamina: 60,
  staminaIncrease: 4000,
  equippedWeapon: dagger
}

var timer = {
  t: 0
}

// var allObjects = [];
var gameState = "";

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

// function _getObject(id) {
//   var obj = null;
//   for (var i = 0; i < allObjects.length; i++) {
//     if(allObjects[i].__id__ === id) {
//       obj = allObjects[i];
//       break;
//     }
//   }
//   return obj;
// }

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
    if(attacker.state === "dead") {
      return;
    }

    attacker.state = "idle";

    if(attacked.state === "blocking") {
      attacked.stamina -= attacker.equippedWeapon.damage * 0.7;
      if(attacked.stamina <= 0) {
        attacked.health += attacked.stamina;
        attacked.stamina = 0;
        if(attacked.health <= 0) {
          isDead(attacked);
        }
      }
      staminaStartIncrease(attacked);
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

    ObjectStore.emit("change");
  });

  AnimationStore.playAnimation(anim);

  attacker.stamina -= attacker.equippedWeapon.staminaDamage;

  staminaStartIncrease(attacker);

  ObjectStore.emit('change');
}

function isDead(guy) {
  guy.state = "dead";
  guy.health = 0;
  guy.stamina = 0;
  AnimationStore.delete(guy.staminaIncreasing);
  guy.equippedWeapon = hands;
  ObjectStore.emit("change");
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
    var time = rand(enemy.attackFrequency - 2000, enemy.attackFrequency + 2000);
    enemy.attackIntervalID = AnimationStore.createAnimation({nextAttackTime: time}, {nextAttackTime: 0}, enemy, time, function() {
      enemyAttack(enemy, player);
    });

    AnimationStore.playAnimation(enemy.attackIntervalID);
  }
}

var ObjectStore = merge(EventEmitter.prototype, {
  // getGameState: function() {
  //   return gameState;
  // },

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
        if(data.stamina < data.dodgeStamina) {
          console.log("Can't dodge, not enough stamina");
          return;
        }

        data.stamina -= data.dodgeStamina;
        data.state = "dodging";

        staminaStartIncrease(data);

        console.log("Dodging...");

        var anim = AnimationStore.createAnimation({currentAnimationTime: data.dodgeSpeed}, {currentAnimationTime: 0}, data, data.dodgeSpeed,function() {
          data.state = "idle";
          ObjectStore.emit('change');
        });
        AnimationStore.playAnimation(anim);
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
