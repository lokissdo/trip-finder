const { RecommendRepository, DailyScheduleRepository } = require("../database");

const { redisClient } = require("../database");
class RecommendService {
    constructor() {
        this.recommendRepository = new RecommendRepository();
    }


    async getTopRecommendations() {
        try {
            const data = await this.recommendRepository.getTopRecommendations();

            const key = 'topRecommendations' ;
            await redisClient.set(key, JSON.stringify(data), 'EX', 60 * 60 * 24*5);
            const res =  await redisClient.get(key);
            return JSON.parse(res);
        } catch (error) {
            console.error('Error fetching top recommendations:', error);
            throw error;
        }
    }

    async duplicateRecommendation() {
        try {
            const endDate = new Date();

            const startDate = new Date();
            startDate.setDate(endDate.getDate() - 3);

            return  await this.recommendRepository.duplicateRecommendation(startDate, endDate);
        }
        catch (error) {
            console.error('Error duplicating recommendation:', error);
            throw error;
        }
    }
}

module.exports = RecommendService;
