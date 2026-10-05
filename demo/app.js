'use strict';
const $ = id => document.getElementById(id);
const colors = {
  'Seaweed Farm': '#098c78',
  'Sea Cucumber Farm': '#d98c32',
  'Crab Farm': '#7654b8',
  'Unspecified': '#71838b'
};
let map, farmLayer;
let allFeatures = [], visibleFeatures = [];
const markerById = new Map();

function validPoint(feature) {
  const g = feature.geometry;
  if (!g || g.type !== 'Point') return false;
  const [lon, lat] = g.coordinates;
  return Number.isFinite(lon) && Number.isFinite(lat) &&
    lon >= -180 && lon <= 180 && lat >= -90 && lat <= 90;
}

function fillSelect(id, key) {
  const values = allFeatures.map(f => f.properties[key]);
  [...new Set(values.filter(Boolean))].sort().forEach(value => {
    $(id).add(new Option(value, value));
  });
}

function showDetails(feature) {
  const p = feature.properties;
  $('detail').replaceChildren();
  const fields = {
    'Farm code': p.id, 'Survey response': p.surveyId,
    'Activity': p.type, 'Village': p.village,
    'District': p.district, 'Ownership': p.ownership,
    'Method from survey': p.method,
    'Area (unit unspecified)': p.area,
    'GPS accuracy (m)': p.precision
  };
  for (const [label, value] of Object.entries(fields)) {
    const row = document.createElement('p');
    row.textContent = `${label}: ${value ?? 'Not reported'}`;
    $('detail').append(row);
  }
  if (p.sharedLocation || p.type === 'Crab Farm') {
    const note = document.createElement('p');
    note.textContent = p.type === 'Crab Farm'
      ? 'Activity conflicts with survey response; verify.'
      : 'Coordinates are shared with another record.';
    $('detail').append(note);
  }
}

function fitResults() {
  const bounds = farmLayer.getBounds();
  if (bounds.isValid()) map.fitBounds(bounds, {
    padding: [25, 25], maxZoom: 15
  });
}

function render() {
  const query = $('search').value.trim().toLowerCase();
  visibleFeatures = allFeatures.filter(feature => {
    const p = feature.properties;
    const matchDistrict = !$('district').value ||
      p.district === $('district').value;
    const matchActivity = !$('activity').value ||
      p.type === $('activity').value;
    const matchText = [p.id, p.village].some(value =>
      String(value ?? '').toLowerCase().includes(query));
    return matchDistrict && matchActivity && matchText;
  });
  farmLayer.clearLayers();
  markerById.clear();
  farmLayer.addData(visibleFeatures);
  $('results').replaceChildren();
  $('detail').textContent = 'Select a marker or a result.';
  const responses = new Set(visibleFeatures.map(f =>
    f.properties.surveyId).filter(Boolean));
  const mapped = visibleFeatures.filter(validPoint).length;
  $('count').textContent = `${visibleFeatures.length} records | ` +
    `${mapped} mapped | ${responses.size} survey responses`;
  if (!visibleFeatures.length) {
    $('results').textContent = 'No matching farm records.';
  }
  visibleFeatures.forEach(feature => {
    const p = feature.properties;
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = `${p.id} - ${p.village} - ${p.type}`;
    button.addEventListener('click', () => {
      showDetails(feature);
      const marker = markerById.get(p.id);
      if (marker) {
        map.setView(marker.getLatLng(), 16);
        marker.openPopup();
      }
    });
    $('results').append(button);
  });
}

async function init() {
  try {
    if (!window.L) throw new Error('Leaflet did not load.');
    map = L.map('map').setView([-6.16, 39.38], 10);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).on('tileerror', () => {
      $('status').textContent = 'Basemap unavailable. Check internet.';
    }).addTo(map);
    L.control.scale({ imperial: false }).addTo(map);
    farmLayer = L.geoJSON(null, {
      filter: validPoint,
      pointToLayer: (feature, latlng) => L.circleMarker(latlng, {
        radius: 7, color: 'white', weight: 1.5,
        fillColor: colors[feature.properties.type] || colors.Unspecified,
        fillOpacity: 0.9
      }),
      onEachFeature: (feature, marker) => {
        const p = feature.properties;
        const popup = document.createElement('div');
        popup.textContent = `${p.id} - ${p.village} - ${p.type}`;
        marker.bindPopup(popup);
        marker.on('click', () => showDetails(feature));
        markerById.set(p.id, marker);
      }
    }).addTo(map);
    const response = await fetch('data/farms.geojson');
    if (!response.ok) throw new Error(`Data HTTP ${response.status}`);
    const data = await response.json();
    if (data.type !== 'FeatureCollection' ||
        !Array.isArray(data.features)) throw new Error('Invalid GeoJSON');
    allFeatures = data.features;
    fillSelect('district', 'district');
    fillSelect('activity', 'type');
    $('search').addEventListener('input', render);
    ['district', 'activity'].forEach(id =>
      $(id).addEventListener('change', render));
    $('reset').addEventListener('click', () => {
      ['search', 'district', 'activity'].forEach(id => $(id).value = '');
      render(); fitResults();
    });
    $('fit').addEventListener('click', fitResults);
    render(); fitResults();
  } catch (error) {
    $('count').textContent = 'Atlas could not finish loading.';
    $('status').textContent = error.message +
      ' Use a local web server and check the Console and Network tabs.';
  }
}
init();
