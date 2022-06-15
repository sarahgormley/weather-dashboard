var apiKey = "74b589766e2c1c1f69016c5e5740ff80";
var searchBtn = document.getElementById("search-btn");
var cityName = document.getElementById("search-text");
var searchCityName = document.getElementById("search-city-name");
var prevSearches = document.getElementById("prev-searches")
var temperature = document.getElementById("temperature");
var wind = document.getElementById("wind");
var humidity = document.getElementById("humidity");
var currentUVIndex = document.getElementById("uvIndex");
var weatherIcon = document.getElementById("weather-icon");
var currentDay = document.getElementById("current-day");
var dayCard = document.getElementsByClassName("day-card");
var fiveDate = document.getElementById("date");
var futureDate = document.getElementById("futureDate");
var futureTemperature = document.getElementById("futureTemperature");
var futureWind = document.getElementById("futureWind");
var futureHumidity = document.getElementById("futureHumidity");


var currentDate = moment().format("MMM Do, YYYY");

function pageinit() {
    getPrevCities()
}
searchBtn.addEventListener('click', function() {
    getCity(cityName.value)

})

// function to get the selected city from the search bar

function getCity(city) {
    var searchedCity = city;
    let requestURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchedCity + "&units=metric&appid=" + apiKey;
    fetch(requestURL)
        .then(function(response) {
            response.json().then(function(data) {
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




    getFiveDayCity(latitude, longitude);
    getUVIndex(latitude, longitude);
}

function getFiveDayCity(latitude, longitude) {
    let apiURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&exclude=current,minutely,hourly,alerts&units=metric&appid=" + apiKey
    fetch(apiURL)
        .then(function(response) {
            response.json().then(function(data) {
                getFiveDayForecast(data);

            })
        });

}

function getFiveDayForecast(data) {
    console.log(data)

    var futureForecast = document.getElementById("future-forecast");

    for (let i = 1; i < 6; i++) {

        var date = moment().add(+i, 'days').format('DD-MM-YY');
        console.log(date)
        var dailyWeather = document.createElement("div");
        dailyWeather.classList.add("day-card");
        futureForecast.append(dailyWeather);

        var dayWeather = document.createElement("h3");
        dayWeather.setAttribute("id", "futureDate");
        dailyWeather.append(dayWeather)
        dayWeather.innerHTML = date;

        var dayWeatherIcon = document.createElement("img");
        dayWeatherIcon.setAttribute("src", "https://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + "@2x.png");
        dailyWeather.append(dayWeatherIcon);

        var dayTemp = document.createElement("p");
        dayTemp.setAttribute("id", "futureTemperature");
        dailyWeather.append(dayTemp);
        dayTemp.innerHTML = "Temp:  " + avgTemp + "°C";

        var dayWind = document.createElement("p");
        dayWind.setAttribute("id", "futureWind");
        dailyWeather.append(dayWind);
        dayWind.innerHTML = "Wind:  " + avgWind + "km/h";

        var dayHumid = document.createElement("p");
        dayHumid.setAttribute("id", "futureHumidity");
        dailyWeather.append(dayHumid);
        dayHumid.innerHTML = "Humidity: " + avgHumidity + "%";


        var avgTemp = data.daily[i].temp.day;
        var avgWind = data.daily[i].wind_speed;
        var avgHumidity = data.daily[i].humidity;
    }
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
        prevSearches.innerHTML = ""
    } else {
        for (var i = 0; i < arrayCity.length; i++) {

            var prevBtn = document.createElement("button");
            prevBtn.classList.add("prev-city-btn")
            prevBtn.value = arrayCity;
            prevBtn.textContent = arrayCity[i];
            prevSearches.append(prevBtn);
            prevBtn.addEventListener("click", function(event) {
                getCity(event.target.textContent)
            })

        }

    }
};