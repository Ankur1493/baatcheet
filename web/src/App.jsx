
import Messages from "./components/Messages";
import Input from "./components/Input";
import ConnectionTestButton from "./components/ConnectionTestButton";
import { io } from "socket.io-client";
import { SignInButton, SignOutButton, SignedIn, SignedOut } from "@clerk/clerk-react";

export default function App() {
  const socket = io("http://localhost:3000", {
    withCredentials: true,
    extraHeaders: {
      "my-custom-header": "abcd"
    }
  });

  return (
    <div className="">
      <SignedIn>
        <SignOutButton />
        <Messages socket={socket} />
        <Input socket={socket} />
        <ConnectionTestButton socket={socket} />
      </SignedIn>
      <SignedOut>
        <SignInButton />
      </SignedOut>
    </div>
  );
}

