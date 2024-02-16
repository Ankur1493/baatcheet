import React, { useState } from 'react'
import { useUser } from '@clerk/clerk-react'

const FriendRequest = () => {

  const [friendUserName, setFriendUserName] = useState("")
  const user = useUser();
  const handleFriendUserNameChange = (e) => {
    setFriendUserName(friendUserName => friendUserName = e.target.value);
  }

  const sendFriendRequest = async () => {
    //send friend Request
    const request = { sender: user.user.username, receiver: friendUserName }
    console.log(request)
    try {
      const response = await fetch("http://localhost:8000/api/friend-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      })
      console.log(response)
      if (response.ok) {
        console.log('Friend request sent successfully');
      } else {
        console.error('Failed to send friend request:');
      }
    } catch (err) {
      console.error(err)
    }

  }

  return (
    <div className='h-20 bg-red-400'>
      <div>
        <input value={friendUserName} onChange={handleFriendUserNameChange} placeholder="enter friend's user name" />
      </div>
      <div>
        <button onClick={sendFriendRequest}>Send Request</button>
      </div>
    </div>
  )
}

export default FriendRequest
