import React, { useState } from "react";
import { TRestaurant } from "../../restaurant";
import { FaLocationDot, FaUtensils, FaStar } from "react-icons/fa6";
import { Modal, Divider } from "antd";
import { NumericFormat } from "react-number-format";

const RestaurantCard: React.FC<{ data: TRestaurant }> = ({ data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const mapData = `https://maps.google.com/maps?q=${parseFloat(
    data.latitude
  )},${parseFloat(data.longitude)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  return (
    <>
      <Modal
        centered
        width={800}
        open={isModalOpen}
        title={"Detail"}
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
        <div className="flex flex-col gap-1">
          <div className="flex flex-row justify-between items-start">
            <div>
              <div className="flex flex-row items-center gap-6">
                <div className="text-2xl font-bold font-customTitle">
                  {data.name}
                </div>
                <div className="flex flex-row items-center gap-1">
                  <div className="text-lg font-customTitle">{data.rating}</div>
                  <FaStar size={12} color="#858585CC" />
                </div>
              </div>
              <div className="font-customDetail text-md">{data.style}</div>
              <button
                className="text-md px-4 py-2 mt-2 bg-green-400 text-white font-customTitle font-bold rounded"
                onClick={() => {
                  window.open(data.link, "_blank");
                }}
              >
                More Detail
              </button>
            </div>
            <div className="flex flex-col place-items-end">
              <span className="text-sm font-customDetail">Starting from</span>
              <div className="flex flex-row gap-1">
                <NumericFormat
                  thousandSeparator
                  displayType="text"
                  style={{ height: 25, borderRadius: 5 }}
                  className="text-green-400 font-bold font-customDetail text-xl"
                  value={data.price}
                />
                <span className="text-green-400 font-customDetail font-bold text-xl">
                  VND
                </span>
              </div>
              {data.price !== 0 && (
                <div className="text-gray-400 text-md font-customDetail font-semibold">
                  / day
                </div>
              )}
            </div>
          </div>
          <Divider />
          <div className="text-xl font-customCardTitle font-semibold">
            Description
          </div>
          <p className="font-customDetail text-lg">{data.description}</p>
          <Divider />
          <div className="text-xl font-customCardTitle font-semibold">
            Image
          </div>
          <img src={data.image} className="w-full rounded-lg" height={400} />
          <Divider />
          <div className="text-xl font-customCardTitle font-semibold">
            Location / Map
          </div>
          <iframe
            width="700"
            height="400"
            className="rounded self-center"
            src={mapData}
          ></iframe>
        </div>
      </Modal>
      <button
        key={data._id}
        className="flex flex-row border-gray-100 border-t bg-white items-start shadow-md rounded-lg hover:-translate-y-3 transition duration-500 ease-out"
      >
        <div className="basis-2/5">
          <img src={data.image} className="w-96 h-60 rounded-lg" />
        </div>
        <div className="basis-3/5 w-full h-full py-2 flex flex-col px-4 justify-between">
          <div className="flex flex-col gap-4">
            <div className="flex flex-row justify-between items-start w-full">
              <div className="self-start flex flex-col gap-3 max-w-80">
                <div className="flex font-semibold text-2xl text-start font-customTitle">
                  {data.name}
                </div>
                <div className="flex flex-row divide-x-2 items-center gap-6">
                  <div className="flex flex-row gap-2 items-center">
                    <FaLocationDot size={20} color="#858585CC" />
                    <p className="font-customDetail text-lg text-gray-400">
                      {data.province}
                    </p>
                  </div>
                  <div className="pl-4 flex flex-row gap-2 items-center">
                    <FaStar size={20} color="#858585CC" />
                    <p className="font-customDetail text-lg text-gray-400">
                      {data.rating}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col place-items-end">
                <div className="flex flex-row items-start gap-1">
                  <NumericFormat
                    thousandSeparator
                    displayType="text"
                    style={{ height: 25, borderRadius: 5 }}
                    className="text-green-400 font-bold font-customDetail text-xl"
                    value={data.price}
                  />
                  <span className="text-green-400 font-customDetail font-bold text-lg">
                    VND
                  </span>
                </div>
                <span className="text-gray-400 text-md font-semibold">
                  / person
                </span>
              </div>
            </div>
            <div className="flex flex-row gap-2 items-center">
              <FaUtensils size={20} color="#858585CC" />
              <p className="font-customDetail text-start text-lg text-gray-400">
                {data.style}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <hr style={{ height: 0.5 }} className="bg-gray-300 my-2" />
            <button
              className="bg-green-400 text-xl text-white py-2 font-customTitle font-bold rounded-sm"
              onClick={showModal}
            >
              View detail
            </button>
          </div>
        </div>
      </button>
    </>
  );
};

export default RestaurantCard;
