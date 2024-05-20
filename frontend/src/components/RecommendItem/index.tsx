import React from "react";
import { MdOutlineSchedule } from "react-icons/md";
// import recommends from "./fakerData"

import {
  FaCarSide,
  FaHotel,
  FaLongArrowAltRight,
  FaStar,
} from "react-icons/fa";
import { FcLike } from "react-icons/fc";
import { IoTodayOutline } from "react-icons/io5";
import { TiWeatherPartlySunny } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../utils/date-formatter";

const RecommendItem: React.FC<any> = ({ recommend }: { recommend: any }) => {
  const navigate = useNavigate();
  console.log(recommend);
  // parse to dd-mm-yyyy
  const startDate = formatDate(new Date(recommend.startDate));
  const endDate = formatDate(new Date(recommend.endDate));
  const output: any = recommend.output;
  let sumCost: number = 0;
  if (output.vehicles) {
    if (output.vehicles.length > 0) {
      sumCost += output.vehicles[0].price;
    }
    if (output.vehicles.length > 1) {
      sumCost += output.vehicles[1].price;
    }
  }
  if (output.hotel) {
    sumCost += output.hotel.price;
  }
  if (output.dailySchedules) {
    output.dailySchedules.forEach((dailySchedule: any) => {
      if (dailySchedule.schedule.morning)
        sumCost += dailySchedule.schedule.morning.price;
      if (dailySchedule.schedule.afternoon)
        sumCost += dailySchedule.schedule.afternoon.price;
      if (dailySchedule.midDayRestaurant)
        sumCost += dailySchedule.midDayRestaurant.price;
      if (dailySchedule.afternoonRestaurant)
        sumCost += dailySchedule.afternoonRestaurant.price;
    });
  }

  return (
    <div className="shadow  flex-1 flex m-5 rounded-2xl pr-2 transition ease-in-out delay-150  hover:-translate-y-3 hover:shadow-2xl duration-300">
      <div
        className="flex-2 mr-3"
        style={{
          width: "300px",
          height: "400px",
          position: "relative",
          overflow: "hidden",
          borderRadius: "20px",
        }}
      >
        <img
          className="rounded-xl overflow-hidden"
          style={{
            width: "300px",
            height: "400px",
          }}
          src={output.dailySchedules[0].schedule.morning.img_url}
          alt=""
        />
      </div>
      <div className="flex-1 flex flex-col text-xl text-semibold h-100">
        <div className="font-bold">
          {recommend.departure}{" "}
          {recommend.destination != recommend.departure &&
            " - " + recommend.destination}{" "}
        </div>
        <div className="flex justify-start items-center text-sm">
          <MdOutlineSchedule />
          <p className="m-2">{startDate}</p> <FaLongArrowAltRight />{" "}
          <span className="m-2">{endDate}</span>
        </div>
        {output.vehicles && (
          <div className="flex justify-start items-center text-sm mt-2">
            <FaCarSide />
            <span className="ml-2"></span> {output.vehicles[0]?.type} -{" "}
            {output.vehicles[0]?.brand}
          </div>
        )}

        {output.hotel && (
          <div className="flex justify-start items-center text-sm mt-2">
            <FaHotel />
            <span className="ml-2"></span> {output.hotel.name} -{" "}
            {output.hotel.rating} <FaStar color="#FFC107" />
          </div>
        )}

        {output.weather && (
          <div className="flex justify-start items-center text-sm mt-2">
            <TiWeatherPartlySunny />
            <span className="ml-2"></span> {output.weather.description} -{" "}
            {output.weather.temperature} ℃
          </div>
        )}

        {output.dailySchedules.map((dailySchedule: any, index: number) => {
          return (
            <div className=" flex items-start  text-sm mt-2">
              <div className="w-fit flex justify-start items-center mr-1">
                <IoTodayOutline /> <span className="ml-2"></span> Day{" "}
                {index + 1}:{" "}
              </div>

              <ul className="">
                <li className="text-left">
                  {dailySchedule.schedule.morning.name}
                </li>
                <li className="text-left">
                  {dailySchedule.schedule.afternoon.name}
                </li>
              </ul>
            </div>
          );
        })}

        <div className="flex justify-start items-center text-sm mt-2">
          <FcLike /> <span className="ml-2"></span>
          {(recommend.count + 2) * 100} people interested
        </div>

        <div className="font-bold mt-3 ">
          {new Intl.NumberFormat().format(sumCost)} VND
        </div>
        <button
          className=" self-center w-3/4 text-white border-none rounded-lg bg-green-400 px-4 py-2 font-bold text-xl mt-auto mb-2"
          onClick={async () => {
            navigate("/recommend", { state: { myObj: recommend.output } });
          }}
        >
          View More
        </button>
      </div>
    </div>
  );
};

export default RecommendItem;
