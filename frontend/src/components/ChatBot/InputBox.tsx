import React, { useState, ChangeEvent, KeyboardEvent } from "react";
import "./style.css";
import { Avatar } from 'antd';
import { SendOutlined } from '@ant-design/icons';

interface InputBoxProps {
  sendMessage: (message: string) => void;
  loading: boolean;
}

const InputBox: React.FC<InputBoxProps> = ({ sendMessage, loading }) => {
  const [input, setInput] = useState<string>("");

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input.trim() !== "") {
      sendMessage(input);
      setInput("");
    }
  };

  const handleSendButtonClick = () => {
    if (input.trim() !== "") {
      sendMessage(input);
      setInput("");
    }
  };

  return (
    <div className="input-box-container">
      <div className="input-box">
        {loading && <progress style={{ width: "100%" }} />}
        <input
          disabled={loading}
          type="text"
          style={{width:200}}
          className="form-control"
          placeholder="Type a message..."
          value={loading ? "Loading..." : input}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setInput(e.target.value)
          }
          onKeyPress={handleKeyPress}
        />
      </div>
      <Avatar
        className="send-icon"
        size={48}
        icon={<SendOutlined />}
        onClick={handleSendButtonClick}
      />
    </div>
  );
};

export default InputBox;
