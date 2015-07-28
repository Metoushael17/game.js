import React from 'react';
import JsonEdit from '../../lib/JsonEdit';
import clone from '../../lib/clone';

import AnimationStore from '../Stores/AnimationStore';
import ObjectStore from '../Stores/ObjectStore';

import Weapons from '../Objects/Weapons';
import Shields from '../Objects/Shields';
import Player from '../Objects/Player';
import Enemies from '../Objects/Enemies';

const cachedPlayer = clone(Player);
const cachedEnemies = clone(Enemies);

function getDevToolsState() {
  return {};
}

const DevTools = React.createClass({
  getInitialState() {
    return getDevToolsState();
  },

  componentDidMount() {
    document.addEventListener('keydown', this._onKeyDown);
  },

  render() {
    return (
      <div id="DevTools">
      <button onClick={this._reset}>Reset</button>
      <button onClick={this._pause}>Pause / Play</button>
      <JsonEdit source={{
        Weapons: Weapons,
        Shields: Shields,
        Player: Player,
        Enemies: Enemies,
      }} onEdit={this._onEdit}/>
      </div>
    );
  },
  _onKeyDown(e) {
    switch (e.which) {
      case 82:
        this._reset();
        break;
      case 80:
        this._pause();
        break;
      default:
        break;
    }
  },

  _reset() {
    const state = Player.state;
    this._resetObj(Player, cachedPlayer);
    this._resetObj(Enemies, cachedEnemies);
    if (state === 'dead') {
      ObjectStore.load(Player);
      ObjectStore.load(Enemies);
    }
  },

  _resetObj(toReset, model) {
    for (const prop in model) {
      if (typeof model[prop] === 'object') {
        this._resetObj(toReset[prop], model[prop]);
        continue;
      }
      toReset[prop] = model[prop];
    }
  },

  _pause() {
    AnimationStore.toggle();
  },

  _onEdit() {
    localStorage.Weapons = JSON.stringify(Weapons);
    localStorage.Shields = JSON.stringify(Shields);
    localStorage.Player = JSON.stringify(Player);
    localStorage.Enemies = JSON.stringify(Enemies);
  },
});

module.exports = DevTools;

