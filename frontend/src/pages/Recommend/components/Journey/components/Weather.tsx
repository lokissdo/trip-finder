import React from "react";
import {
  Cloudy,
  Foggy,
  Rainy,
  Sun,
  Windy,
} from "../../../../../assets/Weather";

const Weather: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="text-gray-200 text-xl font-semibold font-customCardTitle">
        {data.temperature} ℃
      </div>
      <div className="text-gray-200 text-md">{data.description}</div>
      {data.description.includes("clear") ? (
        <img src={Sun} className="mt-1" width={60} height={40} />
      ) : data.description.includes("rain") ? (
        <img src={Rainy} className="mt-1" width={60} height={40} />
      ) : data.description.includes("smoke") ? (
        <img src={Foggy} className="mt-1" width={60} height={40} />
      ) : data.description.includes("haze") ? (
        <img src={Windy} className="mt-1" width={60} height={40} />
      ) : (
        <div className="font-semibold text-gray-600">
          <img src={Cloudy} className="mt-1" width={60} height={40} />
        </div>
      )}
    </div>
  );
};

export default Weather;
