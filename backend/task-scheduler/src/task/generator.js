const DailyScheduleService = require('../services/daily-schedule-service');
const { SubscribeMessage, PublishMessage, FormateData } = require('../utils');
// const { RPCObserver } = require('../utils/rpc');
const { USER_SERVICE } = require('../config');
const UserAuth = require('./middlewares/auth');
const targetProvinces= ["TP Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "Phú Quốc"]
class GeneratorTaskScheduler {
    constructor() {
        this.dailyScheduleService = new DailyScheduleService();
    }

    async generatorDailySchedules() {
        console.log('Running task to generate daily schedules...');
        try {
            targetProvinces.forEach(async (province) => {
                console.log('Generating schedules for:', province);
                const schedules = await this.dailyScheduleService.generatorDailySchedules(province);
                console.log('Generated schedules:', schedules);
            });
            // Process the schedules as needed (e.g., save to a database, send notifications, etc.)
        } catch (error) {
            console.error('Error generating daily schedules:', error);
        }
    }
}

module.exports = new GeneratorTaskScheduler();
