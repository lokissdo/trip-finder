const { RecommendRepository } = require("../database");

class RecommendService {
    constructor() {
        this.recommendRepository = new RecommendRepository();
    }


    async getRecommendation({ costOptions, startDate, endDate,departure, destination, userOptions }) {
        const  availableRecommendations = await this.recommendRepository.GetRecommendationsByParameters({ costOptions, startDate, endDate,departure, destination, userOptions });
        if(availableRecommendations.length === 0){
            return await this.recommendRepository.GenerateRecommendationsByParameters({ costOptions, startDate, endDate,departure, destination, userOptions });
        }
        return availableRecommendations;
    }


    async incrementRecommendationCount(recommendId) {
        
        return await this.recommendRepository.incrementRecommendationCount(recommendId);
    }

    async generateRecommendations({ costOptions, startDate, endDate,departure, destination, userOptions }) {
        return await this.recommendRepository.GenerateRecommendationsByParameters({ costOptions, startDate, endDate,departure, destination, userOptions });
    }

    async getTopRecommendations() {
        try {
            const data = await this.recommendRepository.getTopRecommendations();
            return data;
        } catch (error) {
            console.error('Error fetching top recommendations:', error);
            throw error;
        }
    }

}

module.exports = RecommendService;
