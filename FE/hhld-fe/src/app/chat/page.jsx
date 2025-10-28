"use client";
import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

const ChatBox = () => {
  const [msg, setMsg] = useState("");
  const [msgs, setMsgs] = useState([]); // each message: { text, sender: 'me' | 'other' }
  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState(
    () => localStorage.getItem("chatUsername") || ""
  );
  const [isUsernameSet, setIsUsernameSet] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const messagesEndRef = useRef(null);

  const connectSocket = () => {
    const newSocket = io("http://localhost:8080", {
      query: { username },
    });
    setSocket(newSocket);

    newSocket.on("chat msg", (incomingMsg) => {
      setMsgs((prev) => [
        ...prev,
        {
          text: incomingMsg.text,
          sender: incomingMsg.sender,
          isMe: false,
        },
      ]);
    });

    newSocket.on("users online", (users) => {
      setOnlineUsers(new Set(users));
    });

    return newSocket;
  };

  useEffect(() => {
    if (isUsernameSet && username) {
      const newSocket = connectSocket();
      return () => newSocket.close();
    }
  }, [isUsernameSet, username]);

  const sendMsg = (e) => {
    e.preventDefault();
    const msgToBeSent = {
      text: msg,
      sender: username,
      receiver: "all", // Using 'all' for broadcast messages
    };
    if (socket && msg.trim() !== "") {
      socket.emit("chat msg", msgToBeSent);
      setMsgs((prev) => [
        ...prev,
        {
          text: msgToBeSent.text,
          sender: username,
          isMe: true,
        },
      ]);
      setMsg("");
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  const handleSetUsername = (e) => {
    e.preventDefault();
    if (username.trim()) {
      localStorage.setItem("chatUsername", username);
      setIsUsernameSet(true);
    }
  };

  if (!isUsernameSet) {
    return (
      <div className="mt-130 bg-gray-200 p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Enter Your Name
          </h2>
          <form onSubmit={handleSetUsername} className="space-y-4">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your name..."
              className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Join Chat
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-130 bg-gray-200 p-8 rounded-lg shadow-lg w-full max-w-md">
      {/* Chat card */}
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        {/* Online users */}
        <div className="mb-4 p-2 bg-gray-100 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-600 mb-1">
            Online Users:
          </h3>
          <div className="flex flex-wrap gap-2">
            {Array.from(onlineUsers).map((user) => (
              <span
                key={user}
                className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm"
              >
                {user}
              </span>
            ))}
          </div>
        </div>

        {/* Messages container */}
        <div className="flex flex-col h-[60vh] overflow-hidden rounded-lg border border-gray-300">
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-100">
            {msgs.map((m, i) => (
              <div
                key={i}
                className={`space-y-1 ${m.isMe ? "ml-auto items-end" : ""}`}
              >
                <span className="text-xs text-gray-500 px-2">
                  {m.isMe ? "You" : m.sender}
                </span>
                <div
                  className={`p-3 rounded-lg w-fit max-w-[80%] 
                    ${
                      m.isMe
                        ? "bg-blue-600 text-white ml-auto"
                        : "bg-gray-300 text-gray-800"
                    }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={sendMsg}
            className="border-t border-gray-300 p-3 flex items-center gap-1.5 bg-gray-100"
          >
            <input
              type="text"
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
