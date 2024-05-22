import React, { useEffect, useState } from "react";
import { options } from "../../../../assets/locationSelecion";
import Select from "react-select";
import { DatePicker, Divider, FloatButton, GetProps, Slider, Spin } from "antd";
import type { DatePickerProps } from "antd";
import dayjs from "dayjs";
import { fetchHotel } from "./hooks/fetchHotel";
import Navbar from "../../../../components/Navbar";
import { THotel } from "./hotel";
import HotelCard from "./components/HotelCard";
import { optionsPlatform } from "../../../../assets/webSource";
import { fetchMoreHotel } from "./hooks/fetchMoreHotel";
type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;
const disabledDate: RangePickerProps["disabledDate"] = (current) => {
  // Can not select days before today and today
  return current && current < dayjs().endOf("day");
};
const Hotel: React.FC = () => {
  const [platform, setPlatform] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const [province, setProvince] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const [date, setDate] = useState<string | string[]>();
  const [startPrice, setStartPrice] = useState<number>(0);
  const [endPrice, setEndPrice] = useState<number>(0);
  const [result, setResult] = useState<THotel[]>([]);
  const [name, setName] = useState<string>("");
  const [page, setPage] = useState<number>(2);
  const [isEnd, setIsEnd] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const onChange: DatePickerProps["onChange"] = (date, dateString) => {
    console.log(date, dateString);
    setDate(dateString);
  };
  const onChangeComplete = (value: number[]) => {
    console.log("onChangeComplete: ", value);
    setStartPrice(value[0]);
    setEndPrice(value[1]);
  };
  useEffect(() => {
    const readyHotel = async () => {
      window.scrollTo(0, 0);
      setIsLoading(true);
      await fetchHotel(
        setResult,
        name,
        platform,
        province,
        date,
        startPrice,
        endPrice
      );
      setIsLoading(false);
    };
    readyHotel();
  }, []);
  return (
    <div>
      <div className="px-12 py-4 shadow-md">
        <Navbar />
      </div>
      <div className="my-6 flex flex-row gap-2 px-24">
        <div className="basis-1/3 h-screen sticky top-2 px-4">
          <div className="font-customCardTitle text-xl font-bold">
            Filter for Hotels
          </div>
          <div className="text-start font-customDetail text-lg text-gray-600 font-semibold">
            Province
          </div>
          <Select
            options={options}
            isClearable
            isSearchable
            defaultValue={province}
            onChange={setProvince}
            placeholder="Province"
          />
          <Divider />
          <div className="text-start font-customDetail text-lg text-gray-600 font-semibold">
            Date
          </div>
          <DatePicker
            size="large"
            className="w-full"
            disabledDate={disabledDate}
            onChange={onChange}
          />
          <Divider />
          <div className="text-start font-customDetail text-lg text-gray-600 font-semibold">
            Name
          </div>
          <input
            type="text"
            className="w-full rounded-md border-gray-300"
            placeholder="Name of hotel"
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <Divider />
          <div className="text-start font-customDetail text-lg text-gray-600 font-semibold">
            Platform
          </div>
          <Select
            options={optionsPlatform}
            isClearable
            isSearchable
            defaultValue={platform}
            maxMenuHeight={150}
            onChange={setPlatform}
            placeholder="Platform"
          />
          <Divider />
          <div className="text-start font-customDetail text-lg text-gray-600 font-semibold">
            Price (unit : VND)
          </div>
          <Slider
            range
            max={4000000}
            step={100000}
            defaultValue={[500000, 2000000]}
            onChangeComplete={onChangeComplete}
          />
          <button
            className="bg-green-400 text-white text-xl font-bold py-2 px-6 rounded-lg"
            onClick={() => {
              window.scrollTo(0, 0);
              setIsLoading(true);
              fetchHotel(
                setResult,
                name,
                platform,
                province,
                date,
                startPrice,
                endPrice
              );
              setIsLoading(false);
              setIsEnd(false);
              setPage(2);
            }}
          >
            Search
          </button>
        </div>
        <div className="basis-2/3 flex flex-col gap-6">
          {isLoading && (
            <div className="flex flex-col">
              <div className="px-4 py-3 self-center flex flex-row items-center gap-3">
                <Spin size="large" />
                <span className="text-lg font-customCardTitle font-semibold">
                  Loading hotel
                </span>
              </div>
            </div>
          )}
          {!isLoading && result.length === 0 && (
            <div className="text-xl font-bold font-customCardTitle">
              No Results Found
            </div>
          )}
          {result &&
            result.map((hotel: THotel, index: number) => {
              return <HotelCard data={hotel} key={index} />;
            })}
          {result.length && !isEnd && (
            <button
              className="bg-green-400 text-white font-bold py-2 px-2 rounded w-2/5 self-center"
              onClick={async () => {
                await fetchMoreHotel(
                  setResult,
                  setIsEnd,
                  result,
                  page,
                  name,
                  platform,
                  province,
                  date,
                  startPrice,
                  endPrice
                );
                setPage(page + 1);
              }}
            >
              More
            </button>
          )}
        </div>
        <FloatButton.BackTop
          style={{ bottom: 30, right: 30 }}
          visibilityHeight={1000}
        />
      </div>
    </div>
  );
};

export default Hotel;
