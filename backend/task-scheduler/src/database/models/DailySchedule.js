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
        ref: 'Attraction',
        required: true
    },
    afternoon: {
        type: Schema.Types.ObjectId,
        ref: 'Attraction',
        required: true
    },
    evening: {
        type: Schema.Types.ObjectId,
        ref: 'Attraction'
    },
    generator: {
        type: Number,
        required: true
    }
}
    , {
        timestamps: true
    });


DailyScheduleSchema.index({ morning: 1, afternoon: 1 }, { unique: true });
DailyScheduleSchema.index({ initialPrice: 1 });
DailyScheduleSchema.index({ province: 1 });

module.exports = mongoose.model('DailySchedule', DailyScheduleSchema);