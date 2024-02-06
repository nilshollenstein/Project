// api.js
const axios = require("axios");

async function getWeatherData() {
  const url =
    "https://api.openweathermap.org/data/2.5/weather?lat=47&lon=8&appid=682fbde19d8e67b978559f90bac20fcf";
  const response = await axios.get(url);
  return response.data;
}

module.exports = { getWeatherData };
