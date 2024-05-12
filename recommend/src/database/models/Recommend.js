const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ItinerarySchema = new Schema({
    
},{
    timestamps: true
});
 
module.exports =  mongoose.model('Itinerary', ItinerarySchema);