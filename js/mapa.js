// Función para inicializar el mapa con Leaflet
function initProveedorMap(lat = 19.4326, lng = -99.1332, containerId = 'map') {
    // Verificar si el contenedor del mapa existe
    const mapContainer = document.getElementById(containerId);
    if (!mapContainer) {
        console.error('No se encontró el contenedor del mapa con ID:', containerId);
        return;
    }

    // Inicializar el mapa
    const map = L.map(containerId).setView([lat, lng], 15);

    // Agregar capa de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Agregar marcador para la ubicación del proveedor
    const marker = L.marker([lat, lng]).addTo(map);
    marker.bindPopup('<b>Ubicación del proveedor</b><br>Zona Centro, Ciudad de México').openPopup();

    return map;
}

// Función para inicializar el mapa en la página de proveedor
document.addEventListener('DOMContentLoaded', function() {
    // Solo inicializar si estamos en la página de proveedor
    if (document.getElementById('map')) {
        initProveedorMap();
    }
});