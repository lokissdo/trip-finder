const { HotelRepository,VehicleRepository, RestaurantRepository,AttractionRepository } = require("../database");

class SearchService {
    constructor() {
        this.hotelRepository = new HotelRepository();
        this.vehicleRepository = new VehicleRepository();
        this.restaurantRepository = new RestaurantRepository();
        this.attractionRepository = new AttractionRepository();
        

    }

    async GetHotelsByParameters({name, start, end,province,checkinDate,platform, location, sort, page, pageSize}) {
        try {
            const hotels = await this.hotelRepository.getHotelByName({name, start, end,platform, checkinDate,province,location, sort, page, pageSize});
            return hotels;
        } catch (error) {
            console.error('Error getting hotels by parameters:', error);
            return []; // Return empty array on error
        }
    }

    async indexWholeHotelsCreated() {
        try {
            const response = await this.hotelRepository.indexWholeData();
            return response;
        } catch (error) {
            console.error('Error indexing hotels:', error);
            return []; // Return empty array on error
        }
    }


    async GetVehiclesByParameters({ type, start, end, date, departure,platform, arrival, departureTime, brand, sort, page, pageSize }) {
        try {
            const vehicles = await this.vehicleRepository.getVehicleByType({ type, start, end, date,platform, departure, arrival, departureTime, brand, sort, page, pageSize });
            return vehicles;
        } catch (error) {
            console.error('Error getting vehicles by parameters:', error);
            return []; // Return empty array on error
        }
    }

    async indexWholeVehiclesCreated() {
        try {
            const response = await this.vehicleRepository.indexWholeData();
            return response;
        } catch (error) {
            console.error('Error indexing vehicles:', error);
            return []; // Return empty array on error
        }
    }

    async indexWholeRestaurantsCreated() {
        try {
            const response = await this.restaurantRepository.indexWholeData();
            return response;
        } catch (error) {
            console.error('Error indexing vehicles:', error);
            return []; // Return empty array on error
        }
    }



    async GetRestaurantsByParameters({ name, province, platform, start, end, location, sort, page, pageSize }) {
        try {
            const restaurants = await this.restaurantRepository.searchRestaurants({ name, province, platform, start, end, location, sort, page, pageSize });
            return restaurants;
        } catch (error) {
            console.error('Error getting restaurants by parameters:', error);
            return []; // Return empty array on error
        }
    }


    async GetAttractionsByParameters({ name, province, platform, start, end, location, sort, page, pageSize }) {
        try {
            const attractions = await this.attractionRepository.searchAttractions({ name, province, platform, start, end, location, sort, page, pageSize });
            return attractions;
        } catch (error) {
            console.error('Error getting attractions by parameters:', error);
            return []; // Return empty array on error
        }
    }

    async indexWholeAttractionsCreated() {
        try {
            const response = await this.attractionRepository.indexWholeData();
            return response;
        } catch (error) {
            console.error('Error indexing attractions:', error);
            return []; // Return empty array on error
        }
    }

}

module.exports = SearchService;
