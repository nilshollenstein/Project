const express = require("express");
// Um die API abzurufen
const axios = require("axios");
const fs = require("fs");

const app = express();
const url =
  "https://api.openweathermap.org/data/2.5/weather?lat=47&lon=8&appid=682fbde19d8e67b978559f90bac20fcf";
const port = 3000;
// Function to get the Data from the API, needs two return, because of two functions
let summeryWeather;

app.get("/", (req, res) => {
  axios.get(url).then((response) => {
    // Saves the Data into a additionall variable
    let data = response.data;
    let temp = data.main.temp;
    let humidity = data.main.humidity;
    // [0] Because data.weather is an Array,
    let weather = data.weather[0].main;
    // Quelle: https://sentry.io/answers/convert-unix-timestamp-to-date-and-time-in-javascript/
    let sunrise = new Date(data.sys.sunrise * 1000);
    let sunset = new Date(data.sys.sunset * 1000);
    summeryWeather = {
      temp: temp,
      humidity: humidity,
      weather: weather,
      sunrise: sunrise,
      sunset: sunset,
    };
    fs.writeFile(
      "./src/weatherData.json",
      JSON.stringify(summeryWeather),
      (error) => {
        if (error) {
          console.log("Error: " + error);
          return;
        }
        console.log("Data written to file successfully.");
      }
    );
    res.send(JSON.stringify(summeryWeather));
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
