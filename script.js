var apiKey = "74b589766e2c1c1f69016c5e5740ff80";
var searchBtn = document.getElementById("search-btn");

var cityName = document.getElementById("city-name");
var temperature = document.getElementById("temperature");
var wind = document.getElementById("wind");
var humidity = document.getElementById("humidity");
var currentUVIndex = document.getElementById("uvIndex");
var weatherIcon = document.getElementById("weather-icon")
var city;
var currentDate = moment().format("MMM Do, YYYY");



function handleFormSubmit(form) {
    const cityName = form.querySelector("#search-text").value;
    getCity(cityName);
}
// function to get the selected city from the search bar

function getCity(cityName) {
    let requestURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;
    fetch(requestURL).then(function(response) {
            console.log(cityName)
        }

    )
}

searchBtn.addEventListener("click", getCity)