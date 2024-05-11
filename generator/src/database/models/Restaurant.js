const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LandscapeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    // location is obejct including lattiude and longitude and province
    location: {
        province: {
            type: String,
            required: true
        },
        latitude: {
            type: String,
            required: true
        },
        longitude: {
            type: String,
            required: true
        }
    },
    rating: {
        type: Number,
    },
    link : {
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
    image: {
        type: String,
        required: true
    },
    openTime: {
        type: String,
    },
    description: {
        type: String,
    }
}, {
    timestamps: true
});

module.exports =  mongoose.model('Landscape', LandscapeSchema);