var apiKey = "74b589766e2c1c1f69016c5e5740ff80";
var searchBtn = document.getElementById("search-btn");
var cityName = document.getElementById("search-text");
var searchCityName = document.getElementById("search-city-name");
var prevSearches = document.getElementById("prev-searches")
var prevCityBtn = document.getElementsByClassName("prev-city-btn");
var temperature = document.getElementById("temperature");
var wind = document.getElementById("wind");
var humidity = document.getElementById("humidity");
var currentUVIndex = document.getElementById("uvIndex");
var weatherIcon = document.getElementById("weather-icon");
var currentDay = document.getElementById("current-day");
var dayCard = document.getElementsByClassName("day-card");
var fiveDate = document.getElementById("date");


var currentDate = moment().format("MMM Do, YYYY");

function pageinit() {
    getPrevCities()
}
searchBtn.addEventListener('click', function() {
    getCity(cityName)

})

// function to get the selected city from the search bar

function getCity(cityName) {
    var searchedCity = cityName.value;
    let requestURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchedCity + "&units=metric&appid=" + apiKey;
    fetch(requestURL)
        .then(function(response) {
            response.json().then(function(data) {
                console.log(data);
                displayCityData(data);
                saveSearchedCity(searchedCity);
            })
        });

};

function displayCityData(data) {
    var searchedCityName = data.name;
    var cityTemp = data.main.temp;
    var windSpeed = data.wind.speed;
    var searchedHumidity = data.main.humidity;
    var latitude = data.coord.lat;
    var longitude = data.coord.lon;

    searchCityName.innerHTML = searchedCityName;
    temperature.innerHTML = cityTemp + "°C";
    wind.innerHTML = windSpeed + "km/h";
    humidity.innerHTML = searchedHumidity + "%";
    currentDay.innerHTML = currentDate;

    var currentWeatherIcon = document.createElement("img");
    currentWeatherIcon.setAttribute("src", "https://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png");
    weatherIcon.appendChild(currentWeatherIcon);

    getUVIndex(latitude, longitude);
}

function getUVIndex(latitude, longitude) {
    let uvURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + apiKey + "&lat=" + latitude + "&lon=" + longitude;
    fetch(uvURL)
        .then(function(index) {
            index.json().then(function(data) {

                if (data.value < 4) {
                    currentUVIndex.setAttribute("id", "green-UV");
                } else if (data.value < 8) {
                    currentUVIndex.setAttribute("id", "yellow-UV");
                } else {
                    currentUVIndex.setAttribute("id", "red-UV");
                }

                currentUVIndex.innerHTML = data.value;

            })
        })
}



function saveSearchedCity(searchedCity) {

    var lsCity = localStorage.getItem("searchedCities");

    var arrayCity;

    if (!lsCity) {
        arrayCity = [];
    } else {
        arrayCity = JSON.parse(lsCity)
    };

    arrayCity.push(searchedCity);

    var cityString = JSON.stringify(arrayCity)
    window.localStorage.setItem("searchedCities", cityString);


    if (arrayCity.length === 0) {
        console.log("Please search a city to start.")
    } else {
        for (var i = 0; i < arrayCity.length; i++) {

            var prevBtn = document.createElement("button");
            prevBtn.classList.add("prev-city-btn")
            prevBtn.value = arrayCity;
            prevBtn.textContent = arrayCity[i];
            prevSearches.append(prevBtn);


        }
        prevBtn.addEventListener("click", function() {
            getCity(arrayCity)
        })
    }
}