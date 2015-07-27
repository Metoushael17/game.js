/**
 * @jsx React.DOM
 */

var React = require('react');
var GridStore = require('../Stores/GridStore');

function getGridState() {
  return {

  };
}

var Grid = React.createClass({displayName: 'Grid',
  getInitialState: function() {
    return getGridState();
  },

  componentWillMount: function() {
    GridStore.on('change', this._onChange);
  },

  componentWillUnmount: function() {
    GridStore.removeListener('change', this._onChange);
  },

  render: function() {
    // Add a click action on each cell. This action can be:
    // if click on moveCell: then move selected ship to clicked cell
    // if click on attackCell: then attack on that cell
    // if click on radarCell: do nothing
    // if click on tableCell: if selectedWeapon, then fire, else do
    //                        nothing

    var CellStyle = {
      width: cellSize,
      height: cellSize
    };

    var GridStyle = {
      top: height / 5,
      left: windowWidth / 2 - width / 2,
      width: width,
      height: width,
    };

    var rows = [];
    var columns = [];
    for (var i = 0; i < cellNumber; i++) {
      for(var p = 0; p < cellNumber; p++) {
        columns.push(React.DOM.td( {style:CellStyle, name:p, onClick:this._onCellClick}));
      }
      rows.push(React.DOM.tr( {name:i}, columns));
      columns = [];
    }

    var table = React.DOM.table( {id:"tableGrid"}, rows);

    var move = this.props.moveArray.map(function(cell) {
      var moveStyle = {
        left: cell.x * cellSize,
        top: cell.y * cellSize,
        width: cellSize,
        height: cellSize
      }
      return React.DOM.div( {className:"moveCell", style:moveStyle} );
    });


    var attack = this.props.attackArray.map(function(cell) {
      var attackCell = {
        left: cell.x * cellSize,
        top: cell.y * cellSize,
        width: cellSize,
        height: cellSize
      }
      return React.DOM.div( {className:"attackCell", style:attackCell} );
    });

    var fogOfWar = this.props.fogOfWar.map(function(cell) {
      var fogOfWar = {
        left: cell.x * cellSize,
        top: cell.y * cellSize,
        width: cellSize,
        height: cellSize
      }
      return React.DOM.div( {className:"fogOfWar", style:fogOfWar} );
    });

    var objects = this.props.allObjects;

    return (
      React.DOM.div( {id:"grid", style:GridStyle}, 
        table,
        move,
        attack,
        objects,
        fogOfWar
      )
    );
  },

   /**
   * Event handler for 'change' events coming from the GridStore
   */
  _onChange: function() {
    this.setState(getGridState());
  },

  _onCellClick: function() {

  }
});

