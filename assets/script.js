var apiKey = "12524a4796d1cd5b9b5d525171960baf";
let airportArrayClear = [];
let tempCheckArray = [];
let localLat;
let localLong;
let warmLatLon;
let closeLatLon;
let airportArrayIATA;
var flightDate = moment().add(1, "days").format("YYYY-MM-DD");
var returnDate = moment().add(4, "days").format("YYYY-MM-DD");
var bigAirports = [{"IATA Code": "ATL", "city": "Atlanta"}, {"IATA Code": "DFW", "city": "Dallas"}, {"IATA Code": "DEN", "city": "Denver"}, {"IATA Code": "ORD", "city": "Chicago"},
                     {"IATA Code": "LAX", "city": "Los Angeles"}, {"IATA Code": "CLT", "city": "Charlotte"}, {"IATA Code": "LAS", "city": "Las Vegas"},
                     {"IATA Code": "PHX", "city": "Phoenix"}, {"IATA Code": "MCO", "city": "Orlando"}, {"IATA Code": "SEA", "city": "Seattle"}, {"IATA Code": "MIA", "city": "Miami"},{"IATA Code": "IAH", "city": "Houston"},
                     {"IATA Code": "JFK", "city": "New York City"}, {"IATA Code": "FLL", "city": "Fort Lauderdale"}, {"IATA Code": "SFO", "city": "San Francisco"},
                     {"IATA Code": "EWR", "city": "Newark"}, {"IATA Code": "MSP", "city": "Minneapolis"}, {"IATA Code": "DTW", "city": "Detroit"}, {"IATA Code": "BOS", "city": "Boston"},
                     {"IATA Code": "PHL", "city": "Philadelphia"}, {"IATA Code": "STL", "city": "St. Louis"}, {"IATA Code": "BWI", "city": "Baltimore"}, {"IATA Code": "TPA", "city": "Tampa"},
                     {"IATA Code": "SAN", "city": "San Diego"}, {"IATA Code": "SLC", "city": "Salt Lake City"}, {"IATA Code": "IAD", "city": "Washington, D.C."}, {"IATA Code": "BNA", "city": "Nashville"},
                     {"IATA Code": "LGA", "city": "New York City"}, {"IATA Code": "DAL", "city": "Dallas"}, {"IATA Code": "DCA", "city": "Washington, D.C."}, {"IATA Code": "PDX", "city": "Portland"},
                     {"IATA Code": "HNL", "city": "Honolulu"}, {"IATA Code": "HOU", "city": "Houston"}, {"IATA Code": "AUS", "city": "Austin"}, {"IATA Code": "MDW", "city": "Chicago"},
                     {"IATA Code": "RSW", "city": "Fort Myers"}, {"IATA Code": "SMF", "city": "Sacramento"}, {"IATA Code": "MSY", "city": "New Orleans"}, {"IATA Code": "RDU", "city": "Raleigh"},
                     {"IATA Code": "SJU", "city": "San Juan"}, {"IATA Code": "SJC", "city": "San Jose"}, {"IATA Code": "OAK", "city": "Oakland"}, {"IATA Code": "MCI", "city": "Kansas City"}, 
                     {"IATA Code": "CLE", "city": "Cleveland"}, {"IATA Code": "IND", "city": "Indianapolis"}, {"IATA Code": "SAT", "city": "San Antonio"}, {"IATA Code": "SNA", "city": "Orange County"},
                     {"IATA Code": "PIT", "city": "Pittsburgh"}, {"IATA Code": "CVG", "city": "Cincinatti"}, {"IATA Code": "CMH", "city": "Columbus"}, {"IATA Code": "PBI", "city": "Palm Beach"}, 
                     {"IATA Code": "JAX", "city": "Jackonsville"}, {"IATA Code": "MKE", "city": "Milwaukee"}, {"IATA Code": "ONT", "city": "Ontario"}, {"IATA Code": "BDL", "city": "Hartford"},
                     {"IATA Code": "OGC", "city": "Kahului"}, {"IATA Code": "ANC", "city": "Anchorage"}, {"IATA Code": "OMA", "city": "Omaha"}, {"IATA Code": "MEM", "city": "Memphis"}, 
                     {"IATA Code": "RNO", "city": "Reno"}];


