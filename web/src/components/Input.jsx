import React, { useState } from 'react'

const Input = ({ socket }) => {

  const [message, setMessage] = useState("")

  const handleMessageChange = (event) => {
    setMessage(prevMessage => prevMessage = event.target.value)
  }

  const handleSubmit = () => {
    console.log("Message Sent")
    if (!message.length) {
      return;
    }

    socket.emit("message", message);
    setMessage("")
  }

  return (
    <div>
      <div>
        <input placeholder='enter your message' value={message} onChange={handleMessageChange} />
      </div>
      <div>
        <button onClick={handleSubmit} >Send</button>
      </div>
    </div>
  )
}

export default Input
