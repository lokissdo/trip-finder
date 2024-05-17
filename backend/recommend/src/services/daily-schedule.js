const {  DailyScheduleRepository } = require("../database");

const {PublishMessage} = require("../utils");
class DailyScheduleService {
    constructor() {
        this.dailyScheduleRepository = new DailyScheduleRepository();
    }
    async generatorDailySchedules(province) {
        return await this.dailyScheduleRepository.generateDailySchedules(province);
    }
}

module.exports = DailyScheduleService;
