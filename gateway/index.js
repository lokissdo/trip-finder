const express = require("express");
const cors = require("cors");
const proxy = require("express-http-proxy");

const app = express();

app.use(cors());
app.use(express.json());

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
