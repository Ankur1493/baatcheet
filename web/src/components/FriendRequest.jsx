import React, { useState } from 'react'

const FriendRequest = () => {

  const [friendUserName, setFriendUserName] = useState("")

  const handleFriendUserNameChange = (e) => {
    setFriendUserName(friendUserName => friendUserName = e.target.value);
  }

  const sendFriendRequest = () => {
    //send friend Request
    setFriendUserName("")
    console.log("request send");
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
