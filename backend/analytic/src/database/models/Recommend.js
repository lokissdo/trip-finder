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
        type: Object,
        required: true
    }
});
 
module.exports =  mongoose.model('Recommend', RecommendSchema);