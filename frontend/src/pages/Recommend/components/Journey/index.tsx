import React from "react";
import DailySchedule from "../DailySchedule";
import HotelCard from "../../../Explore/MultiSelection/Hotel/components/HotelCard";
import VehicleCard from "../../../Explore/MultiSelection/Vehicle/components/VehicleCard";

const Journey: React.FC<{ data?: any }> = ({ data }) => {
  const weather = data.weather;
  const dailySchedules = data.dailySchedules;
  const vehicles = data.vehicles;
  return (
    <div className="flex flex-col gap-4">
      <div>{weather.city}</div>
      <div>temperature: {weather.temperature} ℃</div>
      <div>{weather.description}</div>
      <div>Hotel</div>
      <HotelCard data={data.hotel} />
      <div>Vehicles</div>
      {vehicles.map((data: any) => {
        return <VehicleCard data={data} />;
      })}
      <div>Journey</div>
      <div>
        {dailySchedules.map((dayData: any, index: number) => {
          return <DailySchedule dayData={dayData} index={index} key={index} />;
        })}
      </div>
    </div>
  );
};

export default Journey;
