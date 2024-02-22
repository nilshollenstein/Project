/**
 * Monthly Weatherdata collector and Weather Website
 *
 *
 * @author Nils Hollenstein
 * @version 1.0
 * @name saveData
 * @description This module writes Data to files
 * @date 22.02.2024
 *
 * Needed modules:
 * fs
 *
 * To run this with nodemon enter npm test in the Console
 * To enter it with  normal node enter npm start in the console
 */

/**
 * Imports
 */
const fs = require("fs");

/**
 * Functions
 */
function saveDatatoFile(path, data) {
  // Writes the informations to the file
  fs.writeFile(path, JSON.stringify(data), (error) => {
    // Checks if there was an error while writing to the file
    if (error) {
      console.log("Error: " + error);
      return;
    }
    console.log("Data written to file successfully.");
  });
}
/**
 * Exports
 */
// Exports the function to other files
module.exports = { saveDatatoFile };
