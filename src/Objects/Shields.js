"use strict";

var clone = require("clone");

var shield = {
  blockingSpeed: 300,
  blockRatio: 0.1,
  type: "simpleshield",
  name: "The Mighty CockBlocker"
}

var Shield = {
  shield: shield
};

if(localStorage.Shield) {
  Shield = JSON.parse(localStorage.Shield);
}

module.exports = Shield;
