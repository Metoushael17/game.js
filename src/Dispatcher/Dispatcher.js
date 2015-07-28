/**
 *
 * Dispatcher
 *
 * The Dispatcher is capable of registering callbacks and invoking them.
 * More robust implementations than this would include a way to order the
 * callbacks for dependent Stores, and to guarantee that no two stores
 * created circular dependencies.
 */

import RSVP from 'rsvp';

let _callbacks = [];
let _promises = [];

let hashmap = {};

/**
 * Add a promise to the queue of callback invocation promises.
 * @param {function} callback The Store's registered callback.
 * @param {object} payload The data from the Action.
 */
function _addPromise(obj, payload) {
  _promises.push(new RSVP.Promise((resolve, reject) => {
    if (obj.callback(payload)) {
      if (hashmap[obj.id]) {
        hashmap[obj.id](payload);
      }
      resolve(payload);
    } else {
      reject(/*new Error('Dispatcher callback unsuccessful')*/);
    }
  }).catch((e) => {
    console.error(e.stack);
  }));
}

/**
 * Empty the queue of callback invocation promises.
 */
function _clearPromises() {
  _promises = [];
}

function Dispatcher() {}

Dispatcher.prototype = Object.assign(Dispatcher.prototype, {

  /**
   * Register a Store's callback so that it may be invoked by an action.
   * @param {function} callback The callback to be registered.
   * @return {number} The index of the callback within the _callbacks array.
   */
  register(callback, id, from) {
    if (from) {
      hashmap[from] = callback;
    } else {
      _callbacks.push({
        callback: callback,
        id: id ? id : Date.now(),
      });
    }
    return _callbacks.length - 1; // index
  },

  /**
   * dispatch
   * @param  {object} payload The data from the action.
   */
  dispatch(payload) {
    _callbacks.forEach((obj) => {
      _addPromise(obj, payload);
    });
    RSVP.Promise.all(_promises).then(_clearPromises);
  },
});

module.exports = Dispatcher;
