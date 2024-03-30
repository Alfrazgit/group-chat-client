import React, { useState, useEffect } from "react";
import queryString from "query-string";
import io from "socket.io-client";
import InfoBar from "./../InfoBar/InfoBar.js";
import Input from "./../Input/Input.js";
import Messages from "../Messages/Messages.js";
import TextContainer from "../TextContainer/TextContainer.js";

import "./Chat.css";
import { useLocation } from "react-router";

const ENDPOINT = "https://group-chat-server-theta.vercel.app/";

// const ENDPOINT = "http://localhost:5000";

let socket;

const Chat = () => {
  const location = useLocation();

  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [users, setUsers] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);

    socket = io(
      process.env.ENDPOINT || "https://group-chat-server-theta.vercel.app/",
      {
        cors: {
          origin: ENDPOINT,
          credentials: true,
        },
        transports: ["websocket"],
      }
    );

    setRoom(room);
    setName(name);

    socket.emit("join", { name, room }, (error) => {
      if (error) {
        alert(error);
      }
    });
  });

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages((messages) => [...messages, message]);
    });

    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
  }, []);

  const sendMessage = (event) => {
    event.preventDefault();

    if (message) {
      socket.emit("sendMessage", message, () => setMessage(""));
    }
  };

  console.log(message, messages);

  return (
    <div className="outerContainer">
      <div className="container">
        <InfoBar room={room} />
        <Messages messages={messages} name={name} />
        <Input
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </div>
      <TextContainer users={users} />
    </div>
  );
};

export default Chat;
