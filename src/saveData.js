const fs = require("fs");

function saveDatatoFile(path, data) {
  // Writes the informations to the file
  fs.writeFile(path, JSON.stringify(data), (error) => {
    if (error) {
      console.log("Error: " + error);
      return;
    }
    console.log("Data written to file successfully.");
  });
}

module.exports = { saveDatatoFile };
