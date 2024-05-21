import React, { useEffect, useState } from "react";
import Select from "react-select";
import { options } from "../../../../assets/locationSelecion";
import { fetchRestaurant } from "./hooks/fetchRestaurant";
import { TRestaurant } from "./restaurant";
import Navbar from "../../../../components/Navbar";
import RestaurantCard from "./components/RestaurantCard";
import { optionsSort } from "../../../../assets/sortType";
import { Divider, FloatButton, Slider } from "antd";
import { fetchMoreRestaurant } from "./hooks/fetchMoreRestaurant";

const Restaurant: React.FC = () => {
  const [province, setProvince] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const [sort, setSort] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const [result, setResult] = useState<TRestaurant[]>([]);
  const [page, setPage] = useState<number>(2);
  const [isEnd, setIsEnd] = useState<boolean>(false);
  const [name, setName] = useState("");
  const [startPrice, setStartPrice] = useState<number>(0);
  const [endPrice, setEndPrice] = useState<number>(0);
  const onChangeComplete = (value: number[]) => {
    console.log("onChangeComplete: ", value);
    setStartPrice(value[0]);
    setEndPrice(value[1]);
  };
  useEffect(() => {
    const readyRestaurant = async () => {
      window.scrollTo(0, 0);
      await fetchRestaurant(
        setResult,
        province,
        name,
        startPrice,
        endPrice,
        sort
      );
    };
    readyRestaurant();
  }, []);
  return (
    <div>
      <div className="px-12 py-4 shadow-md">
        <Navbar />
      </div>
      <div className="flex flex-row gap-5 py-4 px-24">
        <div className="basis-1/3 h-screen sticky top-10 px-6">
          <div className="font-customCardTitle text-xl font-bold">
            Filter for restaurant
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
            Name
          </div>
          <input
            type="text"
            className="w-full rounded-md border-gray-300"
            placeholder="Name of attraction"
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <Divider />
          <div className="text-start font-customDetail text-lg text-gray-600 font-semibold">
            Price (unit : VND)
          </div>
          <Slider
            range
            max={6000000}
            step={100000}
            defaultValue={[500000, 2000000]}
            onChangeComplete={onChangeComplete}
          />
          <div className="text-start font-customDetail text-lg text-gray-600 font-semibold">
            Sort by price
          </div>
          <Select
            options={optionsSort}
            isClearable
            isSearchable
            defaultValue={sort}
            onChange={setSort}
            placeholder="Sort by price"
          />
          <button
            className="bg-green-400 text-white text-xl font-bold py-2 px-8 rounded-lg mt-8"
            onClick={() => {
              window.scrollTo(0, 0);
              fetchRestaurant(
                setResult,
                province,
                name,
                startPrice,
                endPrice,
                sort
              );
              setIsEnd(false);
              setPage(2);
            }}
          >
            Search
          </button>
        </div>
        <div className="basis-2/3 flex flex-col gap-6">
          {result.length === 0 && (
            <div className="text-xl font-bold font-customCardTitle">
              No Results Found
            </div>
          )}
          {result &&
            result.map((data: TRestaurant, index: number) => {
              return <RestaurantCard data={data} key={index} />;
            })}
          {result.length !== 0 && !isEnd && (
            <button
              className="bg-green-400 text-white font-bold py-2 px-2 rounded w-2/5 self-center"
              onClick={async () => {
                await fetchMoreRestaurant(
                  setResult,
                  setIsEnd,
                  result,
                  page,
                  province,
                  name,
                  startPrice,
                  endPrice,
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

export default Restaurant;
