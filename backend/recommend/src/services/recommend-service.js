const { RecommendRepository, DailyScheduleRepository } = require("../database");

class RecommendService {
    constructor() {
        this.recommendRepository = new RecommendRepository();
        this.dailyScheduleRepository = new DailyScheduleRepository();
    }


    async getRecommendation({ costOptions, startDate, endDate,departure, destination, userOptions }) {
        return await this.recommendRepository.GetRecommendationsByParameters({ costOptions, startDate, endDate,departure, destination, userOptions });
    }

    async generatorDailySchedules(province) {
        return await this.dailyScheduleRepository.generateDailySchedules(province);
    }
}

module.exports = RecommendService;
