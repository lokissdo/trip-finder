import React, { useEffect, useState } from "react";
import Select from "react-select";
import { options } from "../../../../assets/locationSelecion";
import { fetchAttraction } from "./hooks/fetchAttraction";
import { TAttraction } from "./attraction";
import Navbar from "../../../../components/Navbar";
import { Divider, FloatButton } from "antd";
import { optionsPlatform } from "../../../../assets/webSource";
import { optionsSort } from "../../../../assets/sortType";
import { fetchMoreAttraction } from "./hooks/fetchMoreAttraction";
import AttractionCard from "./components/AttractionCard";

const Attraction: React.FC = () => {
  const [province, setProvince] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const [name, setName] = useState("");
  const [platform, setPlatform] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const [sort, setSort] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const [result, setResult] = useState<TAttraction[]>([]);
  const [page, setPage] = useState<number>(2);
  const [isEnd, setIsEnd] = useState<boolean>(false);
  useEffect(() => {
    const readyAttraction = async () => {
      await fetchAttraction(setResult, province, name, platform, sort);
    };
    readyAttraction();
  }, []);
  return (
    <div>
      <div className="px-12 py-4 shadow-md">
        <Navbar />
      </div>
      <div className="flex flex-row gap-5 px-24 my-6">
        <div className="basis-1/3 h-screen sticky top-20 px-4">
          <div className="font-customCardTitle text-xl font-bold">
            Filter for attraction
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
            Platform
          </div>
          <Select
            options={optionsPlatform}
            isClearable
            isSearchable
            defaultValue={platform}
            onChange={setPlatform}
            placeholder="Platform"
          />
          <Divider />
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
              fetchAttraction(setResult, province, name, platform, sort);
              setIsEnd(false);
              setPage(2);
            }}
          >
            Search
          </button>
        </div>
        <div className="basis-2/3 flex flex-col gap-4">
          {result.length === 0 && (
            <div className="text-xl font-bold font-customCardTitle">
              No Results Found
            </div>
          )}
          {result &&
            result.map((data: TAttraction, index: number) => {
              return <AttractionCard data={data} key={index} />;
            })}
          {result.length !== 0 && !isEnd && (
            <button
              className="bg-green-400 text-white font-bold py-2 px-2 rounded w-2/5 self-center"
              onClick={async () => {
                await fetchMoreAttraction(
                  setResult,
                  setIsEnd,
                  result,
                  page,
                  province,
                  name,
                  platform,
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

export default Attraction;
