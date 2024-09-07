import React, { useEffect, useState } from 'react';
import { user } from "../Join/Join";
import socketIO from "socket.io-client";
import "./Chat.css";
import sendLogo from "../../images/send.png";
import Message from "../Message/Message";
import ReactScrollToBottom from "react-scroll-to-bottom";
import closeIcon from "../../images/closeIcon.png";

let socket;
const ENDPOINT = "http://localhost:4500/";

const Chat = () => {
  const [id, setid] = useState("");
  const [messages, setMessages] = useState([]);

  const send = () => {
    const message = document.getElementById('chatInput').value;
    if (message) {
      socket.emit('message', { message, id });
      document.getElementById('chatInput').value = ""; // Clear input field
    }
  };

  useEffect(() => {
    // Initialize socket connection
    socket = socketIO(ENDPOINT, { transports: ['websocket'] });

    socket.on('connect', () => {
      alert('connected');
      setid(socket.id); // Set the socket ID
    });

    // Emit 'joined' event when the user joins
    socket.emit('joined', { user });

    // Welcome message from the server
    socket.on('welcome', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]); // Update messages state
      console.log(data.user, data.message);
    });

    // Listen for the 'userJoined' event broadcasted by the server
    socket.on('userJoined', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]); // Append new message
      console.log(data.user, data.message);
    });

    // Listen for the 'leave' event
    socket.on('leave', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]); // Append leave message
      console.log(data.user, data.message);
    });

    // Cleanup on component unmount
    return () => {
      socket.disconnect();
      socket.off('welcome');
      socket.off('userJoined');
      socket.off('leave');
    };
  }, []);

  // Handle incoming messages
  useEffect(() => {
    socket.on('sendMessage', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]); // Append new message
      console.log(data.user, data.message, data.id);
    });

    // Cleanup on unmount
    return () => {
      socket.off('sendMessage');
    };
  }, [messages]);

  return (
    <div className='chatPage'>
      <div className='chatContainer'>
        <div className='header'>
          <h2>NexChat</h2>
          <a href='/'><img src={closeIcon} alt='close' /></a>
        </div>

        <ReactScrollToBottom className='chatBox'>
          {/* Render all messages */}
          {messages.map((item, i) => (
            <Message
              key={i}
              user={item.id === id ? '' : item.user}
              message={item.message}
              classs={item.id === id ? 'left' : 'right'}
            />
          ))}
        </ReactScrollToBottom>

        <div className='inputBox'>
          {/* Text input and send button */}
          <input
            onKeyPress={(event) => event.key === 'Enter' ? send() : null}
            type="text"
            id="chatInput"
          />
          <button onClick={send} className='sendBtn'>
            <img src={sendLogo} alt='Send' />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
