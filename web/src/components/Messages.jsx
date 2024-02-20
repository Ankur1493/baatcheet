import { useUser } from '@clerk/clerk-react';
import React, { useState, useEffect } from 'react'

const Messages = ({ socket }) => {

  const user = useUser();
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
            <li className='py-1' key={index}>
              <div className='flex mx-32  h-[32px] items-center bg-sky-950 rounded-[10px] text-white w-fit border-sky-50 border-[1px]'>
                <div className='mx-6'>{msg}</div>
              </div>
            </li>
          ))
        }
      </ul>
    </div>
  )
}

export default Messages 
