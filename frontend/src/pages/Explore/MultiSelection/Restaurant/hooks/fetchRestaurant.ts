import { Dispatch, SetStateAction } from "react";
import { backend_dev } from "../../../../../service";
import { TRestaurant } from "../restaurant";

export const fetchRestaurant = async (
  setResult: Dispatch<SetStateAction<TRestaurant[] | undefined>>,
  province?: { value: string; label: string } | null
) => {
  const standardLocation = province?.label.replace(" ", "+");
  console.log(standardLocation);
  const params = {
    province: standardLocation || "",
  };
  const response = await fetch(
    backend_dev.search + `restaurants?province=${params.province}`
  );
  const result = await response.json();
  console.log(await result);
  setResult(result);
  return result;
};
