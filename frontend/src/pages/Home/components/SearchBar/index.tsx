import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { DatePicker } from "antd";
import type { GetProps } from "antd";
import dayjs from "dayjs";
import Select from "react-select";
import { SwapRightOutlined } from "@ant-design/icons";
import { options } from "../../../../assets/locationSelecion";
type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;
const disabledDate: RangePickerProps["disabledDate"] = (current) => {
  // Can not select days before today and today
  return current && current < dayjs().endOf("day");
};

const { RangePicker } = DatePicker;
const SearchBar: React.FC<{
  setLocation: Dispatch<SetStateAction<string>>;
}> = ({ setLocation }) => {
  const [from, setFrom] = useState<{ value: string; label: string } | null>(
    null
  );
  const [to, setTo] = useState<{ value: string; label: string } | null>(null);
  console.log(from);
  console.log(to);
  useEffect(() => {
    if (to) {
      setLocation(to.label);
    } else {
      setLocation("");
    }
  }, [to, from, setLocation]);
  return (
    <>
      <div className="flex-2 flex flex-col gap-1">
        <div className="flex flex-row gap-1">
          <span className="font-semibold text-lg">Start date</span>
          <SwapRightOutlined />
          <span className="font-semibold text-lg">End date</span>
        </div>
        <RangePicker
          style={{ height: 38 }}
          disabledDate={disabledDate}
          placement="bottomLeft"
          size="large"
        />
      </div>
      <div className="flex-2 flex flex-col pl-2 gap-1">
        <div className="flex flex-row gap-1">
          <span className="font-semibold text-lg">From</span>
          <SwapRightOutlined />
          <span className="font-semibold text-lg">To</span>
        </div>
        <div className="flex flex-row gap-2">
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
            defaultValue={to}
            options={options}
            onChange={setTo}
            placeholder="To"
            className="min-w-44 h-10"
          />
        </div>
      </div>
      <div className="flex-1 px-2 flex flex-col gap-1">
        <div className="self-start font-semibold text-lg">Budget</div>
        <input
          type="string"
          style={{ height: 38, borderRadius: 5 }}
          className="border border-gray-300 outline-none pl-2"
          placeholder="Your budget"
        />
      </div>
      <button className="flex-1 text-white border-none bg-green-400 rounded-lg font-bold m-1 text-xl">
        Search
      </button>
    </>
  );
};

export default SearchBar;
