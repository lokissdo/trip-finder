import React, { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { GoogleGenerativeAI } from "@google/generative-ai";
import MDEditor from "@uiw/react-md-editor";
import InputBox from "./InputBox";
import { Avatar } from 'antd';
import { MessageOutlined, CloseOutlined } from '@ant-design/icons';

import "./style.css"; 

const API_KEY: string = "AIzaSyDINuMsM7lgc2JLtSS5ZpVBFasC1g2PIvA";
const genAI = new GoogleGenerativeAI(API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

interface Message {
  text: string;
  sender: string;
  timestamp: Date;
  isCode?: boolean;
}

// const Header: React.FC = () => {
//   return (
//     <div className="header">
//       <small>Xin chào, tôi có thể giúp gì cho bạn?</small>
//     </div>
//   );
// };

const ChatWindow: React.FC = () => {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    // Auto-scroll to the bottom of the chat container when new messages are added
    if (chatContainerRef.current)
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [messages]);

  const sendMessage = async (inputText: string) => {
    if (!inputText) {
      return;
    }

    // Update messages with the user message
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: inputText, sender: "user", timestamp: new Date() },
    ]);

    setLoading(true);

    try {
      const result = await model.generateContent(inputText);
      const text = await result.response.text();

      // Check if the response is code before updating messages
      const isCode = text.includes("```");

      // Update messages with the AI response
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: text,
          sender: "ai",
          timestamp: new Date(),
          isCode, // Add a flag to identify code snippets
        },
      ]);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("generateContent error: ", error);
    }
  };

  const [chatVisible, setChatVisible] = useState(false);
  // const inputRef = useRef<HTMLInputElement>(null); // Ref for input field

  const toggleChatWindow = () => {
    setChatVisible(!chatVisible);
  };

  const closeChatWindow = () => {
    setChatVisible(false);
  };

  // const handleSendButtonClick = () => {
  //   // Retrieve the input text from the input field
  //   const inputText = inputRef.current?.value || '';
  //   // Call sendMessage with the input text
  //   sendMessage(inputText);
  //   // Clear the input field after sending the message
  //   if (inputRef.current) {
  //     inputRef.current.value = '';
  //   }
  // };

  return (
    <>
      {!chatVisible && (
        <Avatar
          className="chat-icon"
          size={48}
          icon={<MessageOutlined />}
          onClick={toggleChatWindow}
        />
      )}
      <div id="chat-window" className={`chat-window ${chatVisible ? '' : 'hidden'}`}>
        <div className="chat-header">
          <span className="chat-title">Chatbot</span>
          <button className="close-button" onClick={closeChatWindow}>
            <CloseOutlined />
          </button>
        </div>
        <div className="chat-container" ref={chatContainerRef}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${message.sender === "user" ? "user" : "ai"
                }`}
            >
              {message.isCode ? (
                <MDEditor.Markdown
                  source={message.text}
                  style={{ whiteSpace: "pre-wrap" }}
                />
              ) : (
                <>
                  <p className="message-text">{message.text}</p>
                  <span
                    className={`time ${message.sender === "user" ? "user" : "ai"
                      }`}
                  >
                    {message.timestamp
                      ? dayjs(message.timestamp).format("HH:mm")
                      : ""}
                  </span>
                </>
              )}
            </div>
          ))}
        </div>
        <InputBox sendMessage={sendMessage} loading={loading} />
      </div>
    </>
  );
};

export default ChatWindow;
