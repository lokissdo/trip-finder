const mongoose = require('mongoose');
const { RecommendModel } = require('../models');

//Dealing with data base operations
class RecommendRepository {

    async CreateRecommend({departureDate, returnDate, province, estimatedCost, weather, departureVehicle, destinationVehicle, hotel, schedules}){

        const recommend = new RecommendModel({
            departureDate,
            returnDate,
            province,
            estimatedCost,
            weather,
            departureVehicle,
            destinationVehicle,
            hotel,
            schedules
        })
        const recommendResult = await recommend.save();
        return recommendResult;

    }
}

module.exports = RecommendRepository;
