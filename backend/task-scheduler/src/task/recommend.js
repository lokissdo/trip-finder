const RecommendService = require('../services/recommend-service');
const { SubscribeMessage, PublishMessage, FormateData } = require('../utils');
// const { RPCObserver } = require('../utils/rpc');
const { USER_SERVICE } = require('../config');
const UserAuth = require('./middlewares/auth');
class RecommendTaskScheduler {
    constructor() {
        this.recommendService = new RecommendService();
        console.log('RecommendTaskScheduler initialized', this.recommendService);
    }

    async getTopRecommendations() {
        console.log('Running task to fetch top recommendations...');
        try {
            const recommendations = await  this.recommendService.getTopRecommendations();
            
            const ids = recommendations.map(recommend => recommend._id);
            console.log('Top recommendations:', ids);
            // Process the recommendations as needed (e.g., save to a database, send notifications, etc.)
        } catch (error) {
            console.error('Error fetching top recommendations:', error);
        }
    }
}

module.exports = new RecommendTaskScheduler();
