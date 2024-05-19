import React from "react";
import { FaLocationDot } from "react-icons/fa6";

const MidDaySchedule: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div>
      <div className="text-xl font-bold">{data.name}</div>
      <img src={data.img_url} className="w-full rounded-xl" />
      <div className="flex flex-row gap-1.5 items-center">
        <FaLocationDot size={20} color="#858585CC" />
        <p className="font-customDetail text-lg text-gray-600">
          {data.address}
        </p>
      </div>
      <div>{data.description}</div>
    </div>
  );
};

export default MidDaySchedule;
