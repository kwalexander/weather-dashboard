// define variables
var apiKey = "0b16f3c77b968f39ae09c648a502a860";
var cityFormEl = document.querySelector("#city-form");
var cityInputEl = document.querySelector("#cityName");
var searchedCities = document.querySelector("#searched-cities");
var cityBtnEl = document.querySelector("#city-btn");
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
    startSearch(searchCityName);
};

// function to convert searched city value to lat/long coordinates
var startSearch = function (searchCityName) {

    // get lat long geocode from open weather api
    var getCityCoordinate = "https://api.openweathermap.org/data/2.5/weather?q=" + searchCityName + "&appid=" + apiKey;

    // console.log(getCityCoordinate);

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
    searchedCities.textContent = "";
    for (var i = 0; i < cityArray.length; i++) {
        let cityBtnEl = document.createElement('button')
        searchedCities.appendChild(cityBtnEl);
        cityBtnEl.textContent = cityArray[i];
        cityBtnEl.setAttribute("value", cityArray[i]);
        cityBtnEl.setAttribute('id', 'city-btn')
    }
};

// convert to coordinates to feed into the weather request
var convertCoordinates = function (cityName, data) {
    lon = data.coord.lon;
    lat = data.coord.lat;

    geoCode.push(lat, lon);

    // console.log(geoCode);

    requestWeather(cityName, geoCode);
};

// use the coordinates to get the weather 
var requestWeather = function (cityName, coordinates) {
    var currentWeatherURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&units=imperial";
    fetch(currentWeatherURL).then(function (response) {
        response.json().then(function (weatherData) {
            // link to display current and forecast here
            // console.log(currentWeatherURL);
            displayCurrentWeather(cityName, weatherData);
        });
    });

    var forecastWeatherURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&units=imperial";
    fetch(forecastWeatherURL).then(function (response) {
        response.json().then(function (weatherData) {
            // link to display current and forecast here
            // console.log(forecastWeatherURL);
        });
    });
};

// display city current weather
var displayCurrentWeather = function (cityName, weatherData) {
    todayEl.textContent = "";

    // make necessary elements within the current weather div
    var cityNameContainer = document.createElement("div");
    var currentCityName = document.createElement("span");

    console.log(weatherData);

    currentCityName.textContent = cityName + " ";
    cityNameContainer.appendChild(currentCityName);
    todayEl.appendChild(cityNameContainer);
    var currentDate = document.createElement("span");
    //from stackoverflow
    var currentDate = new Date();
    var dd = String(currentDate.getDate()).padStart(2, '0');
    var mm = String(currentDate.getMonth() + 1).padStart(2, '0');
    var yyyy = currentDate.getFullYear();
    currentDate = mm + '/' + dd + '/' + yyyy;
    cityNameContainer.textContent = cityName + " (" + currentDate + ")";

    var todayWeatherIcon = document.createElement("img");
    var todayIconCode = weatherData.weather[0].icon;
    var todayIconURL = "http://openweathermap.org/img/wn/" + todayIconCode + "@2x.png";
    todayWeatherIcon.setAttribute('src', todayIconURL);
    cityNameContainer.appendChild(todayWeatherIcon);

    var temp = "Temp: " + weatherData.main.temp + "°F";
    var tempEl = document.createElement("div");
    var tempTitleEl = document.createElement("span");
    tempTitleEl.textContent = temp;
    tempEl.appendChild(tempTitleEl);
    cityNameContainer.appendChild(tempEl);

    var wind = "Wind: " + weatherData.wind.speed + " MPH";
    var windEl = document.createElement("div");
    var windTitleEl = document.createElement("span");
    windTitleEl.textContent = wind;
    windEl.appendChild(windTitleEl);
    cityNameContainer.appendChild(windEl);

    var humidity = "Humidity: " + weatherData.main.humidity + "%";
    var humidEl = document.createElement("div");
    var humidTitleEl = document.createElement("span");
    humidTitleEl.textContent = humidity;
    humidEl.appendChild(humidTitleEl);
    cityNameContainer.appendChild(humidEl);
}

// display city 5 day forecast

// event listeners
cityFormEl.addEventListener("submit", submitForm);

// listen for a btn click anywhere in the history container and then rerun the functions
searchedCities.addEventListener("click", (e) => {
    e.preventDefault();

    todayEl.textContent = "";
    forecastEl.textContent = "";
    var clickedCity = this.event.target.value;
    startSearch(clickedCity);
    requestWeather(clickedCity);
})