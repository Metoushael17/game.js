"use strict";

var clone = require("clone");

var Weapons = require("./Weapons");
var Shields = require("./Shields")

var Player = {
  currentAnimation: null,
  currentAnimationTime: 0,
  staminaIncreasing: 0,
  health: 100,
  maxHealth: 100,
  state: "idle",
  alliance: "ally",
  stamina: 100,
  maxStamina: 100,
  dodgeStamina: 20,
  equippedWeapon: Weapons.dagger,
  equippedShield: Shields.shield,
  animations: {
    idle: {
      url: "./resources/animation/idle.jpg",
      width: 136,
      height: 144
    },
    attacking: {
      url: "./resources/animation/attacking.jpg",
      width: 168,
      height: 144
    },
    blocking: {
      url: "./resources/animation/blocking.jpg",
      width: 168,
      height: 144
    },
    dodging: {
      url: "./resources/animation/dodging.jpg",
      width: 136,
      height: 144
    },
    dead: {
      url: "./resources/animation/dead.jpg",
      width: 136,
      height: 144
    }
  },
  dodgeSpeed: 1000,
  staminaIncreaseSpeed: 4000,
  staminaStartIncreaseSpeed: 1000,
  idleSpeed: 3000
}

if(localStorage.Player) {
  Player = JSON.parse(localStorage.Player)
}

module.exports = Player;
