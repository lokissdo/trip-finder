import React from "react";
import Navbar from "../../components/Navbar";
import { useLocation } from "react-router-dom";
import SearchBar from "../../components/Search";
import { FaLocationDot } from "react-icons/fa6";

const Recommend: React.FC = () => {
  const { state } = useLocation();
  console.log(state.myObj); // {myOgj: obj}
  const data = state.myObj;
  const weather = data.weather;
  const dailySchedules = data.dailySchedules;
  return (
    <div>
      <div className="px-12 py-4 shadow-md">
        <Navbar />
      </div>
      <div className="px-40">
        <SearchBar />
      </div>
      {data && (
        <div className="mx-auto w-5/6">
          <div className="flex flex-row gap-5">
            <div className="basis-1/3">
              <div>Sidebar</div>
              <div>điều chỉnh tiền</div>
              <div>chọn option ưu tiên</div>
              <div>Chon useroption</div>
            </div>
            <div className="basis-2/3 flex flex-col gap-4">
              <div>{weather.city}</div>
              <div>temperature: {weather.temperature}</div>
              <div>{weather.description}</div>
              <div>
                {dailySchedules.map((day: any, index: number) => {
                  const dayData = day.schedule;
                  return (
                    <div key={index}>
                      <div className="font-semibold text-lg">
                        day {index + 1} : {dayData.morning.name},
                        {dayData.afternoon.name}
                      </div>
                      <div className="text-lg font-semibold">
                        {dayData.morning.name}
                      </div>
                      <img
                        src={dayData.morning.img_url}
                        width={500}
                        height={400}
                      />
                      <div className="flex flex-row gap-1.5 items-center">
                        <FaLocationDot size={20} color="#858585CC" />
                        <p className="font-customDetail text-lg text-gray-600">
                          {dayData.morning.address}
                        </p>
                      </div>
                      <div>{dayData.morning.description}</div>
                      <div className="text-lg font-semibold">
                        {dayData.afternoon.name}
                      </div>
                      <img
                        src={dayData.afternoon.img_url}
                        width={500}
                        height={400}
                      />
                      <div className="flex flex-row gap-1.5 items-center">
                        <FaLocationDot size={20} color="#858585CC" />
                        <p className="font-customDetail text-lg text-gray-600">
                          {dayData.afternoon.address}
                        </p>
                      </div>
                      <div>{dayData.afternoon.description}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recommend;
