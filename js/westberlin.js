let button;
let map;
let resultView;
let isInside;

window.addEventListener("load", initwestBerlin)

function initwestBerlin() {
    resultView = false;
    isInside = false;

    button = document.getElementById("button");
    button.addEventListener("click", () => {
        if (!resultView) {
            if (isInside) {
                button.innerHTML = "YOU<br>PROBABLY<br>ARE";
            }
            else {
                button.innerHTML = "YOU<br>ARE<br>PROBABLY<br>NOT";
            }

            resultView = true;
        }
        else {
            document.getElementById("map").style.opacity = 1;
            button.classList.add("hidden");
        }
    });

    getLocation();
}

function getLocation() {
    if (!resultView) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                latitude = position.coords.latitude;
                longitude = position.coords.longitude;

                isInside = contains([longitude, latitude], westBerlinCoords);

                initMap({ lat: latitude, lon: longitude });
            }, onError);
        }
        else {
            alert("Geolocation is not supported by this browser.");
        }
    }
    else {
        button.innerHTML = "AM<br>I<br>IN<br>WEST<br>BERLIN?";
        resultView = false;
    }
}

function contains(point, polygon) {
    let i = 0;
    let j = 0;
    let result = false;

    for (i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        if ((polygon[i][1] > point[1]) != (polygon[j][1] > point[1]) &&
            (point[0] < (polygon[j][0] - polygon[i][0]) * (point[1] - polygon[i][1]) / (polygon[j][1] - polygon[i][1]) + polygon[i][0])) {
            result = !result;
        }
    }

    return result;
}

function initMap(position) {
    map = L.map('map').setView([position.lat, position.lon], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(map);

    var markerIcon = L.icon({
        iconUrl: 'res/marker.png',
        iconSize: [200, 200],
        iconAnchor: [99, 191]
    })

    L.marker([position.lat, position.lon], { icon: markerIcon }).addTo(map);

    westBerlinCoords = westBerlinCoords.map(function (coord) {
        return [coord[1], coord[0]];
    })

    var polygon = L.polygon(westBerlinCoords, { color: '#ff4444', weight: 2 }).addTo(map);
    map.fitBounds(polygon.getBounds());
}

function onError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("Please allow request for Geolocation.");
            button.innerHTML = "YOU<br>NEED<br>TO<br>ALLOW<br>GEOLOCATION!";
            resultView = true;
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}