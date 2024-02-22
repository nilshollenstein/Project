/**
 * Monthly Weatherdata collector and Weather Website
 *
 *
 * @author Nils Hollenstein
 * @version 1.2
 * @name WeatherWebsite
 * @description This Module collects data from API's
 * @date 22.02.2024
 *
 * Needed modules:
 * axios
 */
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
