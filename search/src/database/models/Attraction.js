const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AttractionSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    province: {
        type: String,
        required: true
    },
    lat: {
        type: Number,
        required: true
    },
    long: {
        type: Number,
        required: true
    },
    platform: {
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
    address: {
        type: String
    },
    img_url: {
        type: String
    },
    description: {
        type: String,
    },
    link: {
        type: String,
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Attraction', AttractionSchema);