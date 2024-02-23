/**
 *
 * @author Nils Hollenstein
 * @version 1.3
 * @description This program uses the Data from cityData.json to display dynamic Charts on the website
 */

/**
 * Instantiation
 */
let correctLocationName = [
  "Zurich",
  "Cape Town",
  "Dubai",
  "London",
  "Mexico City",
  "New York",
  "Rio de Janeiro",
  "Shang Hai",
  "Tokyo",
];
// Geting data from the specified JSON file
fetch("./cityData.json")
  .then((res) => {
    //https://www.freecodecamp.org/news/how-to-read-json-file-in-javascript/
    // Check if the network response is successful(this if is needed, so that the charts aren't empty)
    if (!res.ok) {
      console.error("Network response was not ok");
      return;
    }
    return res.json();
  })

  .then((data) => {
    // Replace the names of the Locations with more understandable names
    let locationsList = data.map((item) => item.location);
    for (let i = 0; i < correctLocationName.length; i++) {
      if (locationsList.length <= i) {
        locationsList.push(correctLocationName[i]);
      } else {
        locationsList[i] = correctLocationName[i];
      }
    }

    // Selecting the canvas to draw on it in 2D
    var ctx = document.getElementById("myChart1").getContext("2d");
    // Creating a new chart with data from cityData.json and the context of myChart
    var myChart1 = new Chart(ctx, {
      type: "bar",
      data: {
        labels: locationsList,
        datasets: [
          {
            label: "Temperature in °C",
            // Storing temperatures in a new array
            data: data.map((item) => item.temp),
            backgroundColor: [
              "rgba(192, 192, 232, 0.3)",
              "rgba(150, 150, 190, 0.3)",
              "rgba(128, 128, 168, 0.3)",
              "rgba(100, 100, 140, 0.3)",
            ],
            borderColor: [
              "rgba(192, 192, 232, 1)",
              "rgba(150, 150, 190, 1)",
              "rgba(128, 128, 168, 1)",
              "rgba(100, 100, 140, 1)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        plugins: {
          legend: {
            labels: {
              // This more specific font property overrides the global property
              font: {
                size: 20,
              },
            },
          },
        },
      },
    });
    // Selecting the canvas to draw on it in 2D
    var ctx = document.getElementById("myChart2").getContext("2d");
    // Creating a new chart with data from cityData.json and the context of myChart
    var myChart2 = new Chart(ctx, {
      type: "bar",
      data: {
        labels: locationsList,
        datasets: [
          {
            label: "Humidity in %",
            // Storing humidity in an array
            data: data.map((item) => item.humidity),
            backgroundColor: [
              "rgba(192, 192, 232, 0.3)",
              "rgba(150, 150, 190, 0.3)",
              "rgba(128, 128, 168, 0.3)",
              "rgba(100, 100, 140, 0.3)",
            ],
            borderColor: [
              "rgba(192, 192, 232, 1)",
              "rgba(150, 150, 190, 1)",
              "rgba(128, 128, 168, 1)",
              "rgba(100, 100, 140, 1)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        plugins: {
          legend: {
            labels: {
              // This more specific font property overrides the global property
              font: {
                size: 20,
              },
            },
          },
        },
      },
    });
  })
  // Catch the error if there is one with the fetch
  .catch((error) => {
    console.error("There has been a problem with your fetch operation:", error);
  });
