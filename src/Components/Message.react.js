import React from 'react';

import MessageStore from '../Stores/MessageStore';
// import ObjectStore from 'Stores/ObjectStore';

function getMessageState() {
  return {
    messages: MessageStore.getMessages(),
  };
}

const Message = React.createClass({
  getInitialState() {
    return getMessageState();
  },

  componentDidMount() {
    MessageStore.on('change', this._onChange);
  },

  componentWillUnount() {
    MessageStore.removeListener('change', this._onChange);
  },

  render() {
    const messages = this.state.messages.slice(Math.max(this.state.messages.length - 10, 0), this.state.messages.length);
    const loaderStyle = {
      display: messages.length > 0 ? 'block' : 'none',
    };

    const arrayOfMessages = messages.map((m, i) => {
      return (
        <div
          key={'message_' + i}
          className="message"
          style={{opacity: (i + 3) / messages.length}}>
          {m.message}
        </div>
      );
    });

    return (
      <div id="messageBox" style={loaderStyle} >
      {arrayOfMessages}
      </div>
    );
  },

  _onChange() {
    this.setState(getMessageState());
  },
});


module.exports = Message;
