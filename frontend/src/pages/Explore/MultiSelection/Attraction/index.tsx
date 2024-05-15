import React, { useState } from "react";
import Select from "react-select";
import { options } from "../../../../assets/locationSelecion";
import { fetchAttraction } from "./hooks/fetchAttraction";
import { TAttraction } from "./attraction";

const Attraction: React.FC = () => {
  const [province, setProvince] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const [result, setResult] = useState<TAttraction[]>();
  return (
    <div>
      <div>province</div>
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
      {result &&
        result.map((res: TAttraction) => {
          return (
            <div>
              <div>{res.name}</div>
              <div>{res.address}</div>
              <div>{res.price}</div>
              <img src={res.img_url} />
            </div>
          );
        })}
    </div>
  );
};

export default Attraction;
