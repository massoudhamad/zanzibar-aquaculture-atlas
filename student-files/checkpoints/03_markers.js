const map = L.map('map').setView([-6.16, 39.38], 10);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19, attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);
async function loadFarms() {
  try {
    const response = await fetch('data/farms.geojson');
    if (!response.ok) throw new Error(`Data HTTP ${response.status}`);
    const data = await response.json();
    const layer = L.geoJSON(data, {
      pointToLayer: (feature, latlng) => L.circleMarker(latlng, {
        radius: 6, color: '#098c78'
      }),
      onEachFeature: (feature, marker) => {
        const node = document.createElement('div');
        node.textContent = feature.properties.id + ' - ' +
          feature.properties.village;
        marker.bindPopup(node);
      }
    }).addTo(map);
    if (layer.getBounds().isValid()) map.fitBounds(layer.getBounds());
    document.getElementById('count').textContent =
      `${data.features.length} farm-location records loaded`;
  } catch (error) {
    document.getElementById('status').textContent = error.message;
  }
}
loadFarms();
