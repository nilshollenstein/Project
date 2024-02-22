// api.js

/**
 * Imports
 */
const axios = require("axios");

/**
 * Functions
 */
// Function to get data from APIs
async function getWeatherData(url) {
  // Gets the data from the API
  const response = await axios.get(url);
  // Returns the data
  return response.data;
}
/**
 * Exports
 */
// Exports the function to other files
module.exports = { getWeatherData };
