// define variables
var apiKey = "0b16f3c77b968f39ae09c648a502a860";
var cityFormEl = document.querySelector("#city-form");
var cityInputEl = document.querySelector("#cityName");
var searchedCitiesEl = document.querySelector("#searched-cities");
var todayEl = document.querySelector("#today");
var forecastEl = document.querySelector("#forecast");

// listen for user city search
var submitForm = function (event) {
    event.preventDefault();
    var searchCityName = cityInputEl.value.trim();
    console.log(cityInputEl.value);
};

// convert search to lat/long coordinates

// query weather API with searched city

// display city current weather

// display city 5 day forecast

// save searched city to local storage and populate recent searches

// event listeners
cityFormEl.addEventListener("submit", submitForm);