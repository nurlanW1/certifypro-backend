require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 4000,
  FRONTEND_URL: process.env.FRONTEND_URL || "http://127.0.0.1:5500"
};
