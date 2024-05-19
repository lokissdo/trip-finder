import React, { useState } from "react";
import Select from "react-select";

import { DatePicker, DatePickerProps, GetProps } from "antd";
import { optionsVehicle } from "../../../../assets/vehicleType";
import { fetchVehicle } from "./hooks/fetchVehicle";
import dayjs from "dayjs";
import { options } from "../../../../assets/locationSelecion";
import { TVehicle } from "./vehicle";
import Navbar from "../../../../components/Navbar";
import { NumericFormat } from "react-number-format";
import VehicleCard from "./components/VehicleCard";
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
      <div>Transportations</div>
      <div className="flex flex-row">
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
        <button
          onClick={() =>
            fetchVehicle(
              setResult,
              from,
              to,
              date,
              vehicle,
              endPrice,
              startPrice
            )
          }
        >
          Search
        </button>
      </div>

      {result && (
        <div className="mx-auto w-3/4">
          <div className="flex flex-row gap-5 overflow-hidden">
            <div className="basis-1/3 h-screen top-0">
              <div>Sidebar</div>
              <div>dieu chinh gia tien</div>
              <div>Slider</div>
              <NumericFormat
                thousandSeparator
                displayType="input"
                placeholder="start price"
                style={{ height: 38, borderRadius: 5 }}
                className="border border-gray-300 outline-none pl-2"
                onValueChange={(values) => {
                  console.log("start: ", values);
                  setStartPrice(values.floatValue ?? 0);
                }}
              />
              <NumericFormat
                thousandSeparator
                displayType="input"
                placeholder="end price"
                style={{ height: 38, borderRadius: 5 }}
                className="border border-gray-300 outline-none pl-2"
                onValueChange={(values) => {
                  console.log("end: ", values);
                  setEndPrice(values.floatValue ?? 0);
                }}
              />
            </div>
            <div className="basis-2/3 flex flex-col gap-4 overflow-y-auto">
              {result.map((res: TVehicle) => {
                return <VehicleCard data={res} key={res._id} />;
              })}
              {result && <button>More</button>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vehicle;
