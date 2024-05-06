
// define Model Weather including description, city, temperature, date, crawlDate
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const WeatherSchema = new Schema({
    description: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    temperature: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
}
    , {
        timestamps: true
    });

module.exports = mongoose.model('Weather', WeatherSchema);  
