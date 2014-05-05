/**
 * @jsx React.DOM
 */

"use strict";
var React = require("react");
var JsonEdit = require("../../lib/JsonEdit");
var AnimationStore = require("../Stores/AnimationStore");
var clone = require("clone");

var Weapons = require("../Objects/Weapons");
var Shields = require("../Objects/Shields");
var Player = require("../Objects/Player");
var Enemies = require("../Objects/Enemies");

var cachedPlayer = clone(Player);
var cachedEnemies = clone(Enemies);

function getDevToolsState() {
  return {};
}

var DevTools = React.createClass({
  getInitialState: function() {
    return getDevToolsState();
  },

  componentDidMount: function() {
    document.addEventListener("keydown", this._onKeyDown);
  },

  render: function() {
    return (
      <div id="DevTools">
      <button onClick={this._reset}>Reset</button>
      <button onClick={this._pause}>Pause / Play</button>
      <JsonEdit source={{
        Weapons: Weapons,
        Shields: Shields,
        Player: Player,
        Enemies: Enemies
      }} onEdit={this._onEdit}/>
      </div>
    );
  },
  _onKeyDown: function(e) {
    switch(e.which) {
      case 82:
        this._reset();
        break;
      case 80:
        this._pause();
        break;
    }
  },

  _reset: function() {
    this._resetObj(Player, cachedPlayer);
    this._resetObj(Enemies, cachedEnemies);
  },

  _resetObj: function(toReset, model) {
    for(var prop in model) {
      if(typeof model[prop] === "object") {
        this._resetObj(toReset[prop], model[prop]);
        continue;
      }
      toReset[prop] = model[prop];
    }
  },

  _pause: function() {
    AnimationStore.toggle();
  },

  _onEdit: function() {
    console.log(Weapons)
    localStorage.Weapons = JSON.stringify(Weapons);
    localStorage.Shields = JSON.stringify(Shields);
    localStorage.Player = JSON.stringify(Player);
    localStorage.Enemies = JSON.stringify(Enemies);
  }
});

module.exports = DevTools;