// Search button click
$(".uk-button-secondary").on("click", function(event) {
    event.preventDefault();
    zip = $("#user-zip").val().trim();
    if (zip === '') {
        return;
    } else {
        localTempApiFetch();
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
        })
        .then(function(response) {
            var localLat = response.coord.lat;
            var localLong = response.coord.lon;
            // Find airports within a given radius, pull lat and lon coordinates
            fetch("https://aviation-reference-data.p.rapidapi.com/airports/search?lat=" + localLat + "&lon=" + localLong + "&radius=250", {
                "method": "GET",
                "headers": {
                    "x-rapidapi-host": "aviation-reference-data.p.rapidapi.com",
                    "x-rapidapi-key": "862a716dc7msh647274362d7a08cp12fe37jsn54b5d3acd3b7"
                }
            })
            .then(function(response) {
                return response.json();
            })
            .then(function(response) {
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
                var searchStr = "regional"
                let airportArrayNoReg = airportArrayNoPriv.filter(function(e){
                    return !e.name.toLowerCase().includes(searchStr.toLowerCase());
                });
                let airportArrayCheckLat = airportArrayNoReg.filter(function(lat){
                    return lat.latitude < localLat;
                });
                //console.log(airportArrayCheckLat);
                airportArrayIATA = airportArrayCheckLat;
                // Find temp at each airport
                var promises = []
                airportArrayCheckLat.forEach(function(coord) {
                    promises.push(new Promise(function(resolve, reject) {
                        var tempLatCheck = coord.latitude;
                        var tempLonCheck = coord.longitude;
                        fetch("https://api.openweathermap.org/data/2.5/weather?lat="+ tempLatCheck + "&lon=" + tempLonCheck + "&units=imperial&appid=" + apiKey)
                        .then(function(response){
                            return response.json();
                        })
                        .then(function(response){
                            var airTemp = response.main.temp;
                            var latAtAirport = response.coord.lat;
                            var lonAtAirport = response.coord.lon;
                            dist = distance(latAtAirport, lonAtAirport, localLat, localLong);
                            var nestedArrayElem = {"latitude": latAtAirport, "longitude": lonAtAirport, "temp": airTemp, "distance": dist};
                            tempCheckArray.push(nestedArrayElem);
                            resolve("done")
                        });
                    }))
                });
                Promise.all(promises)
                .then(function() {
                    chooseClosest();
                    chooseWarmest();
                    findTrip();
                    $("#flights").removeAttr("hidden");
                    $("#spinner").attr("hidden", true);
                })
            })
        })
        
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
    for (var i = 0; i < tempCheckArray.length; i++) {
        // Sort Distances
        tempCheckArray.sort(function(a,b) {
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
    airportsByDistanceClosest = tempCheckArray.reverse();
    closestAirportLat = airportsByDistanceClosest[0]["latitude"];
    closestAirportLon = airportsByDistanceClosest[0]["longitude"];
    closeLatLon = {"latitude": closestAirportLat, "longitude": closestAirportLon};
}

// Choose warmest airport, save codes <this runs third>
function chooseWarmest() {
    for (var i = 0; i < tempCheckArray.length; i++) {
        // Sort Distances
        tempCheckArray.sort(function(a,b) {
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
    warmestAirportLat = tempCheckArray[0]["latitude"];
    warmestAirportLon = tempCheckArray[0]["longitude"];
    warmLatLon = {"latitude": warmestAirportLat, "longitude": warmestAirportLon};
}


// Flight finder & publish results on page <this runs fourth>
function findTrip() {
    let closestAirportIATA;
    let warmestAirportIATA;
    var closestData = closeLatLon;
    var warmestData = warmLatLon;
    airportArrayFinal = airportArrayIATA;
    for (i = 0; i < airportArrayFinal.length; i++) {
        if (warmestData["latitude"] === closestData["latitude"] &&  warmestData["longitude"] === closestData["longitude"]) {
            console.log("You're already at the hottest place");
            return;
        }
        else if (airportArrayFinal[i]["latitude"] === warmestData["latitude"] && airportArrayFinal[i]["longitude"] === warmestData["longitude"]) {
            warmestAirportIATA = airportArrayFinal[i]["iataCode"];
        }
        else if (airportArrayFinal[i]["latitude"] === closestData["latitude"] && airportArrayFinal[i]["longitude"] === closestData["longitude"]) {
            closestAirportIATA = airportArrayFinal[i]["iataCode"];
        }
    }
    // Fetch flights using sky scanner
    fetch("https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browseroutes/v1.0/US/USD/en-US/" + closestAirportIATA + 
    "-sky/" + warmestAirportIATA + "-sky/" + flightDate + "?inboundpartialdate=" + returnDate, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
            "x-rapidapi-key": "862a716dc7msh647274362d7a08cp12fe37jsn54b5d3acd3b7"
        }
    })
    .then(function(response){
        return response.json();
    }).then(function(response){
        console.log(response);
    });
}