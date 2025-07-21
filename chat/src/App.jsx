import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./App.css";

const socket = io("http://localhost:3000");

function App() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState([]);
  const [roomId, setRoomId] = useState("");
  const [recipientId, setRecipientId] = useState("");
  const [mode, setMode] = useState("group"); // 'group' or 'private'

  useEffect(() => {
    socket.on("message_ack", (data) => {
      console.log(data);
    });

    socket.on("receive_message", (data) => {
      setResponse((prev) => [...prev, `[Group] ${data.user}: ${data.message}`]);
    });

    socket.on("receive_private_message", (data) => {
      setResponse((prev) => [...prev, `[Private] ${data.from}: ${data.message}`]);
    });

    socket.on("room_joined", (data) => {
      setResponse((prev) => [...prev, `[System]: ${data}`]);
    });

    return () => {
      socket.off("receive_message");
      socket.off("receive_private_message");
      socket.disconnect();
    };
  }, []);

  const handleJoinRoom = () => {
    if (roomId.trim()) {
      socket.emit("join_room", roomId);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (mode === "group") {
      socket.emit("send_room_message", { message, room: roomId });
    } else {
      socket.emit("private_message", { message, toSocketId: recipientId });
    }
    setMessage("");
  };

  return (
    <div>
      <h2>Chat App</h2>
      <div>
        <label>
          <input
            type="radio"
            checked={mode === "group"}
            onChange={() => setMode("group")}
          />
          Group Chat
        </label>
        <label>
          <input
            type="radio"
            checked={mode === "private"}
            onChange={() => setMode("private")}
          />
          Private Chat
        </label>
      </div>

      {mode === "group" ? (
        <div>
          <input
            type="text"
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <button onClick={handleJoinRoom}>Join Room</button>
        </div>
      ) : (
        <div>
          <input
            type="text"
            placeholder="Recipient Socket ID"
            value={recipientId}
            onChange={(e) => setRecipientId(e.target.value)}
          />
        </div>
      )}

      <form onSubmit={handleSend}>
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>

      <div style={{ marginTop: "20px" }}>
        <h4>Messages:</h4>
        {response.map((msg, i) => (
          <p key={i}>{msg}</p>
        ))}
      </div>
    </div>
  );
}

export default App;
