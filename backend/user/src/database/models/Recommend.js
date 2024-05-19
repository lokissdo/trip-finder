const mongoose = require('mongoose');
const crypto = require('crypto');
const Schema = mongoose.Schema;
const RecommendSchema = new Schema({
    count: {
        type: Number,
        required: true,
        default: 0
    },
    costOptions: {
        itinerary:{
            type: Number,
        },
        hotel:{
            type: Number,
        },
        vehicle:{
            type: Number,
        },
        restaurant:{
            type: Number,
        },
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
            _id: false,
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
    },
    hash: {
        type: String,
        unique: true,
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});


RecommendSchema.index({ destination: 1, departure: 1, startDate: 1, endDate: 1 });
RecommendSchema.index({ 'costOptions.itinerary': 1 });
RecommendSchema.index({ 'costOptions.hotel': 1 });
RecommendSchema.index({ 'costOptions.vehicle': 1 });
RecommendSchema.index({ 'costOptions.restaurant': 1 });
RecommendSchema.index({ userOptions: 1 });
RecommendSchema.index({ hash: 1 }, { unique: true });



RecommendSchema.methods.createHash = function() {
    const doc = this.toObject({ getters: false, virtuals: false });
    delete doc._id;
    delete doc.hash;
    return crypto.createHash('sha256').update(JSON.stringify(doc)).digest('hex');
};

RecommendSchema.pre('save', function(next) {
    this.hash = this.createHash();
    next();
});



module.exports =  mongoose.model('Recommend', RecommendSchema);