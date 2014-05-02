/** @jsx React.DOM */

"use strict";

var clone = require("clone");

var HeavyCannon = require("./Weapon").newInstance();
HeavyCannon.range = {
  width: 15,
  height: 11,
  offsetX: -5,
  offsetY: -5
};
HeavyCannon.damage = 2;
HeavyCannon.name = "heavyCannon";

var Cruiser = {
  weapons: [HeavyCannon],
  size: 5,
  speed: 10,
  baseSpeed: 10,
  armour: 2,
  radar: {
    width: 10,
    height: 3,
    offsetX: 1,
    offsetY: -1
  },
  x: 0,
  y: 0,
  direction: "east",
  type: "cruiser",
  alliance: "ally",
  damaged: [],

  hit: function(x, y, damage) {
    if(this.speed === 0) {
      return;
    }

    var touched = this.damaged.filter(function(cell) {
      return cell.x === x && cell.y === y;
    });

    if(touched.length) {
      if(touched[0].hit < this.armour) {
        touched[0].hit += damage;
        if(touched[0].hit >= this.armour) {
          this.speed = ~~(this.speed * (this.size - this.damaged.filter(function(cell) {
            return cell.hit >= this.armour;
          }.bind(this)).length) / this.size);
        }
      }
    } else {
      this.damaged.push({
        x: x,
        y: y,
        hit: damage
      });

      if(damage >= this.armour) {
        this.speed = ~~(this.baseSpeed * (this.size - this.damaged.filter(function(cell) {
          return cell.hit >= this.armour;
        }.bind(this)).length) / this.size);
      }
    }

    console.log("HIT " + this.speed);
  },

  newInstance: function() {
    return clone(this);
  }
};

module.exports = Cruiser;
