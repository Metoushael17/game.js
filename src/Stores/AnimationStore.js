"use strict";

var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

var AppDispatcher = require('../Dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');

var getID = (function() {
  var id = 0;

  return function() {
    return ++id;
  };
})();

var Node = function() {
  this.next = null;
  this.data = null;
  this.ID = getID();
  this.pause = false;
  return this;
}

var frames = {
  head: null,
  tail: null
};

var Store = null;
var pause = true;

var fps = 60;

function _animationLoop() {
  if(pause || (!frames.head && !frames.tail)) {
    return;
  }
  // Since objects are accessed by pointers in the heap, we can just do
  // things like list.data = cur.next, and it will change the list.data
  // pointer to the new thing
  var anim = frames.head;
  var prev = null;

  while(anim) {
    if(anim.pause) {
      prev = anim;
      anim = anim.next;
      continue;
    }
    var data = anim.data;
    var curFrame = data.frames[data.frames.length - 1];
    var obj = data.obj;

    for(var p in curFrame) {
      obj[p] = curFrame[p];
    }

    if(data.frames.length > 1) {
      // We chop the last element
      --data.frames.length;

      // We only update the |prev| if there we're not going to jump above
      // an anim (aka if the anim isn't finished yet). If the anim is
      // finished, we're goint to remove it from the list of anims and
      // therefore the |prev| pointer should be pointing at the same
      // thing as before
      prev = anim;
    } else {
      if(data.callback) {
        data.callback();
      }
      // if(!!savedStart[curFrame.name]){
      //   savedStart[curFrame.name]();
      // }

      // If this was the first animation registered, then we move the
      // global |frames.head| pointer
      if(!prev) {
        frames.head = anim.next;
        // If anim is the last element, we update the |frames.tail| pointer
        if(!anim.next) {
          frames.tail = null;
        }
      } else {
        prev.next = anim.next;
        // If anim is the last element, we update the |frames.tail| pointer
        if(!anim.next) {
          frames.tail = prev;
        }

      }
    }
    anim = anim.next;
  }

  AnimationStore.emit('update');
  requestAnimationFrame(_animationLoop);
  // setTimeout(_animationLoop, 1000/fps);
}

function _createAnimation(startObj, endObj, objToAnimate, speedOfAnimation, callback) {
  var found = false;
  var availableParams = [];

  // We go through both objects and take only the properties that are the
  // same and that are numbers
  for(var p2 in endObj) {
    for(var p1 in startObj) {
      // For now we only animate numbers
      if(p1 === p2 && !isNaN(startObj[p1]) && !isNaN(endObj[p2])) {
        found = true;
        break;
      }
    }
    if(found) {
      availableParams.push(p1);
      found = false;
    }
  }

  var increments = [];
  var coef = ~~(speedOfAnimation * fps / 1000);

  // Loop through the parameters and calculate the increment that is
  // ideal for the given time and the known frame rate
  for (var i = 0; i < availableParams.length; i++) {
    increments.push((endObj[availableParams[i]] - startObj[availableParams[i]]) / coef);
  }

  var frames = new Array(coef);

  var list = new Node();
  list.data = {
    obj: objToAnimate,
    frames: frames,
    callback: callback
  };

  for (var i = 0; i < coef; i++) {
    var newObj = {};

    // Go through all the increments of the parameters and
    // do the increment. Basically creating one frame in time.
    for (var j = 0; j < increments.length; j++) {
      newObj[availableParams[j]] = endObj[availableParams[j]] - increments[j] * i;
    }

    frames[i] = newObj;
  }

  return list;
}

function _addAnimation(anim) {
  var prevPause = pause;
  // We artificially pause just in case the scheduler isn't on our side
  // for the small amount of lines
  pause = true;

  if(frames.tail) {
    frames.tail.next = anim;
    frames.tail = anim;
  }

  if(!frames.head) {
    frames.head = anim;
    frames.tail = anim;
    if(!prevPause) {
      requestAnimationFrame(_animationLoop);
      // setTimeout(_animationLoop, 1000/fps);
    }
  }

  if(!prevPause) {
    pause = false;
  }
}

function setFrames(obj, speedOfAnimation, callback) {
  var found = false;
  var availableParams = [];

  var coef = ~~(speedOfAnimation * fps / 1000);
  var increment = (obj.toValue - obj.curVal) / coef;
  var frames = new Array(coef);

  for (var i = 0; i < coef; i++) {
    var newObj = {
      curValue: obj.toValue - increment * i
    };

    frames[i] = newObj;
  }

  return frames;
}

function _createAnimatedObject(val, speed, callback){
  var toValue = 0;

  var obj = {
    curVal: val,
    frames: []
  };

  Object.defineProperty(obj, "toValue", {
    get: function() {
      return toValue;
    },
    set: function(y) {
      toValue = y;
      obj.frames = setFrames(obj, speed, callback);
    }
  })
  return obj;
}

var AnimationStore = merge(EventEmitter.prototype, {
  createAnimation: _createAnimation,
  createAnimatedObject: _createAnimatedObject,
  playAnimation: _addAnimation,
  start: function() {
    if(!pause) {
      return;
    }
    pause = false;
    requestAnimationFrame(_animationLoop);
    // setTimeout(_animationLoop, 1000/fps);
  },
  pause: function(anim) {
    if(anim) {
      anim.pause = true;
      return;
    }
    pause = true;
  },
  toggle: function(anim) {
    if(anim) {
      anim.pause = !anim.pause;
      return;
    }
    pause = !pause;
    if(!pause) {
      requestAnimationFrame(_animationLoop);
      // setTimeout(_animationLoop, 1000/fps);
    }
  },

  delete: function(anim) {
    if(frames.head) {
      var tmp = frames.head;
      var prev = null;
      while(tmp) {
        if(tmp.ID === anim.ID) {
          if(prev) {
            prev.next = tmp.next;
          } else {
            frames.head = tmp.next;
          }

          if(!tmp.next) {
            frames.tail = prev;
          }
          break;
        }
        prev = tmp;
        tmp = tmp.next;
      }
    }
  }
});

module.exports = AnimationStore;
