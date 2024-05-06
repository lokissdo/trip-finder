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
        type: Schema.Types.ObjectId,
        ref: 'Landscape',
        required: true
    },
    afternoon: {
        type: Schema.Types.ObjectId,
        ref: 'Landscape',
        required: true
    },
    evening: {
        type: Schema.Types.ObjectId,
        ref: 'Landscape'
    },
}
    , {
        timestamps: true
    });

module.exports = mongoose.model('DailySchedule', DailyScheduleSchema);