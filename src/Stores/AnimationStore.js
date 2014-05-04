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

var Node = function(data) {
  this.next = null;
  this.data = data;
  this.ID = getID();
  this.pause = false;
  return this;
}

var allAnimations = {
  head: null,
  tail: null
};

var Store = null;
var pause = true;
var LOOPING = true;

var fps = 60;
function _animationLoop() {
  if(pause || (!allAnimations.head && !allAnimations.tail)) {
    return;
  }
  LOOPING = true;
  // Since objects are accessed by pointers in the heap, we can just do
  // things like list.data = cur.next, and it will change the list.data
  // pointer to the new thing
  var anim = allAnimations.head;
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
      // If this was the first animation registered, then we move the
      // global |allAnimations.head| pointer
      if(!prev) {
        allAnimations.head = anim.next;
        // If anim is the last element, we update the |allAnimations.tail| pointer
        if(!anim.next) {
          allAnimations.tail = null;
        }
      } else {
        prev.next = anim.next;
        // If anim is the last element, we update the |allAnimations.tail| pointer
        if(!anim.next) {
          allAnimations.tail = prev;
        }
      }

      if(data.callback) {
        data.callback();
      }
    }
    anim = anim.next;
  }

  AnimationStore.emit('update');
  LOOPING = false;
  setTimeout(function() {
    requestAnimationFrame(_animationLoop);
  }, 1000 / fps);
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

  // var tmp = allAnimations.head;
  // while(tmp) {
  //   if(tmp.data.obj === objToAnimate) {
  //     console.warn("You're changing the same value with two different animations, they might conflict");
  //   }
  //   tmp = tmp.next;
  // }

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

function _playAnimation(anim) {
  if(allAnimations.tail) {
    allAnimations.tail.next = anim;
    allAnimations.tail = anim;
  }

  if(!allAnimations.head) {
    allAnimations.head = anim;
    allAnimations.tail = anim;
    if(!pause && !LOOPING) {
      requestAnimationFrame(_animationLoop);
      // setTimeout(_animationLoop, 1000/fps);
    }
  }
}

function setFrames(obj, speedOfAnimation, callback) {
  var coef = ~~(speedOfAnimation * fps / 1000);
  var increment = (obj.toValue - obj.curValue) / coef;
  var frames = new Array(coef);

  for (var i = 0; i < coef; i++) {
    frames[i] = obj.toValue - increment * i;
  }
  return frames;
}

var allAnimatedObjects = {
  head: null,
  tail: null
};

function _animationLoop2() {
  if(!allAnimatedObjects.head && !allAnimatedObjects.tail) {
    return;
  }
  // Since objects are accessed by pointers in the heap, we can just do
  // things like list.data = cur.next, and it will change the list.data
  // pointer to the new thing
  var anim = allAnimatedObjects.head;
  var prev = null;

  while(anim) {
    if(anim.pause) {
      prev = anim;
      anim = anim.next;
      continue;
    }
    var data = anim.data;
    var val = data.frames[data.frames.length - 1];
    if(data.filterFunction(val)) {
      data.curValue = data.mapFunction(val);
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
      // global |allAnimatedObjects.head| pointer
      if(!prev) {
        allAnimatedObjects.head = anim.next;
        // If anim is the last element, we update the |allAnimatedObjects.tail| pointer
        if(!anim.next) {
          allAnimatedObjects.tail = null;
        }
      } else {
        prev.next = anim.next;
        // If anim is the last element, we update the |allAnimatedObjects.tail| pointer
        if(!anim.next) {
          allAnimatedObjects.tail = prev;
        }
      }
    }
    anim = anim.next;
  }

  AnimationStore.emit('update');
  requestAnimationFrame(_animationLoop2);
}

function _createAnimatedObject(val, callback){
  var obj = {
    curValue: val || 0,
    __toValue: 0,
    lastChangeValue: 0,
    frames: [],
    callback: callback || function(val) {return val},
    mapFunction: function(val) {return val;},
    filterFunction: function() {return true;},
    until: function(f) {
      this.callback = function() {
        if(!f()) {
          callback();
        }
      };
      return this;
    },

    map: function(f) {
      var prev = this.mapFunction;
      this.mapFunction = function(val) {
        return f(prev(val));
      };
      return this;
    },

    filter: function(f) {
      var prev = this.filterFunction;
      this.filterFunction = function(val) {
        if(prev(val)) {
          return f(val);
        }
        return false;
      };
      return this;
    }
  };

  Object.defineProperty(obj, "toValue", {
    get: function() {
      return obj.__toValue;
    },
    set: function(y) {
      if(y === obj.curValue) {
        return;
      }
      obj.lastChangeValue = obj.curValue;
      obj.__toValue = y;
      obj.frames = setFrames(obj, Math.abs(obj.__toValue - obj.curValue), obj.callback);
      var anim = new Node(obj);

      if(allAnimatedObjects.tail) {
        allAnimatedObjects.tail.next = anim;
        allAnimatedObjects.tail = anim;
      }

      if(!allAnimatedObjects.head) {
        allAnimatedObjects.head = anim;
        allAnimatedObjects.tail = anim;
        requestAnimationFrame(_animationLoop2);
      }
    }
  });

  return obj;
}

var AnimationStore = merge(EventEmitter.prototype, {
  createAnimation: _createAnimation,
  createAnimatedObject: _createAnimatedObject,
  playAnimation: _playAnimation,
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
    if(!anim) {
      return;
    }
    if(allAnimations.head) {
      var tmp = allAnimations.head;
      var prev = null;
      while(tmp) {
        if(tmp.ID === anim.ID) {
          if(prev) {
            prev.next = tmp.next;
          } else {
            allAnimations.head = tmp.next;
          }

          if(!tmp.next) {
            allAnimations.tail = prev;
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
