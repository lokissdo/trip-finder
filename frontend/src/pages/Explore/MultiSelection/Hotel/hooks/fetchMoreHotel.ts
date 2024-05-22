import { Dispatch, SetStateAction } from "react";
import { backend_dev } from "../../../../../service";
import { THotel } from "../hotel";

export const fetchMoreHotel = async (
  setResult: Dispatch<SetStateAction<THotel[]>>,
  setIsEnd: Dispatch<SetStateAction<boolean>>,
  result: THotel[],
  page: number,
  name?: string,
  platform?: { value: string; label: string } | null,
  province?: { value: string; label: string } | null,
  date?: string | string[],
  startPrice?: number,
  endPrice?: number
) => {
  const standardLocation = province?.label.replace(" ", "+");
  const standardName = name?.replace(" ", "+");
  const params = {
    platform: platform?.value || "",
    province: standardLocation || "",
    name: standardName || "",
    checkinDate: date || "",
    end: endPrice || "",
    start: startPrice || "0",
  };
  const response = await fetch(
    backend_dev.search +
      `hotels?province=${params.province}&checkinDate=${params.checkinDate}&start=${params.start}&end=${params.end}&page=${page}&platform=${params.platform}`
  );
  const moreResult = await response.json();
  // console.log("result: ", result);
  const final = [...result, ...moreResult];
  if ((await moreResult.length) < 20) {
    setIsEnd(true);
  }
  // console.log(await moreResult);
  setResult(final);
  return result;
};
