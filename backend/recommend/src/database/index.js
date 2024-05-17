
// database related modules
module.exports = {
    databaseConnection: require('./connection'),
    // redisClient: require('./redis-connection'),
    RecommendRepository: require('./repository/recommend-repository'),
    DailyScheduleRepository: require('./repository/daily-schedule-repository'),

}