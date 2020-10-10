const API_KEY = "a67e2faf254fdecaeeaee4a0d9d7e157"
let activeCityName = "";
let cities = [];

//converts temperature in Kelvin to Fahrenheit
function convTemp(K) {
    return (((K - 273.15) * 9) / 5 + 32).toFixed(0);
}

//converts m/s to mph
function convSpeed(s) {
    return (s * 2.2369362920544).toFixed(1);
}

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
        // update5DayData(city);
        updateCityDayData(city);
}

function update5DayData(city) {
    //TODO
}

function updateCityDayData(city) {
    console.log("Made it here")
    $.ajax({
        url: `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`,
        method: "GET"
    }).then(
        function(res) {
            // console.log(res);
            updateDayWeatherUI(res);
            updateUVIndex(res.coord.lat, res.coord.lon);
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
    $("div.jumbotron > h1.display-4").html(res.name);
    $("div.jumbotron > p.jumboT").html(`Temperature: ${convTemp(res.main.temp)}${'&#8457'}`);
    $("div.jumbotron > p.jumboH").html(`Humidity: ${res.main.humidity.toFixed(0)}%`);
    $("div.jumbotron > p.jumboW").html(`Wind Speed: ${convSpeed(parseFloat(res.wind.speed))} MPH`);
    //update5Day()l

}

//Plucked from stack overflow
String.prototype.toTitleCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

initialize();