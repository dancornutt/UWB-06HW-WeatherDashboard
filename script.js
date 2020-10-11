//TODOs:
    //Error handle cities not found
    //Hit API with imperial units

const API_KEY = "a67e2faf254fdecaeeaee4a0d9d7e157"
let activeCityName = "";
let cities = [];

// //converts temperature in Kelvin to Fahrenheit
// function convTemp(K) {
//     return (((K - 273.15) * 9) / 5 + 32).toFixed(0);
// }

// //converts m/s to mph
// function convSpeed(s) {
//     return (s * 2.2369362920544).toFixed(1);
// }

//initialize cities from local storage
function initialize() {
    let savedCities = JSON.parse(localStorage.getItem("WeatherAppCities"));
    if (savedCities && savedCities.length > 0) {
        cities = [...savedCities];
        cities.forEach(element => {
            let city = $("<button>")
                .attr("class", "list-group-item list-group-item-action")
                .attr("type", "button")
                .attr("data", element)
                .text(element.toTitleCase())
            $(".list-group").append(city);
        });
    } else {
        localStorage.setItem("WeatherAppCities", JSON.stringify([]));
    }
}

//event handler on search button query on click:
$(".searchCityBtn").on("click", function(event) {
    event.preventDefault();
    let wantedCity = $(".searchCityTxt").val();
    if (wantedCity) {
        wantedCity = wantedCity.trim().toLowerCase();
        console.log("cities", cities)
        if (!cities || !cities.includes(wantedCity)) {
            cities.push(wantedCity);
            localStorage.setItem("WeatherAppCities", JSON.stringify(cities));
        };
        getcity(wantedCity);
    }
})
            
//event handler on list group on click
$(".list-group").on("click", function(event) {
    event.preventDefault();
    let requestedCity = $(event.target).attr("data");
    getcity(requestedCity);
})

function getcity(city) {
    //request city data from open weather endpoints
    console.log("Getting data for: ", city);
    //TODO check if openWeather has city data
        // update5Day(city);
        updateCityDayData(city);
}

function update5Day(lat, lon) {
    $.ajax({
        url: `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&units=imperial&appid=${API_KEY}`,
        method: "GET"
    }).then(
        function(res) {
            let days = res.daily.slice(0,5);
            $.each(days, function(index, value) {
                // updateUI Day
                $(`#day${index} > div.card-body > h5.card-title`)
                    .html(`${moment().add(1 + index, 'days').format("dddd")}`);
                $(`#day${index} > div.card-body > p.temp`)
                    .html(`Temperature: ${value.temp.day.toFixed(1)}&#8457`);
                $(`#day${index} > div.card-body > p.humidity`)
                    .html(`Humidity: ${value.humidity}%`);                
            });
            console.log("7 day weather is: ", days);
        }
    )
}

function updateCityDayData(city) {
    $.ajax({
        url: `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${API_KEY}`,
        method: "GET"
    }).then(
        function(res) {
            updateDayWeatherUI(res);
            updateUVIndex(res.coord.lat, res.coord.lon);
            update5Day(res.coord.lat, res.coord.lon);
        }
    )
}

function updateUVIndex(lat, lon) {
    $.ajax({
        url: `http://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${API_KEY}`,
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

function updateDayWeatherUI(res) {
    $("div.jumbotron > div.row > h1.display-4").html(res.name);
    $('#wicon').attr('src', `http://openweathermap.org/img/w/${res.weather[0].icon}.png`);
    $("div.jumbotron > p.jumboT").html(`Temperature: ${res.main.temp.toFixed(1)}&#8457`);
    $("div.jumbotron > p.jumboH").html(`Humidity: ${res.main.humidity.toFixed(0)}%`);
    $("div.jumbotron > p.jumboW").html(`Wind Speed: ${res.wind.speed.toFixed(0)} MPH`);
}

//Plucked from stack overflow
String.prototype.toTitleCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

initialize();