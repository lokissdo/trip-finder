const { HotelRepository, VehicleRepository, RestaurantRepository, AttractionRepository } = require("../database");


class IndexingService {
    constructor() {
        this.hotelRepository = new HotelRepository();
        this.vehicleRepository = new VehicleRepository();
        this.restaurantRepository = new RestaurantRepository();
        this.attractionRepository = new AttractionRepository();
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

module.exports = IndexingService;
