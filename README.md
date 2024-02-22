# WeatherWebsite  
## Description  

This project is a Monthly Weatherdata collector and Weather Website. It collects weather data based on user-provided coordinates and displays it on a website.  

## Author  
[Nils Hollenstein](https://github.com/nilshollenstein)
## Version  
1.2  
### Modules  
Make sure to install the following modules using npm:  

- express.js
- fs
- path
- nodemon
## How to use it
Run this command to clone it
``` bash
   git clone https://github.com/nilshollenstein/Project_WinterVacations.git
 ```  
Then Run this command (install node.js i you don't allready have it)
``` bash
   npm i
 ```

## How to run it  
To run this with nodemon, enter  
``` bash
   npm test
 ```
in the Console.  
To run this with node, enter  
``` bash
   npm start
 ```
in the Console
## Project Structure  
- api.js: Contains functions to fetch weather data from the OpenWeatherMap API.  
- saveData.js: Includes functions to save user-provided coordinates to a file.  
- views directory: Contains HTML templates for different routes (index.ejs, overview.ejs, statistics.ejs).  
- public directory: Includes static files like images and the cityData.json file.  
- style_index.css, style_overview.css, style_statistics.css: CSS files for styling different pages.  
- js_chart.js: JavaScript file for rendering charts using Chart.js.  
## How to Use  
1. Start by entering the coordinates of the location you want to check on the home page.  
2. Navigate to the "Overview" page to see the current weather details for the provided coordinates.  
3. Navigate to the "Statistics" page to compare weather data among different cities, including the one you entered.    
**Important Note**  
Make sure to provide valid latitude and longitude values within the specified ranges.  
### Acknowledgments  
- This project uses the OpenWeatherMap API to fetch weather data.  
- Charts are created using the Chart.js library.
- The HTML files work with ejs
### Contact    
For any inquiries, contact the author Nils Hollenstein.  
