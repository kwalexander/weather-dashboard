// DEFINE VARIABLES
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

// FUNCTIONS
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
        cityBtnEl.className = "search-button";
        cityBtnEl.setAttribute("value", cityArray[i]);
        cityBtnEl.setAttribute('id', 'city-btn')
    }
};

// convert to coordinates to feed into the weather request
var convertCoordinates = function (cityName, data) {
    lon = data.coord.lon;
    lat = data.coord.lat;

    geoCode.push(lat, lon);

    requestWeather(cityName, geoCode);
};

// use the coordinates to get the current and forecast weather as needed
var requestWeather = function (cityName, coordinates) {
    var currentWeatherURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&units=imperial";
    fetch(currentWeatherURL).then(function (response) {
        response.json().then(function (weatherData) {
            displayCurrentWeather(cityName, weatherData);
        });
    });
};

var requestForecastWeather = function (cityName, coordinates) {
    var forecastWeatherURL = "https://api.openweathermap.org/data/3.0/onecall?lat=" + lat + "&lon=" + lon + "&exclude=hourly" + "&appid=" + apiKey + "&units=imperial";
    fetch(forecastWeatherURL).then(function (response) {
        response.json().then(function (forecastData) {
            displayForecastWeather(cityName, forecastData);
        });
    });
};


// display city current weather
var displayCurrentWeather = function (cityName, weatherData) {
    todayEl.textContent = "";

    // make necessary elements within the current weather div
    var cityNameContainer = document.createElement("div");
    var currentCityName = document.createElement("h3");

    // console.log(weatherData);

    currentCityName.textContent = cityName + " ";
    cityNameContainer.appendChild(currentCityName);
    cityNameContainer.className = "city-name-container";
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

    requestForecastWeather();
};

// display the 5 day forecast weather
var displayForecastWeather = function (cityName, forecastData) {
    var forecastArray = forecastData.daily;

    var forecastTitle = document.createElement("h3");
    forecastTitle.textContent = "5 day forecast";
    forecastTitle.className = "today-h3";
    forecastEl.appendChild(forecastTitle);

    // console.log(forecastData.daily);

    // loop to split forecast data array out into daily cards
    for (var i = 1; i < 6; i++) {
        var forecastCard = document.createElement("div");
        var forecastCard = document.createElement("h4");
        forecastEl.appendChild(forecastCard);
        forecastCard.className = "card text-white col-12 col-md-6 col-lg-2 bg-dark mb-3";

        // note refactor this to use current date forecast
        var forecastDate = document.createElement("span");
        forecastDate.className = "card-title"
        var forecastDate = new Date();
        var dd = String(forecastDate.getDate() + i).padStart(2, '0');
        var mm = String(forecastDate.getMonth() + 1).padStart(2, '0');
        var yyyy = forecastDate.getFullYear();
        forecastDate = mm + '/' + dd + '/' + yyyy;
        forecastCard.textContent = forecastDate;

        // console.log(forecastData);

        var forecastWeatherIcon = document.createElement("img");
        var forecastIconCode = forecastData.daily[i].weather[0].icon;
        var forecastIconURL = "http://openweathermap.org/img/wn/" + forecastIconCode + "@2x.png";
        forecastWeatherIcon.className = "mr-3";
        forecastWeatherIcon.setAttribute('src', forecastIconURL);
        forecastCard.appendChild(forecastWeatherIcon);

        var forecastTempEl = document.createElement("div");
        forecastTempEl.textContent = "Temp: " + forecastArray[i].temp.day + "°F";
        forecastTempEl.className = "card-text"
        forecastCard.appendChild(forecastTempEl);

        var forecastWindEl = document.createElement("div");
        forecastWindEl.textContent = "Wind: " + forecastArray[i].wind_speed + "MPH";
        forecastWindEl.className = "card-text"
        forecastCard.appendChild(forecastWindEl);

        var forecastHumidEl = document.createElement("div");
        forecastHumidEl.textContent = "Humidity: " + forecastArray[i].humidity + "%";
        forecastHumidEl.className = "card-text"
        forecastCard.appendChild(forecastHumidEl);
    }
};

// EVENT LISTENERS
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