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
    latitude <= 90 &&
    latitude >= -90 &&
    longitude <= 180 &&
    longitude >= -180
  ) {
    saveDatatoFile("./src/lat_long.json", coordinates);
  }
  res.redirect("/overview");
});
app.get("/", async (req, res) => {
  let data = await getWeatherData(url);
  let temp = data.main.temp;
  let humidity = data.main.humidity;
  let id = data.id;
  let location = data.name;

  let dailyConditions = {
    temp: Math.round((temp - 273.15) * 100) / 100,
    humidity: humidity,
    id: id,
    location: location,
  };
  // Speichert den aktuellen Monat in einer Variable
  const currentMonth = date.getMonth() + 1;
  // Speichert die JSON-Daten in einer Variable
  const dataFromFile = fs.readFileSync(jsonPathDailyData, "utf8");
  // Erstellt ein JS-Objekt aus dem JSON Objekt
  const parsedData = JSON.parse(dataFromFile);
  // Sucht nach dem Monat im JSON Objekt und gibt die Wetterdaten des Tages zurück
  const currentMonthData = parsedData[currentMonth];

  if (isEmpty(currentMonthData)) {
    parsedData[currentMonth] = [dailyConditions];
  } else {
    // Information to findIndex from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex?retiredLocale=de
    // Searches a specific Index in the Object, compares it with today
    const existingLocationData = currentMonthData.findIndex(
      // Schaut ob es einen Eintrag zum aktuellen Tag findet, wenn ja, kommt der index des ersten passenden Wertes zurück, sonst -1
      (location) => location.id === dailyConditions.id
    );

    //Prüft ob Eintrag für aktuellen Monat enthalten
    if (currentMonthData) {
      if (existingLocationData !== -1) {
        // Wenn es einen Eintrag gibt, fügt man ihn diesem hinzu(überschreibt den alten)
        currentMonthData[existingLocationData] = dailyConditions;
      } else {
        // Fügt neuen eintrag Hinzu
        currentMonthData.push(dailyConditions);
      }
    } else {
      // Erstellt einen neuen Eintrag für den Monat und fügt die Dailyconditions an
      parsedData[currentMonth] = [dailyConditions];
    }

    for (let i = 1; i < 13; i++) {
      if (i !== currentMonth) {
        delete parsedData[i];
      }
    }
  }
  saveDatatoFile(jsonPathDailyData, parsedData);
  res.render("index.ejs");
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
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
