import { Dispatch, SetStateAction } from "react";
import { backend_dev } from "../../../../../service";
import { TRestaurant } from "../restaurant";

export const fetchRestaurant = async (
  setResult: Dispatch<SetStateAction<TRestaurant[]>>,
  province?: { value: string; label: string } | null,
  name?: string,
  startPrice?: number,
  endPrice?: number,
  sort?: { value: string; label: string } | null
) => {
  const standardLocation = province?.label.replace(" ", "+");
  console.log(standardLocation);
  const params = {
    province: standardLocation || "",
    name: name || "",
    startPrice: startPrice || 0,
    endPrice: endPrice || "",
    sort: sort?.value || "",
  };
  const response = await fetch(
    backend_dev.search +
      `restaurants?province=${params.province}&sort=${params.sort}&name=${params.name}&start=${params.startPrice}&end=${params.endPrice}`
  );
  const result = await response.json();
  console.log(await result);
  setResult(result);
  return result;
};
