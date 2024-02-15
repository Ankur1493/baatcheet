import React, { useState } from 'react'

const Messages = () => {

  const [messages, setMessages] = useState([]);

  return (
    <div>
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
