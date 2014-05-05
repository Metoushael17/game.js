/**
 * @jsx React.DOM
 */

"use strict";
var React = require("react");
var JsonEdit = require("../../lib/JsonEdit");

var Weapons = require("../Objects/Weapons");
var Shields = require("../Objects/Shields");
var Player = require("../Objects/Player");
var Enemies = require("../Objects/Enemies");

function getDevToolsState() {
  return {};
}

var DevTools = React.createClass({
  getInitialState: function() {
    return getDevToolsState();
  },

  render: function() {
    return (
      <div id="DevTools">
      <JsonEdit source={{
        Weapons: Weapons,
        Shields: Shields,
        Player: Player,
        Enemies: Enemies
      }} onEdit={this._onEdit}/>
      </div>
    );
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

