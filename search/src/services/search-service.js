const { HotelRepository } = require("../database");

class SearchService {
    constructor() {
        this.repository = new HotelRepository();
    }

    async GetHotelsByParameters({name, start, end, location, sort, page, pageSize}) {
        try {
            const hotels = await this.repository.getHotelByName({name, start, end, location, sort, page, pageSize});
            return hotels;
        } catch (error) {
            console.error('Error getting hotels by parameters:', error);
            return []; // Return empty array on error
        }
    }

    async indexWholeHotelsCreated() {
        try {
            const response = await this.repository.indexWholeData();
            return response;
        } catch (error) {
            console.error('Error indexing hotels:', error);
            return []; // Return empty array on error
        }
    }

}

module.exports = SearchService;
