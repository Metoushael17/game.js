const requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
// const cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

// const AppDispatcher = require('../Dispatcher/AppDispatcher');
import {EventEmitter} from 'events';

const fps = 60;

const getID = (() => {
  let id = 0;

  return () => {
    return ++id;
  };
})();

function Node(data) {
  this.next = null;
  this.data = data;
  this.ID = getID();
  this.pause = true;
  return this;
}

let allAnimations = {
  head: null,
  tail: null,
};

// const Store = null;
let pause = true;
let LOOPING = true;

// const fps = 60;
function _animationLoop() {
  if (pause || (!allAnimations.head && !allAnimations.tail)) {
    LOOPING = false;
    return;
  }
  LOOPING = true;
  // Since objects are accessed by pointers in the heap, we can just do
  // things like list.data = cur.next, and it will change the list.data
  // pointer to the new thing
  let anim = allAnimations.head;
  let prev = null;

  while (anim) {
    if (anim.pause) {
      prev = anim;
      anim = anim.next;
      continue;
    }
    let data = anim.data;
    const curFrame = data.frames[data.frames.length - 1];
    let obj = data.obj;

    for (let p in curFrame) {
      if (curFrame.hasOwnProperty(p)) {
        obj[p] = curFrame[p];
      }
    }

    if (data.frames.length > 1) {
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
      if (!prev) {
        allAnimations.head = anim.next;
        // If anim is the last element, we update the |allAnimations.tail| pointer
        if (!anim.next) {
          allAnimations.tail = null;
        }
      } else {
        prev.next = anim.next;
        // If anim is the last element, we update the |allAnimations.tail| pointer
        if (!anim.next) {
          allAnimations.tail = prev;
        }
      }

      if (data.callback) {
        data.callback();
      }
    }
    anim = anim.next;
  }

  // AnimationStore.emit('update');
  // setTimeout(function() {
  requestAnimationFrame(_animationLoop);
  // }, 1000 / fps);
  // setTimeout(_animationLoop, 1000/fps);
}

function _playAnimation(anim) {
  let tmp = allAnimations.head;
  while (tmp && tmp.ID !== anim) {
    tmp = tmp.next;
  }

  if (tmp) {
    tmp.pause = false;
    if (!LOOPING) {
      requestAnimationFrame(_animationLoop);
    }
  }
}

function _createAnimation(startObj, endObj, objToAnimate, speedOfAnimation, callback) {
  let availableParams = [];

  // We go through both objects and take only the properties that are the
  // same and that are numbers
  for (let p2 in endObj) {
    if (endObj.hasOwnProperty(p2)) {
      for (let p1 in startObj) {
        if (endObj.hasOwnProperty(p1)) {
          // For now we only animate numbers
          if (p1 === p2 && !isNaN(startObj[p1]) && !isNaN(endObj[p2])) {
            availableParams.push(p1);
          }
        }
      }
    }
  }

  // const tmp = allAnimations.head;
  // while (tmp) {
  //   if (tmp.data.obj === objToAnimate) {
  //     console.warn("You're changing the same value with two different animations, they might conflict");
  //   }
  //   tmp = tmp.next;
  // }

  let increments = [];
  const coef = ~~(speedOfAnimation * fps / 1000);

  // Loop through the parameters and calculate the increment that is
  // ideal for the given time and the known frame rate
  for (let i = 0; i < availableParams.length; i++) {
    increments.push((endObj[availableParams[i]] - startObj[availableParams[i]]) / coef);
  }

  let frames = new Array(coef);

  let list = new Node();
  list.data = {
    obj: objToAnimate,
    frames: frames,
    callback: callback,
  };

  for (let i = 0; i < coef; i++) {
    let newObj = {};

    // Go through all the increments of the parameters and
    // do the increment. Basically creating one frame in time.
    for (let j = 0; j < increments.length; j++) {
      newObj[availableParams[j]] = endObj[availableParams[j]] - increments[j] * i;
    }

    frames[i] = newObj;
  }


  if (allAnimations.tail) {
    allAnimations.tail.next = list;
    allAnimations.tail = list;
  }

  if (!allAnimations.head) {
    allAnimations.head = list;
    allAnimations.tail = list;
  }
  _playAnimation(list.ID);
  return list.ID;
}

// function setFrames(obj, speedOfAnimation, callback) {
//   const coef = ~~(speedOfAnimation * fps / 1000);
//   const increment = (obj.toValue - obj.curValue) / coef;
//   const frames = new Array(coef);

//   for (const i = 0; i < coef; i++) {
//     frames[i] = obj.toValue - increment * i;
//   }
//   return frames;
// }

// const allAnimatedObjects = {
//   head: null,
//   tail: null
// };

