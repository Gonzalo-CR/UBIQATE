let map;
let marker;
let startMarker;
let routeLayer;

document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('input-type').addEventListener('change', changeInputType);
    document.getElementById('convert-btn').addEventListener('click', convertAndShow);
    document.getElementById('find-location-btn').addEventListener('click', findStartLocation);

    initMap();
});

function initMap() {
    map = L.map('map').setView([0, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Añadir evento de clic al mapa
    map.on('click', function(e) {
        const lat = e.latlng.lat;
        const lon = e.latlng.lng;
        updateOutputs(lat, lon);
        updateMap(lat, lon);
        reverseGeocode(lat, lon);
    });
}

function changeInputType() {
    const inputType = document.getElementById('input-type').value;
    document.getElementById('dd-input').style.display = 'none';
    document.getElementById('dms-input').style.display = 'none';
    document.getElementById('utm-input').style.display = 'none';
    document.getElementById('address-input').style.display = 'none';
    document.getElementById(`${inputType}-input`).style.display = 'block';
}

function convertAndShow() {
    const inputType = document.getElementById('input-type').value;

    if (inputType === 'address') {
        const address = document.getElementById('address').value;
        geocodeAddress(address);
    } else {
        let lat, lon;
        switch(inputType) {
            case 'dd':
                lat = parseFloat(document.getElementById('dd-lat').value);
                lon = parseFloat(document.getElementById('dd-lon').value);
                break;
            case 'dms':
                lat = dmsToDD(
                    parseFloat(document.getElementById('dms-lat-d').value),
                    parseFloat(document.getElementById('dms-lat-m').value),
                    parseFloat(document.getElementById('dms-lat-s').value),
                    document.getElementById('dms-lat-dir').value
                );
                lon = dmsToDD(
                    parseFloat(document.getElementById('dms-lon-d').value),
                    parseFloat(document.getElementById('dms-lon-m').value),
                    parseFloat(document.getElementById('dms-lon-s').value),
                    document.getElementById('dms-lon-dir').value
                );
                break;
            case 'utm':
                const utmResult = utmToLatLon(
                    parseInt(document.getElementById('utm-zone').value),
                    document.getElementById('utm-hemisphere').value,
                    parseFloat(document.getElementById('utm-easting').value),
                    parseFloat(document.getElementById('utm-northing').value)
                );
                lat = utmResult.latitude;
                lon = utmResult.longitude;
                break;
        }
        updateOutputs(lat, lon);
        updateMap(lat, lon);
        reverseGeocode(lat, lon);
        if (startMarker) {
            getRoute(startMarker.getLatLng(), [lat, lon]);
        }
    }
}

function findStartLocation() {
    const address = document.getElementById('start-address').value;
    geocodeAddress(address, true);
}

function geocodeAddress(address, isStartLocation = false) {
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const lat = parseFloat(data[0].lat);
                const lon = parseFloat(data[0].lon);
                updateOutputs(lat, lon);
                updateMap(lat, lon);
                document.getElementById('address-output').textContent = `Dirección: ${data[0].display_name}`;
                if (isStartLocation) {
                    if (startMarker) {
                        map.removeLayer(startMarker);
                    }
                    startMarker = L.marker([lat, lon]).addTo(map);
                    document.getElementById('distance-output').textContent = 'Ubicación inicial establecida.';
                }
                if (startMarker) {
                    getRoute(startMarker.getLatLng(), [lat, lon]);
                }
            } else {
                alert('No se encontró la dirección.');
            }
        });
}

function reverseGeocode(lat, lon) {
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('address-output').textContent = `Dirección: ${data.display_name}`;
        });
}

function updateOutputs(lat, lon) {
    document.getElementById('dd-output').textContent = `Lat: ${lat.toFixed(6)}, Lon: ${lon.toFixed(6)}`;
    document.getElementById('dms-output').textContent = `Lat: ${lat.toFixed(6)}, Lon: ${lon.toFixed(6)}`;
    document.getElementById('utm-output').textContent = `Lat: ${lat.toFixed(6)}, Lon: ${lon.toFixed(6)}`;
    if (startMarker) {
        const distance = calculateDistance(startMarker.getLatLng().lat, startMarker.getLatLng().lng, lat, lon);
        document.getElementById('distance-output').textContent = `Distancia: ${distance.toFixed(2)} km`;
    } else {
        document.getElementById('distance-output').textContent = '';
    }
}

function updateMap(lat, lon) {
    if (marker) {
        map.removeLayer(marker);
    }
    marker = L.marker([lat, lon]).addTo(map);
    map.setView([lat, lon], 13);
}


function decodePolyline(encoded) {
    let points = [];
    let index = 0, lat = 0, lng = 0;

    while (index < encoded.length) {
        let b, shift = 0, result = 0;
        do {
            b = encoded.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);
        const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
        lat += dlat;

        shift = 0;
        result = 0;
        do {
            b = encoded.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);
        const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
        lng += dlng;

        points.push([lat / 1E5, lng / 1E5]);
    }

    return points;
}


function getRoute(start, end) {
    if (routeLayer) {
        map.removeLayer(routeLayer);
    }
    fetch(`https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end[1]},${end[0]}?overview=full&geometries=polyline`)
        .then(response => response.json())
        .then(data => {
            if (data.routes.length > 0) {
                const routePoints = decodePolyline(data.routes[0].geometry);
                routeLayer = L.polyline(routePoints, { color: 'blue' }).addTo(map);
                const distance = data.routes[0].distance / 1000;
                document.getElementById('distance-output').textContent = `Distancia: ${distance.toFixed(2)} km`;
                map.fitBounds(routeLayer.getBounds());
            } else {
                alert('No se pudo obtener la ruta.');
            }
        })
        .catch(() => alert('Error al calcular la ruta.'));
}

function dmsToDD(degrees, minutes, seconds, direction) {
    let dd = degrees + minutes / 60 + seconds / 3600;
    if (direction === 'S' || direction === 'W') {
        dd *= -1;
    }
    return dd;
}

function utmToLatLon(zone, hemisphere, easting, northing) {
    const utm = `+proj=utm +zone=${zone} +${hemisphere === 'S' ? 'south' : ''} +ellps=WGS84 +datum=WGS84 +units=m +no_defs`;
    const wgs84 = '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs';
    const [lon, lat] = proj4(utm, wgs84, [easting, northing]);
    return { latitude: lat, longitude: lon };
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radio de la Tierra en kilómetros
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function toRad(degrees) {
    return degrees * Math.PI / 180;
}
