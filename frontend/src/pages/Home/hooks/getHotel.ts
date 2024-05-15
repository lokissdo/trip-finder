import { backend_dev } from "../../../service";

export const getHotel = async (location: string) => {
  if (location) {
    const standardLocation = location.replace(" ", "+");
    // console.log("locationStandard: ", standardLocation);
    // console.log("full string: ", backend_dev.hotel + standardLocation);
    const response = await fetch(
      backend_dev.search + `hotels?province=${standardLocation}`
    );
    return await response.json();
  }
};
