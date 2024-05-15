import React, { useState } from "react";
import Select from "react-select";

import { DatePicker, DatePickerProps, GetProps } from "antd";
import { optionsVehicle } from "../../../../assets/vehicleType";
import { fetchVehicle } from "./hooks/fetchVehicle";
import dayjs from "dayjs";
import { options } from "../../../../assets/locationSelecion";
type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;

const disabledDate: RangePickerProps["disabledDate"] = (current) => {
  // Can not select days before today and today
  return current && current < dayjs().endOf("day");
};
const Vehicle: React.FC = () => {
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
          fetchVehicle(from, to, date, vehicle, endPrice, startPrice)
        }
      >
        Search
      </button>
    </div>
  );
};

export default Vehicle;
