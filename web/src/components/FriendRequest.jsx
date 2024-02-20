import React, { useEffect, useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import { useFriend } from '../friendContext';

const FriendRequest = () => {

  const { selectedFriend, setSelectedFriend } = useFriend();

  const setActiveFriend = (username) => {
    setSelectedFriend(username)
  }

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
        console.log('Failed to send friend request:');
      }
    } catch (err) {
      console.error(err)
    }

  }

  return (
    <div className='h-36 w-full flex justify-between px-6'>
      <div>
        <h1 className='text-3xl font-bold text-sky-950'>Your Friends</h1>
        <ul className='text-[20px] flex flex-col flex-wrap px-6'>
          {friends.length > 0 ? (


            friends.map(friend => (
              <li key={friend._id} className={`list-disc ${selectedFriend ? 'text-red-300' : 'text-black'}`} ><button onClick={() => { setActiveFriend(friend.userName) }} > {friend.userName}</button></li>

            ))
          ) : (
            <h2 className='text-2xl text-red-300'>Send friend request to make friends</h2>
          )
          }
        </ul>
      </div>
      <div className='w-[400px]'>
        <div>
          <input className='w-[310px] h-12 rounded-[10px] border-red-100 border-[2px] text-center bg-pink-50' value={friendUserName} onChange={handleFriendUserNameChange} placeholder="enter friend's user name" />
        </div>
        <div>
          <button className='w-[210px] h-8 mt-4 rounded-[10px] border-red-100 border-[2px] text-center bg-pink-50' onClick={sendFriendRequest}>Send Request</button>
        </div>
      </div>
    </div >
  )
}

export default FriendRequest
