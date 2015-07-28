import React from 'react';

// PlayerView store contains all the data and logic for the PlayerView
import ObjectStore from '../Stores/ObjectStore';
// import MessageStore from '../Stores/MessageStore';
// import SoundStore from '../Stores/SoundStore';
import AnimationStore from '../Stores/AnimationStore';

import ObjectActions from '../Actions/ObjectActions';
import MessageActions from '../Actions/MessageActions';

// import Message from 'Message.react';
// import DevTools from 'DevTools.react';

const ATTACK = 13;
const BLOCK = 32;
const DOGE = 16;

function getColor(n) {
  const r = 255 - ~~(n / 6000 * 255);
  const g = ~~(n / 6000 * 255);
  let b = (~~(n / 6000 * 255) - 200);
  if (b < 0) {
    b = 0;
  }
  let strR = r.toString(16);
  let strG = g.toString(16);
  let strB = b.toString(16);
  if (r < 16) {
    strR = '0' + strR;
  }

  if (g < 16) {
    strG = '0' + strG;
  }

  if (b < 16) {
    strB = '0' + strB;
  }
  const color = '#' + strR + strG + strB;
  return color;
}


ObjectStore.load(require('../Objects/Player'));
ObjectStore.load(require('../Objects/Enemies').simple);

function getViewState() {
  return {
    enemy: ObjectStore.getEnemy(),
    player: ObjectStore.getPlayer(),
  };
}

const PlayerView = React.createClass({
  getInitialState() {
    return getViewState();
  },

  componentWillUnmount() {
    ObjectStore.removeListener('change', this._onChange);
  },

  componentDidMount() {
    AnimationStore.on('update', this._onChange);
    ObjectStore.on('change', this._onChange);
    document.addEventListener('keyup', this._onKeyUp);
    document.addEventListener('mousemove', this._onMouseMove);

    MessageActions.sendMessage('Keybindings: ');
    MessageActions.sendMessage('enter: attack');
    MessageActions.sendMessage('space: block');
    MessageActions.sendMessage('shift: doge');
  },

  // equal(obj1, obj2) {
  //   // return JSON.stringify(obj1) === JSON.stringify(obj2);
  //   return false;
  // },

  // shouldComponentUpdate(nextProps, nextState) {
  //   return !this.equal(nextProps, this.props) || !this.equal(nextState, this.state);
  // },

  render() {
    const player = this.state.player;
    const enemy = this.state.enemy;

    const circleRadius = enemy.state === 'attacking' ? enemy.currentAnimationTime : 0;

    const translate = `translate(-${(~~((player.currentAnimationTime - 1) / 1000) * player.animations[player.state].width)}px, 0px)`;

    return (
      <div id="PlayerView">
        <div className="player">
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
          overflow: 'hidden',
          position: 'absolute',
          left: 400,
          top: 0,
        }} >
          <img src={player.animations[player.state].url} style={{
            transform: translate,
            WebkitTransform: translate,
          }} />
        </div>
        <br />
        <div className="player">
        Next attack: {~~(enemy.nextAttackTime / 1000)} <br />

          <div className="circleBase" style={{
            width: circleRadius / 50,
            height: circleRadius / 50,
            left: 200 - circleRadius / 100,
            top: 270 - circleRadius / 100,
            background: getColor(circleRadius),
          }}>
          <span>{~~(circleRadius / 1000)}</span>
          </div>

        Enemy: <br /> <br />
        Status: {enemy.state} <br />
        Health: {~~enemy.health} <br />
        Stamina: {~~enemy.stamina} <br />
        Equipped Weapon: {enemy.equippedWeapon.name} <br />
        Damage: {enemy.equippedWeapon.damage} <br />
        Equipped Shield: {enemy.equippedShield.name} <br />
        Block Ratio: {enemy.equippedShield.blockRatio}
        </div>
      </div>
    );
  },

  _onHover() {

  },

  _onMouseMove() {
    // goal.top = e.x;
    // goal.left = e.y;
  },

  _onChange() {
    this.setState(getViewState());
  },

  _onKeyDown(e) {
    document.removeEventListener('keydown', this._onKeyDown);
    switch (e.which) {
      case ATTACK:
        ObjectActions.playerAttack(this.state.player, this.state.enemy);
        break;
      case BLOCK:
        ObjectActions.playerBlock(this.state.player, true);
        break;
      case DOGE:
        ObjectActions.playerDodge(this.state.player);
        break;
      default:
        break;
    }
  },

  _onKeyUp(e) {
    document.addEventListener('keydown', this._onKeyDown);
    switch (e.which) {
      case ATTACK:
        break;
      case BLOCK:
        ObjectActions.playerBlock(this.state.player, false);
        break;
      case DOGE:
        break;
      default:
        break;
    }
  },
});


module.exports = PlayerView;
