import React from "react";
import Navbar from "../../components/Navbar";
import { useLocation } from "react-router-dom";
import SearchBar from "../../components/Search";

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
        <div className="mx-auto w-4/5">
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
                      <div>day {index + 1}</div>
                      <div>{dayData.morning.name}</div>
                      <img
                        src={dayData.morning.img_url}
                        width={400}
                        height={300}
                      />
                      <div>{dayData.morning.description}</div>
                      <div>{dayData.afternoon.name}</div>
                      <img
                        src={dayData.afternoon.img_url}
                        width={400}
                        height={300}
                      />
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
