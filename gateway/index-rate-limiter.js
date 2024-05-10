const express = require("express");
const cors = require("cors");
const redis = require("redis");
const proxy = require("express-http-proxy");
const app = express();
const REDIS_PORT = 6379;  // Replace with your redis port
const REDIS_HOST = "127.0.0.1";
const NUM_REQUESTS = 10;
const WINDOW_DURATION = 60000; // 1 minute

const redisClient = redis.createClient({
  socket: {
    port: REDIS_PORT,
    host: REDIS_HOST,
  }
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

    next(); // Allow the request to proceed
  };
};
app.use(cors());
app.use(express.json());

app.use(rateLimiter(WINDOW_DURATION,NUM_REQUESTS)); // Apply globally for all routes

app.use("/customer", proxy("http://localhost:8001"));
app.use("/search", proxy("http://localhost:8002"));
app.use("/", proxy("http://localhost:8002")); // products

app.listen(8000, () => {
  console.log("Gateway is Listening to Port 8000");
});
