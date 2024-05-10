const SearchService = require('../services/search-service');
const UserAuth = require('./middlewares/auth');
const { SubscribeMessage, PublishMessage, FormateData } = require('../utils');
const { RPCObserver } = require('../utils/rpc');
const { SEARCH_SERVICE } = require('../config');




module.exports = (app, channel) => {

    const service = new SearchService();

    // To listen
    //SubscribeMessage(channel, service, SEARCH_SERVICE);

    RPCObserver(SEARCH_SERVICE, service);

    app.get('/hotels', async (req, res) => {
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


    app.post('/index-hotels', UserAuth, async (req, res) => {

        console.log(req.user);
        if (req.user.role !== 'admin') {
            return res.status(403).json({ msg: 'Forbidden' });
        }
        try {
            const response = await service.indexWholeHotelsCreated();
            res.json(response);
        } catch (err) {
            console.error('Error indexing hotels:', err);
            res.status(500).json({ msg: 'Internal Server Error' });
        }
    });



    app.get('/vehicles', async (req, res) => {
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
    app.post('/index-vehicles', UserAuth, async (req, res) => {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ msg: 'Forbidden' });
        }
        try {
            const response = await service.indexWholeVehiclesCreated();
            res.json(response);
        } catch (err) {
            console.error('Error indexing vehicles:', err);
            res.status(500).json({ msg: 'Internal Server Error' });
        }
    });





    app.post('/index-restaurants', UserAuth, async (req, res) => {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ msg: 'Forbidden' });
        }
        try {
            const response = await service.indexWholeRestaurantsCreated();
            res.json(response);
        } catch (err) {
            console.error('Error indexing restaurants:', err);
            res.status(500).json({ msg: 'Internal Server Error' });
        }
    });

    // Search restaurants
    app.get('/restaurants', async (req, res) => {
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



    // Define route for indexing attractions
    app.post('/index-attractions', UserAuth, async (req, res) => {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ msg: 'Forbidden' });
        }
        try {
            const response = await service.indexWholeAttractionsCreated();
            res.json(response);
        } catch (err) {
            console.error('Error indexing attractions:', err);
            res.status(500).json({ msg: 'Internal Server Error' });
        }
    });

    // Search attractions
    app.get('/attractions', async (req, res) => {
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
