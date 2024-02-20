import { io } from "socket.io-client";
import { SignInButton, SignOutButton, SignedIn, SignedOut } from "@clerk/clerk-react";
import FriendRequest from "./components/FriendRequest";
import ChatContainer from "./components/ChatContainer";

export default function App() {
  const socket = io("http://localhost:8000", {
    withCredentials: true,
    extraHeaders: {
      "my-custom-header": "abcd"
    }
  });

  return (
    <div className="">
      <SignedIn>
        <SignOutButton />
        <FriendRequest socket={socket} />
        <ChatContainer socket={socket} />
      </SignedIn>
      <SignedOut>
        <SignInButton />
      </SignedOut>
    </div>
  );
}

