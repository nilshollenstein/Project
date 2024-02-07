// api.js
const axios = require("axios");

async function getWeatherData(url) {
  const response = await axios.get(url);
  return response.data;
}

module.exports = { getWeatherData };
