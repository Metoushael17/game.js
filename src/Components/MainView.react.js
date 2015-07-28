import React from 'react';
import DevTools from './DevTools.react';
import PlayerView from './PlayerView.react';

const MainView = React.createClass({
  render() {
    return (
      <div id="main">
        <PlayerView />
        <DevTools />
      </div>
    );
  },
});


module.exports = MainView;
