const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ItinerarySchema = new Schema({
    departureDate: {
        type: Date,
        required: true
    },
    returnDate: {
        type: Date,
        required: true
    },
    province: {
        type: String,
        required: true
    },
    estimatedCost: {
        type: Number,
        required: true
    },
    
    weather: {
        type: String,
        required: true
    },
    departureVehicle: {
        type: Schema.Types.ObjectId,
        ref: 'Vehicle',
    },
    destinationVehicle: {
        type: Schema.Types.ObjectId,
        ref: 'Vehicle',
    },
    hotel: {
        type: Schema.Types.ObjectId,
        ref: 'Hotel',
    },
    schedules: [
     {
        type: Schema.Types.ObjectId,
        ref: 'DailySchedule'
     }
    ]
},{
    timestamps: true
});
 
module.exports =  mongoose.model('Itinerary', ItinerarySchema);