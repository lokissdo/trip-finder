const { HotelRepository, VehicleRepository, RestaurantRepository, AttractionRepository } = require("../database");


class IndexingService {
    constructor() {
        this.hotelRepository = new HotelRepository();
        this.vehicleRepository = new VehicleRepository();
        this.restaurantRepository = new RestaurantRepository();
        this.attractionRepository = new AttractionRepository();
    }


    async indexDataForUpdate() {
        try {
            // startDate is 3 days ago
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - 3);
            const endDate = new Date(); 
            console.log('Indexing hotels within date range:', startDate, endDate);
            await this.hotelRepository.indexDataWithinDateRange(startDate, endDate);

            console.log('Indexing vehicles within date range:', startDate, endDate);
            await this.vehicleRepository.indexDataWithinDateRange(startDate, endDate);

            console.log('Indexing restaurants within date range:', startDate, endDate);
            await this.restaurantRepository.indexDataWithinDateRange(startDate, endDate);

            console.log('Indexing attractions within date range:', startDate, endDate);
            await this.attractionRepository.indexDataWithinDateRange(startDate, endDate);

        } catch (error) {
            console.error('Error indexing data:', error);
            return []; // Return empty array on error
        }
    }

    async removeOldData() {
        try {
            // endDate is 3 days ago
            const endDate = new Date();
            endDate.setDate(endDate.getDate() - 3);
            console.log('Removing data older than:', endDate);
            await this.hotelRepository.removeIndexBeforeDate(endDate);
            await this.vehicleRepository.removeIndexBeforeDate(endDate);
            await this.restaurantRepository.removeIndexBeforeDate(endDate);
            await this.attractionRepository.removeIndexBeforeDate(endDate);
        } catch (error) {
            console.error('Error removing old data:', error);
        }
    }





}

module.exports = IndexingService;
