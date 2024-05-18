const DailyScheduleRepository = require("./daily-schedule-repository");
const { SEARCH_SERVICE } = require("../../config")
const { RPCRequest } = require("../../utils/rpc");
const Recommend = require("../models/Recommend");
const mongoose = require('mongoose');



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

    // Copy top 1000 recommendations with highest count from the past 3 days, insert them with recommendation.startDate + 1  and recommendation.enđate + 1
    async duplicateRecommendation(startDate, endDate) {
        try {
            const recommendations = await Recommend.aggregate([
                { $match: { updatedAt: { $gte: startDate, $lte: endDate }, count: {$gt: 1} } },
                { $sort: { count: -1 } },
                { $limit: 1000 }
            ]).exec();
    
            const bulkOperations = recommendations.map(recommendation => {
                const newRecommendation = {
                    ...recommendation,
                    _id: undefined,
                    startDate: new Date(recommendation.startDate.setDate(recommendation.startDate.getDate() + 1)),
                    endDate: new Date(recommendation.endDate.setDate(recommendation.endDate.getDate() + 1)),
                    count: recommendation.count - 1
                };
                const recommendInstance = new Recommend(newRecommendation);
                recommendInstance.hash = recommendInstance.createHash();
        
                return {
                    insertOne: {
                        document: recommendInstance
                    }
                };
            });
    
            await Recommend.bulkWrite(bulkOperations, { ordered: false });
            console.log('Bulk insert completed with conflict unique key ignored.');
        } catch (error) {
            console.error('Error duplicating recommendation:', error);
            throw error;
        }
    }


}

module.exports = RecommendRepository;