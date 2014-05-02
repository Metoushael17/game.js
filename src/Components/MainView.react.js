/** @jsx React.DOM */

"use strict";
var React = require("react");

// View store contains all the data and logic for the View
var ObjectStore = require('../Stores/ObjectStore');
var MessageStore = require("../Stores/MessageStore");
var SoundStore = require("../Stores/SoundStore");
var AnimationStore = require("../Stores/AnimationStore");

var ObjectActions = require("../Actions/ObjectActions");
var Message = require("./Message.react");

var clone = require("clone");
// var theme = new Audio("./resources/sounds/PiratesCaribbean.mp3");
// theme.controls = true;
// theme.loop = true;
// theme.autoplay = false;
// var playLoop = false;

var ATTACK = 13;
var BLOCK = 32;
var DOGE = 10;

function getViewState() {
  return {
    gameState: ObjectStore.getGameState(),
    styleBox: ObjectStore.getStyleBox(),
    enemy: ObjectStore.getEnemy(),
    player: ObjectStore.getPlayer()
  }
}

var View = React.createClass({
  getInitialState: function() {
    return getViewState();
  },

  componentWillMount: function(){
    window.onresize = this.onResize;
    this.onResize();
  },

  componentWillUnmount: function() {
    ObjectStore.removeListener('change', this._onChange);
  },

  onResize: function() {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight
    });
  },

  componentDidMount: function() {
    AnimationStore.on("update", this._onChange);
    ObjectStore.on('change', this._onChange);
    document.addEventListener("keyup", this._onKeyUp);
    document.addEventListener("mousemove", this._onMouseMove);

    ObjectActions.start(this.state.player, this.state.enemy);
  },

  // equal: function(obj1, obj2) {
  //   // return JSON.stringify(obj1) === JSON.stringify(obj2);
  //   return false;
  // },

  // shouldComponentUpdate: function(nextProps, nextState) {
  //   return !this.equal(nextProps, this.props) || !this.equal(nextState, this.state);
  // },

  render: function() {
    var width = this.state.width;
    var height = this.state.height;

    var styleBox = {
      // WebkitTransform: "translate(" + Math.round(this.state.styleBox.top) + "px," + Math.round(this.state.styleBox.left) + "px)",
      // transform: "translate(" + Math.round(this.state.styleBox.top) + "px," + Math.round(this.state.styleBox.left) + "px)"
    }

    var player = this.state.player;
    var enemy = this.state.enemy;

    return (
      <div id="view">
        <div className="player" style={styleBox}>
        Player: <br /><br />
        Status: {player.state} <br />
        In animation {~~(player.currentAnimationTime / 1000)} <br />
        Health: {player.health} <br />
        Stamina: {~~player.stamina} <br />
        Equipped Weapon: {player.equippedWeapon.name} <br />
        Damage: {player.equippedWeapon.damage} <br />
        </div>
        <br />
        <div className="player" style={styleBox}>
        Next attack in {~~(enemy.nextAttackTime / 1000)} Enemy: <br /> <br />
        Status: {enemy.state} <br />
        In animation {~~(enemy.currentAnimationTime / 1000)} <br />
        Health: {enemy.health} <br />
        Stamina: {~~enemy.stamina} <br />
        Equipped Weapon: {enemy.equippedWeapon.name} <br />
        Damage: {enemy.equippedWeapon.damage} <br />
        </div>

        <Message
          width={width}
          height={height}
        />
      </div>
    );
  },

  _onHover: function(e) {

  },

  _onMouseMove: function(e) {
    // goal.top = e.x;
    // goal.left = e.y;
  },

  _onChange: function() {
    this.setState(getViewState());
  },

  _onKeyDown: function(e) {
    document.removeEventListener("keydown", this._onKeyDown);
    switch(e.which) {
      case ATTACK:
        ObjectActions.playerAttack(this.state.player, this.state.enemy);
        break;
      case BLOCK:
        ObjectActions.playerBlock(this.state.player, true);
        break;
      case DOGE:
        ObjectActions.playerDodge(this.state.player);
        break;
    }
  },

  _onKeyUp: function(e) {
    document.addEventListener("keydown", this._onKeyDown);
    switch(e.which) {
      case ATTACK:
        break;
      case BLOCK:
        ObjectActions.playerBlock(this.state.player, false);
        break;
      case DOGE:
        break;
    }
  }
});


module.exports = View;
