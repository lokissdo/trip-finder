


const DailySchedule = require('../models/DailySchedule'); // Import Hotel model

const mongoose = require('mongoose');
const COST_GAP_RATE = 0.2;
class DailyScheduleRepository {




    async createLandscapeScheduleByDays(province, numOfDays, initialCost, bestPrice = false) {



        var dailySchedules = [];
        if (bestPrice) {
            const sortCriteria = { initialPrice: -1 }; // Sort by price in descending order (1 for ascending, -1 for descending)
            dailySchedules = await DailySchedule
                .find({ province: province }) // Only filter by province
                .sort(sortCriteria)
                .limit(numOfDays)
                .exec();
        } else {
            let maxPriceQuery = initialCost* (1 + COST_GAP_RATE) / numOfDays ;
            const aggregationPipeline = [
                { $match: { province: province, initialPrice: { $gte: 0, $lte: maxPriceQuery } } },
                { $sample: { size: numOfDays } } // Select random numOfDays documents
            ];

            dailySchedules = await DailySchedule.aggregate(aggregationPipeline).exec();

        }

        // dailySchedules < numOfDays return -1
        if (dailySchedules.length < numOfDays) {
            return -1;
        }
        return dailySchedules;


    }




}

module.exports = DailyScheduleRepository;