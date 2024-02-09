// Fetching data from the specified JSON file
fetch("./cityData.json")
  .then((res) => {
    //https://www.freecodecamp.org/news/how-to-read-json-file-in-javascript/
    // Check if the network response is successful
    if (!res.ok) {
      console.error("Network response was not ok");
      return;
    }
    return res.json();
  })

  .then((data) => {
    console.log(data);
    // Selecting the canvas to draw on it in 2D
    var ctx = document.getElementById("myChart1").getContext("2d");
    // Creating a new chart with data from cityData.json and the context of myChart
    var myChart1 = new Chart(ctx, {
      type: "bar",
      data: {
        labels: data.map((item) => item.location),
        datasets: [
          {
            label: "Temperature in °C",
            // Storing temperatures in an array
            data: data.map((item) => item.temp),
            backgroundColor: [
              "rgba(255,  99,  132,  0.2)",
              "rgba(54,  162,  235,  0.2)",
              "rgba(255,  206,  86,  0.2)",
              "rgba(75,  192,  192,  0.2)",
            ],
            borderColor: [
              "rgba(255,  99,  132,  1)",
              "rgba(54,  162,  235,  1)",
              "rgba(255,  206,  86,  1)",
              "rgba(75,  192,  192,  1)",
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
        labels: data.map((item) => item.location),
        datasets: [
          {
            label: "Humidity in %",
            // Storing humidity in an array
            data: data.map((item) => item.humidity),
            backgroundColor: [
              "rgba(255,  99,  132,  0.2)",
              "rgba(54,  162,  235,  0.2)",
              "rgba(255,  206,  86,  0.2)",
              "rgba(75,  192,  192,  0.2)",
            ],
            borderColor: [
              "rgba(255,  99,  132,  1)",
              "rgba(54,  162,  235,  1)",
              "rgba(255,  206,  86,  1)",
              "rgba(75,  192,  192,  1)",
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

  .catch((error) => {
    console.error("There has been a problem with your fetch operation:", error);
  });
