const Itinerary = require('./models/Itinerary');

// database related modules
module.exports = {
    databaseConnection: require('./connection'),
   UserRepository: require('./repository/user-repository'),
   ItineraryRepository: require('./repository/itinerary-repository'),
}