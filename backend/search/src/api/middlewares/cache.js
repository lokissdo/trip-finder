const redis = require('redis');

// Create Redis clients
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


// Middleware for search query caching
const cacheMiddleware = async(req, res, next) => {
    const key = req.originalUrl || req.url;
    console.log('key:', key)
    try {
        const cachedResponse = await redisClient.get(key)
        if (cachedResponse) {
            console.log("cache hit",cachedResponse)
            return res.json(JSON.parse(cachedResponse));
        } else {
            res.sendResponse = res.json;
            res.json = (body) => {
                redisClient.set(key, JSON.stringify(body),{EX: 600} ); // Cache for 600 seconds (10 minutes)
                res.sendResponse(body);
            };
            next();
        }
    } catch (e) {
        console.log('Error in get cache from Redis:', e)
        next()
    }

};

// Middleware for rate limiting (example)

// Example routes using the middlewares
module.exports = cacheMiddleware