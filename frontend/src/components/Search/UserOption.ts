export interface UserOptions {
    cheapestItinerary: boolean;
    cheapestHotel: boolean;
    cheapestVehicle: boolean;
    cheapestRestaurant: boolean;
    vehicleType: string;
  }


  export const defaultUserOptions: UserOptions = {
    cheapestItinerary: false,
    cheapestHotel: false,
    cheapestVehicle: false,
    cheapestRestaurant: false,
    vehicleType: "Xe Khách",
  };