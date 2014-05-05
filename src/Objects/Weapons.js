"use strict";

var clone = require("clone");


var hands = {
  attackSpeed: 400,
  staminaDamage: 20,
  damage: 5,
  type: "fists",
  name: "Bare hands"
}

var dagger = {
  attackSpeed: 700,
  staminaDamage: 30,
  damage: 10,
  type: "dagger",
  name: "The Pussy Dagger"
}

var sword = {
  attackSpeed: 1000,
  staminaDamage: 50,
  damage: 50,
  type: "longsword",
  name: "LongLightSaber Sword"
}

var Weapons = {
  hands: hands,
  dagger: dagger,
  sword: sword
};

if(localStorage.Weapons) {
  Weapons = JSON.parse(localStorage.Weapons);
}

module.exports = Weapons;
