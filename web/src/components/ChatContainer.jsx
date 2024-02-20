import React from 'react'
import Messages from './Messages'
import Input from './Input'
import { useFriend } from '../friendContext'

const ChatContainer = ({ socket }) => {

  const { selectedFriend } = useFriend();

  return (
    <div>
      {
        selectedFriend !== null ?
          (
            <div>
              <Messages socket={socket} />
              <Input socket={socket} />
            </div>) : (
            <div className='text-4xl text-sky-950 font-medium px-8 fixed bottom-28'>Please Select a friend</div>
          )
      }
    </div>
  )
}

export default ChatContainer
