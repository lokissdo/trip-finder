const { HotelRepository,VehicleRepository } = require("../database");

class SearchService {
    constructor() {
        this.hotelRepository = new HotelRepository();
        this.vehicleRepository = new VehicleRepository();
    }

    async GetHotelsByParameters({name, start, end,province,checkinDate, location, sort, page, pageSize}) {
        try {
            const hotels = await this.hotelRepository.getHotelByName({name, start, end, checkinDate,province,location, sort, page, pageSize});
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


    async GetVehiclesByParameters({ type, start, end, date, departure, arrival, departureTime, brand, sort, page, pageSize }) {
        try {
            const vehicles = await this.vehicleRepository.getVehicleByType({ type, start, end, date, departure, arrival, departureTime, brand, sort, page, pageSize });
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

}

module.exports = SearchService;
