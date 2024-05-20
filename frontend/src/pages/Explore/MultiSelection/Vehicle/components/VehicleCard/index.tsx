import React, { useState } from "react";
import { TVehicle } from "../../vehicle";
import { BsDot, BsThreeDotsVertical } from "react-icons/bs";
import { FaStar, FaBusSimple, FaPlane, FaLocationDot } from "react-icons/fa6";
import { NumericFormat } from "react-number-format";
import { Modal } from "antd";

const VehicleCard: React.FC<{ data: TVehicle }> = ({ data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const isodate = new Date(data.date);
  const localedateformat = isodate.toLocaleDateString("en-US");
  const initialImage =
    "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8YnVzfGVufDB8MHwwfHx8MA%3D%3D";
  return (
    <>
      <Modal
        centered
        width={800}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[]}
      >
        <div>{data._id}</div>
      </Modal>
      <button
        onClick={showModal}
        key={data._id}
        className="flex flex-row border-gray-100 border-t bg-white items-center shadow-md rounded-lg"
      >
        <img
          src={data.img_url ?? initialImage}
          className="h-4/5 w-60 rounded-lg m-auto"
        />
        <div className="w-full flex flex-row px-4 py-4 justify-between items-center">
          <div className="self-start flex flex-col gap-2">
            <div className="flex flex-row gap-5 divide-x-2">
              <div className="flex font-semibold text-2xl font-customCardTitle">
                {data.brand}
              </div>
              {data.type === "Xe Khách" && (
                <div className="pl-4 flex flex-row gap-2 items-center">
                  <FaStar size={20} color="#858585CC" />
                  <p className="font-customDetail text-lg text-gray-400">
                    {data.rating}
                  </p>
                </div>
              )}
            </div>
            <div className="flex text-md font-customDetail">{data.detail}</div>
            <div className="flex flex-row gap-2 items-center font-semibold">
              {data.type === "Xe Khách" && (
                <FaBusSimple size={20} color="#808080" />
              )}
              {data.type === "Máy Bay" && <FaPlane size={20} color="#808080" />}
              <p className="font-customDetail text-md text-icon">
                {data.departure}
              </p>
              <BsDot color="#808080" />
              <p className="font-customDetail text-md font-thin text-icon">
                {data.departureTime}
              </p>
              <BsDot color="#808080" />
              <p className="font-customDetail text-md font-thin text-icon">
                {localedateformat}
              </p>
            </div>
            <div className="flex flex-row gap-2">
              <BsThreeDotsVertical size={20} color="#d3d3d3" />
              <p className="text-sm text-gray-400">{data.duration}</p>
            </div>
            <div className="flex flex-row gap-2 items-center">
              <FaLocationDot size={20} color="#808080" />
              <p className="font-customDetail text-md font-semibold text-icon">
                {data.arrival}
              </p>
            </div>
          </div>
          <div className="flex flex-col place-items-end">
            <div className="flex flex-row gap-1">
              <NumericFormat
                thousandSeparator
                displayType="text"
                style={{ height: 38, borderRadius: 5 }}
                className="text-green-400 font-bold font-customDetail text-xl"
                value={data.price}
              />
              <span className="text-green-400 font-customDetail font-bold text-xl">
                VND
              </span>
            </div>
            {data.price !== 0 && (
              <div className="text-gray-400 text-sm font-customDetail font-semibold">
                / person
              </div>
            )}
          </div>
        </div>
      </button>
    </>
  );
};

export default VehicleCard;
