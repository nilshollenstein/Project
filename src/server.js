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
const { type } = require("os");

/********************************************************
 * Instantiation
 */
// Für das aktuelle Datum

const app = express();

let errorStatus;

const port = 3000;
let url =
  "https://api.openweathermap.org/data/2.5/weather?lat=47&lon=8&appid=682fbde19d8e67b978559f90bac20fcf";

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
  errorStatus = null;
  const latitude = req.body.latitude;
  const longitude = req.body.longitude;

  const coordinates = {
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude),
  };

  if (
    coordinates.latitude <= 90 &&
    coordinates.latitude >= -90 &&
    coordinates.longitude <= 180 &&
    coordinates.longitude >= -180 &&
    typeof coordinates.latitude === "number" &&
    typeof coordinates.longitude === "number"
  ) {
    errorStatus = null;
    res.redirect("overview");
  } else {
    errorStatus = "Invalid Coordinates";
    res.render("index.ejs", { errorStatus: errorStatus });
  }

  saveDatatoFile("./src/json/lat_long.json", coordinates);
});
app.post("/statistics", (req, res) => {
  errorStatus = null;
  const latitude = req.body.latitudeNewLocation;
  const longitude = req.body.longitudeNewLocation;

  const coordinatesNewLocation = {
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude),
  };

  if (
    coordinatesNewLocation.latitude <= 90 &&
    coordinatesNewLocation.latitude >= -90 &&
    coordinatesNewLocation.longitude <= 180 &&
    coordinatesNewLocation.longitude >= -180 &&
    typeof coordinatesNewLocation.latitude === "number" &&
    typeof coordinatesNewLocation.longitude === "number"
  ) {
    errorStatus = "";
    saveDatatoFile(
      "./src/json/coordinatesNewLocation.json",
      coordinatesNewLocation
    );
    res.redirect("statistics");
  } else {
    errorStatus = "Invalid Coordinates";
    res.redirect("statistics");
  }
});
app.get("/", async (req, res) => {
  res.render("index.ejs", { errorStatus: errorStatus });
});
app.get("/overview", async (req, res) => {
  let lat_long = JSON.parse(
    fs.readFileSync("./src/json/lat_long.json", "utf8")
  );
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

app.get("/statistics", async (req, res) => {
  let coordinatesUser = JSON.parse(
    fs.readFileSync("./src/json/coordinatesNewLocation.json", "utf8")
  );
  if (!coordinatesUser[0] || !coordinatesUser[1]) {
    coordinatesUser = { latitude: 0, longitude: 0 };
  }
  console.log(coordinatesUser);
  const coordinatesZurich = [47.37, 8.54];
  const coordinatesNewYork = [40.42, 8.54];
  const coordinatesTokyo = [35.68, 139.74];
  const coordinatesDubai = [25.21, 55.27];
  const coordinatesRioDeJaneiro = [-22.91, -43.23];
  const coordinatesCapeTown = [-33.92, 18.42];
  const coordinatesLondon = [51.5, -0.11];
  const coordinatesShangHai = [31.23, 121.47];
  const coordinatesMexicoCity = [19.43, -99.1389];

  const coordinatesUserLocation = [
    coordinatesUser.latitude,
    coordinatesUser.longitude,
  ];
  console.log(coordinatesUserLocation);
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
  coordinatesCities.push(coordinatesUserLocation);
  console.log(coordinatesCities);
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
  res.render("statistics.ejs", { errorStatus: errorStatus });
});
app.get("/statistics", (req, res) => {
  res.sendFile(__dirname + "/public/cityData.json");
  res.redirect("/statistics");
});
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
