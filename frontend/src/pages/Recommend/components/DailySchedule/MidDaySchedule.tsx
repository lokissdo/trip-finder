import { Modal } from "antd";
import React, { useState } from "react";
import { FaLocationDot, FaMap } from "react-icons/fa6";

const MidDaySchedule: React.FC<{ data: any }> = ({ data }) => {
  console.log("attraction: ", data);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const mapData = `https://maps.google.com/maps?q=${data.lat},${data.long}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
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
      <div className="flex flex-col gap-1">
        <div className="text-xl text-start font-bold font-customCardTitle">
          {data.name}
        </div>
        <div className="flex flex-row justify-between">
          <div className="flex flex-row gap-1.5 items-center">
            <FaLocationDot size={16} color="#858585CC" />
            <p className="font-customDetail text-md text-gray-500">
              {data.address}
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
        <p className="font-customDetail text-md text-start">
          {data.description}
        </p>
      </div>
      <img src={data.img_url} className="w-full rounded-xl" />
    </div>
  );
};

export default MidDaySchedule;
