var AppDispatcher = require('../Dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');

var AnimationStore = require("./AnimationStore");

var MessageActions = require("../Actions/MessageActions");

var Weapons = require("../Objects/Weapons");
var Shields = require("../Objects/Shields");

var player, enemy;

function idle(guy) {
  if(guy.state === "idle") {
    AnimationStore.delete(guy.currentAnimation);
    guy.currentAnimation = AnimationStore.createAnimation({currentAnimationTime: 0}, {currentAnimationTime: 4000}, guy, guy.idleSpeed, function() {
      idle(guy);
    });
  }
}

var timer = {
  t: 0
};

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
    if(attacker.alliance === "ally") {
      MessageActions.sendMessage("attacker: Can't attack because not enough stamina");
    }
    return true;
  }

  if(attacker.state !== "idle" && attacker.state !== "blocking") {
    if(attacker.alliance === "ally") {
      MessageActions.sendMessage("Can't attack because you're currently", player.state);
    }
    return true;
  }

  attacker.state = "attacking";

  AnimationStore.delete(attacker.currentAnimation)
  attacker.currentAnimation = AnimationStore.createAnimation({currentAnimationTime: 0}, {currentAnimationTime: 4000}, attacker, attacker.equippedWeapon.attackSpeed, function() {
    if(attacker.state === "dead") {
      return;
    }
    AnimationStore.delete(attacker.staminaIncreasing)
    staminaStartIncrease(attacker);

    attacker.state = "idle";
    idle(attacker);

    if(attacked.state === "blocking") {
      attacked.stamina -= attacker.equippedWeapon.damage * (1 - attacked.equippedShield.blockRatio);
      if(attacked.stamina <= 0) {
        attacked.health += attacked.stamina;
        attacked.stamina = 0;
        if(attacked.health <= 0) {
          isDead(attacked);
        }
      }
      AnimationStore.delete(attacked.staminaIncreasing)

      var anim = AnimationStore.createAnimation({t: 0}, {t: 1000}, timer, attacked.staminaStartIncreaseSpeed, function() {
        staminaStartIncrease(attacked);
      });

      if(attacker.alliance === "ally") {
        MessageActions.sendMessage("blocked");
      }
      return;
    }

    if(attacked.state === "dodging" && attacked.currentAnimationTime < 400) {
      if(attacker.alliance === "ally") {
        MessageActions.sendMessage("dodged");
      }
      return;
    }

    if(attacked.state === "dead") {
      if(attacker.alliance === "ally") {
        MessageActions.sendMessage("enemy is already dead");
      }
      return;
    }

    attacked.health -= attacker.equippedWeapon.damage;

    if(attacked.health <= 0) {
      isDead(attacked);
    }

    ObjectStore.emit("change");
  });



  if(attacker.staminaIncreasing) {
    AnimationStore.delete(attacker.staminaIncreasing);
  }

  attacker.stamina -= attacker.equippedWeapon.staminaDamage;

  ObjectStore.emit('change');
}

function isDead(guy) {
  guy.state = "dead";
  guy.health = 0;
  guy.stamina = 0;
  AnimationStore.delete(guy.staminaIncreasing);
  if(guy.attackIntervalID) {
    AnimationStore.delete(guy.attackIntervalID);
  }
  guy.equippedWeapon = Weapons.hands;
  ObjectStore.emit("change");
}

function staminaStartIncrease(guy) {
  guy.staminaIncreasing = AnimationStore.createAnimation(guy, {stamina: guy.maxStamina}, guy, (guy.maxStamina - guy.stamina) / guy.maxStamina * guy.staminaIncreaseSpeed);

}

function enemyAttack(enemy, player) {
  if(player.state !== "dead" && enemy.state !== "dead") {
    attack(enemy, player);
    var time = rand(enemy.attackFrequency - enemy.attackFrequency * 0.2, enemy.attackFrequency + enemy.attackFrequency * 0.2);
    AnimationStore.delete(enemy.attackIntervalID)
    enemy.attackIntervalID = AnimationStore.createAnimation({nextAttackTime: time}, {nextAttackTime: 0}, enemy, time, function() {
      enemyAttack(enemy, player);
    });

  }
}

var ObjectStore = merge(EventEmitter.prototype, {
  load: function(guy) {
    if(guy.alliance === "ally") {
      player = guy;
      idle(player);
    } else if(guy.alliance === "enemy") {
      enemy = guy;
      enemy.attackIntervalID = AnimationStore.createAnimation({nextAttackTime: enemy.attackFrequency}, {nextAttackTime: 0}, enemy, enemy.attackFrequency, function() {
        enemyAttack(enemy, player);
      });

    }
  },

  getPlayer: function() {
    return player;
  },

  getEnemy: function() {
    return enemy;
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
      case 'PLAYER_ATTACK':
        attack(data.player, data.enemy);
        break;
      case 'PLAYER_DODGE':
        if(data.state !== "idle" && data.state !== "blocking") {
          if(data.alliance === "ally") {
            MessageActions.sendMessage("Can't dodge because you're currently", player.state);
          }
          return true;
        }
        if(data.stamina < data.dodgeStamina) {
          if(data.alliance === "ally") {
            MessageActions.sendMessage("Can't dodge, not enough stamina");
          }
          return;
        }

        data.stamina -= data.dodgeStamina;
        data.state = "dodging";

        if(data.alliance === "ally") {
          MessageActions.sendMessage("Dodging...");
        }

        AnimationStore.delete(data.currentAnimation)
        data.currentAnimation = AnimationStore.createAnimation({currentAnimationTime: 0}, {currentAnimationTime: 4000}, data, data.dodgeSpeed,function() {
          if(data.state === "dead") {
            isDead(data);
            return;
          }
          staminaStartIncrease(data);
          data.state = "idle";
          ObjectStore.emit('change');
        });

        if(data.staminaIncreasing) {
          AnimationStore.delete(data.staminaIncreasing);
        }
        break;
      case 'PLAYER_BLOCK':
        if(data.state !== "idle") {
          if(data.alliance === "ally") {
            MessageActions.sendMessage("Can't block because you're currently", data.state);
          }
          return true;
        }
        data.state = "blocking";

        AnimationStore.delete(data.currentAnimation)
        data.currentAnimation = AnimationStore.createAnimation({currentAnimationTime: 0}, {currentAnimationTime: 4000}, player, data.equippedShield.blockingSpeed);

        break;
      case 'PLAYER_UNBLOCK':
        if(data.state !== "blocking") {
          return true;
        }

        AnimationStore.delete(data.currentAnimation)
        data.currentAnimation = AnimationStore.createAnimation(player, {currentAnimationTime: 0}, player, player.currentAnimationTime / 4000 * data.equippedShield.blockingSpeed, function() {
          data.state = "idle";
          idle(data);
        });
        break;
  }

  // This often goes in each case that should trigger a UI change.
  // This store needs to trigger a UI change after every view action,
  // so we can dry up the code a bit by putting it here.
  ObjectStore.emit('change');

  return true; // No errors.  Needed by promise in Dispatcher.
}, "ObjectStore");

module.exports = ObjectStore;
