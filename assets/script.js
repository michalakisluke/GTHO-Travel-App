apiKey = "12524a4796d1cd5b9b5d525171960baf";

// Search button click
$(".uk-button-secondary").on("click", function (event){
    event.preventDefault();
    zip = $("#user-zip").val().trim();
    if (zip === '') {
        console.log("You woulda thought");
        return;
    }
    else {
        console.log(zip);
        localTempApiFetch();
    }
});

//Fetch temp data for zip codes
function localTempApiFetch() {
    // Write a fetch request to the Giphy API
    fetch("https://api.openweathermap.org/data/2.5/weather?zip="+zip+"&units=imperial&appid="+apiKey)
    .then(function(response){
        return response.json();
    }).then(function(response) {
        var localTemp = response.main.temp;
        var localLat = response.coord.lat;
        var localLong = response.coord.lon;
        console.log("The local temp is " + localTemp + " degrees Farenheit");
        console.log("The local latitude is " + localLat);
        console.log("The local longitude is " + localLong);
        fetch("https://aviation-reference-data.p.rapidapi.com/airports/search?lat="+ localLat +"&lon="+ localLong +"&radius=50", {
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "aviation-reference-data.p.rapidapi.com",
                "x-rapidapi-key": "862a716dc7msh647274362d7a08cp12fe37jsn54b5d3acd3b7"
            }
        })
        .then(function(response){
            return response.json();
        }).then(function(response){
            for (i = 0; i < response.length; i++) {
                var icaoCode = response[i].icaoCode;
                if (response[i].icaoCode == null) {
                    response.splice(i, 1);
                }
            }
            console.log(response);
        });
    });
}


