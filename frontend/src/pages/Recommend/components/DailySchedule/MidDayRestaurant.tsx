import { Modal } from "antd";
import React, { useState } from "react";
import { BsDashLg } from "react-icons/bs";
import { FaLocationDot, FaMap, FaStar, FaUtensils } from "react-icons/fa6";
import { NumericFormat } from "react-number-format";
import { TripAdvisor } from "../../../../assets/WebAvatar";

const MidDayRestaurant: React.FC<{ data: any }> = ({ data }) => {
  console.log("restaurant: ", data);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const mapData = `https://maps.google.com/maps?q=${data.latitude},${data.longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  return (
    <div>
      <Modal
        centered
        width={800}
        open={isModalOpen}
        title={"Map"}
        styles={{
          header: { height: 20 },
          body: {
            overflowY: "auto",
            paddingRight: 10,
            maxHeight: "calc(100vh - 200px)",
          },
        }}
        onCancel={handleCancel}
        footer={[]}
      >
        <div className="flex flex-col">
          <iframe
            width="700"
            height="400"
            className="rounded self-center"
            src={mapData}
          ></iframe>
        </div>
      </Modal>
      <div className="flex flex-row justify-between items-start">
        <div className="flex flex-col gap-1">
          <div className="flex flex-row gap-4 items-center">
            <div className="flex flex-row items-center gap-3 text-xl font-bold font-customCardTitle">
              <FaUtensils /> <span>{data.name}</span>
            </div>
            {data.rating && (
              <>
                <BsDashLg color="#858585CC" size={18} />
                <div className="flex flex-row gap-1 items-center">
                  <div className="font-customDetail font-semibold text-xl">
                    {data.rating}
                  </div>
                  <FaStar color="#FCF55F" size={18} />
                </div>
              </>
            )}
          </div>
          <div className="flex flex-row gap-4 items-center">
            <div className="flex flex-row gap-1.5 items-center">
              <FaLocationDot size={16} color="#858585CC" />
              <p className="font-customDetail text-md text-gray-500">
                {data.province}
              </p>
            </div>
            <button
              onClick={showModal}
              className="bg-green-400 flex flex-row items-center gap-1 px-2 py-1 rounded-md"
            >
              <FaMap size={20} color="white" />
              <span className="text-white font-semibold font-customDetail">
                Map
              </span>
            </button>
          </div>
        </div>
        <div className="flex flex-col place-items-end">
          <span className="text-gray-400 text-md font-customDetail font-semibold">
            Starting from
          </span>
          <div className="flex flex-row gap-1">
            <NumericFormat
              thousandSeparator
              displayType="text"
              style={{ height: 20, borderRadius: 5 }}
              className="text-green-400 font-bold font-customDetail text-xl"
              value={data.price}
            />
            <span className="text-green-400 font-customDetail font-bold text-xl">
              VND
            </span>
          </div>
          {data.price !== 0 && (
            <div className="text-gray-400 text-md font-customDetail font-semibold">
              / meal
            </div>
          )}
        </div>
      </div>
      <div className="text-md mt-4 text-start font-customDetail">
        Style : {data.style}
      </div>
      <button
        className="flex flex-row gap-2 py-2 px-2 mt-2 border-green-400 border rounded"
        onClick={() => {}}
      >
        <div className="text-green-400 font-customCardTitle font-bold">
          More on
        </div>
        <img
          src={TripAdvisor}
          className="w-28 h-6"
          onClick={() => {
            window.open(data.link, "_blank");
          }}
        />
      </button>
      <img src={data.image} className="mt-4 h-96 w-full rounded-xl" />
    </div>
  );
};

export default MidDayRestaurant;
