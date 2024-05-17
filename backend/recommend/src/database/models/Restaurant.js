const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RestaurantSchema = new Schema({
    name: {
        type: String,
        required: true
    },
   status: {
        type: String,
    },
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
    },
    rating: {
        type: Number,
    },
    link: {
        type: String,
    },
    description: {
        type: String,
    },
    style: {
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
    },
    description: {
        type: String,
    }
}, {
    timestamps: true
});


RestaurantSchema.index({ updatedAt: 1 });
module.exports = mongoose.model('Restaurant', RestaurantSchema);