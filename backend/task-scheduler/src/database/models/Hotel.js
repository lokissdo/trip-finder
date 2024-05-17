const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HotelSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    // location is obejct including lattiude and longitude and province
    province: {
        type: String,
        required: true
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    page_url: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
    },
    checkin: {
        type: String,
    },
    checkout: {
        type: String,
    },
    standard: {
        type: String,
    },
    price: {
        type: Number,
        required: true
    },
    platform: {
        type: String,
        required: true
    },
    image_url: {
        type: String,
        required: true
    },
    description: {
        type: String,
    }
}, {
    timestamps: true
});

HotelSchema.index({ updatedAt: 1 });
module.exports = mongoose.model('Hotel', HotelSchema);