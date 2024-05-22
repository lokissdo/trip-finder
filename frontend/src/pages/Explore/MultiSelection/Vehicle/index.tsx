import React, { useEffect, useState } from "react";
import Select from "react-select";

import {
  DatePicker,
  DatePickerProps,
  Divider,
  FloatButton,
  GetProps,
  Slider,
  Spin,
} from "antd";
import { optionsVehicle } from "../../../../assets/vehicleType";
import { fetchVehicle } from "./hooks/fetchVehicle";
import dayjs from "dayjs";
import { options } from "../../../../assets/locationSelecion";
import { TVehicle } from "./vehicle";
import Navbar from "../../../../components/Navbar";
import VehicleCard from "./components/VehicleCard";
import { fetchMoreVehicle } from "./hooks/fetchMoreVehicle";
import { optionsSort } from "../../../../assets/sortType";
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
  const [brand, setBrand] = useState<string>("");
  const [sort, setSort] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const [isEnd, setIsEnd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const onChange: DatePickerProps["onChange"] = (date, dateString) => {
    console.log(date, dateString);
    setDate(dateString);
  };
  const [page, setPage] = useState<number>(2);
  const onChangeComplete = (value: number[]) => {
    console.log("onChangeComplete: ", value);
    setStartPrice(value[0]);
    setEndPrice(value[1]);
  };
  useEffect(() => {
    const readyVehicle = async () => {
      window.scrollTo(0, 0);
      setIsLoading(true);
      await fetchVehicle(
        setResult,
        from,
        to,
        date,
        vehicle,
        brand,
        endPrice,
        startPrice,
        sort
      );
      setIsLoading(false);
    };
    readyVehicle();
  }, []);
  return (
    <div>
      <div className="px-12 py-4 shadow-md">
        <Navbar />
      </div>
      <div className="my-2 px-24 flex flex-row gap-5">
        <div className="basis-1/3 h-screen sticky top-2 px-10">
          <div className="font-customCardTitle text-xl font-bold">
            Filter for Transportations
          </div>
          <div className="text-start font-customDetail text-lg text-gray-600 font-semibold">
            From
          </div>
          <Select
            isClearable
            isSearchable
            options={options}
            defaultValue={from}
            onChange={setFrom}
            placeholder="From"
            className="min-w-52 h-10"
          />
          <div className="text-start font-customDetail text-lg text-gray-600 font-semibold">
            To
          </div>
          <Select
            isClearable
            isSearchable
            options={options}
            defaultValue={to}
            onChange={setTo}
            placeholder="To"
            className="min-w-52 h-10"
          />
          <div className="text-start font-customDetail text-lg text-gray-600 font-semibold">
            Departure date
          </div>
          <DatePicker
            size="large"
            className="w-full"
            style={{ height: 38, borderRadius: 4 }}
            disabledDate={disabledDate}
            onChange={onChange}
          />
          <Divider />
          <div className="text-start font-customDetail text-lg text-gray-600 font-semibold">
            Vehicle type
          </div>
          <Select
            isClearable
            isSearchable
            options={optionsVehicle}
            defaultValue={vehicle}
            onChange={setVehicle}
            placeholder="Vehicle type"
            className="min-w-44 h-10"
          />
          <div className="text-start font-customDetail text-lg text-gray-600 font-semibold">
            Brand
          </div>
          <input
            type="text"
            className="w-full rounded-md border-gray-300"
            placeholder="Brand"
            onChange={(e) => {
              setBrand(e.target.value);
            }}
          />

          <Divider />
          <div className="text-start font-customDetail text-lg text-gray-600 font-semibold">
            Price
          </div>
          <Slider
            range
            max={5000000}
            step={100000}
            defaultValue={[500000, 2000000]}
            onChangeComplete={onChangeComplete}
          />
          <div className="text-start font-customDetail text-lg text-gray-600 font-semibold">
            Sort by price
          </div>
          <Select
            isClearable
            isSearchable
            options={optionsSort}
            defaultValue={sort}
            onChange={setSort}
            placeholder="Sort by price"
            className="min-w-44 h-10"
          />
          <button
            className="bg-green-400 px-6 py-2 mt-4 text-white text-xl font-bold rounded-lg"
            onClick={() => {
              window.scrollTo(0, 0);
              fetchVehicle(
                setResult,
                from,
                to,
                date,
                vehicle,
                brand,
                endPrice,
                startPrice,
                sort
              );
              setIsEnd(false);
              setPage(2);
            }}
          >
            Search
          </button>
        </div>
        <div className="basis-2/3 flex flex-col gap-4">
          {isLoading && (
            <div className="flex flex-col">
              <div className="px-4 py-3 self-center flex flex-row items-center gap-3">
                <Spin size="large" />
                <span className="text-lg font-customCardTitle font-semibold">
                  Loading attraction
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
            result.map((res: TVehicle) => {
              return <VehicleCard data={res} key={res._id} />;
            })}
          {result.length && !isEnd && (
            <button
              className="bg-green-400 text-white font-bold py-2 rounded w-2/5 self-center"
              onClick={async () => {
                await fetchMoreVehicle(
                  setResult,
                  setIsEnd,
                  result,
                  page,
                  from,
                  to,
                  date,
                  vehicle,
                  brand,
                  endPrice,
                  startPrice,
                  sort
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

export default Vehicle;
