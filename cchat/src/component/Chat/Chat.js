import React, { useEffect, useState } from 'react';
import { user } from "../Join/Join";
import socketIO from "socket.io-client";
import "./Chat.css";
import sendLogo from "../../images/send.png";
import Message from "../Message/Message";
import ReactScrollToBottom from "react-scroll-to-bottom";
import closeIcon from "../../images/closeIcon.png";

let socket;
const ENDPOINT = "https://chatapp-bda7.onrender.com/";

const Chat = () => {
  const [id, setid] = useState("");
  const [messages, setMessages] = useState([]);

  const send = () => {
    const message = document.getElementById('chatInput').value;
    if (message) {
      socket.emit('message', { message, id });
      document.getElementById('chatInput').value = "";
    }
  };

  useEffect(() => {
   
    socket = socketIO(ENDPOINT, { transports: ['websocket'] });

    socket.on('connect', () => {
      alert('connected');
      setid(socket.id); 
    });

   
    socket.emit('joined', { user });

   
    socket.on('welcome', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]); 
      console.log(data.user, data.message);
    });

    socket.on('userJoined', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]); 
      console.log(data.user, data.message);
    });

  
    socket.on('leave', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]); 
      console.log(data.user, data.message);
    });

  
    return () => {
      socket.disconnect();
      socket.off('welcome');
      socket.off('userJoined');
      socket.off('leave');
    };
  }, []);

 
  useEffect(() => {
    socket.on('sendMessage', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
      console.log(data.user, data.message, data.id);
    });

 
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
