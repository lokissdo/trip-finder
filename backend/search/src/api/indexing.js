const UserAuth = require('./middlewares/auth');
const { SubscribeMessage, PublishMessage, FormateData } = require('../utils');
const IndexingService = require('../services/indexing-service');




module.exports = (app) => {

    const service = new IndexingService();

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
    
}
