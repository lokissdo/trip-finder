const { RecommendRepository, DailyScheduleRepository } = require("../database");

class RecommendService {
    constructor() {
        this.recommendRepository = new RecommendRepository();
    }


    async getRecommendation({ costOptions, startDate, endDate,departure, destination, userOptions }) {
        return await this.recommendRepository.GetRecommendationsByParameters({ costOptions, startDate, endDate,departure, destination, userOptions });
    }

    async incrementRecommendationCount(recommendId) {
        
        return await this.recommendRepository.incrementRecommendationCount(recommendId);
    }

}

module.exports = RecommendService;
