
// database related modules
module.exports = {
    databaseConnection: require('./connection'),
    RecommendRepository: require('./repository/recommend-repository'),
    DailyScheduleRepository: require('./repository/daily-schedule-repository'),
    HotelRepository: require('./repository/hotel-repository'),
    AttractionRepository: require('./repository/attraction-repository'),
    RestaurantRepository: require('./repository/restaurant-repository'),
    VehicleRepository: require('./repository/vehicle-repository'),

    redisClient: require('./redis-connection')
}