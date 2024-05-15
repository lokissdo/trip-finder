import { backend_dev } from "../../../../../service";

export const fetchHotel = async (
  province?: { value: string; label: string } | null,
  date?: string | string[],
  startPrice?: number,
  endPrice?: number
) => {
  const standardLocation = province?.label.replace(" ", "+");
  console.log(standardLocation);
  console.log(date);
  console.log(startPrice);
  console.log(endPrice);
  const params = {
    province: standardLocation || "",
    checkinDate: date || "",
    end: endPrice || "",
    start: startPrice || "0",
  };
  const response = await fetch(
    backend_dev.search +
      `hotels?province=${params.province}&checkinDate=${params.checkinDate}&start=${params.start}&end=${params.end}`
  );
  const result = await response.json();
  console.log(await result);
  return result;
};
