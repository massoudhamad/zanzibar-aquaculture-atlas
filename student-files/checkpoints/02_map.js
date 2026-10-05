const map = L.map('map').setView([-6.16, 39.38], 10);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19, attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);
L.marker([-6.16, 39.38]).addTo(map)
  .bindPopup('Demonstration point only - not a surveyed farm.');
