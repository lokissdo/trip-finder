import { Dispatch, SetStateAction } from "react";
import { backend_dev } from "../../../../../service";
import { TVehicle } from "../vehicle";

export const fetchVehicle = async (
  setResult: Dispatch<SetStateAction<TVehicle[]>>,
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
  const standardBrand = brand?.replace(" ", "+");
  const params = {
    departure: standardFrom || "",
    arrival: standardTo || "",
    vehicle: standardVehicle || "",
    brand: standardBrand || "",
    start: startPrice || "0",
    end: endPrice || "",
    sort: sort?.value || "",
    departureTime: date || "",
  };
  console.log(standardFrom);
  console.log(standardBrand);
  console.log(standardTo);
  console.log(standardVehicle);
  console.log(date);
  console.log(startPrice);
  console.log(endPrice);
  const response = await fetch(
    backend_dev.search +
      `vehicles?departure=${params.departure}&arrival=${params.arrival}&type=${params.vehicle}&start=${params.start}&end=${params.end}&date=${params.departureTime}&brand=${params.brand}&sort=${params.sort}`
  );
  const result = await response.json();
  console.log(await result);
  setResult(result);
  return result;
};
