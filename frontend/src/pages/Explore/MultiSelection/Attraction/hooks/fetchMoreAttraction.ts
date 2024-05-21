import { Dispatch, SetStateAction } from "react";
import { backend_dev } from "../../../../../service";
import { TAttraction } from "../attraction";

export const fetchMoreAttraction = async (
  setResult: Dispatch<SetStateAction<TAttraction[]>>,
  setIsEnd: Dispatch<SetStateAction<boolean>>,
  result: TAttraction[],
  page: number,
  province?: { value: string; label: string } | null,
  name?: string,
  platform?: { value: string; label: string } | null,
  sort?: { value: string; label: string } | null
) => {
  const standardLocation = province?.label.replace(" ", "+");
  const standardName = name?.replace(" ", "+");
  console.log(standardLocation);
  const params = {
    province: standardLocation || "",
    name: standardName || "",
    platform: platform?.value || "",
    sort: sort?.value || "",
  };
  const response = await fetch(
    backend_dev.search +
      `attractions?province=${params.province}&sort=${params.sort}&name=${params.name}&platform=${params.platform}&page=${page}`
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
