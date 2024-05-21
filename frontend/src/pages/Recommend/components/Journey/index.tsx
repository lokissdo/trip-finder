import React from "react";
import DailySchedule from "../DailySchedule";
import HotelCard from "../../../Explore/MultiSelection/Hotel/components/HotelCard";
import VehicleCard from "../../../Explore/MultiSelection/Vehicle/components/VehicleCard";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../../../components/Navbar";
const Journey: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const data = state.data;
  const weather = data.weather;
  const dailySchedules = data.dailySchedules;
  const vehicles = data.vehicles;
  const handleBackClick = () => {
    navigate(-1)
  };

  return (


    <div>
      <div className="px-12 py-4 shadow-md">
        <Navbar />



      </div>
      <div className="flex justify-start">
      <button
          onClick={handleBackClick}
          className=" ml-10 mt-3 text-gray-900 bg-gray-200 rounded-full px-2 py-1 focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          &larr; Back
        </button>


        
      </div>
     

      <div className="flex justify-center items-center">
        <div className="flex w-3/5 flex-col gap-4">

          {weather && (
            <>
              <div>{weather.city}</div>
              <div>temperature: {weather.temperature} ℃</div>
              <div>{weather.description}</div>
            </>)}



          {data.hotel && (
            <>
              <div>Hotel</div>
              <HotelCard data={data.hotel} />
            </>)}

          {vehicles && vehicles.length > 0 && (
            <>
              <div>Vehicles</div>
              {vehicles.map((data: any) => {
                return <VehicleCard data={data} />;
              })}
            </>)}
          {
            (dailySchedules && dailySchedules.length > 0) ? (
              <>
                <div>Journey</div>
                <div>
                  {dailySchedules.map((dayData: any, index: number) => {
                    return <DailySchedule dayData={dayData} index={index} key={index} />;
                  })}
                </div>
              </>
            ) : "Không tồn tại lịch trình phù hợp nào"

          }



        <div>
            <button className=" mb-4 text-white border-none rounded-lg bg-green-400 align-middle px-8 font-bold text-xl">


            Save
          </button>
        </div>
        </div>

      </div>




    </div>



  );
};

export default Journey;
