const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VehicleSchema = new Schema({
    // type is enum, bus or plane
    type: {
        type: String,
        enum: ['Xe Khách', 'Máy bay'],
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    departureTime: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    departure: {
        type: String,
        required: true
    },
    arrival: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
    },
    price: {
        type: Number,
        required: true
    },
    coupon: {
        type: String,
    },
    image_url: {
        type: String,
        required: true
    },
    detail: {
        type: String,
    },
    page_url : {
        type: String,
    }
}, {
    timestamps: true
});

module.exports =  mongoose.model('Vehicle', VehicleSchema);