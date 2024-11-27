let map, routingControl, userLocation, userCircle;

function initMap() {
    // Inicializar el mapa centrado en Argentina como vista predeterminada
    map = L.map('map').setView([-38.4161, -63.6167], 5); // Coordenadas de Argentina

    // Añadir capa base
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Inicializar el control de rutas con una configuración básica
    routingControl = L.Routing.control({
        waypoints: [], // Inicialmente vacío
        routeWhileDragging: false, // No permitir arrastrar rutas
        lineOptions: {
            styles: [{ color: 'red', opacity: 0.8, weight: 6 }] // Línea roja personalizada
        },
        createMarker: function() { return null; } // No crear marcadores
    }).addTo(map);

    // Verificar si la geolocalización está disponible
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(updateUserLocation, handleLocationError, {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 5000
        });
    } else {
        alert("La geolocalización no está soportada en este navegador.");
    }
}

function updateUserLocation(position) {
    const { latitude, longitude } = position.coords;
    userLocation = L.latLng(latitude, longitude);

    if (!userCircle) {
        // Crear un marcador y un círculo en la ubicación del usuario
        userCircle = L.circle(userLocation, {
            color: 'blue',
            radius: 50,
            fillOpacity: 0.3
        }).addTo(map).bindPopup("Estás aquí").openPopup();

        // Centrar el mapa en la ubicación del usuario
        map.setView(userLocation, 13);
    } else {
        // Actualizar la posición del marcador y el círculo
        userCircle.setLatLng(userLocation);
        map.setView(userLocation, 13);
    }
}

function handleLocationError(error) {
    console.error("Error en la geolocalización:", error);
    alert("No se pudo obtener tu ubicación.");
}

function searchRoute() {
    const destination = document.getElementById('destination').value;

    if (!userLocation) {
        alert("No se ha detectado tu ubicación.");
        return;
    }

    if (!destination) {
        alert("Por favor, ingresa el destino.");
        return;
    }

    // API key de GraphHopper
    const apiKey = 'ea0313bf-ed8e-43de-a131-6b1d2fcde1ef';
    const url = `https://graphhopper.com/api/1/route?point=${userLocation.lat},${userLocation.lng}&point=${destination}&key=${apiKey}&vehicle=car&locale=es&instructions=false`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.paths && data.paths.length > 0) {
                const route = data.paths[0];
                const routeCoordinates = route.points.coordinates.map(coord => [coord[1], coord[0]]); // Convertir a [lat, lng]

                // Actualizar los waypoints del control de rutas
                routingControl.setWaypoints(routeCoordinates.map(coord => L.latLng(coord[0], coord[1])));
            } else {
                alert("No se encontró ninguna ruta.");
            }
        })
        .catch(err => {
            console.error("Error al obtener la ruta:", err);
            alert("Error al obtener la ruta. Verifica el destino ingresado.");
        });
}

function clearRoute() {
    routingControl.setWaypoints([]); // Limpia los waypoints del control de rutas
}

// Inicializar el mapa al cargar la página
window.onload = initMap;
