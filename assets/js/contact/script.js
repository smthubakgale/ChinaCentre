document.getElementById('back-button').addEventListener('click', function() {
      window.history.back();
    });

L.mapquest.key = 'YOUR_MAPQUEST_KEY';

var map = L.mapquest.map('map', {
    center: [-26.011694, 28.123784],
    layers: L.mapquest.tileLayer('map'),
    zoom: 15
});

var marker = L.marker([-26.011694, 28.123784], {
    icon: L.mapquest.icons.marker(),
    draggable: false
}).addTo(map);

marker.bindPopup('18 Greenstone Place, Modderfontein, Johannesburg');

document.getElementById('nav-button').addEventListener('click', function() {
    navigator.geolocation.getCurrentPosition(function(position) {
        var userLocation = [position.coords.latitude, position.coords.longitude];
        L.mapquest.directions().route({
            from: userLocation,
            to: [-26.011694, 28.123784]
        }).then(function(response) {
            var directions = response.route;
            var bounds = directions.bbox;
            map.fitBounds(bounds);
            var routeLayer = L.mapquest.directionsLayer({
                directionsResponse: response,
                fitMapBounds: true
            }).addTo(map);
            var directionsHtml = '';
            for (var i = 0; i < directions.legs[0].maneuvers.length; i++) {
                var maneuver = directions.legs[0].maneuvers[i];
                directionsHtml += '<p>' + maneuver.narrative + ' (' + maneuver.distance + ')</p>';
            }
            document.getElementById('directions').innerHTML = directionsHtml;
            document.querySelector('.directions-container').style.display = 'block';
            var speech = new SpeechSynthesisUtterance();
            speech.text = 'Please follow the directions to reach our location.';
            speech.lang = 'en-US';
            speech.volume = 1;
            speech.rate = 1;
            speech.pitch = 1;
            window.speechSynthesis.speak(speech);
            var watchID = navigator.geolocation.watchPosition(function(position) {
                var userLocation = [position.coords.latitude, position.coords.longitude];
                var destination = [-26.011694, 28.123784];
                var distance = calculateDistance(userLocation, destination);
                if (distance < 0.1) { // arrival threshold in kilometers
                    navigator.geolocation.clearWatch(watchID);
                    var speech = new SpeechSynthesisUtterance();
                    speech.text = 'You have arrived at your destination.';
                    speech.lang = 'en-US';
                    speech.volume = 1;
                    speech.rate = 1;
                    speech.pitch = 1;
                    window.speechSynthesis.speak(speech);
                } else {
                    var nextManeuver = get_next_maneuver(directions.legs[0].maneuvers, userLocation);
                    if (nextManeuver) {
                        var nextManeuverLocation = [nextManeuver.startPoint.lat, nextManeuver.startPoint.lng];
                        var nextManeuverDistance = calculateDistance(userLocation, nextManeuverLocation);
                        if (nextManeuverDistance < 0.01) { // threshold in kilometers
                            var speech = new SpeechSynthesisUtterance();
                            speech.text = nextManeuver.narrative;
                            speech.lang = 'en-US';
                            speech.volume = 1;
                            speech.rate = 1;
                            speech.pitch = 1;
                            window.speechSynthesis.speak(speech);
                            setTimeout(function() {
                                L.mapquest.directions().route({
                                    from: userLocation,
                                    to: destination
                                }).then(function(response) {
                                    var directions = response.route;
                                    var bounds = directions.bbox;
                                    map.fitBounds(bounds);
                                    var routeLayer = L.mapquest.directionsLayer({
                                        directionsResponse: response,
                                        fitMapBounds: true
                                    }).addTo(map);
                                    var directionsHtml = '';
                                    for (var i = 0; i < directions.legs[0].maneuvers.length; i++) {
                                        var maneuver = directions.legs[0].maneuvers[i];
                                        directionsHtml += '<p>' + maneuver.narrative + ' (' + maneuver.distance + ')</p>';
                                    }
                                    document.getElementById('directions').innerHTML = directionsHtml;
                                });
                            }, 5000); // update every 5 seconds
                        }
                    }
                }
            }, function(error) {
                console.error(error);
            }, {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 5000
            });
        });
    });
});

function get_next_maneuver(maneuvers, userLocation) {
    for (var i = 0; i < maneuvers.length; i++) {
        var maneuver = maneuvers[i];
        var maneuverLocation = [maneuver.startPoint.lat, maneuver.startPoint.lng];
        var distance = calculateDistance(userLocation, maneuverLocation);
        if (distance < 0.01) { // threshold in kilometers
            return maneuver;
        }
    }
    return null;
}

function calculateDistance(userLocation, destination) {
    var lat1 = userLocation[0] * Math.PI / 180;
    var lon1 = userLocation[1] * Math.PI / 180;
    var lat2 = destination[0] * Math.PI / 180;
    var lon2 = destination[1] * Math.PI / 180;
    var dlat = lat2 - lat1;
    var dlon = lon2 - lon1;
    var a = Math.sin(dlat / 2) * Math.sin(dlat / 2) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) * Math.sin(dlon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var distance = 6371 * c; // in kilometers
    return distance;
}

