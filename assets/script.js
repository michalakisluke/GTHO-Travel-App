var apiKey = "12524a4796d1cd5b9b5d525171960baf";
let airportArrayClear = [];
let tempCheckArray = [];
let localLat;
let localLong;
let warmLatLon;
let closeLatLon;
let airportArrayIATA;
let originIata;
let destIata;
let destCity;
let destAirportTemp;
let airportArrayFiltered;
var flightDate = moment().format("YYYY-MM-DD");
var bigAirports = [{ iataCode: "ATL", city: "Atlanta" }, { iataCode: "DFW", city: "Dallas" }, { iataCode: "DEN", city: "Denver" }, { iataCode: "ORD", city: "Chicago" },
    { iataCode: "LAX", city: "Los Angeles" }, { iataCode: "CLT", city: "Charlotte" }, { iataCode: "LAS", city: "Las Vegas" },
    { iataCode: "PHX", city: "Phoenix" }, { iataCode: "MCO", city: "Orlando" }, { iataCode: "SEA", city: "Seattle" }, { iataCode: "MIA", city: "Miami" }, { iataCode: "IAH", city: "Houston" },
    { iataCode: "JFK", city: "New York City" }, { iataCode: "FLL", city: "Fort Lauderdale" }, { iataCode: "SFO", city: "San Francisco" },
    { iataCode: "EWR", city: "Newark" }, { iataCode: "MSP", city: "Minneapolis" }, { iataCode: "DTW", city: "Detroit" }, { iataCode: "BOS", city: "Boston" },
    { iataCode: "PHL", city: "Philadelphia" }, { iataCode: "STL", city: "St. Louis" }, { iataCode: "BWI", city: "Baltimore" }, { iataCode: "TPA", city: "Tampa" },
    { iataCode: "SAN", city: "San Diego" }, { iataCode: "SLC", city: "Salt Lake City" }, { iataCode: "IAD", city: "Washington, D.C." }, { iataCode: "BNA", city: "Nashville" },
    { iataCode: "LGA", city: "New York City" }, { iataCode: "DAL", city: "Dallas" }, { iataCode: "DCA", city: "Washington, D.C." }, { iataCode: "PDX", city: "Portland" },
    { iataCode: "HNL", city: "Honolulu" }, { iataCode: "HOU", city: "Houston" }, { iataCode: "AUS", city: "Austin" }, { iataCode: "MDW", city: "Chicago" },
    { iataCode: "RSW", city: "Fort Myers" }, { iataCode: "SMF", city: "Sacramento" }, { iataCode: "MSY", city: "New Orleans" }, { iataCode: "RDU", city: "Raleigh" },
    { iataCode: "SJU", city: "San Juan" }, { iataCode: "SJC", city: "San Jose" }, { iataCode: "OAK", city: "Oakland" }, { iataCode: "MCI", city: "Kansas City" },
    { iataCode: "CLE", city: "Cleveland" }, { iataCode: "IND", city: "Indianapolis" }, { iataCode: "SAT", city: "San Antonio" }, { iataCode: "SNA", city: "Orange County" },
    { iataCode: "PIT", city: "Pittsburgh" }, { iataCode: "CVG", city: "Cincinatti" }, { iataCode: "CMH", city: "Columbus" }, { iataCode: "PBI", city: "Palm Beach" },
    { iataCode: "JAX", city: "Jacksonville" }, { iataCode: "MKE", city: "Milwaukee" }, { iataCode: "ONT", city: "Ontario" }, { iataCode: "BDL", city: "Hartford" },
    { iataCode: "OGC", city: "Kahului" }, { iataCode: "ANC", city: "Anchorage" }, { iataCode: "OMA", city: "Omaha" }, { iataCode: "MEM", city: "Memphis" },
    { iataCode: "RNO", city: "Reno" }
];

// Load previous results from local storage
function writeHistory() {
    if (localStorage.bookFlightURL !== null) {
        $("#previous-location-name").html(localStorage.destCity);
        $("#previous-flight-url").html(localStorage.bookFlightURL);
    } else {
        $("#flight-history").attr("hidden", true)
    }
};

// Search button click
$(".search-button").on("click", function(event) {
    event.preventDefault();
    zip = $("#user-zip").val().trim();
    if (zip.length !== 5) {
        $("#user-zip").effect("shake");
        return;
    } else {
        localTempApiFetch();
        // show spinner & hide user input upon click
        $("#spinner").removeAttr("hidden");
        $("#location").attr("hidden", true);
        $(".down-button").attr("hidden", true);
    }
});

// Go to top button click
$("#go-again-button").on("click", function(event) {
    location.reload(true);
});

