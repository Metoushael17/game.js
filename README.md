#React - Gameee
_by Peter, Eric and Benjamin_

This

### Architecture
This game was built using an architecture called [Flux](https://github.com/fisherwebdev/react/tree/master/examples/todomvc-flux), envisioned by some people at Facebook. 
Bill Fisher describes Flux as   
>An application architecture for React utilizing a unidirectional data flow

I won't go into too much detail about how it's designed, and if you want to know more you can take a look at [this](https://github.com/fisherwebdev/react/tree/master/examples/todomvc-flux) example, but I'll explain briefly.
There are three parts to Flux: the Views, the Dispatcher and the Stores. Data flows unidirectionally like so

```
Views ---> (actions) ----> Dispatcher ---> (registerd callback) ---> Stores --------+
Ʌ                                                                                   |
|                                                                                   V
+----- (Views listen to those events) ---- (Stores emit different events) ----------+
```

You start by creating a Store, which will contain all the data for a certain part of your application, and all the logic to manipulate that data. You then add a function in the app dispatcher that will be called to send an event targeted to that specific Store. Finally to interact with the Store from the views, you create a ViewAction which will contain all the different events you want to send to the store that will trigger the business logic.

Once all this is set up, you want to create Views that will be using the data inside the Store, so all you have to do is to listen for the "change" event triggered by the Store. 


Here is a little example of how the data flows in our game.

When you click on a cell to move your ship (imagine that you already selected the ship) there is first some hit detection to check if you're clicking on a valid cell. Then we call ObjectActions.moveObject(...) which will trigger an action of type OBJECT\_ACTION and which will then be pass down to the dispatcher which will itself pass it down to all registered Stores. 

The ObjectStore will get the action and see that it's an OBJECT\_ACTION therefore it will proceed. All the other Store registered will disregard the action, as they won't be interested. The ObjectStore will then check what the action is trying to do, which, in this case, is moving an object. The ObjectStore will then move the object in our representation of the grid and then emit two events, a change event and a moveobject event, which should be caught by the Views that are interested in these events. The views that will catch those events will call a setState using this new data, therefore causing a re-rendering. (There are some interesting optimization that can be done be having special events for special Views).

One View that is interested in a moveobject action is the Energybar which will decrement on a moveobject action.

To summarize, thanks to Flux we get consistent data across all Views without having to duplicate data and we get a very interesting separation of concerns. On top of all this logic, there is still the React logic of states which can become confusing at start. The way we've seen it so far is that we're trying to have as minimal local state as possible. Everything needed for a React component is saved in the Store, then linked to the state of a global component (here called the MainView) and then passed down to the children that are interested in that data. That way, the data is always synced between all the different views, and the logic can be implemented in one place.

### How to install
Well, it's pretty simple. All you need is nodejs and npm (which now come together). If you don't have nodejs, just go to [this](https://github.com/joyent/node) repository, and follow the instructions.

Open a terminal and type the following:
```
cd ~/Desktop
git clone https://github.com/bsansouci/react-shipwars.git
cd react-shipwars
npm install && grunt build && grunt
```
This will download all the dependencies needed, compile the code for the first time and run a server at http://localhost:8000 which will reload every time you do a change.

### How do I just start the server
Enter the following command
```
grunt
```
This will watch for changes in the js files and css files, compile them, bundle them in one bundled.js file and then reload the local server.


### How do I just build
Simple, run the command
```
grunt build
```

This will compile all the files and bundle them in one bundled.js file.

