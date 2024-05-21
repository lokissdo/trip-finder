import { Dispatch, SetStateAction } from "react";
import { backend_dev } from "../../../../../service";
import { TRestaurant } from "../restaurant";

export const fetchMoreRestaurant = async (
  setResult: Dispatch<SetStateAction<TRestaurant[]>>,
  setIsEnd: Dispatch<SetStateAction<boolean>>,
  result: TRestaurant[],
  page: number,
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
      `restaurants?province=${params.province}&sort=${params.sort}&page=${page}&name=${params.name}&start=${params.startPrice}&end=${params.endPrice}`
  );
  const moreResult = await response.json();
  console.log("result: ", result);
  const final = [...result, ...moreResult];
  if ((await moreResult.length) < 20) {
    setIsEnd(true);
  }
  console.log(await moreResult);
  setResult(final);
  return result;
};
