import React, { useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import { useFriend } from '../friendContext';
const Input = ({ socket }) => {

  const [message, setMessage] = useState("")
  const user = useUser();
  const { selectedFriend } = useFriend();

  const handleMessageChange = (event) => {
    setMessage(prevMessage => prevMessage = event.target.value)
  }

  const getRoomId = () => {
    const usernames = [user.user.username, selectedFriend].sort();
    return usernames.join('_');
  }

  const handleSubmit = () => {
    console.log("Message Sent")
    if (!message.length) {
      return;
    }
    const roomId = getRoomId();
    console.log(roomId)
    socket.emit("message", { message, roomId });
    setMessage("")
  }

  return (
    <div className='px-8 fixed bottom-24' >
      <div>
        <input className='h-24 w-[450px] text-[16px] px-3 bg-pink-50 border-red-100 border-[2px] rounded-[10px]' placeholder='enter your message' value={message} onChange={handleMessageChange} />
      </div>
      <div>
        <button className='w-[210px] h-8 mt-4 rounded-[10px] border-red-100 border-[2px] text-center bg-pink-50' onClick={handleSubmit} >Send</button>
      </div>
    </div >
  )
}

export default Input
