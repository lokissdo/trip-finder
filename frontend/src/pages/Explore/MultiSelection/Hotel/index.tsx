import React, { useState } from "react";
import { options } from "../../../../assets/locationSelecion";
import Select from "react-select";
import { DatePicker, GetProps } from "antd";
import type { DatePickerProps } from "antd";
import dayjs from "dayjs";
import { fetchHotel } from "./hooks/fetchHotel";
import Navbar from "../../../../components/Navbar";
import { THotel } from "./hotel";
import HotelCard from "./components/HotelCard";
type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;
const disabledDate: RangePickerProps["disabledDate"] = (current) => {
  // Can not select days before today and today
  return current && current < dayjs().endOf("day");
};
const Hotel: React.FC = () => {
  const [province, setProvince] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const [date, setDate] = useState<string | string[]>();
  const [startPrice, setStartPrice] = useState<number>(0);
  const [endPrice, setEndPrice] = useState<number>(0);
  const [result, setResult] = useState<THotel[]>();
  const onChange: DatePickerProps["onChange"] = (date, dateString) => {
    console.log(date, dateString);
    setDate(dateString);
  };
  return (
    <div>
      <div className="px-12 py-4 shadow-md">
        <Navbar />
      </div>
      <Select
        options={options}
        isClearable
        isSearchable
        defaultValue={province}
        onChange={setProvince}
        placeholder="Province"
      />
      <DatePicker
        size="large"
        disabledDate={disabledDate}
        onChange={onChange}
      />
      <input
        type="number"
        placeholder="start price"
        // value={startPrice}
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
          fetchHotel(setResult, province, date, startPrice, endPrice)
        }
      >
        Search
      </button>
      {result &&
        result.map((hotel: THotel) => {
          return <HotelCard data={hotel} />;
        })}
    </div>
  );
};

export default Hotel;
