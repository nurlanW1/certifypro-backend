// backend/config.js
require("dotenv").config();

const FRONTEND_URL =
  process.env.FRONTEND_URL ||
  "https://frontend-production-6cfb.up.railway.app"; // frontend Railway URL

module.exports = {
  PORT: process.env.PORT || 4000,
  FRONTEND_URL,
};
