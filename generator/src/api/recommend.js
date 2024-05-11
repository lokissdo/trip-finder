const RecommendService = require('../services/recommend-service');
const UserAuth = require('./middlewares/auth');
const { SubscribeMessage, PublishMessage, FormateData } = require('../utils');
const { RPCObserver } = require('../utils/rpc');
const { RECOMMEND_SERVICE } = require('../config');




module.exports = (app, channel) => {

    const service = new RecommendService();

    // To listen
    //SubscribeMessage(channel, service, Recommend_SERVICE);

    //RPCObserver(Recommend_SERVICE, service);

 
    app.get('/recommend', async (req, res) => {
        try{
            const { costOptions, startDate, endDate,departure, destination, userOptions } = req.query;
            const result = await service.getRecommendation({
                costOptions: costOptions ? JSON.parse(costOptions) : undefined, 
                userOptions: userOptions ? JSON.parse(userOptions) : undefined,
                startDate, endDate,departure, destination});
            res.send(result);
        }catch(err){
            console.error('Error getting recommendation:', err);
            res.status(400).json({ msg: 'Internal Server Error' });
        }
        
    });

    app.post('/daily-schedule/generator', UserAuth, async (req, res) => {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ msg: 'Forbidden' });
        }
        const { province } = req.body;
        console.log(req.body);
        if (!province) {
            res.status(400).send('Province is required');
            return;
        }
        const result = await service.generatorDailySchedules(province);
        res.send(result);
    });

}
