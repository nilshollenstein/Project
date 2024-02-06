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
// Ucm die API abzurufen
const axios = require("axios");
const fs = require("fs");
const { parse } = require("url");

/********************************************************
 * Instantiation
 */
// Für das aktuelle Datum
const date = new Date();
const app = express();
const url =
  "https://api.openweathermap.org/data/2.5/weather?lat=47&lon=8&appid=682fbde19d8e67b978559f90bac20fcf";
const port = 3000;
const path = "./src/weatherData.json";

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
app.get("/", (req, res) => {
  axios.get(url).then((response) => {
    // Saves the Data into a additionall variable, saves some Values to own variables
    let data = response.data;
    let temp = data.main.temp;
    let humidity = data.main.humidity;
    // [0] Because data.weather is an Array,
    let weather = data.weather[0].main;
    // Quelle: https://sentry.io/answers/convert-unix-timestamp-to-date-and-time-in-javascript/
    let sunrise = new Date(data.sys.sunrise * 1000);
    let sunset = new Date(data.sys.sunset * 1000);
    summeryWeather = {
      temp: Math.round((temp - 273.15) * 100) / 100,
      humidity: humidity,
      weather: weather,
      sunrise: sunrise,
      sunset: sunset,
    };
    let dailyConditions = {
      temp: Math.round((temp - 273.15) * 100) / 100,
      humidity: humidity,
      day: date.getDate(),
    };
    // Speichert den aktuellen Monat in einer Variable
    const currentMonth = date.getMonth() + 1;
    // Speichert die JSON-Daten in einer Variable
    const dataFromFile = fs.readFileSync(path, "utf8");
    // Erstellt ein JS-Objekt aus dem JSON Objekt
    const parsedData = JSON.parse(dataFromFile);
    // Sucht nach dem Monat im JSON Objekt und gibt die Wetterdaten des Tages zurück
    const currentMonthData = parsedData[currentMonth];

    if (isEmpty(currentMonthData)) {
      parsedData[currentMonth] = [dailyConditions];
    } else {
      // Information to findIndex from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex?retiredLocale=de
      // Searches a specific Index in the Object, compares it with today
      const existingEntryDay = currentMonthData.findIndex(
        // Schaut ob es einen Eintrag zum aktuellen Tag findet, wenn ja, kommt der index des ersten passenden Wertes zurück, sonst -1
        (day) => day.day === dailyConditions.day
      );

      //Prüft ob Eintrag für aktuellen Monat enthalten
      if (currentMonthData) {
        if (existingEntryDay !== -1) {
          // Wenn es einen Eintrag gibt, fügt man ihn diesem hinzu(überschreibt den alten)
          currentMonthData[existingEntryDay] = dailyConditions;
        } else {
          // Fügt neuen eintrag Hinzu
          currentMonthData.push(dailyConditions);
        }
      } else {
        // Erstellt einen neuen Eintrag für den Monat und fügt die Dailyconditions an
        parsedData[currentMonth] = [dailyConditions];
      }
      for (let i = 1; i < 12; i++) {
        if (i !== currentMonth) {
          delete parsedData[i];
        }
      }
    }
    // Writes the informations to the file
    fs.writeFile(path, JSON.stringify(parsedData), (error) => {
      if (error) {
        console.log("Error: " + error);
        return;
      }
      console.log("Data written to file successfully.");
    });
    res.send(JSON.stringify(summeryWeather));
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
