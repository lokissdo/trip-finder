import React, { useState } from "react";
import { THotel } from "../../hotel";
import { Divider, Modal } from "antd";
import { FaLocationDot, FaStar } from "react-icons/fa6";
import { NumericFormat } from "react-number-format";
import { BsDot } from "react-icons/bs";
import {
  Agoda,
  Booking,
  Traveloka,
  TripAdvisor,
} from "../../../../../../assets/WebAvatar";

const HotelCard: React.FC<{ data: THotel }> = ({ data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const mapData = `https://maps.google.com/maps?q=${data.latitude},${data.longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
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
          <div className="flex flex-row justify-between items-center">
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
              <div className="font-customDetail text-md">{data.standard}</div>
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
                <div className="text-gray-400 text-md font-customDetail font-semibold">
                  / day
                </div>
              )}
            </div>
          </div>
          <div className="font-customCardTitle text-md">
            Check in :{" "}
            <span className="text-gray-400 font-semibold">
              {data.checkin.substring(0, 16)}
            </span>
          </div>
          <Divider />
          <div className="text-xl font-customCardTitle font-semibold">
            Image
          </div>
          <img src={data.image_url} className="w-full h-80 rounded-lg" />
          <Divider />
          <div className="text-xl font-customCardTitle font-semibold">
            Description
          </div>
          <p className="font-customDetail text-lg">{data.description}</p>
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
      <div
        key={data._id}
        className="flex flex-row border-gray-100 border-t w-full bg-white shadow-md rounded-lg hover:-translate-y-2 hover:shadow-xl transition ease-out"
      >
        <div className="basis-2/5">
          <img src={data.image_url} className="w-96 h-60 rounded-lg" />
        </div>
        <div className="basis-3/5 w-full py-1.5 px-4 flex flex-col justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex flex-row items-start justify-between gap-6">
              <div className="flex flex-col">
                <div className="text-2xl text-start font-bold font-customCardTitle">
                  {data.name}
                </div>
                <div className="flex flex-row items-center gap-3">
                  <div className="font-customDetail text-md">
                    {data.standard}
                  </div>
                  <BsDot color="#808080" />
                  <div className="flex flex-row items-center gap-1">
                    <div className="text-lg font-customDetail ">
                      {data.rating}
                    </div>
                    <FaStar size={12} color="#858585CC" />
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
                  / day
                </span>
                {data.platform === "Traveloka.com" ? (
                  <img
                    src={Traveloka}
                    className="mt-1"
                    width={100}
                    height={80}
                  />
                ) : data.platform === "Booking.com" ? (
                  <img src={Booking} className="mt-1" width={100} height={80} />
                ) : data.platform === "Agoda" ? (
                  <img src={Agoda} className="mt-1" width={90} height={70} />
                ) : data.platform === "Tripadvisor.com.vn" ? (
                  <img
                    src={TripAdvisor}
                    className="mt-1"
                    width={100}
                    height={80}
                  />
                ) : (
                  <div className="font-semibold text-gray-600">
                    {data.platform}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-row gap-2 items-center">
              <FaLocationDot size={20} color="#808080CC" />
              <div className="text-lg font-customDetail text-gray-600 font-semibold">
                {data.province}
              </div>
            </div>
            <div className="text-start font-customDetail">
              <span className="font-bold">Check in : </span>{" "}
              {data.checkin.substring(0, 16)}
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
      </div>
    </>
  );
};

export default HotelCard;
