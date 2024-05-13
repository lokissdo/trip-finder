import React, { Dispatch, SetStateAction } from "react";
import { FaHotel, FaLocationDot, FaPlane, FaUtensils } from "react-icons/fa6";

const ChipButton: React.FC<{
  labelName: string;
  setChoosen: Dispatch<SetStateAction<string>>;
  choosen: string;
}> = ({ labelName, setChoosen, choosen }) => {
  // console.log(choosen);
  return (
    <button
      className={
        choosen === labelName
          ? "flex flex-row items-center gap-2 border border-green-400 p-2 rounded-3xl bg-green-400"
          : "flex flex-row items-center gap-2 border p-2 rounded-3xl"
      }
      onClick={() => {
        setChoosen(labelName);
      }}
    >
      <span
        className={
          choosen === labelName ? "text-white text-lg" : "text-black text-lg"
        }
      >
        {labelName}
      </span>
      {labelName === "Vehicle" && (
        <FaPlane
          size={20}
          className={choosen === labelName ? "text-white" : "text-black"}
        />
      )}
      {labelName === "Restaurant" && (
        <FaUtensils
          size={20}
          className={choosen === labelName ? "text-white" : "text-black"}
        />
      )}
      {labelName === "Hotel" && (
        <FaHotel
          size={20}
          className={choosen === labelName ? "text-white" : "text-black"}
        />
      )}
      {labelName === "Attraction" && (
        <FaLocationDot
          size={20}
          className={choosen === labelName ? "text-white" : "text-black"}
        />
      )}
    </button>
  );
};

export default ChipButton;
