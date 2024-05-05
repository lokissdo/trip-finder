const SearchService = require('../services/search-service');
const UserAuth = require('./middlewares/auth');
const { SubscribeMessage, PublishMessage, FormateData } = require('../utils');
const { RPCObserver } = require('../utils/rpc');
const { SEARCH_SERVICE } = require('../config');




module.exports = (app, channel) => {

    const service = new SearchService();

    // To listen
    SubscribeMessage(channel, service, SEARCH_SERVICE);

    RPCObserver(SEARCH_SERVICE, service);

    app.get('/hotels', async (req, res) => {
        try {
            const { name, start, end, location, sort, page, pageSize } = req.query;

            // Assuming GetHotelsByParameters method exists in the HotelService to search for hotels
            const hotels = await service.GetHotelsByParameters({
                name,
                start,
                end,
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


}
