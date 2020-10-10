const API_KEY = "a67e2faf254fdecaeeaee4a0d9d7e157"
let activeCityName = "";
let cities = [];

//initialize cities from local storage
function initialize() {
    console.log("Inside Initialize");
    let savedCities = JSON.parse(localStorage.getItem("WeatherAppCities"));
    console.log("Saved cities: ", cities);
    if (savedCities && savedCities.length > 0) {
        console.log(savedCities + "truthy")
        cities = [...savedCities];
        cities.forEach(element => {
            let city = $("<button>")
                .attr("class", "list-group-item list-group-item-action")
                .attr("type", "button")
                .text(element.toTitleCase())
            $(".list-group").append(city);
        });
    } else {
        localStorage.setItem("WeatherAppCities", JSON.stringify([]));
    }
    // if (this.cities.length > 0) {
    //     this.cities.forEach(element => {
    //         let city = $("<button>")
    //             .attr("class", "list-group-item list-group-item-action")
    //             .attr("type", "button")
    //             .text(element.toTitleCase())
    //         $(".list-group").append(city);
    //     });
    // } 
    console.log("Exiting Initialize, cities: ", cities);
}

//Event handler on search query On click:
    //Clean data, convert to lowercase, see if city is in list already if not:
        // getcity(city)
            //if response is successful
                //Update other data
            //else alter user city not found, exit
$(".searchCityBtn").on("click", function(event) {
    event.preventDefault();
    let wantedCity = $(".searchCityTxt").val();
    if (wantedCity) {
        wantedCity = wantedCity.trim().toLowerCase();
        console.log("cities", cities)
        if (!cities || !cities.includes(wantedCity)) {
            cities.push(wantedCity);
            localStorage.setItem("WeatherAppCities", JSON.stringify(cities))
        };
        getcity(wantedCity);
    }
})
            
//Event handler on list group on click:
    //get event.target.data. updateUI()

function getcity(city) {
    //request city data from open weather endpoints
    console.log("Getting data for: ", city);
        update5DayData(city);
        updateCityDayData(city);
        updateUVIndexData(city);

        //on response add city to list-group
        //update UI()
        //saveTLocalStorage()
}

function update5DayData(city) {

}

function updateCityDayData(city) {
    console.log("Made it here")
    $.ajax({
        url: `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`,
        method: "GET"
    }).then(
        function(res) {
            console.log(res);
        }
    )
}

function updateUVIndexData(city) {

}

//Plucked from stack overflow
String.prototype.toTitleCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

initialize();