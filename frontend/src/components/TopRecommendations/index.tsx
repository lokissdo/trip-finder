import React, { useEffect, useState } from "react";
import { DatePicker, Spin } from "antd";
import type { GetProps } from "antd";
import dayjs from "dayjs";
import { MdOutlineSchedule } from "react-icons/md";
import recommends from "./fakerData"
import { FaCarSide, FaHotel, FaLongArrowAltRight, FaStar } from "react-icons/fa";
import { FcLike } from "react-icons/fc";
import { IoTodayOutline } from "react-icons/io5";
import { TiWeatherPartlySunny } from "react-icons/ti";
type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;
const disabledDate: RangePickerProps["disabledDate"] = (current) => {
  // Can not select days before today and today
  return current && current < dayjs().endOf("day");
};
const formatDate = (date: Date) => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Tháng trong JavaScript bắt đầu từ 0
  const year = date.getFullYear().toString(); // Lấy 2 chữ số cuối của năm
  return `${day}-${month}-${year}`;
};

const renderRecommendation = (recommend: any) => {
  console.log(recommend)
  // parse to dd-mm-yyyy
  const startDate = formatDate(new Date(recommend.startDate))
  const endDate = formatDate(new Date(recommend.endDate))
  const output: any = recommend.output
  var sumCost: number = 0
  if (output.vehicles) {
    if (output.vehicles.length > 0) {
      sumCost += output.vehicles[0].price

    } if (output.vehicles.length > 1) {
      sumCost += output.vehicles[1].price

    }
  }
  if (output.hotel) {
    sumCost += output.hotel.price
  }
  if (output.dailySchedules) {
    output.dailySchedules.forEach((dailySchedule: any) => {
      if (dailySchedule.schedule.morning)
        sumCost += dailySchedule.schedule.morning.price
      if (dailySchedule.schedule.afternoon)
        sumCost += dailySchedule.schedule.afternoon.price
      if (dailySchedule.midDayRestaurant)
        sumCost += dailySchedule.midDayRestaurant.price
      if (dailySchedule.afternoonRestaurant)
        sumCost += dailySchedule.afternoonRestaurant.price
    })
  }

  return (




    <div className="shadow  flex-1 flex m-5 rounded-2xl pr-2 transition ease-in-out delay-150  hover:-translate-y-3 hover:shadow-2xl duration-300">
      <div className="flex-2 mr-3" style={
        {
          width: "300px",
          height: "400px",
          position: "relative",
          overflow: "hidden",
          borderRadius: "20px"
        }
      }>
        <img className="rounded-xl overflow-hidden" style={{
          width: "300px",
          height: "400px",
        }} src={output.dailySchedules[0].schedule.morning.img_url} alt="" />

      </div>
      <div className="flex-1 flex flex-col text-xl text-semibold h-100">


        <div className="font-bold">{recommend.departure}  {(recommend.destination != recommend.departure) && ( " - " +  recommend.destination )}  </div>
        <div className="flex justify-start items-center text-sm">
          <MdOutlineSchedule />
          <p className="m-2">{startDate}</p>   <FaLongArrowAltRight />  <span className="m-2">{endDate}</span>
        </div>
        {output.vehicles && (
          <div className="flex justify-start items-center text-sm mt-2">
            <FaCarSide /><span className="ml-2"></span> {output.vehicles[0]?.type} -  {output.vehicles[0]?.brand}
          </div>
        )}

        {output.hotel && (
          <div className="flex justify-start items-center text-sm mt-2">
            <FaHotel /><span className="ml-2"></span> {output.hotel.name} - {output.hotel.rating}  <FaStar color="#FFC107" />
          </div>
        )}

        {output.weather && (
          <div className="flex justify-start items-center text-sm mt-2">
            <TiWeatherPartlySunny /><span className="ml-2"></span> {output.weather.description} - {output.weather.temperature}  ℃
          </div>
        )}




        {output.dailySchedules.map((dailySchedule: any, index: number) => {
          return (
            <div className=" flex items-start  text-sm mt-2">
              <div className="w-fit flex justify-start items-center mr-1" ><IoTodayOutline /> <span className="ml-2"></span> Day {index + 1}: </div>

              <ul className="" >
                <li className="text-left">{dailySchedule.schedule.morning.name}</li>
                <li className="text-left">{dailySchedule.schedule.afternoon.name}</li>

              </ul>
            </div>
          )
        })}


        <div className="flex justify-start items-center text-sm mt-2">
          <FcLike /> <span className="ml-2"></span>{(recommend.count + 2) * 100} people interested
        </div>


        <div className="font-bold mt-3 ">{(new Intl.NumberFormat()).format(sumCost)} VND</div>
        <button
          className=" self-center w-3/4 text-white border-none rounded-lg bg-green-400 px-4 py-2 font-bold text-xl mt-auto mb-2"
          onClick={async () => {

          }}
        >
          View More
        </button>
      </div>
    </div>
  )
}
const { RangePicker } = DatePicker;
const TopRecommendations: React.FC = () => {
  const [from, setFrom] = useState<{ value: string; label: string } | null>(
    null
  );
  const [to, setTo] = useState<{ value: string; label: string } | null>(null);
  // const [recommends, setRecommends] = useState<any>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  useEffect(() => {
    // getTopRecommend().then((response) => {
    //   setRecommends(response);
    //   console.log(response);
    // });
  }, []);
  return (
    <>
      <div className="center w-full">
        <div className="text-3xl font-semibold">
          Explore Our Popuplar Recommendations

        </div>
        <div className="center mt-3 text-xl font-thin">
          Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit
        </div>


      </div>
      {recommends.length >= 4 &&
        <div className="w-4/5 center flex flex-col m-auto mt-7">
          <div className="w-100 flex basis-2">
            {renderRecommendation(recommends[0])}
            {renderRecommendation(recommends[1])}

          </div>
          <div className="w-100 flex basis-2">
            {renderRecommendation(recommends[2])}
            {renderRecommendation(recommends[3])}
          </div>
        </div>
      }

    </>
  );
};

export default TopRecommendations;
