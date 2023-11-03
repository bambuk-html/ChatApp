import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MessageList() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/messages')
      .then(response => {
        setMessages(response.data);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }, []);

  return (
    <div>
      <h1>Messages</h1>
      {messages.map((message, index) => (
        <div key={index}>
          <h2>{message.user}</h2>
          <p>{message.message}</p>
        </div>
      ))}
    </div>
  );
}

export default MessageList;