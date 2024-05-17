const DailyScheduleRepository = require("./daily-schedule-repository");
const { SEARCH_SERVICE } = require("../../config")
const { RPCRequest } = require("../../utils/rpc");
const Recommend = require("../models/Recommend");


const COST_HOTEL_GAP_RATE = 0.4;
const COST_VEHICLE_GAP_RATE = 0.5;
const COST_RESTAURANT_GAP_RATE = 0.5;


class RecommendRepository {
    constructor() {
        this.dailyScheduleRepository = new DailyScheduleRepository();


    }

    async getTopRecommendations() {
        const now = new Date();

        try {

            const aggregatedResults = await Recommend.aggregate([
                { $match: { startDate: { $gte: now } } },
                { $sort: { count: -1 } },
                {
                    $group: {
                        _id: "$destination",
                        recommendation: { $first: "$$ROOT" }
                    }
                },
                { $limit: 4 },
                { $replaceRoot: { newRoot: "$recommendation" } }
            ]).exec();
            const recommendations = await Recommend.populate(aggregatedResults, [
                { path: 'output.hotel' },
                { path: 'output.vehicles' },
                {
                    path: 'output.dailySchedules',
                    populate: [
                        {
                            path: 'schedule',
                            populate: [
                                { path: 'morning' },
                                { path: 'afternoon' },
                                { path: 'evening' },
                            ]

                        },
                        {
                            path: 'afternoonRestaurant'

                        },
                        { path: 'midDayRestaurant' }
                    ]
                },
                { path: 'output.weather' }
            ]);

            return recommendations
        } catch (error) {
            console.error('Error fetching top recommendations:', error);
            throw error;
        }
    }

}

module.exports = RecommendRepository;