// function _animationLoop2() {
//   if (!allAnimatedObjects.head && !allAnimatedObjects.tail) {
//     return;
//   }
//   // Since objects are accessed by pointers in the heap, we can just do
//   // things like list.data = cur.next, and it will change the list.data
//   // pointer to the new thing
//   const anim = allAnimatedObjects.head;
//   const prev = null;

//   while (anim) {
//     if (anim.pause) {
//       prev = anim;
//       anim = anim.next;
//       continue;
//     }
//     const data = anim.data;
//     const val = data.frames[data.frames.length - 1];
//     if (data.filterFunction(val)) {
//       data.curValue = data.mapFunction(val);
//     }
//     if (data.frames.length > 1) {
//       // We chop the last element
//       --data.frames.length;

//       // We only update the |prev| if there we're not going to jump above
//       // an anim (aka if the anim isn't finished yet). If the anim is
//       // finished, we're goint to remove it from the list of anims and
//       // therefore the |prev| pointer should be pointing at the same
//       // thing as before
//       prev = anim;
//     } else {
//       if (data.callback) {
//         data.callback();
//       }
//       // if (!!savedStart[curFrame.name]){
//       //   savedStart[curFrame.name]();
//       // }

//       // If this was the first animation registered, then we move the
//       // global |allAnimatedObjects.head| pointer
//       if (!prev) {
//         allAnimatedObjects.head = anim.next;
//         // If anim is the last element, we update the |allAnimatedObjects.tail| pointer
//         if (!anim.next) {
//           allAnimatedObjects.tail = null;
//         }
//       } else {
//         prev.next = anim.next;
//         // If anim is the last element, we update the |allAnimatedObjects.tail| pointer
//         if (!anim.next) {
//           allAnimatedObjects.tail = prev;
//         }
//       }
//     }
//     anim = anim.next;
//   }

//   AnimationStore.emit('update');
//   requestAnimationFrame(_animationLoop2);
// }

// function _createAnimatedObject(val, callback){
//   const obj = {
//     curValue: val || 0,
//     __toValue: 0,
//     lastChangeValue: 0,
//     frames: [],
//     callback: callback || function(val) {return val},
//     mapFunction: function(val) {return val;},
//     filterFunction: function() {return true;},
//     until: function(f) {
//       this.callback = function() {
//         if (!f()) {
//           callback();
//         }
//       };
//       return this;
//     },

//     map: function(f) {
//       const prev = this.mapFunction;
//       this.mapFunction = function(val) {
//         return f(prev(val));
//       };
//       return this;
//     },

//     filter: function(f) {
//       const prev = this.filterFunction;
//       this.filterFunction = function(val) {
//         if (prev(val)) {
//           return f(val);
//         }
//         return false;
//       };
//       return this;
//     }
//   };

//   Object.defineProperty(obj, "toValue", {
//     get: function() {
//       return obj.__toValue;
//     },
//     set: function(y) {
//       if (y === obj.curValue) {
//         return;
//       }
//       obj.lastChangeValue = obj.curValue;
//       obj.__toValue = y;
//       obj.frames = setFrames(obj, Math.abs(obj.__toValue - obj.curValue), obj.callback);
//       const anim = new Node(obj);

//       if (allAnimatedObjects.tail) {
//         allAnimatedObjects.tail.next = anim;
//         allAnimatedObjects.tail = anim;
//       }

//       if (!allAnimatedObjects.head) {
//         allAnimatedObjects.head = anim;
//         allAnimatedObjects.tail = anim;
//         requestAnimationFrame(_animationLoop2);
//       }
//     }
//   });

//   return obj;
// }

const AnimationStore = Object.assign(EventEmitter.prototype, {
  createAnimation: _createAnimation,
  // createAnimatedObject: _createAnimatedObject,
  playAnimation: _playAnimation,
  start() {
    pause = false;
    if (!LOOPING) {
      requestAnimationFrame(_animationLoop);
    }
    // setTimeout(_animationLoop, 1000/fps);
  },
  pause() {
    // if (anim) {
    //   anim.pause = true;
    //   return;
    // }
    pause = true;
  },
  toggle() {
    // if (anim) {
    //   anim.pause = !anim.pause;
    //   return;
    // }
    pause = !pause;
    if (!pause) {
      requestAnimationFrame(_animationLoop);
      // setTimeout(_animationLoop, 1000/fps);
    }
  },

  deleteAnim(anim) {
    if (allAnimations.head) {
      let tmp = allAnimations.head;
      let prev = null;
      while (tmp) {
        if (tmp.ID === anim) {
          if (prev) {
            prev.next = tmp.next;
          } else {
            allAnimations.head = tmp.next;
          }

          if (!tmp.next) {
            allAnimations.tail = prev;
          }
          break;
        }
        prev = tmp;
        tmp = tmp.next;
      }
    }
  },
});

export default AnimationStore;
