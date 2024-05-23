const SearchService = require('../services/search-service');
const UserAuth = require('./middlewares/auth');
const { RPCObserver } = require('../utils/rpc');
const { SEARCH_SERVICE } = require('../config');

const cacheMiddleware = require('./middlewares/cache');


module.exports = (app) => {

    const service = new SearchService();

    // To listen

    RPCObserver(SEARCH_SERVICE, service);

    app.get('/hotels',cacheMiddleware, async (req, res) => {
        try {
            const { name, start, end, location, checkinDate,platform, sort, page, province, pageSize } = req.query;

            // Assuming GetHotelsByParameters method exists in the HotelService to search for hotels
            const hotels = await service.GetHotelsByParameters({
                name,
                start,
                end,
                province,
                checkinDate,
                platform,
                location: location ? JSON.parse(location) : undefined,
                sort,
                page: parseInt(page) || undefined,
                pageSize: parseInt(pageSize) || undefined,
            });

            res.json(hotels);
        } catch (err) {
            console.error('Error getting hotels:', err);
            res.status(500).json({ msg: 'Internal Server Error' });
        }
    });


   



    app.get('/vehicles', cacheMiddleware, async (req, res) => {
        try {
            const { type, start, end, date,platform, departure, arrival, departureTime, brand, sort, page, pageSize } = req.query;

            // Assuming GetVehiclesByParameters method exists in the VehicleService to search for vehicles
            const vehicles = await service.GetVehiclesByParameters({
                type,
                start,
                end,
                date,
                departure,
                platform,
                arrival,
                departureTime,
                brand,
                sort,
                page: parseInt(page) || undefined,
                pageSize: parseInt(pageSize) || undefined,
            });

            res.json(vehicles);
        } catch (err) {
            console.error('Error getting vehicles:', err);
            res.status(500).json({ msg: 'Internal Server Error' });
        }
    });

    // Define route for indexing vehicles
   





    

    // Search restaurants
    app.get('/restaurants',cacheMiddleware, async (req, res) => {
        try {
            const { name, province, platform, start, end, location, sort, page, pageSize } = req.query;

            // Assuming GetRestaurantsByParameters method exists in the SearchService to search for restaurants
            const restaurants = await service.GetRestaurantsByParameters({
                name,
                province,
                platform,
                start,
                end,
                location: location ? JSON.parse(location) : undefined,
                sort,
                page: parseInt(page) || undefined,
                pageSize: parseInt(pageSize) || undefined,
            });

            res.json(restaurants);
        } catch (err) {
            console.error('Error getting restaurants:', err);
            res.status(500).json({ msg: 'Internal Server Error' });
        }
    });


    // Search attractions
    app.get('/attractions',cacheMiddleware, async (req, res) => {
        try {
            const { name, province, platform, start, end, location, sort, page, pageSize } = req.query;

            // Assuming GetAttractionsByParameters method exists in the SearchService to search for attractions
            const attractions = await service.GetAttractionsByParameters({
                name,
                province,
                platform,
                start,
                end,
                location: location ? JSON.parse(location) : undefined,
                sort,
                page: parseInt(page) || undefined,
                pageSize: parseInt(pageSize) || undefined,
            });

            res.json(attractions);
        } catch (err) {
            console.error('Error getting attractions:', err);
            res.status(500).json({ msg: 'Internal Server Error' });
        }
    });
}
