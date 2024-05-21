import { CostOptions } from "../../../components/Search/CostOption"

export const caculateCost = (price: number, costOptionRate: any) => {
    let result: CostOptions = {
        itinerary: price * costOptionRate.itineraryRate,
        hotel: price * costOptionRate.hotelRate,
        vehicle: price * costOptionRate.vehicleRate,
        restaurant: price * costOptionRate.restaurantRate,
    };
    return result;
}