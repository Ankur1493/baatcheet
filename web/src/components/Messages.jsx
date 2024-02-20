import React, { useState, useEffect } from 'react'

const Messages = ({ socket }) => {

  const [messages, setMessages] = useState([]);
  useEffect(() => {
    socket.on("message", (message) => {
      setMessages(prevMessages => [...prevMessages, message]);
    });
    return () => {
      socket.off("message");
    };
  }, [socket]);

  return (
    <div className='h-48'>
      <ul>
        {
          messages.map((msg, index) => (
            <li key={index}>{msg}</li>
          ))
        }
      </ul>
    </div>
  )
}

export default Messages 
