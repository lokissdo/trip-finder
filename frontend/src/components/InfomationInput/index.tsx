import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import React, { useState } from "react";

const InformationInput: React.FC<{
  labelName: string;
  isPassword?: boolean;
}> = ({ labelName, isPassword }) => {
  const [isVisible, setIsVisible] = useState(!isPassword);
  return (
    <>
      {isPassword ? (
        <div className="relative">
          <input
            type={isVisible ? "text" : "password"}
            id="floating_outlined"
            className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-green-400 peer"
            placeholder=" "
          />
          <button
            className="end-2.5 bottom-2.5 absolute bg-transparent border-none p-0 focus:outline-none"
            onClick={() => setIsVisible(!isVisible)}
          >
            {isVisible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
          </button>
          <label
            htmlFor="floating_outlined"
            className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-green-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
          >
            {labelName}
          </label>
        </div>
      ) : (
        <div className="relative">
          <input
            type="text"
            id="floating_outlined"
            className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-green-400 peer"
            placeholder=" "
          />
          <label
            htmlFor="floating_outlined"
            className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-green-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
          >
            {labelName}
          </label>
        </div>
      )}
    </>
  );
};

export default InformationInput;
