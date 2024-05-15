import { Dispatch, SetStateAction } from "react";
import { backend_dev } from "../../../../../service";
import { TAttraction } from "../attraction";

export const fetchAttraction = async (
  setResult: Dispatch<SetStateAction<TAttraction[] | undefined>>,
  province?: { value: string; label: string } | null
) => {
  const standardLocation = province?.label.replace(" ", "+");
  console.log(standardLocation);
  const params = {
    province: standardLocation || "",
  };
  const response = await fetch(
    backend_dev.search + `attractions?province=${params.province}`
  );
  const result = await response.json();
  console.log(await result);
  setResult(result);
  return result;
};
