# Student practical files

Follow the HTML course's Labs 1 to 4. Extract this archive before working.

Open `starter` in VS Code. It has a complete HTML scaffold, CSS and JavaScript work areas, and anonymous survey GeoJSON. Start a server in `starter` with `python3 -m http.server 8000` (macOS/Linux) or `py -m http.server 8000` (Windows). Visit http://localhost:8000, or use VS Code Live Server's supplied URL.

Use `checkpoints/02_map.js` or `checkpoints/03_markers.js` to check your progress: replace starter/app.js rather than loading both scripts. The final script is on the course's Lab 4 page. The reference solution has a separate download.

Leaflet and the basemap need internet. The 437 location records are not verified unique farms; they link to 301 survey responses. Personal identifiers are excluded. Coverage is primarily southern Unguja.

The optional prepare_geojson.py requires openpyxl and the original survey workbook. It uses the supplied September 2026 sheet/header schema and removes personal fields from output. Run it from this extracted archive's root:

`python3 prepare_geojson.py survey.xlsx --output starter/data/farms.geojson`

Use `py` instead of `python3` on Windows. The original workbook is not included.
