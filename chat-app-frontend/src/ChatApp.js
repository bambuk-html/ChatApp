import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001'); // Ihr Backend-Server-URL

function ChatApp() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Nachricht empfangen
    socket.on('message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });
  }, []);

  const sendMessage = () => {
    // Nachricht senden
    socket.emit('message', { user: 'username', message });

    // Lokal hinzufügen
    setMessages((prevMessages) => [...prevMessages, { user: 'username', message }]);
    setMessage(''); // Nachrichten-Eingabefeld leeren
  };

  return (
    <div>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>
            {msg.user}: {msg.message}
          </li>
        ))}
      </ul>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default ChatApp;
