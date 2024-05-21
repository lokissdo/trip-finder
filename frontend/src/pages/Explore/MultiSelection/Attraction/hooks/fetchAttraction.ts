import { Dispatch, SetStateAction } from "react";
import { backend_dev } from "../../../../../service";
import { TAttraction } from "../attraction";

export const fetchAttraction = async (
  setResult: Dispatch<SetStateAction<TAttraction[]>>,
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
      `attractions?province=${params.province}&sort=${params.sort}&name=${params.name}&platform=${params.platform}`
  );
  const result = await response.json();
  console.log(await result);
  setResult(result);
  return result;
};
