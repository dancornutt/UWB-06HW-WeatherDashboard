const API_KEY = "a67e2faf254fdecaeeaee4a0d9d7e157"
let cities = [];

//Initialize cities from local storage
function initialize() {
    let savedCities = JSON.parse(localStorage.getItem("WeatherAppCities"));
    if (savedCities && savedCities.length > 0) {
        cities = [...savedCities];
        updateCityButtons();
        updateCity(cities[cities.length -1]);
    } else {
        localStorage.setItem("WeatherAppCities", JSON.stringify([]));
    }
}

//Event handler on search button query on click:
$(".searchCityBtn").on("click", function(event) {
    event.preventDefault();
    let wantedCity = $(".searchCityTxt").val();
    if (wantedCity) {
        wantedCity = wantedCity.trim().toLowerCase();
        updateCity(wantedCity);
    }
})
            
//Event handler on list group on click
$(".list-group").on("click", function(event) {
    event.preventDefault();
    let requestedCity = $(event.target).attr("data");
    updateCity(requestedCity);
})

//Updates UI buttons for saved cities to values in local storage
function updateCityButtons () {
    $(".list-group").empty();
    cities.forEach(element => {
        let city = $("<button>")
            .attr("class", "list-group-item list-group-item-action")
            .attr("type", "button")
            .attr("data", element)
            .text(element.toTitleCase())
        $(".list-group").append(city);
    });
}

function update5Day(lat, lon) {
    $.ajax({
        url: `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&units=imperial&appid=${API_KEY}`,
        method: "GET"
    }).then(
        function(res) {
            let days = res.daily.slice(0,5);
            $.each(days, function(index, value) {
                $(`#day${index} > div.card-body > h5.card-title`)
                    .html(`${moment().add(1 + index, 'days').format("dddd")}`);
                $(`#day${index} > div.card-body > p.temp`)
                    .html(`Temp: ${value.temp.day.toFixed(1)}&#8457`);
                $(`#day${index} > div.card-body > p.humidity`)
                    .html(`Humidity: ${value.humidity}%`);                
            });
        }
    )
}

//Main function for updating weather from API, calls lower functions if city weather request response is valid.
function updateCity(city) {
    $.ajax({
        url: `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${API_KEY}`,
        method: "GET"
    }).then(function(res) {
        //Success
        if (!cities.includes(city)) {
            cities.push(city);
            localStorage.setItem("WeatherAppCities", JSON.stringify(cities));
        };
        updateDayWeatherUI(res);
        updateUVIndex(res.coord.lat, res.coord.lon);
        update5Day(res.coord.lat, res.coord.lon);
        updateCityButtons();
    }).fail(function() {
        //City not found
        alert(`City: ${city} not found!`);
        return
    })
}

function updateUVIndex(lat, lon) {
    $.ajax({
        url: `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${API_KEY}`,
        method: "GET"
    }).then(
        function(res) {
            let btnClass = "";
            if (parseFloat(res.value) <= 2) {
                btnClass = "btn-success";
            } else if (parseFloat(res.value) <= 5) {
                btnClass = "btn-warning";
            } else {
                btnClass = "btn-danger";
            }
            $(".uvButton")
                    .html(res.value)
                    .removeClass("btn-success btn-warning btn-danger")
                    .addClass(btnClass)
        }
    )
}

//Updates main display for selected city or last selected city
function updateDayWeatherUI(res) {
    $("div.jumbotron > div.row > h1.display-4").html(`${res.name}`);
    $("div.jumbotron > h4.display-6").html(`${moment().format('dddd (MM/DD/YY)')}`);
    $('#wicon').attr('src', `https://openweathermap.org/img/w/${res.weather[0].icon}.png`);
    $("div.jumbotron > p.jumboT").html(`Temperature: ${res.main.temp.toFixed(1)}&#8457`);
    $("div.jumbotron > p.jumboH").html(`Humidity: ${res.main.humidity.toFixed(0)}%`);
    $("div.jumbotron > p.jumboW").html(`Wind Speed: ${res.wind.speed.toFixed(0)} MPH`);
}

//Plucked from stack overflow. Adds method for String Class for title case.
String.prototype.toTitleCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

initialize();