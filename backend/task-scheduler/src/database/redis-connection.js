const redis = require("redis");
const redisClient = redis.createClient({
    url: process.env.REDIS_URL,
});

(async () => {
    try {
        await redisClient.connect();
        console.log("Connected to Redis successfully");
    } catch (error) {
        console.error("Error connecting to Redis:", error);
        process.exit(1); // Exit the application on Redis connection failure
    }
})();

module.exports = redisClient;   