apiKey = "12524a4796d1cd5b9b5d525171960baf";
let airportArrayClear = [];
let tempCheckArray = [];

// Search button click
$(".uk-button-secondary").on("click", function(event) {
    event.preventDefault();
    zip = $("#user-zip").val().trim();
    if (zip === '') {
        console.log("You woulda thought");
        return;
    } else {
        console.log(zip);
        localTempApiFetch();

        // show spinner & hide user input upon click
        $("#spinner").removeAttr("hidden");
        $("#location").attr("hidden", true);
    }
});

//Fetch temp data for zip codes
function localTempApiFetch() {
    // Write a fetch request to the Giphy API
    fetch("https://api.openweathermap.org/data/2.5/weather?zip=" + zip + "&units=imperial&appid=" + apiKey)
        .then(function(response) {
            return response.json();
        }).then(function(response) {
            var localTemp = response.main.temp;
            var localLat = response.coord.lat;
            var localLong = response.coord.lon;
            console.log("The local temp is " + localTemp + " degrees Farenheit");
            console.log("The local latitude is " + localLat);
            console.log("The local longitude is " + localLong);
            // Find airports within a given radius, pull lat and lon coordinates
            fetch("https://aviation-reference-data.p.rapidapi.com/airports/search?lat=" + localLat + "&lon=" + localLong + "&radius=500", {
                    "method": "GET",
                    "headers": {
                        "x-rapidapi-host": "aviation-reference-data.p.rapidapi.com",
                        "x-rapidapi-key": "862a716dc7msh647274362d7a08cp12fe37jsn54b5d3acd3b7"
                    }
                })
                .then(function(response) {
                    return response.json();
                }).then(function(response) {
                    airportArray = response;
                    let airportArrayClear = airportArray.filter(function(e) {
                        return e.icaoCode != null;
                    });
                    let airportArrayCheckLat = airportArrayClear.filter(function(lat){
                        return lat.latitude < localLat;
                    });
                    // Find temp at each airport
                    for (j = 0; j < airportArrayCheckLat.length; j++) {
                        var tempLatCheck = airportArrayCheckLat[j].latitude;
                        var tempLonCheck = airportArrayCheckLat[j].longitude;
                        fetch("https://api.openweathermap.org/data/2.5/weather?lat="+ tempLatCheck + "&lon=" + tempLonCheck + "&units=imperial&appid=" + apiKey)
                        .then(function(response){
                            return response.json();
                        }).then(function(response){
                            var airTemp = response.main.temp;
                            var latAtAirport = response.coord.lat;
                            var lonAtAirport = response.coord.lon;
                            var nestedArrayElem = {"latitude": latAtAirport, "longitude": lonAtAirport, "temp": airTemp};
                            //console.log(nestedArrayElem);
                            tempCheckArray.push(nestedArrayElem);
                        });
                    };
                    console.log(tempCheckArray);
                });
        });
}

// function to pop results