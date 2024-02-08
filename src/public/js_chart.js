fetch("./cityData.json")
  .then((res) => {
    //If, damit  die Funktion nur ausgeführt wird wenn der Request erfolgreich war
    if (!res.ok) {
      console.error("Network response was not ok");
      return;
    }
    return res.json();
  })

  .then((data) => {
    console.log(data);
    //https://www.chartjs.org/docs/latest/charts/bar.html
    // Canvas wird ausgewählt, um darauf etwas in 2d zu zeichnen
    var ctx = document.getElementById("myChart1").getContext("2d");
    // Erstellt neuen  Chart mit den Daten aus cityData.json und dem Context von myChart
    var myChart1 = new Chart(ctx, {
      type: "bar",
      data: {
        labels: [
          "Zurich",
          "Cape Town",
          "Dubai",
          "London",
          "Mexico  City",
          "New York",
          "Rio de Janeiro",
          "Shanghai",
          "Tokyo",
        ],
        datasets: [
          {
            label: "Temperature in °C",
            /*Es werden die Temperaturen in einem Array gespeichert*/
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
    // Canvas wird ausgewählt, um darauf etwas in 2d zu zeichnen
    var ctx = document.getElementById("myChart2").getContext("2d");
    // Erstellt neuen  Chart mit den Daten aus cityData.json und dem Context von myChart
    var myChart2 = new Chart(ctx, {
      type: "bar",
      data: {
        labels: [
          "Zurich",
          "Cape Town",
          "Dubai",
          "London",
          "Mexico  City",
          "New York",
          "Rio de Janeiro",
          "Shanghai",
          "Tokyo",
        ],
        datasets: [
          {
            label: "Humidity in %",
            /*Es werden die Temperaturen in einem Array gespeichert*/
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
