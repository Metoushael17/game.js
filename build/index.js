/** @jsx React.DOM */

"use strict";
var React = require('react');

var MainView = require('./Components/MainView.react');

React.renderComponent(
  MainView(null ),
  document.getElementById('react')
);
