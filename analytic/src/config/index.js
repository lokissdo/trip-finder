const dotEnv = require("dotenv");

// if (process.env.NODE_ENV !== "prod") {
//   const configFile = `./.env.${process.env.NODE_ENV}`;
//   dotEnv.config({ path: configFile });
// } else {
//   dotEnv.config();
// }


const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../../.env.dev') })
module.exports = {
  PORT: process.env.ANALYTIC_PORT,
  DB_URL: process.env.MONGODB_URI,
  APP_SECRET: process.env.APP_SECRET,
  EXCHANGE_NAME: process.env.EXCHANGE_NAME,
  MSG_QUEUE_URL: process.env.MSG_QUEUE_URL,
  SEARCH_SERVICE: process.env.SEARCH_SERVICE,
  ELASTICSEARCH_URL: process.env.ELASTICSEARCH_URL,
};
