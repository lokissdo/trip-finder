const mongoose = require('mongoose');
const { ItineraryModel } = require('../models');

//Dealing with data base operations
class ItineraryRepository {

    async CreateItinerary({departureDate, returnDate, province, estimatedCost, weather, departureVehicle, destinationVehicle, hotel, schedules}){

        const Itinerary = new ItineraryModel({
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
        const ItineraryResult = await Itinerary.save();
        return ItineraryResult;

    }
}

module.exports = ItineraryRepository;
