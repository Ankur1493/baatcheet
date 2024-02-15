
import Messages from "./components/Messages";
import Input from "./components/Input";
import { io } from "socket.io-client";

export default function App() {
  const socket = io("http://localhost:3000", {
    withCredentials: true,
    extraHeaders: {
      "my-custom-header": "abcd"
    }
  });

  return (
    <div className="">
      <Messages />
      <Input />
    </div>
  );
}

