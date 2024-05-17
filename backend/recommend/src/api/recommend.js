const RecommendService = require('../services/recommend-service');
const { SubscribeMessage, PublishMessage, FormateData } = require('../utils');
// const { RPCObserver } = require('../utils/rpc');
const { USER_SERVICE } = require('../config');
const UserAuth = require('./middlewares/auth');



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
            console.log('Error getting recommendation:', err);
            res.status(400).json({ error: err.message });
        }
        
    });





    app.get('/recommend/top', async (req, res) => {
        try{
            const result = await service.getTopRecommendations();
            res.send(result);
        }catch(err){
            console.log('Error getting top recommendations:', err);
            res.status(400).json({ error: err.message });
        }
    });


    app.patch('/recommend/:recommendId',UserAuth, async (req, res) => {
        try{
            const { recommendId } = req.params;
            console.log('Recommendation ID:', recommendId);
            const result = await service.incrementRecommendationCount(recommendId);
            console.log('Result:', req.user);
            const userRequest = {
                event: 'ADD_RECOMMENDATION_TO_USER',
                data: {
                    recommendId,
                    userId: req.user._id
                    // get closest hotel to the middle point of the itinerary
                }
            };
            const userRequestJson = JSON.stringify(userRequest);
            PublishMessage(channel,USER_SERVICE , userRequestJson);
            res.send(result);
        }catch(err){
            console.log('Error incrementing recommendation count:', err);
            res.status(400).json({ error: err.message });
        }
        
    });


}
