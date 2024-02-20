import React, { createContext, useState, useContext } from "react";


const FriendContext = createContext();

export const FriendProvider = ({ children }) => {
  const [selectedFriend, setSelectedFriend] = useState(null);

  return (
    <FriendContext.Provider value={{ selectedFriend, setSelectedFriend }}>
      {children}
    </FriendContext.Provider>
  );
};

export const useFriend = () => useContext(FriendContext);

