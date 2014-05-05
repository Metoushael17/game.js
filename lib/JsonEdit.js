/**
* @jsx React.DOM
*/
"use strict";
var TreeView = require("./react-treeview");
var React = require("react");

var Editable = React.createClass({
  getInitialState: function() {
    return {
      editing: false,
      value: this.props.obj[this.props.val]
    }
  },

  componentDidMount: function() {
    // document.addEventListener("click", function(e) {
    //   if(this.state.editing) {
    //     this.setState({
    //       editing: false
    //     })
    //   }
    // }.bind(this));
  },

  render: function() {
    return (
      <span
        ref="text"
        className="editable"
        onClick={this.handleClick}>
        {this.state.editing
          ? <input
              onChange={this._onChange}
              onKeyDown={this._onKeyDown}
              value={this.state.value}/>
          : this.props.obj[this.props.val]}
      </span>
    );
  },
  _onKeyDown: function(e) {
    if(e.which === 13) {
      this.setState({
        editing: false
      });
      this.props.obj[this.props.val] = this.state.value;
      if(this.props.onEdit) {
        this.props.onEdit();
      }
    }
  },
  _onChange: function(e) {
    this.setState({
      value: isNaN(e.target.value) ? e.target.value : parseInt(e.target.value)
    });
  },
  handleClick: function() {
    this.setState({
      editing: true
    })
  }
});

function toTreeView(obj, onEdit) {
  var data = [];
  for(var prop in obj) {
    if(typeof obj[prop] === "object") {
      data.push({
        initiallyCollapsed: true,
        displayNode: <div>{prop}</div>,
        children: toTreeView(obj[prop], onEdit)
      });
      continue;
    }
    data.push({
      displayNode: <div>{prop}:<Editable obj={obj} val={prop} onEdit={onEdit} /></div>,
      children: []
    })
  }
  return data;
}

var TreeViewFromJson = React.createClass({
  getInitialState: function() {
    return {
      tree: toTreeView(this.props.source, this.props.onEdit)
    };
  },
  render: function() {
    return (
      <TreeView source={this.state.tree} />
    );
  }
});


module.exports = TreeViewFromJson
