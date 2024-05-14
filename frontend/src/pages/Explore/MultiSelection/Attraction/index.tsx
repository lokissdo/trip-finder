import React, { useState } from "react";
import Select from "react-select";
import { options } from "../../../../assets/locationSelecion";
import { fetchAttraction } from "./hooks/fetchAttraction";
import { TAttraction } from "./attraction";
import { FaLocationDot } from "react-icons/fa6";

const Attraction: React.FC = () => {
  const [province, setProvince] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const [result, setResult] = useState<TAttraction[]>();
  return (
    <div>
      <Select
        options={options}
        isClearable
        isSearchable
        defaultValue={province}
        onChange={setProvince}
        placeholder="Province"
      />
      <button onClick={() => fetchAttraction(setResult, province)}>
        Search
      </button>
      {result && (
        <div className="mx-auto w-4/5">
          <div className="flex flex-row gap-5">
            <div className="basis-1/3">Sidebar</div>
            <div className="basis-2/3 flex flex-col gap-4">
              {result.map((res: TAttraction) => {
                return (
                  <button
                    key={res._id}
                    className="flex flex-row border-gray-100 border-t bg-white items-center shadow-md rounded-lg"
                  >
                    <img src={res.img_url} className="h-40 w-60 rounded-lg" />
                    <div className="w-full flex flex-row px-4 justify-between items-center">
                      <div className="self-start flex flex-col gap-4">
                        <div className="flex font-semibold text-2xl font-customTitle">
                          {res.name}
                        </div>
                        <div className="flex flex-row gap-1.5 items-center">
                          <FaLocationDot size={20} color="#858585CC" />
                          <p className="font-customDetail text-lg text-gray-400 max-w-96">
                            {res.address}
                          </p>
                        </div>
                      </div>
                      <div>
                        <div className="text-green-400 font-bold font-customDetail text-xl">
                          {res.price === 0 ? "Free" : res.price + " VND"}
                        </div>
                        {res.price !== 0 && (
                          <div className="text-gray-400 text-md font-customDetail font-semibold">
                            per person
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

export default Attraction;
