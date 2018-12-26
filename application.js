var restaurants

function main () {
  // Load the restaurants from a JSON file in the repo's GitHub page
  var JSONRequest = new window.XMLHttpRequest()
  JSONRequest.open('GET', 'https://raw.githubusercontent.com/mileswwatkins/cowen_current_favorites/master/locations.json')
  JSONRequest.onreadystatechange = function () {
    if (JSONRequest.readyState !== 4 || JSONRequest.status !== 200) return
    restaurants = JSON.parse(JSONRequest.responseText)

    // Initialize the map now that the data has been loaded
    createMap()

    // When the user clicks the map, remove the overlying branding text
    var textElem = document.getElementById('branding-text')
    document.body.addEventListener('click', function () {
      textElem.remove()
    }, false)
  }
  JSONRequest.send()
}

function createMap () {
  // Identify map bounds and create map object
  var mapBounds = new window.google.maps.LatLngBounds()

  restaurants.forEach(function (restaurant) {
    mapBounds.extend(new window.google.maps.LatLng(
      restaurant.coordinates[1],
      restaurant.coordinates[0]
    ))
  })

  var mapOptions = {
    panControl: false,
    mapTypeControl: false
  }
  var map = new window.google.maps.Map(
    document.getElementById('map-canvas'),
    mapOptions
  )
  map.setCenter(mapBounds.getCenter())
  map.fitBounds(mapBounds)

  // Show DC Metro lines
  var transitLayer = new window.google.maps.TransitLayer()
  transitLayer.setMap(map)

  var infoWindow = new window.google.maps.InfoWindow()

  // Add each restaurant to the map
  restaurants.forEach(function (restaurant) {
    var position = new window.google.maps.LatLng(
      restaurant.coordinates[1],
      restaurant.coordinates[0]
    )
    var marker = new window.google.maps.Marker({
      map: map,
      position: position
    })

    window.google.maps.event.addListener(marker, 'click', function () {
      infoWindow.setContent(
        '<b>' + restaurant.name + '</b>' + ' <a target="_blank" href="' + restaurant.url + '">' + "(Tyler's Review)</a><br>" +
              restaurant.address + ' <a target="_blank" href="https://www.google.com/maps/dir//' + restaurant.address.split(' ').join('+') + '">(Directions)</a>'
      )
      infoWindow.open(map, this)
    })
  })
}

// On page load, open the JSON file and initialize the map
window.google.maps.event.addDomListener(window, 'load', main)
