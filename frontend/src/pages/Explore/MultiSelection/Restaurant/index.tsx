import React, { useState } from "react";
import Select from "react-select";
import { options } from "../../../../assets/locationSelecion";
import { fetchRestaurant } from "./hooks/fetchRestaurant";

const Restaurant: React.FC = () => {
  const [province, setProvince] = useState<{
    value: string;
    label: string;
  } | null>(null);
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
      <button onClick={() => fetchRestaurant(province)}>Search</button>
    </div>
  );
};

export default Restaurant;
