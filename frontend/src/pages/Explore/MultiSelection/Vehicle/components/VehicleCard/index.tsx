import React from "react";
import { TVehicle } from "../../vehicle";
import { BsDot } from "react-icons/bs";
import { FaStar, FaBusSimple, FaPlane, FaLocationDot } from "react-icons/fa6";
import { NumericFormat } from "react-number-format";
import AvatarCard from "./AvatarCard";

const VehicleCard: React.FC<{ data: TVehicle }> = ({ data }) => {
  const isodate = new Date(data.date);
  const localedateformat = isodate.toLocaleDateString("en-US");
  return (
    <>
      <div
        key={data._id}
        className="flex flex-row border-gray-100 border-t w-full bg-white items-start shadow-md rounded-lg hover:-translate-y-2 hover:shadow-xl transition ease-out"
      >
        <AvatarCard brand={data.brand} imageLink={data.img_url} />
        <div className="basis-3/5 w-full h-60 flex flex-col px-4 py-4 justify-between items-start">
          <div className="flex flex-row w-full justify-between">
            <div className="self-start flex flex-col gap-4">
              <div className="flex font-semibold text-2xl font-customCardTitle">
                {data.brand}
              </div>
              <div className="flex flex-row items-center gap-5 divide-x-2">
                <div className="flex text-md font-customDetail">
                  {data.detail}
                </div>
                {data.type === "Xe Khách" && (
                  <div className="pl-4 flex flex-row gap-2 items-center">
                    <FaStar size={16} color="#858585CC" />
                    <p className="font-customDetail text-md text-gray-400">
                      {data.rating}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex flex-row gap-2 items-center font-semibold">
                <div>Depart at : </div>
                <p className="font-customDetail text-md font-thin text-icon">
                  {data.departureTime}
                </p>
                <BsDot color="#808080" />
                <p className="font-customDetail text-md font-thin text-icon">
                  {localedateformat}
                </p>
              </div>
            </div>
            <div className="flex flex-col place-items-end">
              <div className="flex flex-row gap-1">
                <NumericFormat
                  thousandSeparator
                  displayType="text"
                  style={{ height: 25, borderRadius: 5 }}
                  className="text-green-400 font-bold font-customDetail text-xl"
                  value={data.price}
                />
                <span className="text-green-400 font-customDetail font-bold text-xl">
                  VND
                </span>
              </div>
              {data.price !== 0 && (
                <div className="text-gray-400 text-sm font-customDetail font-semibold">
                  / person
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-row w-full justify-around items-center">
            <div className="flex flex-row gap-2 items-center">
              {data.type === "Xe Khách" && (
                <FaBusSimple size={20} color="#808080" />
              )}
              {data.type === "Máy Bay" && <FaPlane size={20} color="#808080" />}
              <p className="font-customDetail text-md text-icon">
                {data.departure}
              </p>
            </div>
            <div className="flex flex-row items-center gap-3">
              <hr style={{ height: 0.5 }} className="bg-gray-300 w-20" />
              <p className="text-md text-gray-400">{data.duration}</p>
              <hr style={{ height: 0.5 }} className="bg-gray-300 w-20" />
            </div>
            <div className="flex flex-row gap-2 items-center">
              <FaLocationDot size={20} color="#808080" />
              <p className="font-customDetail text-md font-semibold text-icon">
                {data.arrival}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VehicleCard;
