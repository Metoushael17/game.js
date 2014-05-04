/** @jsx React.DOM */

"use strict";
var React = require("react");

// View store contains all the data and logic for the View
var ObjectStore = require('../Stores/ObjectStore');
var MessageStore = require("../Stores/MessageStore");
var SoundStore = require("../Stores/SoundStore");
var AnimationStore = require("../Stores/AnimationStore");

var ObjectActions = require("../Actions/ObjectActions");
var MessageActions = require("../Actions/MessageActions");
var Message = require("./Message.react");

var clone = require("clone");
// var theme = new Audio("./resources/sounds/PiratesCaribbean.mp3");
// theme.controls = true;
// theme.loop = true;
// theme.autoplay = false;
// var playLoop = false;

var ATTACK = 13;
var BLOCK = 32;
var DOGE = 16;

function getColor(n) {
  var r = 255 - ~~(n/6000 * 255);
  var g = ~~(n/6000 * 255);
  var b = (~~(n/6000 * 255) - 200);
  if(b < 0) {
    b = 0;
  }
  var strR = r.toString(16);
  var strG = g.toString(16);
  var strB = b.toString(16);
  if(r < 16) {
    strR = "0" + strR;
  }

  if(g < 16) {
    strG = "0" + strG;
  }

  if(b < 16) {
    strB = "0" + strB;
  }
  var color = "#" + strR + strG + strB;
  return color;
}

function getViewState() {
  return {
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
    MessageActions.sendMessage("Keybindings: ");
    MessageActions.sendMessage("enter: attack");
    MessageActions.sendMessage("space: block");
    MessageActions.sendMessage("shift: doge");
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

    var circleRadius = enemy.state === "attacking" ? enemy.currentAnimationTime : 0;

    var leftPositionPlayerAnimation = -(~~((player.currentAnimationTime - 1)/1000) * player.animations[player.state].width);
    return (
      <div id="view">
        <div className="player" style={styleBox}>
        Player: <br /><br />
        Status: {player.state} <br />
        In animation {~~(player.currentAnimationTime / 1000)} <br />
        Health: {~~player.health} <br />
        Stamina: {~~player.stamina} <br />
        Equipped Weapon: {player.equippedWeapon.name} <br />
        Damage: {player.equippedWeapon.damage} <br />
        Equipped Shield: {player.equippedShield.name} <br />
        Block Ratio: {player.equippedShield.blockRatio}
        </div>
        <div style={{
          width: player.animations[player.state].width,
          height: player.animations[player.state].height,
          overflow: "hidden",
          position: "absolute",
          left: 400,
          top: 0
        }} >
          <img src={player.animations[player.state].url} style={{
            position: "absolute",
            left: leftPositionPlayerAnimation
          }} />
        </div>
        <br />
        <div className="player" style={styleBox}>
        Next attack: {~~(enemy.nextAttackTime / 1000)} <br />
        <div className="circleBase" style={{
            width: circleRadius / 50,
            height: circleRadius / 50,
            left: 200 - circleRadius / 100,
            top: 240 - circleRadius / 100,
            background: getColor(circleRadius)
          }}> <span>{~~(circleRadius / 1000)}</span> </div>
        Enemy: <br /> <br />
        Status: {enemy.state} <br />
        Health: {~~enemy.health} <br />
        Stamina: {~~enemy.stamina} <br />
        Equipped Weapon: {enemy.equippedWeapon.name} <br />
        Damage: {enemy.equippedWeapon.damage} <br />
        Equipped Shield: {enemy.equippedShield.name} <br />
        Block Ratio: {enemy.equippedShield.blockRatio}
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
