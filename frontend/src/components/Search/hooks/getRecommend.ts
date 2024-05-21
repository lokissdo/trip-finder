import { costRateOptions } from "../../../assets/costOptions";
import { backend_dev } from "../../../service";
import { CostOptions } from "../CostOption";
import { UserOptions, defaultUserOptions } from "../UserOption";




export const getRecommend = async (
  from: string,
  to: string,
  startDate: string,
  endDate: string,
  price: number,
  costOptions?: CostOptions,
  userOptions?: UserOptions
) => {
  console.log(from);
  console.log(to);
  console.log(startDate);
  console.log(endDate);
  console.log(price);
  console.log(costOptions);


  if (!costOptions) {
    if (!price) {
      console.error("Price is required");
      return;
    }
    let costRateOption = costRateOptions[0].value;
    costOptions = {
      itinerary: price * costRateOption.itineraryRate,
      hotel: price * costRateOption.hotelRate,
      vehicle: price * costRateOption.vehicleRate,
      restaurant: price * costRateOption.restaurantRate,
    };
  }

  const queryParams: { [key: string]: string | undefined } = {
    costOptions: JSON.stringify(costOptions),
    departure: from,
    destination: to,
    startDate,
    endDate,
    userOptions: userOptions ? JSON.stringify(userOptions) : JSON.stringify(defaultUserOptions),
  };

  console.log("Query params",queryParams);
  const queryString = Object.entries(queryParams)
    .filter(([_, value]) => value !== undefined)
    .map(([key, value]) => `${key}=${encodeURIComponent(value!)}`)
    .join("&");

  console.log(queryString);
  const response = await fetch(`${backend_dev.recommend}/?${queryString}`);
  const result = await response.json();
  return result;
};