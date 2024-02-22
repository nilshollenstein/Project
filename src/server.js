/**
 * Monthly Weatherdata collector and Weather Website
 *
 * This program collects weather data based on user-provided coordinates and displays it on a website.
 *
 * @author Nils Hollenstein
 * @version 1.0
 * @name WeatherWebsite
 *
 * To run this with nodemon enter npm test in the Console
 * To enter it with  normal node enter npm start in the console
 */
/********************************************************
 * Imports
 */
const express = require("express");
const fs = require("fs");
const path = require("path");
const { getWeatherData } = require("./api");
const { saveDatatoFile } = require("./saveData");

/********************************************************
 * Instantiation
 */

const app = express();

let errorStatusIndex;
let errorStatusStatistics;

const port = 3000;
let url =
  "https://api.openweathermap.org/data/2.5/weather?lat=47&lon=8&appid=682fbde19d8e67b978559f90bac20fcf";

/**********************************************************
 * Backend Code
 */

// Parse Request from HTML
app.use(express.urlencoded({ extended: true }));

//Set the view Engine to EJS
app.set("view engine", "ejs");

// Define the directory where your HTML files (views) are located
app.set("views", path.join(__dirname, "views"));

// Optionally, you can define a static files directory (CSS, JS, images, etc.)
app.use(express.static(path.join(__dirname, "public")));

// Handle POST request for the index route
app.post("/", (req, res) => {
  // Reset the status of the errormessage
  errorStatusIndex = null;
  // Collect the data from the form
  const latitude = req.body.latitude;
  const longitude = req.body.longitude;

  // Saves the coordinates to an object
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
    // No wrong input, redirect to overview
    errorStatusIndex = null;
    res.redirect("overview");
    // Wrong input, render index with error
  } else {
    errorStatusIndex = "Invalid Coordinates";
    res.render("index.ejs", { errorStatus: errorStatusIndex });
  }
  // Save coordinates to the file
  saveDatatoFile("./src/json/lat_long.json", coordinates);
});

// Handle POST request for the statistics route
app.post("/statistics", (req, res) => {
  // Reset the status of the errormessage
  errorStatusStatistics = null;

  // Collect the data from the form

  const latitude = req.body.latitudeNewLocation;
  const longitude = req.body.longitudeNewLocation;

  // Saves the coordinates to an object
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
    // No errors, save coordinates to file and redirect to statistics
    errorStatusStatistics = null;
    saveDatatoFile(
      "./src/json/coordinatesNewLocation.json",
      coordinatesNewLocation
    );
    res.redirect("statistics");
  } else {
    // Invalid coordinates, redirect to statistics with error status
    errorStatusStatistics = "Invalid Coordinates";
    res.redirect("statistics");
  }
});
// Handle GET request for the root route
app.get("/", async (req, res) => {
  // Render index with the error status
  res.render("index.ejs", { errorStatus: errorStatusIndex });
});

// Handle GET request for the overview route
app.get("/overview", async (req, res) => {
  // Retrieve coordinates from file
  let lat_long = JSON.parse(
    fs.readFileSync("./src/json/lat_long.json", "utf8")
  );
  let lat = lat_long.latitude;
  let long = lat_long.longitude;

  if (lat && long) {
    // Update API URL with the coordinates of the user
    url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=682fbde19d8e67b978559f90bac20fcf&units=metric`;
  }

  // Saves the Data into a additionall variable, saves some Values to own variables
  let data = await getWeatherData(url);

  let temp = data.main.temp;
  let humidity = data.main.humidity;
  // [0] Because data.weather is an Array that contains another object
  let weather = data.weather[0].main;
  let windspeed = data.wind.speed;
  // Quelle: https://sentry.io/answers/convert-unix-timestamp-to-date-and-time-in-javascript/
  let sunrise = new Date(data.sys.sunrise * 1000);
  let sunset = new Date(data.sys.sunset * 1000);
  let location = data.name;

  summeryWeather = {
    temp: temp,
    humidity: humidity,
    weather: weather,
    sunrise: sunrise.toLocaleTimeString(),
    sunset: sunset.toLocaleTimeString(),
    windspeed: (windspeed * 3.6).toFixed(2),
    location: location,
  };

  res.render("overview.ejs", { data: summeryWeather });
});

// Handle GET request for the statistics route
app.get("/statistics", async (req, res) => {
  // Retrieve user coordinates from file
  let coordinatesUser = JSON.parse(
    fs.readFileSync("./src/json/coordinatesNewLocation.json", "utf8")
  );
  // Coordinates of predefined cities
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

  // User's coordinates
  const coordinatesUserLocation = [
    coordinatesUser.latitude,
    coordinatesUser.longitude,
  ];

  // Array of all coordinates (including user's)
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

  let dataCity = [];
  for (let i = 0; i < coordinatesCities.length; i++) {
    // Iterate threw all coordinates and collect the data from all locations
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

  // Save city data to file
  saveDatatoFile("./src/public/cityData.json", dataCity);
  res.render("statistics.ejs", { errorStatus: errorStatusStatistics });
});

// Handle GET request to retrive the city data
app.get("/statistics", (req, res) => {
  // Send the city data file as response
  res.sendFile(__dirname + "/public/cityData.json");
  res.redirect("/statistics");
});
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
