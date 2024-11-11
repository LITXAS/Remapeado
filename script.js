let userMarker;
let userCircle;

function updateUserLocation(position) {
    const { latitude, longitude } = position.coords;

    if (!userMarker) {
        userMarker = L.marker([latitude, longitude]).addTo(map);
        userCircle = L.circle([latitude, longitude], { radius: 50 }).addTo(map);
    } else {
        userMarker.setLatLng([latitude, longitude]);
        userCircle.setLatLng([latitude, longitude]);
    }

    map.setView([latitude, longitude], 15); // Ajusta el nivel de zoom
}

function handleLocationError(error) {
    console.error("Error en la ubicación: ", error);
    alert("No se pudo obtener la ubicación.");
}

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(updateUserLocation, handleLocationError, {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000
    });
} else {
    alert("La geolocalización no está soportada en este navegador.");
}
