import React from "react";
import { THotel } from "../../hotel";

const HotelCard: React.FC<{ data: THotel }> = ({ data }) => {
  return (
    <button
      key={data._id}
      className="flex flex-row border-gray-100 border-t bg-white items-center shadow-md rounded-lg"
    >
      <img src={data.image_url} className="h-4/5 w-60 rounded-lg" />
      <div className="m-auto flex flex-col gap-2">
        <div className="self-start flex">{data.name}</div>
        <span>{data.price}</span>
        <span>{data.rating}</span>
        <div>{data.checkin.substring(0, 16)}</div>
      </div>
    </button>
  );
};

export default HotelCard;