// Book my flight button click
$(".flight-link").on("click", function() {
    for (i = 0; i < airportArrayFiltered.length; i++) {
        if (closeLatLon["latitude"] === airportArrayFiltered[i]["latitude"] && closeLatLon["longitude"] === airportArrayFiltered[i]["longitude"]) {
            originIata = airportArrayFiltered[i]["iataCode"];
        }
    }
    destIata = localStorage.getItem("destIata");
    originIata = originIata.toLowerCase();
    destIata = destIata.toLowerCase();
    var bookFlightURL = "https://skyscanner.net/g/referrals/v1/flights/day-view?origin=" + originIata + "&destination=" + destIata + "&currency=USD" + "&market=US" + "&outboundDate=" + flightDate;
    window.open(bookFlightURL, "_blank");
    localStorage.setItem("bookFlightURL", bookFlightURL);
});

// Book previous flight button click
$("#book-again").on("click", function() {
    bookFlightURL = localStorage.getItem("bookFlightURL");
    window.open(bookFlightURL, "_blank");
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
            fetch("https://aviation-reference-data.p.rapidapi.com/airports/search?lat=" + localLat + "&lon=" + localLong + "&radius=1000", {
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
                    airportArrayFiltered = airportArray.filter((el) => {
                        return bigAirports.some((f) => {
                            return f.iataCode === el.iataCode;
                        });
                    });
                    airportArrayIATA = airportArrayFiltered;
                    // Find temp at each airport
                    var promises = []
                    airportArrayFiltered.forEach(function(coord) {
                        promises.push(new Promise(function(resolve, reject) {
                            var tempLatCheck = coord.latitude;
                            var tempLonCheck = coord.longitude;
                            fetch("https://api.openweathermap.org/data/2.5/weather?lat=" + tempLatCheck + "&lon=" + tempLonCheck + "&units=imperial&appid=" + apiKey)
                                .then(function(response) {
                                    return response.json();
                                })
                                .then(function(response) {
                                    var airTemp = response.main.temp;
                                    var latAtAirport = response.coord.lat;
                                    var lonAtAirport = response.coord.lon;
                                    dist = distance(latAtAirport, lonAtAirport, localLat, localLong);
                                    var nestedArrayElem = { "latitude": latAtAirport, "longitude": lonAtAirport, "temp": airTemp, "distance": dist };
                                    tempCheckArray.push(nestedArrayElem);
                                    resolve("done")
                                });
                        }))
                    });
                    Promise.all(promises)
                        .then(function() {
                            chooseClosest();
                            chooseWarmest();
                            $("#flights").removeAttr("hidden");
                            $("#spinner").attr("hidden", true);
                            writeInfo();
                        })
                })
        })

}

// find closest airport
function distance(latAtAirport, lonAtAirport, localLat, localLon) {
    if ((latAtAirport == localLat) && (lonAtAirport == localLon)) {
        return 0;
    } else {
        var radlat1 = Math.PI * latAtAirport / 180;
        var radlat2 = Math.PI * localLat / 180;
        var theta = lonAtAirport - localLon;
        var radtheta = Math.PI * theta / 180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;
        return dist;
    }
}

// Choose closest airport, save codes <this runs second>
function chooseClosest() {
    for (var i = 0; i < tempCheckArray.length; i++) {
        // Sort Distances
        tempCheckArray.sort(function(a, b) {
            let varA;
            let varB;
            varA = a["distance"];
            varB = b["distance"];
            if (varA < varB) {
                return 1;
            } else if (varB < varA) {
                return -1;
            }
            return 0;
        });
    }
    airportsByDistanceClosest = tempCheckArray.reverse();
    closestAirportLat = airportsByDistanceClosest[0]["latitude"];
    closestAirportLon = airportsByDistanceClosest[0]["longitude"];
    closeLatLon = { "latitude": closestAirportLat, "longitude": closestAirportLon };
}

// Choose warmest airport, save codes <this runs third>
function chooseWarmest() {
    for (var i = 0; i < tempCheckArray.length; i++) {
        // Sort Distances
        tempCheckArray.sort(function(a, b) {
            let varA;
            let varB;
            varA = a["temp"];
            varB = b["temp"];
            if (varA < varB) {
                return 1;
            } else if (varB < varA) {
                return -1;
            }
            return 0;
        });
    }
    warmestAirportLat = tempCheckArray[0]["latitude"];
    warmestAirportLon = tempCheckArray[0]["longitude"];
    warmLatLon = { "latitude": warmestAirportLat, "longitude": warmestAirportLon };
}

function writeInfo() {
    for (i = 0; i < airportArrayFiltered.length; i++) {
        if (warmLatLon["latitude"] === airportArrayFiltered[i]["latitude"] && warmLatLon["longitude"] === airportArrayFiltered[i]["longitude"]) {
            var destIata = airportArrayFiltered[i]["iataCode"];
            localStorage.setItem("destIata", destIata);
        }
    }
    for (i = 0; i < bigAirports.length; i++) {
        if (destIata === bigAirports[i]["iataCode"]) {
            destCity = bigAirports[i]["city"];
            localStorage.setItem("destCity", destCity);

        }
    }

    $("#location-name").html(destCity);

    var destAirportTemp = tempCheckArray[0]["temp"];
    var destAirportTemp = Math.round(destAirportTemp);
    $("#location-temp").html(destAirportTemp);

}

writeHistory();