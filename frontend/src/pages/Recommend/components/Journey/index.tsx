import React, { useEffect, useState } from "react";
import DailySchedule from "../DailySchedule";
import HotelCard from "../../../Explore/MultiSelection/Hotel/components/HotelCard";
import VehicleCard from "../../../Explore/MultiSelection/Vehicle/components/VehicleCard";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../../../components/Navbar";
import { PutRecommendationToHistories } from "../../../Profile/hooks/history";
import { toast, ToastContainer } from "react-toastify";
import { Divider, FloatButton } from "antd";
import { fetchPageImage } from "./hooks/fetchPageImage";
import Weather from "./components/Weather";
const Journey: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const data = state.data;
  const weather = data.output.weather;
  const dailySchedules = data.output.dailySchedules;
  const vehicles = data.output.vehicles;
  const [saved, setSaved] = React.useState(false);
  const [imageList, setImageList] = useState<string[]>([]);
  const handleBackClick = () => {
    navigate(-1);
  };
  useEffect(() => {
    const fetchAvatar = async () => {
      await fetchPageImage(setImageList, weather.city);
    };
    fetchAvatar();
  }, []);
  window.scrollTo(0, 0);
  return (
    <div>
      <ToastContainer />
      <div className="px-12 py-4 shadow-md">
        <Navbar />
      </div>
      <div className="relative">
        <div style={{ height: 650 }} className="overflow-hidden">
          <div className="flex flex-row">
            <img src={imageList[0]} className="w-2/3" />
            <div>
              <img src={imageList[2]} />
              <img src={imageList[1]} />
            </div>
          </div>
          <div className="absolute top-80 left-32">
            <h3 className="text-9xl text-gray-300 font-semibold font-customCardTitle">
              {weather.city}
            </h3>
          </div>
          {weather && (
            <div className="absolute right-10 top-10 backdrop-blur-lg py-2 px-2 rounded-lg">
              <Weather data={weather} />
            </div>
          )}
          <button
            onClick={handleBackClick}
            className="absolute top-10 font-semibold text-xl left-10 bg-gray-300 rounded-xl p-2"
          >
            &larr; Back
          </button>
        </div>
      </div>

      <div className="flex justify-center items-center">
        <div className="flex w-3/5 flex-col gap-4">
          {data.hotel && (
            <>
              <Divider orientation="left">Hotel</Divider>
              <HotelCard data={data.hotel} />
            </>
          )}

          {vehicles && vehicles.length > 0 && (
            <>
              <Divider orientation="left">
                <span className="text-2xl text-gray-500 font-customCardTitle">
                  Vehicles
                </span>
              </Divider>
              {vehicles.map((data: any) => {
                return <VehicleCard data={data} />;
              })}
            </>
          )}
          {dailySchedules && dailySchedules.length > 0 ? (
            <>
              <Divider orientation="left">
                <span className="text-2xl text-gray-500 font-customCardTitle">
                  Journey
                </span>
              </Divider>
              <div className="flex flex-col">
                {dailySchedules.map((dayData: any, index: number) => {
                  return (
                    <>
                      <DailySchedule
                        dayData={dayData}
                        index={index}
                        key={index}
                      />
                      <Divider />
                    </>
                  );
                })}
              </div>
            </>
          ) : (
            "Không tồn tại lịch trình phù hợp nào"
          )}

          {!saved ? (
            <button
              onClick={async () => {
                const response = await PutRecommendationToHistories(data._id);
                if (response.status === 200) {
                  toast.success(
                    "Save successfully, go to profile to see your journey"
                  );
                  setSaved(true);
                  return;
                }
                toast.error("Save failed, please try again");
              }}
              className="mb-4 w-2/5 self-center text-white border-none rounded-lg bg-green-400 align-middle px-8 py-2 font-bold text-xl"
            >
              Save
            </button>
          ) : (
            <div className="text-center text-xl font-customTitle text-green-500">
              Saved
            </div>
          )}
        </div>
        <FloatButton.BackTop
          style={{ bottom: 30, right: 30 }}
          visibilityHeight={1000}
        />
      </div>
    </div>
  );
};

export default Journey;
