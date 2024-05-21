import React, { useState } from "react";
import { TAttraction } from "../../attraction";
import { Modal, Divider } from "antd";
import { NumericFormat } from "react-number-format";
import { FaLocationDot, FaStar } from "react-icons/fa6";

const AttractionCard: React.FC<{ data: TAttraction }> = ({ data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  data.img_url =
    data.img_url ??
    "https://images.unsplash.com/photo-1507237615867-0d4d2ad6b2d1?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dG91cmlzdHxlbnwwfDB8MHx8fDA%3D";
  const mapData = `https://maps.google.com/maps?q=${data.lat},${data.long}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
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
            <div className="flex flex-col gap-2">
              <div className="text-2xl font-bold font-customTitle">
                {data.name}
              </div>
              {data.rating && (
                <div className="flex flex-row items-center gap-1">
                  <div className="text-lg font-customTitle">{data.rating}</div>
                  <FaStar size={12} color="#858585CC" />
                </div>
              )}
            </div>
            <div className="flex flex-col place-items-end">
              <div className="flex flex-row gap-1">
                <NumericFormat
                  thousandSeparator
                  displayType="text"
                  style={{ height: 38, borderRadius: 5 }}
                  className="text-green-400 font-bold font-customDetail text-xl"
                  value={Math.round(data.price)}
                />
                <span className="text-green-400 font-customDetail font-bold text-xl">
                  VND
                </span>
              </div>
              {data.price !== 0 && (
                <div className="text-gray-400 text-md font-customDetail font-semibold">
                  / person
                </div>
              )}
            </div>
          </div>
          {data.address && (
            <>
              <div className="text-xl font-customCardTitle font-semibold">
                Address
              </div>
              <p className="font-customDetail text-lg">{data.address}</p>
            </>
          )}

          <Divider />
          <div className="text-xl font-customCardTitle font-semibold">
            Image
          </div>
          <img src={data.img_url} className="w-full rounded-lg" height={400} />
          <Divider />
          {data.description !== "NaN" && (
            <>
              <div className="text-xl font-customCardTitle font-semibold">
                Description
              </div>
              <p className="font-customDetail text-lg">{data.description}</p>
              <Divider />
            </>
          )}
          {data.lat && data.long && (
            <>
              <div className="text-xl font-customCardTitle font-semibold">
                Location / Map
              </div>
              <iframe
                width="700"
                height="400"
                className="rounded self-center"
                src={mapData}
              ></iframe>
            </>
          )}
        </div>
      </Modal>
      <div
        key={data._id}
        className="flex flex-row border-gray-100 border-t w-full bg-white shadow-md rounded-lg hover:-translate-y-2 hover:shadow-xl transition ease-out"
      >
        <div className="basis-2/5">
          <img src={data.img_url} className="w-96 h-60 rounded-lg" />
        </div>
        <div className="basis-3/5 w-full py-1.5 px-4 flex flex-col justify-between">
          <div className="w-full flex flex-row px-1 justify-between items-start">
            <div className="self-start flex flex-col gap-2">
              <div className="flex flex-col">
                <div className="text-2xl text-start font-bold font-customCardTitle">
                  {data.name}
                </div>
                {data.rating && (
                  <div className="flex flex-row items-center gap-1">
                    <div className="text-lg font-customTitle">
                      {data.rating}
                    </div>
                    <FaStar size={12} color="#858585CC" />
                  </div>
                )}
              </div>
              <div className="flex flex-row gap-1.5 items-center">
                <FaLocationDot size={20} color="#858585CC" />
                <p className="font-customDetail text-lg text-gray-400 max-w-96">
                  {data.province}
                </p>
              </div>
            </div>
            <div className="flex flex-col place-items-end">
              <div className="flex flex-row gap-1">
                <NumericFormat
                  thousandSeparator
                  displayType="text"
                  style={{ height: 25, borderRadius: 5 }}
                  className="text-green-400 font-bold font-customDetail text-xl"
                  value={Math.round(data.price)}
                />
                <span className="text-green-400 font-customDetail font-bold text-xl">
                  VND
                </span>
              </div>
              {data.price !== 0 && (
                <div className="text-gray-400 text-md font-customDetail font-semibold">
                  / person
                </div>
              )}
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

export default AttractionCard;
