export type TCostOptions = {
  itinerary: number;
  hotel: number;
  vehicle: number;
  restaurant: number;
};
export type TUserOptions = {
  cheapestItinerary: boolean;
  cheapestHotel: boolean;
  cheapestVehicle: boolean;
  cheapestRestaurant: boolean;
};
export type TRecommend = {
  costOptions: TCostOptions;
  userOptions?: TUserOptions;
  departure: string;
  destination: string;
  startDate: string;
  endDate: string;
};
