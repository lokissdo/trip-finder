const Itinerary = require('./models/Itinerary');

// database related modules
module.exports = {
    databaseConnection: require('./connection'),
   UserRepository: require('./repository/user-repository'),
   HotelRepository : require('./repository/hotel-repository'),

   ItineraryRepository: require('./repository/test'),
}