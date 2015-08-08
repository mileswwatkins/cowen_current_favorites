// For now, manually enter the map JSON instead of loading it from a file
restaurants = [{"name": "Baan Thai", "coordinates": [-77.0323817, 38.90815500000001], "address": "1326 14th Street NW, Washington, DC"}, {"name": "Nanjing Bistro", "coordinates": [-77.33416319999999, 38.8502173], "address": "11213 Lee Highway, Suite C, Fairfax, VA"}, {"name": "DCity SmokeHouse", "coordinates": [-77.0094146, 38.9108082], "address": "8 Florida Avenue NW, Washington, DC"}, {"name": "Rose’s Luxury", "coordinates": [-76.995311, 38.880922], "address": "707 8th Street SE, Washington, DC"}, {"name": "Super Bowl Noodle House", "coordinates": [-77.1413993, 39.0767772], "address": "785-G Rockville Pike, Rockville, MD"}, {"name": "Hunan Taste", "coordinates": [-77.2960362, 38.8621481], "address": "10160 Fairfax Blvd., Fairfax, VA"}, {"name": "The Partisan", "coordinates": [-77.0224692, 38.8949871], "address": "709 D Street NW, Washington, DC"}, {"name": "Saba", "coordinates": [-77.27111579999999, 38.8441574], "address": "3900 A Pickett Road, Fairfax, VA"}, {"name": "Thai Taste by Kob", "coordinates": [-77.04915799999999, 39.040656], "address": "11315 Fern Street, Wheaton, MD"}, {"name": "Charcoal Chicken", "coordinates": [-77.4283257, 38.895558], "address": "13969 Metrotech Dr., Chantilly, VA"}, {"name": "Elephant Jumps – Update", "coordinates": [-77.225781, 38.8668415], "address": "8110 A Arlington Blvd, Falls Church, VA"}, {"name": "Shakthi", "coordinates": [-77.0623153, 38.8395962], "address": "3807 Mount Vernon Avenue, Alexandria, VA"}, {"name": "Siroo", "coordinates": [-77.19785569999999, 38.832573], "address": "4231-N Markham Street, Annandale, VA"}, {"name": "Aladdin", "coordinates": [-79.9505951, 37.2711964], "address": "5169 Lee Highway, Garden City Shopping Center, Arlington, VA"}, {"name": "Blue Sand Seafood", "coordinates": [-77.19785569999999, 38.832573], "address": "4231-H Markham Street, Annandale, VA"}, {"name": "Kogiya, Korean BBQ", "coordinates": [-77.1970375, 38.8318794], "address": "4220 Annandale Road, Annandale, VA"}, {"name": "Nostos", "coordinates": [-77.225894, 38.9138145], "address": "8100 Boone Blvd, Vienna, VA"}, {"name": "Elephant Jumps", "coordinates": [-77.225781, 38.8668415], "address": "8110 A Arlington Blvd, Falls Church, VA"}, {"name": "Panda Gourmet", "coordinates": [-76.97047210000001, 38.9177601], "address": "2700 New York Avenue NE, Washington, DC"}, {"name": "Bob’s Shanghai 66", "coordinates": [-77.1536847, 39.0887012], "address": "305 North Washington Street, Rockville, MD"}, {"name": "East Dumpling House", "coordinates": [-77.153442, 39.084665], "address": "12 North Washington St., Suite 14G, Rockville, MD"}, {"name": "Gharer Khabar", "coordinates": [-77.1323192, 38.8966875], "address": "5151 Lee Highway, Arlington, VA"}, {"name": "Jewel of India", "coordinates": [-76.9767962, 39.0211799], "address": "10151 New Hampshire Avenue, Silver Spring, MD"}, {"name": "Keren Restaurant", "coordinates": [-77.0412654, 38.9167413], "address": "1780 Florida Avenue NW, Washington, DC"}, {"name": "Hunan Gate Restaurant", "coordinates": [-77.0905095, 38.8886106], "address": "4233 N. Fairfax Drive, Arlington, VA"}, {"name": "Bang Ga Nae", "coordinates": [-77.1573982, 38.820854], "address": "6499 Little River Turnpike, Alexandria, VA"}, {"name": "R&R Tacqueria – Gas station tacos", "coordinates": [-76.71358140000001, 39.21260729999999], "address": "7894 Washington Blvd. (Rt.1), Elkridge, MD"}, {"name": "DaMoim", "coordinates": [-77.1914376, 38.833016], "address": "7106 Columbia Pike, Annandale, VA"}, {"name": "Mandu Rang Kimbob", "coordinates": [-77.1943775, 38.8311751], "address": "7217 Columbia Pike, Annandale, VA,"}, {"name": "Super Chicken", "coordinates": [-77.1756856, 38.8802517], "address": "422 S. Washington Street, Falls Church, VA"}]

function main() {
    // Identify map bounds and create map object
    mapBounds = new google.maps.LatLngBounds();

    restaurants.forEach(function(restaurant) {
        mapBounds.extend(new google.maps.LatLng(
            restaurant.coordinates[1],
            restaurant.coordinates[0]
        ));
    });

    map = new google.maps.Map(
        document.getElementById("map-canvas")
    );
    map.setCenter(mapBounds.getCenter())
    map.fitBounds(mapBounds);

    infoWindow = new google.maps.InfoWindow();

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
                "<b>" + restaurant.name + "</b>" + "<br>" + restaurant.address
            );
            infoWindow.open(map, this);
        });
    });
}

// On page load, initialize the map
google.maps.event.addDomListener(window, "load", main)
