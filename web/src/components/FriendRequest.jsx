import React, { useEffect, useState } from 'react'
import { useUser } from '@clerk/clerk-react'

const FriendRequest = () => {

  const [friendUserName, setFriendUserName] = useState("");
  const [friends, setFriends] = useState([]);
  const user = useUser();
  const handleFriendUserNameChange = (e) => {
    setFriendUserName(friendUserName => friendUserName = e.target.value);
  }

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/friends?userName=${user.user.username}`,);
        if (response.ok) {
          const data = await response.json();
          setFriends(data);
        } else {
          console.log("Failed to fetch friends.");
        }
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };

    fetchFriends();
  }, []);
  const sendFriendRequest = async () => {
    const request = { sender: user.user.username, receiver: friendUserName }
    console.log(request)
    try {
      const response = await fetch("http://localhost:8000/api/friend-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      })
      if (response.ok) {
        console.log('Friend request sent successfully');
        const data = response.json();
        setFriends(friends => [...friends, data]);
      } else {
        console.error('Failed to send friend request:');
      }
    } catch (err) {
      console.error(err)
    }

  }

  return (
    <div className='h-20 bg-red-400 flex justify-around'>
      <div>
        <h1>Your Friends</h1>
        <ul>
          {friends.length > 0 ? (


            friends.map(friend => (
              <li key={friend._id}>{friend.userName}</li>
            ))
          ) : (
            <h2>Send friend request to make friends</h2>
          )
          }
        </ul>
      </div>
      <div>
        <div>
          <input value={friendUserName} onChange={handleFriendUserNameChange} placeholder="enter friend's user name" />
        </div>
        <div>
          <button onClick={sendFriendRequest}>Send Request</button>
        </div>
      </div>
    </div>
  )
}

export default FriendRequest
