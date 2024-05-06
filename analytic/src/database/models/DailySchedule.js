const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const DailyScheduleSchema = new Schema({
    province: {
        type: String,
        required: true
    },
    initialPrice: {
        type: Number,
        required: true
    },
    morning: {
        // Meal is reference to Food and it optional
        meal: {
            type: Schema.Types.ObjectId,
            ref: 'Food'
        },
        landscape: {
            type: Schema.Types.ObjectId,
            ref: 'Landscape',
            required: true
        },
    },
    afternoon: {
        // Meal is reference to Food and it optional
        meal: {
            type: Schema.Types.ObjectId,
            ref: 'Food',
            required: true
        },
        landscape: {
            type: Schema.Types.ObjectId,
            ref: 'Landscape',
            required: true
        },
    },
    evening: {
        // Meal is reference to Food and it optional
        meal: {
            type: Schema.Types.ObjectId,
            ref: 'Food',
            required: true
        },
        landscape: {
            type: Schema.Types.ObjectId,
            ref: 'Landscape'
        },
    },
}
,{
    timestamps: true
});
 
module.exports =  mongoose.model('DailySchedule', DailyScheduleSchema);