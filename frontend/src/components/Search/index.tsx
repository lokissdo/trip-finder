import React, { useState } from "react";
import { DatePicker, Spin } from "antd";
import type { GetProps } from "antd";
import dayjs from "dayjs";
import Select from "react-select";
import { SwapRightOutlined } from "@ant-design/icons";
import { getRecommend } from "./hooks/getRecommend";
import { useNavigate } from "react-router-dom";
import { options } from "../../assets/locationSelecion";
import { NumericFormat } from "react-number-format";
type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;
const disabledDate: RangePickerProps["disabledDate"] = (current) => {
  // Can not select days before today and today
  return current && current < dayjs().endOf("day");
};

const { RangePicker } = DatePicker;
const SearchBar: React.FC = () => {
  const [from, setFrom] = useState<{ value: string; label: string } | null>(
    null
  );
  const [to, setTo] = useState<{ value: string; label: string } | null>(null);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  return (
    <>
      <div className="flex flex-row divide-x-2 gap-2 p-4">
        <div className="flex-2 flex flex-col gap-1">
          <div className="flex flex-row gap-1">
            <span className="font-semibold text-lg">Start date</span>
            <SwapRightOutlined />
            <span className="font-semibold text-lg">End date</span>
          </div>
          <RangePicker
            style={{ height: 38 }}
            disabledDate={disabledDate}
            onChange={(value, dateString) => {
              console.log("Selected Time: ", value);
              console.log("Formatted Selected Time: ", dateString);
              setStartDate(dateString[0]);
              setEndDate(dateString[1]);
            }}
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
              defaultValue={from}
              onChange={setFrom}
              options={options}
              placeholder="From"
              className="min-w-44 h-10"
            />
            <Select
              isClearable
              isSearchable
              defaultValue={to}
              onChange={setTo}
              options={options}
              placeholder="To"
              className="min-w-44 h-10"
            />
          </div>
        </div>
        <div className="flex-1 px-2 flex flex-col gap-1">
          <div className="self-start font-semibold text-lg">Budget</div>
          <NumericFormat
            thousandSeparator
            displayType="input"
            placeholder="Your budget"
            style={{ height: 38, borderRadius: 5 }}
            className="border border-gray-300 outline-none pl-2"
            onValueChange={(values) => {
              console.log(values);
              setPrice(values.floatValue ?? 0);
              console.log(price);
            }}
          />
        </div>
        <button
          className="text-white border-none rounded-lg bg-green-400 px-4 py-2 font-bold text-xl"
          onClick={async () => {
            setIsLoading(true);
            const response = await getRecommend(
              from,
              to,
              startDate,
              endDate,
              price
            );
            if (await response) {
              setIsLoading(false);
              navigate("/recommend", { state: { myObj: response } });
            }
          }}
        >
          Search
        </button>
      </div>
      {isLoading && (
        <div className="m-auto px-4 py-3 flex flex-row items-center gap-3">
          <Spin size="large" />
          <span>Finding a journey for you</span>
        </div>
      )}
    </>
  );
};

export default SearchBar;
