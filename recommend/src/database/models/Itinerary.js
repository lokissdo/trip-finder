const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ItinerarySchema = new Schema({
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    depature: {
        type: String,
        required: true
    },
    arrival: {
        type: String,
        required: true
    },
    userOptions: {
      
    },
    costOptions: {
       
    },
    dailySchedules: [
        {
            type: Schema.Types.ObjectId,
            ref: 'DailySchedule'
        }
    
    ],
},{
    timestamps: true
});
 
module.exports =  mongoose.model('Itinerary', ItinerarySchema);