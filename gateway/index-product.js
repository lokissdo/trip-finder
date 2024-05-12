require('dotenv').config(); 
const express = require("express");
const cors = require("cors");
const redis = require("redis");
const proxy = require("express-http-proxy");
const app = express();
const REDIS_PORT = 6379;  // Replace with your redis port
const REDIS_HOST = process.env.REDIS_HOST || "localhost";
const NUM_REQUESTS = 10;
const WINDOW_DURATION = 60000; // 1 minute
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

const rateLimiter = (windowMs, limit) => {
  return async (req, res, next) => {
    const ip = req.ip;
    const key = `rate-limit:${ip}`; 
    const count = await redisClient.get(key);
    let newCount = 0;

    if (count) {
      // Convert count to a number and check if limit exceeded
      newCount = parseInt(count);
      if (newCount >= limit) {
        return res.status(429).json({
          error: "Too Many Requests",
          message: `You have exceeded the rate limit of ${limit} requests per ${windowMs / 1000} seconds. Please try again later.`,
        });
      }
    }

    await redisClient.incr(key);

    await redisClient.expire(key, windowMs / 1000); // Expires after window duration
    console.log(`Request count for ${ip}: ${newCount + 1}`);
    next(); // Allow the request to proceed
  };
};
app.use(cors());
app.use(express.json());

app.use(rateLimiter(WINDOW_DURATION,NUM_REQUESTS)); // Apply globally for all routes

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || "http://localhost:8001";
const SEARCH_SERVICE_URL = process.env.SEARCH_SERVICE_URL || "http://localhost:8002";
const RECOMMENDATION_SERVICE_URL = process.env.RECOMMENDATION_SERVICE_URL || "http://localhost:8003";
const ANALYTIC_SERVICE_URL = process.env.ANALYTIC_SERVICE_URL || "http://localhost:8004";

app.use("/user", proxy(USER_SERVICE_URL));
app.use("/search", proxy(SEARCH_SERVICE_URL));
app.use("/recommend", proxy(RECOMMENDATION_SERVICE_URL));
app.use("/analytic", proxy(ANALYTIC_SERVICE_URL));

app.listen(8000, () => {
  console.log("Gateway is Listening to Port 8000");
});
