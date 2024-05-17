const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const RecommendSchema = new Schema({
    count: {
        type: Number,
        required: true,
        default: 0
    },
    costOptions: {
        type: Object,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    departure: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    userOptions: {
        type: Object,
        required: true
    },
    output: {
        hotel: {
            type: Schema.Types.ObjectId,
            ref: 'Hotel' 
        },
        vehicles: [{
            type: Schema.Types.ObjectId,
            ref: 'Vehicle' 
        }],
        dailySchedules: [{
            schedule: {
                type: Schema.Types.ObjectId,
                ref: 'DailySchedule' 
            },
            afternoonRestaurant: {
                type: Schema.Types.ObjectId,
                ref: 'Restaurant' 
            },
            midDayRestaurant: {
                type: Schema.Types.ObjectId,
                ref: 'Restaurant'
            } 
        }],
        weather: {
            type: Schema.Types.ObjectId,
            ref: 'Weather' 
        }
    }
});
 
module.exports =  mongoose.model('Recommend', RecommendSchema);