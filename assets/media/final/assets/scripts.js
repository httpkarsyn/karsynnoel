// Rendering countdown timer
(function () {
    const second = 1000,
        minute = second * 60,
        hour = minute * 60,
        day = hour * 24;

    // January 1st, 2030
    const countDown = new Date("January 1, 2030 00:00:00").getTime();

    const x = setInterval(function () {
        const now = new Date().getTime(),
            distance = countDown - now;

        document.getElementById("days").innerText = Math.floor(distance / (day)).toLocaleString();
        document.getElementById("hours").innerText = Math.floor((distance % (day)) / (hour));
        document.getElementById("minutes").innerText = Math.floor((distance % (hour)) / (minute));
        document.getElementById("seconds").innerText = Math.floor((distance % (minute)) / second);
    }, 0);
})();

// Fetching and rendering data from APIs


var URL_1 = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=35.3733&longitude=-119.0187&hourly=dust&forecast_days=1`;
var URL_2 = `https://api.open-meteo.com/v1/forecast?latitude=-41.2866&longitude=174.7756&hourly=wind_speed_10m&temperature_unit=fahrenheit&wind_speed_unit=mph&forecast_days=1`;
var URL_4 = `https://api.open-meteo.com/v1/forecast?latitude=16.4333&longitude=-93.7953&hourly=temperature_2m&temperature_unit=fahrenheit&forecast_days=1`;
var URL_5 = `https://api.open-meteo.com/v1/forecast?latitude=80.216&longitude=-76.1238&hourly=snowfall&temperature_unit=fahrenheit&forecast_days=1`;
var URL_6 = `https://api.open-meteo.com/v1/forecast?latitude=25.2973&longitude=91.5827&hourly=rain&temperature_unit=fahrenheit&wind_speed_unit=mph&forecast_days=1`

fetch(URL_1)
    .then((response) => response.json())
    .then((data) => renderDust(data));

fetch(URL_2)
    .then((response) => response.json())
    .then((data) => renderWindSpeed(data));

fetch(URL_4)
    .then((response) => response.json())
    .then((data) => renderTemperature(data));

fetch(URL_5)
    .then((response) => response.json())
    .then((data) => renderSnowfall(data));

fetch(URL_6)
    .then((response) => response.json())
    .then((data) => renderRain(data));



    function renderDust(data) {
        var dateObject = new Date();
        var hour = dateObject.getHours();
        var dustElement = document.querySelector('.api-overlay[data-property="dust"]');
        var barElement = document.querySelector('.bar-dust');
    
       
        var dustValue = data.hourly.dust[hour];
    
       
        dustElement.textContent = dustValue + " MG/M3";
    
      
        var maxWidth = 100; 
        var currentWidth = (dustValue / 84) * maxWidth;
        barElement.style.width = currentWidth + '%';
    }
    
    
    function renderWindSpeed(data) {
        var dateObject = new Date();
        var hour = dateObject.getHours();
        var windSpeedElement = document.querySelector('.api-overlay[data-property="wind-speed"]');
        var barElement = document.querySelector('.bar-wind');
    
       
        var windSpeedValue = data.hourly.wind_speed_10m[hour];

        windSpeedElement.textContent = windSpeedValue + " MPH";
    
       
        console.log(barElement);
    
       
        var maxWidth = 100; 
        var currentWidth = (windSpeedValue / 83) * maxWidth; 
      
        barElement.style.width = currentWidth + '%';
    }
    
    

function renderTemperature(data) {
    var dateObject = new Date();
    var hour = dateObject.getHours();
    var temperatureElement = document.querySelector('.api-overlay[data-property="temperature"]');
    var barElement = document.querySelector('.bar-temp');
    
    var temperature = data.hourly.temperature_2m[hour];
    
   
    temperatureElement.textContent = `${temperature} F`;
    
    var maxWidth = 100; 
    var currentWidth = (temperature / 122) * maxWidth; 
    barElement.style.width = currentWidth + '%';
}


function renderSnowfall(data) {
    var dateObject = new Date();
    var hour = dateObject.getHours();
    var snowfallElement = document.querySelector('.api-overlay[data-property="snowfall"]');
    var barElement = document.querySelector('.bar-snow');

   
    var snowfallValue = data.hourly.snowfall[hour];

   
    snowfallElement.textContent = snowfallValue + " IN";

  
    var maxWidth = 100; 
    var currentWidth = (snowfallValue / 23 ) * maxWidth; 

  
    barElement.style.width = currentWidth + '%';
}


function renderRain(data) {
    var dateObject = new Date();
    var hour = dateObject.getHours();
    var rainElement = document.querySelector('.api-overlay[data-property="rain"]');
    var barElement = document.querySelector('.bar-rain');

  
    var rainValue = data.hourly.rain[hour];


    rainElement.textContent = rainValue + " IN";

   
    var maxWidth = 100; 
    var currentWidth = (rainValue / 39.5) * maxWidth; 
    barElement.style.width = currentWidth + '%';
}



