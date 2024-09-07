import React from 'react';
import "./Message.css";

const Message = ({ user, message, classs }) => {
    if (user) {
        return (
            <div className={`messageBox ${classs}`}>
                <b>{user}</b>: {message}
            </div>
        );
    } else {
        return (
            <div className={`messageBox ${classs}`}>
                <b>You</b>: {message}
            </div>
        );
    }
};

export default Message;
