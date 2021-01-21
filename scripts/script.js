$(document).ready(function () {
  var cityArray = [];
  var lon = "";
  var lat = "";
  var apiKey = "39edc21fee70b725a0dbcb6dbed85366";

  loadStoredCities();

  $("#add-city").on("click", function (event) {
    event.preventDefault();

    var city = $("#city-input").val().trim();

    cityArray.push(city);
    storeCityArray();
    retrieveCityArray();
  });

  function storeCityArray() {
    localStorage.setItem("cities", JSON.stringify(cityArray));
  }

  function retrieveCityArray() {
    var retrievedData = localStorage.getItem("cities");
    if (retrievedData !== null) {
      cityArray = JSON.parse(retrievedData);

      renderCityButtons();
    }
  }

  function loadStoredCities() {
    retrieveCityArray();
  }

  function renderCityButtons() {
    $("#city-buttons-div").empty();
    for (var i = 0; i < cityArray.length; i++) {
      var newButton = $("<button>");

      newButton.addClass("btn btn-outline-secondary city-button");
      newButton.attr("city-name", cityArray[i]);
      newButton.text(cityArray[i]);

      $("#city-buttons-div").append(newButton);
    }
  }

  $(document).on("click", ".city-button", getLonLat);

  function getLonLat() {
    var city = $(this).attr("city-name");
    var queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "&appid=" +
      apiKey;
    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      lon = response.coord.lon;
      lat = response.coord.lat;
      getWeatherInfo(city);
    });
  }

  function getWeatherInfo(city) {
    var queryURL =
      "https://api.openweathermap.org/data/2.5/onecall?lat=" +
      lat +
      "&lon=" +
      lon +
      "&exclude={part}&appid=" +
      apiKey;
    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      renderPage(response, city);
    });
  }

  function renderPage(response, city) {
    renderCurrentDayTitle(response, city);
    renderCurrentDayBody(response);
    renderUVISpan(response);
    renderForecast(response);
    $("#weather-info-body").css("display", "block");
  }

  function getDate(response) {
    var unixTimestamp = response.dt;
    var date = new Date(unixTimestamp * 1000);
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    var ddmmyyyy = day + "/" + month + "/" + year;
    return ddmmyyyy;
  }

  function getWeatherIcon(response) {
    var iconCode = response.current.weather[0].icon;
    var iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png";
    return iconURL;
  }

  function getTempCelsius(response) {
    var tempKelvin = response.current.temp;
    var tempCelsius = Math.round((tempKelvin - 273.15) * 10) / 10;
    return tempCelsius;
  }

  function getWindSpeedMPH(response) {
    var speedMPerS = response.current.wind_speed;
    var speedMPH = Math.round(speedMPerS * 2.237 * 10) / 10;
    return speedMPH;
  }

  function renderCurrentDayTitle(response, city) {
    var date = "(" + getDate(response.daily[0]) + ")";
    var weatherIconURL = getWeatherIcon(response);

    var titleElement = $("#city-date-icon");
    titleElement.text(city + " " + date + " ");

    var iconElement = $("<img></img>");
    iconElement.attr("src", weatherIconURL);
    titleElement.append(iconElement);
  }

  function renderCurrentDayBody(response) {
    var temp = getTempCelsius(response);
    var humidity = response.current.humidity;
    var windSpeed = getWindSpeedMPH(response);

    $("#current-temp").text("Temperature: " + temp + "°C");
    $("#current-humidity").text("Humidity: " + humidity + "%");
    $("#current-wind-speed").text("Wind Speed: " + windSpeed + " mph");
  }

  function renderUVISpan(response) {
    var uvi = response.current.uvi;
    var uviSpan = $("<span></span>");
    uviSpan.attr("id", "uviValue");
    uviSpan.text(uvi);

    if (uvi <= 2) {
      uviSpan.css({ "background-color": "#5cb85c", "border-color": "#4cae4c" });
    } else if (uvi > 2 && uvi <= 5) {
      uviSpan.css({ "background-color": "#f0ad4e", "border-color": "#eea236" });
    } else {
      uviSpan.css({ "background-color": "#d9534f", "border-color": "#d43f3a" });
    }

    var uviElement = $("#current-uvi");
    uviElement.text("UV Index: ");
    uviElement.append(uviSpan);
  }

  function renderForecast(response) {
    for (var i = 1; i <= 5; i++) {
      getForecastDate(response, i);
      getForecastIcon(response, i);
      getForecastData(response, i);
    }
  }

  function getForecastDate(response, i) {
    var date = getDate(response.daily[i]);
    var id = "#forecast-date-" + i;
    $(id).text(date);
  }

  function getForecastIcon(response, i) {
    var icon = response.daily[i].weather[0].icon;
    var iconURL = "http://openweathermap.org/img/w/" + icon + ".png";
    var id = "#forecast-icon-" + i;
    $(id).attr("src", iconURL);
  }

  function getForecastData(response, i) {
    var temp = response.daily[i].temp.day - 273.15;
    var humidity = response.daily[i].humidity;
    tempID = "#forecast-temp-" + i;
    humidityID = "#forecast-humidity-" + i;
    $(tempID).text("Temp: " + temp + "°C");
    $(humidityID).text("Humidity: " + humidity + "%");
  }
});
