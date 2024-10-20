var key = 'e92c3c9cd77dad7b1b1d40b741adca16'; // api key

var lat = 40.73;
var lng = -74.00;

var URL_1 = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${ lat }&longitude=${ lng }&hourly=ozone&forecast_days=1`;
var URL_2 = `https://api.openweathermap.org/data/2.5/weather?lat=${ lat }&lon=${ lng }&appid=e92c3c9cd77dad7b1b1d40b741adca16&units=imperial`;

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
	var airElement = document.querySelector('.air');
	airElement.innerHTML = `${ data.hourly.ozone[11] }`;
}

function renderWeather(data) {
	console.log(data);
	var weatherElement = document.querySelector('.weather');
	weatherElement.innerHTML = `${ data.wind.speed }`;
}
