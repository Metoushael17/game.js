// import AppDispatcher from 'Dispatcher/AppDispatcher';
// import {EventEmitter} from 'events';
// import merge from 'react/lib/merge';

// const SoundStore = merge(EventEmitter.prototype, {});
// import lasers from 'Audio("./resources/sounds/Cannon.m4a';
// import move from 'Audio("./resources/sounds/Move.mp3';
// //const theme = new Audio("./resources/sounds/PiratesCaribbean.mp3");
// import click from 'Audio("./resources/sounds/button-22.mp3';
// import sploosh from 'Audio("./resources/sounds/Sploosh.m4a';

// // Register to handle all updates
// AppDispatcher.register(function(payload) {
//   //console.log("MESSAGE HI HIH IHIHIII");
//   if (payload.source !== 'OBJECT_ACTION') {
//     // Return true just to tell the dispatcher that everything is fine
//     return true;
//   }

//   const action = payload.action;
//   const data = action.data;
//   switch(action.actionType) {
//     case 'ON_CELL_CLICK':

//       break;
//     case 'ADD_OBJECT':

//       break;
//     case 'MOVE_OBJECT':
//       move.play();
//       break;
//     case 'ROTATE_OBJECT':
//       ////console.log("play music");
//       click.play();
//       break;
//     case 'ATTACK_SHIP':
//       lasers.play();
//       break;
//     case 'SET_SELECTED_SHIP':
//       //console.log("play music");
//       click.play();
//       break;
//     case 'SET_SELECTED_WEAPON':
//       //console.log("play music");
//       click.play();
//       break;
//     case 'SET_GAMESTATE':

//       break;
//     case 'SETUP_GAME':

//       break;
//     case 'LOAD_GAME':

//       break;
//     case 'SAVE_GAME':
//       //console.log("play music");
//       click.play();
//       break;
//     case 'HIT_WATER':
//       //console.log("play music");
//       sploosh.play();
//       break;
//     case 'SWAP_SHIPS':
//       //console.log("play music");
//       move.play();
//       break;
//     case 'LAY_MINE':
//       //console.log("play music");
//       sploosh.play();
//       break;
//     case 'LAUNCH_TORPEDO':
//       //console.log("play music");
//       lasers.play();
//       break;
//     case 'GENERATE_CORALS':

//       break;
//   }

//   SoundStore.emit('change');

//   return true; // No errors.  Needed by promise in Dispatcher.
// });

// module.exports = SoundStore;
