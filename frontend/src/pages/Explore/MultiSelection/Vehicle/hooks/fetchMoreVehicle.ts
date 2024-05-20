import { Dispatch, SetStateAction } from "react";
import { backend_dev } from "../../../../../service";
import { TVehicle } from "../vehicle";

export const fetchMoreVehicle = async (
  setResult: Dispatch<SetStateAction<TVehicle[]>>,
  result: TVehicle[],
  page: number,
  from?: { value: string; label: string } | null,
  to?: { value: string; label: string } | null,
  date?: string | string[],
  vehicle?: { value: string; label: string } | null,
  endPrice?: number,
  startPrice?: number
) => {
  const standardFrom = from?.label.replace(" ", "+");
  const standardTo = to?.label.replace(" ", "+");
  const standardVehicle = vehicle?.label.replace(" ", "+");
  const params = {
    departure: standardFrom || "",
    arrival: standardTo || "",
    vehicle: standardVehicle || "",
    start: startPrice || "0",
    end: endPrice || "",
    departureTime: date || "",
  };
  const response = await fetch(
    backend_dev.search +
      `vehicles?departure=${params.departure}&arrival=${params.arrival}&type=${params.vehicle}&start=${params.start}&end=${params.end}&date=${params.departureTime}&page=${page}`
  );
  const moreResult = await response.json();
  console.log("result: ", result);
  const final = [...result, ...moreResult];
  console.log(await moreResult);
  console.log("final: ", final);
  setResult(final);
  return final;
};
