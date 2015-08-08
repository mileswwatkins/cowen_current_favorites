var restaurants;

function main() {
    // Load the restaurants from a JSON file in the repo's GitHub page
    var JSONRequest = new XMLHttpRequest();
    JSONRequest.open("GET", "https://raw.githubusercontent.com/mileswwatkins/cowen_current_favorites/master/locations.json");
    JSONRequest.onreadystatechange = function () {
        if (JSONRequest.readyState != 4 || JSONRequest.status != 200) return;
        restaurants = JSON.parse(JSONRequest.responseText);

        // Initialize the map now that the data has been loaded
        createMap();
    };
    JSONRequest.send();
}

function createMap() {
    // Identify map bounds and create map object
    var mapBounds = new google.maps.LatLngBounds();

    restaurants.forEach(function(restaurant) {
        mapBounds.extend(new google.maps.LatLng(
            restaurant.coordinates[1],
            restaurant.coordinates[0]
        ));
    });

    var map = new google.maps.Map(
        document.getElementById("map-canvas")
    );
    map.setCenter(mapBounds.getCenter())
    map.fitBounds(mapBounds);

    // Show DC Metro lines
    var transitLayer = new google.maps.TransitLayer();
    transitLayer.setMap(map);

    var infoWindow = new google.maps.InfoWindow();

    // Add each restaurant to the map
    restaurants.forEach(function(restaurant) {
        var position = new google.maps.LatLng(
            restaurant.coordinates[1],
            restaurant.coordinates[0]
        );
        var marker = new google.maps.Marker({
            map: map,
            position: position
        });

        google.maps.event.addListener(marker, 'click', function() {
            infoWindow.setContent(
                '<a href="' + restaurant.url + '"><b>' + restaurant.name + "</b></a>" + "<br>" + restaurant.address
            );
            infoWindow.open(map, this);
        });
    });
}

// On page load, open the JSON file and initialize the map
google.maps.event.addDomListener(window, "load", main);
