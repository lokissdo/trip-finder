import { costRateOptions } from "../../../assets/costOptions";
import { backend_dev } from "../../../service";
import { CostOptions } from "../CostOption";
import { UserOptions } from "../UserOption";




export const generateRecommend = async (
    from: string,
    to: string,
    startDate: string,
    endDate: string,
    price: number,
    costOptions?: CostOptions,
    userOptions?: UserOptions
) => {
    console.log("Generating........ Recommend");


    if (!costOptions) {
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
        userOptions: userOptions ? JSON.stringify(userOptions) : undefined,
    };

    const queryString = Object.entries(queryParams)
        .filter(([_, value]) => value !== undefined)
        .map(([key, value]) => `${key}=${encodeURIComponent(value!)}`)
        .join("&");

    console.log(queryString);
    const response = await fetch(`${backend_dev.recommend}/generator?${queryString}`);
    const result = await response.json();
    return {
        result,
        error: response.status !== 200
    };
};