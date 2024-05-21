import { Dispatch, SetStateAction } from "react";
import { backend_dev } from "../../../../../service";
import { TVehicle } from "../vehicle";

export const fetchMoreVehicle = async (
  setResult: Dispatch<SetStateAction<TVehicle[]>>,
  setIsEnd: Dispatch<SetStateAction<boolean>>,
  result: TVehicle[],
  page: number,
  from?: { value: string; label: string } | null,
  to?: { value: string; label: string } | null,
  date?: string | string[],
  vehicle?: { value: string; label: string } | null,
  brand?: string,
  endPrice?: number,
  startPrice?: number,
  sort?: { value: string; label: string } | null
) => {
  const standardFrom = from?.label.replace(" ", "+");
  const standardTo = to?.label.replace(" ", "+");
  const standardVehicle = vehicle?.label.replace(" ", "+");
  const params = {
    departure: standardFrom || "",
    arrival: standardTo || "",
    vehicle: standardVehicle || "",
    brand: brand || "",
    start: startPrice || "0",
    end: endPrice || "",
    departureTime: date || "",
    sort: sort?.value || "",
  };
  const response = await fetch(
    backend_dev.search +
      `vehicles?departure=${params.departure}&arrival=${params.arrival}&type=${params.vehicle}&start=${params.start}&end=${params.end}&date=${params.departureTime}&brand=${params.brand}&sort=${params.sort}&page=${page}`
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
