import React from "react";

const MidDayRestaurant: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div>
      <div className="text-lg font-bold">{data.name}</div>
      <img src={data.image} className="w-full rounded-xl" />
      <div>{data.description}</div>
      <div>{data.rating}</div>
    </div>
  );
};

export default MidDayRestaurant;
