import React, { useState, ChangeEvent, KeyboardEvent } from "react";

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

  return (
    <div className="input-box">
      {loading && <progress style={{ width: "100%" }} />}
      <input
        disabled={loading}
        type="text"
        className="form-control"
        placeholder="Type a message..."
        value={loading ? "Loading..." : input}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setInput(e.target.value)
        }
        onKeyPress={handleKeyPress}
      />
    </div>
  );
};

export default InputBox;
