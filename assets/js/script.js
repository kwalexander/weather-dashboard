// define variables
var apiKey = "0b16f3c77b968f39ae09c648a502a860";
var cityFormEl = document.querySelector("#city-form");
var cityInputEl = document.querySelector("#cityName");
var searchedCitiesEl = document.querySelector("#searched-cities");
var todayEl = document.querySelector("#today");
var forecastEl = document.querySelector("#forecast");
var cityName;
var searchCityName;
var lat = "";
var lon = "";
var geoCode = [];
var cityArray = [];

// listen for user's city search from the form
var submitForm = function (event) {
    event.preventDefault();
    var searchCityName = cityInputEl.value.trim();
    console.log(searchCityName);
    startSearch(searchCityName);
};

// function to convert searched city value to lat/long coordinates
var startSearch = function (searchCityName) {

    // get lat long geocode from open weather api
    var getCityCoordinate = "https://api.openweathermap.org/data/2.5/weather?q=" + searchCityName + "&appid=" + apiKey;

    console.log(getCityCoordinate);

    fetch(getCityCoordinate).then(function (response) {

        if (response.ok) {
            response.json().then(function (data) {
                convertCoordinates(searchCityName, data);
                //// store city in local storage array for history container
                cityArray.push(searchCityName);
                localStorage.setItem("searchedCities", JSON.stringify(cityArray));
                searchHistory(cityArray);
            });
        } else { alert("Can't find city, search again") }
    })
};

// display search history
var searchHistory = function (cityArray) {
    searchedCitiesEl.textContent = "";
    for (var i = 0; i < cityArray.length; i++) {
        let cityBtnEl = document.createElement('button')
        searchedCitiesEl.appendChild(cityBtnEl);
        cityBtnEl.textContent = cityArray[i];
        cityBtnEl.setAttribute("value", cityArray[i]);
    }
};

// convert to coordinates to feed into the weather request
var convertCoordinates = function (searchCityName, data) {
    lon = data.coord.lon;
    lat = data.coord.lat;

    geoCode.push(lat, lon);

    console.log(geoCode);

    requestWeather(cityName, geoCode);
};

// use the coordinates to get the weather 
var requestWeather = function (cityName, coordinates) {
    var currentWeatherURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;
    fetch(currentWeatherURL).then(function (response) {
        response.json().then(function (weatherData) {
            // link to display current and forecast here
            console.log(currentWeatherURL);
        });
    });

    var forecastWeatherURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;
    fetch(forecastWeatherURL).then(function (response) {
        response.json().then(function (weatherData) {
            // link to display current and forecast here
            console.log(forecastWeatherURL);
        });
    });
};

// display city current weather

// display city 5 day forecast

// event listeners
cityFormEl.addEventListener("submit", submitForm);