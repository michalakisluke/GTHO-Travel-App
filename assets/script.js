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
        localTempApiFetch();
        chooseClosest();
        chooseWarmest();

        // show spinner & hide user input upon click
        $("#spinner").removeAttr("hidden");
        $("#location").attr("hidden", true);
    }
});

//Fetch temp data for zip codes <This runs first>
function localTempApiFetch() {
    // Write a fetch request to the OpenWeather API for lat and lon and local temp
    fetch("https://api.openweathermap.org/data/2.5/weather?zip=" + zip + "&units=imperial&appid=" + apiKey)
        .then(function(response) {
            return response.json();
        }).then(function(response) {
            var localLat = response.coord.lat;
            var localLong = response.coord.lon;
            localStorage.setItem("localLat", JSON.stringify(localLat));
            localStorage.setItem("localLon", JSON.stringify(localLong));
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
                    var searchStr = "ahp"
                    let airportArrayNoHeli = airportArrayClear.filter(function(e) {
                        return !e.name.toLowerCase().includes(searchStr.toLowerCase());
                    });
                    var searchStr = "afb"
                    let airportArrayNoAFB = airportArrayNoHeli.filter(function(e) {
                        return !e.name.toLowerCase().includes(searchStr.toLowerCase());
                    });
                    var searchStr = "aaf"
                    let airportArrayNoAAF = airportArrayNoAFB.filter(function(e) {
                        return !e.name.toLowerCase().includes(searchStr.toLowerCase());
                    });
                    var searchStr = "base"
                    let airportArrayNoBase = airportArrayNoAAF.filter(function(e) {
                        return !e.name.toLowerCase().includes(searchStr.toLowerCase());
                    });
                    var searchStr = "executive"
                    let airportArrayNoExec = airportArrayNoBase.filter(function(e) {
                        return !e.name.toLowerCase().includes(searchStr.toLowerCase());
                    });
                    var searchStr = "private"
                    let airportArrayNoPriv = airportArrayNoExec.filter(function(e) {
                        return !e.name.toLowerCase().includes(searchStr.toLowerCase());
                    });
                    let airportArrayCheckLat = airportArrayNoPriv.filter(function(lat){
                        return lat.latitude < localLat;
                    });
                    console.log(airportArrayCheckLat);
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
                            localLat = JSON.parse(localStorage.getItem("localLat"));
                            localLon = JSON.parse(localStorage.getItem("localLon"));
                            dist = distance(latAtAirport, lonAtAirport, localLat, localLon);
                            var nestedArrayElem = {"latitude": latAtAirport, "longitude": lonAtAirport, "temp": airTemp, "distance": dist};
                            tempCheckArray.push(nestedArrayElem);
                            localStorage.setItem("array", JSON.stringify(tempCheckArray));
                        });
                    };
                });
        });
}

// find closest airport
function distance(latAtAirport, lonAtAirport, localLat, localLon) {
    if ((latAtAirport == localLat) && (lonAtAirport == localLon)) {
            return 0;
        }
    else {
            var radlat1 = Math.PI * latAtAirport/180;
            var radlat2 = Math.PI * localLat/180;
            var theta = lonAtAirport-localLon;
            var radtheta = Math.PI * theta/180;
            var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            if (dist > 1) {
            dist = 1;
            }
            dist = Math.acos(dist);
            dist = dist * 180/Math.PI;
            dist = dist * 60 * 1.1515;
            return dist;
    }
}

// Choose closest airport, save codes <this runs second>
function chooseClosest() {
    var airportsByDistance = JSON.parse(localStorage.getItem("array"));
    for (var i = 0; i < airportsByDistance.length; i++) {
        // Sort Distances
        airportsByDistance.sort(function(a,b) {
          let varA;
          let varB;
          varA = a["distance"];
          varB = b["distance"];
          if (varA < varB) {
            return 1;
          }
          else if (varB < varA) {
            return -1;
          }
          return 0;
        });
    }
    airportsByDistanceClosest = airportsByDistance.reverse();
    console.log(airportsByDistanceClosest);
    closestAirportLat = airportsByDistanceClosest[0]["latitude"];
    closestAirportLon = airportsByDistanceClosest[0]["longitude"];
    localStorage.setItem("closestLatLon", JSON.stringify([closestAirportLat, closestAirportLon]));
}

// Choose warmest airport, save codes <this runs third>
function chooseWarmest() {
    var airportsByTemp = JSON.parse(localStorage.getItem("array"));
    for (var i = 0; i < airportsByTemp.length; i++) {
        // Sort Distances
        airportsByTemp.sort(function(a,b) {
          let varA;
          let varB;
          varA = a["temp"];
          varB = b["temp"];
          if (varA < varB) {
            return 1;
          }
          else if (varB < varA) {
            return -1;
          }
          return 0;
        });
    }
    warmestAirportLat = airportsByTemp[0]["latitude"];
    warmestAirportLon = airportsByTemp[0]["longitude"];
    localStorage.setItem("warmLatLon", JSON.stringify([warmestAirportLat, warmestAirportLon]));
}


// Flight finder & publish results on page
function findTrip() {
    let closestAirportIATA;
    let warmestAirportIATA;

    //to do
    // pull from local storage: warmest lat and closest lat
    // use for loop to run through saved location array, match lat and lon for closest and hottest (Two seperate for loops)
    // get airport IATA codes from array
}