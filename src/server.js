/**
 * Monthly Weatherdata collector and Weather Website
 *
 * A program to process and filter monthly weather data based on the current month.
 * 
 * @author Nils Hollenstein
 * @version 1.0
 * @name WeatherWebsite
 * @

*/
/********************************************************
 * Imports
 */
const express = require("express");
const fs = require("fs");
const { getWeatherData } = require("./api");
const { saveDatatoFile } = require("./saveData");
const path = require("path");

/********************************************************
 * Instantiation
 */
// Für das aktuelle Datum
const date = new Date();
const app = express();

let errorStatus = null;

const port = 3000;
const jsonPathDailyData = "./src/weatherData.json";
let url =
  "https://api.openweathermap.org/data/2.5/weather?lat=47&lon=8&appid=682fbde19d8e67b978559f90bac20fcf";

/*********************************************************
 * Functions
 */
// Quelle: https://sentry.io/answers/how-do-i-test-for-an-empty-javascript-object/
// Prüft ob ein Array etwas enthält
function isEmpty(array) {
  // Durch jedes element im Array iterieren
  for (let piece in array) {
    // Wenn im Array  ein Element vorhanden ist, wird false zurückgegeben
    if (array.hasOwnProperty(piece)) return false;
  }
  // Wenn im Array nichts gefunden wurde wird true zurückgegeben
  return true;
}

/**********************************************************
 * Backend Code
 */

app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

// Define the directory where your HTML files (views) are located
app.set("views", path.join(__dirname, "views"));

// Optionally, you can define a static files directory (CSS, JS, images, etc.)
app.use(express.static(path.join(__dirname, "public")));

app.post("/", (req, res) => {
  const latitude = req.body.latitude;
  const longitude = req.body.longitude;

  console.log(latitude + " " + longitude);
  const coordinates = {
    latitude: latitude,
    longitude: longitude,
  };
  if (
    latitude >= 90 ||
    latitude >= -90 ||
    longitude >= 180 ||
    longitude <= -180 ||
    typeof latitude === "string" ||
    typeof longitude === "string"
  ) {
    errorStatus = "Ungültige Koordinaten oder falscher Datentyp.";
    res.redirect("/");
  } else {
    errorStatus = null;
    res.redirect("/overview");
  }
});
app.get("/", async (req, res) => {
  const coordinatesZurich = [47.37, 8.54];
  const coordinatesNewYork = [40.42, 8.54];
  const coordinatesTokyo = [35.68, 139.74];
  const coordinatesDubai = [25.21, 55.27];
  const coordinatesRioDeJaneiro = [-22.91, -43.23];
  const coordinatesCapeTown = [-33.92, 18.42];
  const coordinatesLondon = [51.5, -0.11];
  const coordinatesShangHai = [31.23, 121.47];
  const coordinatesMexicoCity = [19.43, -99.1389];
  const coordinatesCities = [
    coordinatesZurich,
    coordinatesCapeTown,
    coordinatesDubai,
    coordinatesLondon,
    coordinatesMexicoCity,
    coordinatesNewYork,
    coordinatesRioDeJaneiro,
    coordinatesShangHai,
    coordinatesTokyo,
  ];

  let dataCity = [];
  for (let i = 0; i < coordinatesCities.length; i++) {
    let urlCities = `https://api.openweathermap.org/data/2.5/weather?lat=${coordinatesCities[i][0]}&lon=${coordinatesCities[i][1]}&appid=682fbde19d8e67b978559f90bac20fcf`;
    let dataCurrentCity = await getWeatherData(urlCities);
    let temp = dataCurrentCity.main.temp;
    let informationCity = {
      temp: Math.round((temp - 273.15) * 100) / 100,
      humidity: dataCurrentCity.main.humidity,
      location: dataCurrentCity.name,
    };
    dataCity.push(informationCity);
  }
  saveDatatoFile("./src/public/cityData.json", dataCity);

  res.render("index.ejs", { errorStatus: errorStatus });
});
app.get("/overview", async (req, res) => {
  let lat_long = JSON.parse(fs.readFileSync("./src/lat_long.json", "utf8"));
  let lat = lat_long.latitude;
  let long = lat_long.longitude;

  if (lat && long) {
    url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=682fbde19d8e67b978559f90bac20fcf`;
  }
  // Saves the Data into a additionall variable, saves some Values to own variables
  let data = await getWeatherData(url);
  let temp = data.main.temp;
  let humidity = data.main.humidity;
  // [0] Because data.weather is an Array,
  let weather = data.weather[0].main;
  // Quelle: https://sentry.io/answers/convert-unix-timestamp-to-date-and-time-in-javascript/
  let sunrise = new Date(data.sys.sunrise * 1000);
  let sunset = new Date(data.sys.sunset * 1000);
  let location = data.name;

  summeryWeather = {
    temp: Math.round((temp - 273.15) * 100) / 100,
    humidity: humidity,
    weather: weather,
    sunrise: sunrise.toLocaleTimeString(),
    sunset: sunset.toLocaleTimeString(),
    location: location,
  };

  res.render("overview.ejs", { data: summeryWeather });
});

app.get("/statistics", (req, res) => {
  res.render("statistics.ejs");
  res.sendFile("cityData.json");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
