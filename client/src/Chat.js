import React, { useState, useEffect } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import { IoSendSharp } from "react-icons/io5";

function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const sentMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    let copy = false;
    socket.on("receive_message", (data) => {
      if (!copy) {
        setMessageList((list) => [...list, data]);
      }
    });

    return () => {
      copy = true;
    };
  }, [socket]);

  useEffect(() => {
    let copy = false;

    socket.on("new_join", (data) => {
      if (!copy) {
        setMessageList((list) => [...list, data]);
      }
    });
    return () => {
      copy = true;
    };
  }, [socket]);

  useEffect(() => {
    let copy = false;

    socket.on("new_left", (data) => {
      if (!copy) {
        setMessageList((list) => [...list, data]);
      }
    });
    return () => {
      copy = true;
    };
  }, [socket]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Live Chat : {username}</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent, i) => {
            return (
              <div
                className="message"
                id={
                  messageContent.username || messageContent.left
                    ? "join"
                    : username === messageContent.author
                    ? "you"
                    : "other"
                }
                key={i}
              >
                <div>
                  <div className="message-content">
                    <p>{messageContent.message}</p>
                    {messageContent.username &&
                      `${messageContent.username} joined chat`}
                    {messageContent.left &&
                      `${messageContent.left} lefted chat`}
                  </div>
                  <div className="message-meta">
                    <p id="time">{messageContent.time}</p>
                    <p id="author">{messageContent.author}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="Message.."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sentMessage();
          }}
        />
        <button onClick={sentMessage}>
          <IoSendSharp />
        </button>
      </div>
    </div>
  );
}

export default Chat;
