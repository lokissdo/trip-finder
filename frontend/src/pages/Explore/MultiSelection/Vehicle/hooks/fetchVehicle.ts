import { backend_dev } from "../../../../../service";

export const fetchVehicle = async (
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
  console.log(standardFrom);
  console.log(standardTo);
  console.log(date);
  console.log(startPrice);
  console.log(endPrice);
  const response = await fetch(
    backend_dev.search +
      `vehicles?departure=${params.departure}&arrival=${params.arrival}&type=${params.vehicle}&start=${params.start}&end=${params.end}&date=${params.departureTime}`
  );
  const result = await response.json();
  console.log(await result);
  return result;
};
