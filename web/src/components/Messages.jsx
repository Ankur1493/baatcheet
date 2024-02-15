import React, { useState, useEffect } from 'react'

const Messages = ({ socket }) => {

  const [messages, setMessages] = useState([]);
  useEffect(() => {
    // Event listener for incoming messages
    socket.on("message", (message) => {
      // Update the messages state with the new message
      setMessages(prevMessages => [...prevMessages, message]);
    });

    // Clean up event listener when the component unmounts
    return () => {
      socket.off("message");
    };
  }, [socket]);

  return (
    <div className='h-48'>
      <ul>
        {
          messages.map((msg) => (
            <li>{msg}</li>
          ))
        }
      </ul>
    </div>
  )
}

export default Messages 
