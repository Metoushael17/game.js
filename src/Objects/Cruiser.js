/** @jsx React.DOM */

"use strict";

var clone = require("clone");
var Cruiser = {
  // What follows are the attributes of the object which are used to
  // recognize them
  __renderable: true,

  newInstance: function() {
    return clone(this);
  }
};

module.exports = Cruiser;
