const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VehicleSchema = new Schema({
    // type is enum, bus or plane
    type: {
        type: String,
        enum: ['BUS', 'PLANE'],
        required: true
    },
    departureDate: {
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

    destinationDate: {
        type: Date,
        required: true
    },
    rating: {
        type: Number,
    },
    price: {
        type: Number,
        required: true
    },
    platform: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    link : {
        type: String,
    }
}, {
    timestamps: true
});

module.exports =  mongoose.model('Vehicle', VehicleSchema);