import React, { useState } from "react";
import Select from "react-select";

import { DatePicker, DatePickerProps, GetProps } from "antd";
import { optionsVehicle } from "../../../../assets/vehicleType";
import { fetchVehicle } from "./hooks/fetchVehicle";
import dayjs from "dayjs";
import { options } from "../../../../assets/locationSelecion";
import { TVehicle } from "./vehicle";
import { FaBusSimple, FaStar, FaLocationDot } from "react-icons/fa6";
import { BsDot, BsThreeDotsVertical } from "react-icons/bs";
import Navbar from "../../../../components/Navbar";
type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;

const disabledDate: RangePickerProps["disabledDate"] = (current) => {
  // Can not select days before today and today
  return current && current < dayjs().endOf("day");
};
const Vehicle: React.FC = () => {
  const [result, setResult] = useState<TVehicle[]>([]);
  const [from, setFrom] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const [to, setTo] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const [vehicle, setVehicle] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const [date, setDate] = useState<string | string[]>();
  const [startPrice, setStartPrice] = useState<number>(0);
  const [endPrice, setEndPrice] = useState<number>(0);
  const onChange: DatePickerProps["onChange"] = (date, dateString) => {
    console.log(date, dateString);
    setDate(dateString);
  };

  return (
    <div>
      <div className="px-12 py-4 shadow-md">
        <Navbar />
      </div>
      <div>Transportattions</div>
      <Select
        isClearable
        isSearchable
        options={options}
        defaultValue={from}
        onChange={setFrom}
        placeholder="From"
        className="min-w-44 h-10"
      />
      <Select
        isClearable
        isSearchable
        options={options}
        defaultValue={to}
        onChange={setTo}
        placeholder="To"
        className="min-w-44 h-10"
      />
      <Select
        isClearable
        isSearchable
        options={optionsVehicle}
        defaultValue={vehicle}
        onChange={setVehicle}
        placeholder="Vehicle type"
        className="min-w-44 h-10"
      />
      <DatePicker
        size="large"
        disabledDate={disabledDate}
        onChange={onChange}
      />
      <input
        type="number"
        placeholder="start price"
        onChange={(e) => {
          console.log("start:", e.target.value);
          setStartPrice(parseInt(e.target.value));
        }}
      />
      <input
        type="number"
        placeholder="end price"
        onChange={(e) => {
          console.log("end:", e.target.value);
          setEndPrice(parseInt(e.target.value));
        }}
      />
      <button
        onClick={() =>
          fetchVehicle(setResult, from, to, date, vehicle, endPrice, startPrice)
        }
      >
        Search
      </button>
      {result && (
        <div className="mx-auto w-3/4">
          <div className="flex flex-row gap-5">
            <div className="basis-1/3 h-screen sticky">Sidebar</div>
            <div className="basis-2/3 flex flex-col gap-4">
              {result.map((res: TVehicle) => {
                return (
                  <button
                    key={res._id}
                    className="flex flex-row border-gray-100 border-t bg-white items-center shadow-md rounded-lg"
                  >
                    <img
                      src={res.img_url}
                      className="h-4/5 w-60 rounded-lg m-auto"
                    />
                    <div className="w-full flex flex-row px-4 py-4 justify-between items-center">
                      <div className="self-start flex flex-col gap-2">
                        <div className="flex flex-row gap-5 divide-x-2">
                          <div className="flex font-semibold text-2xl font-customCardTitle">
                            {res.brand}
                          </div>
                          <div className="pl-4 flex flex-row gap-2 items-center">
                            <FaStar size={20} color="#858585CC" />
                            <p className="font-customDetail text-lg text-gray-400">
                              {res.rating}
                            </p>
                          </div>
                        </div>
                        <div className="flex text-md font-customDetail">
                          {res.detail}
                        </div>
                        <div className="flex flex-row gap-2 items-center font-semibold">
                          <FaBusSimple size={20} color="#808080" />
                          <p className="font-customDetail text-md text-icon">
                            {res.departure}
                          </p>
                          <BsDot color="#808080" />
                          <p className="font-customDetail text-md font-thin text-icon">
                            {res.departureTime}
                          </p>
                        </div>
                        <div className="flex flex-row gap-2">
                          <BsThreeDotsVertical size={20} color="#d3d3d3" />
                          <p className="text-sm text-gray-400">
                            {res.duration}
                          </p>
                        </div>
                        <div className="flex flex-row gap-2 items-center">
                          <FaLocationDot size={20} color="#808080" />
                          <p className="font-customDetail text-md font-semibold text-icon">
                            {res.arrival}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col place-items-end">
                        <div className="text-green-400 font-bold font-customDetail text-xl">
                          {res.price === 0 ? "Free" : res.price + " VND"}
                        </div>
                        {res.price !== 0 && (
                          <div className="text-gray-400 text-sm font-customDetail font-semibold">
                            / person
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vehicle;
