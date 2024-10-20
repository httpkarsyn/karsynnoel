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


var key = 'e92c3c9cd77dad7b1b1d40b741adca16'; // api key

var lat = 40.73;
var lng = -74.00;

var URL_1 = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lng}&hourly=ozone&forecast_days=1`;
var URL_2 = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=e92c3c9cd77dad7b1b1d40b741adca16&units=imperial`;

fetch(URL_1)
      .then((response) => {
            return response.json();
      })
      .then((data) => {
            renderAirQuality(data);
      })

fetch(URL_2)
      .then((response) => {
            return response.json();
      })
      .then((data) => {
            renderWeather(data);
      })

function renderAirQuality(data) {
      console.log(data);

      var elevationElement = document.querySelector('.api-overlay[data-property="elevation"]');
     elevationElement.innerHTML = data.elevation;
}

function renderWeather(data) {
      console.log(data);

      var windSpeedElement = document.querySelector('.api-overlay[data-property="wind-speed"]');
      windSpeedElement.innerHTML = data.wind.speed;
}
