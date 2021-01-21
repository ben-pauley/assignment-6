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
    });
  }

  function displayWeatherInfo() {}
});
