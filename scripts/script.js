var cityArray = [];

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

    newButton.addClass("btn btn-outline-secondary");
    newButton.attr("city-name", cityArray[i]);
    newButton.text(cityArray[i]);

    $("#city-buttons-div").append(newButton);
  }
}
