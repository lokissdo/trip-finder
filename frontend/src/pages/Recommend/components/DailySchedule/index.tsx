import React from "react";
import MidDaySchedule from "./MidDaySchedule";
import MidDayRestaurant from "./MidDayRestaurant";

const DailySchedule: React.FC<{ dayData: any; index: number }> = ({
  dayData,
  index,
}) => {
  const schedule = dayData.schedule;
  const morningRestaurant = dayData.midDayRestaurant;
  const afternoonRestaurant = dayData.afternoonRestaurant;
  return (
    <div key={index}>
      <div className="font-semibold text-lg">
        Day {index + 1} : {schedule.morning.name}, {schedule.afternoon.name}
      </div>
      <MidDaySchedule data={schedule.morning} />
      {morningRestaurant &&  <MidDayRestaurant data={morningRestaurant} /> }

      <MidDaySchedule data={schedule.afternoon} />

      {afternoonRestaurant &&  <MidDayRestaurant data={afternoonRestaurant} /> }
    </div>
  );
};

export default DailySchedule;
