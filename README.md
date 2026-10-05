# Zanzibar Aquaculture Atlas Course

A complete static teaching website: six lecture lessons, four practical labs, downloadable student files, a reference atlas, an assessment rubric and instructor guidance. All reading material is HTML. No PDF viewer, build tool, framework, package manager, login or backend is needed.

## Publish with GitHub Pages

1. Extract the project ZIP. Open the `zanzibar-aquaculture-course` folder.
2. Create an empty GitHub repository, for example `zanzibar-aquaculture-course`.
3. Push this folder's contents to the repository. `index.html` must be at the repository root. Use your actual username and repository name in the remote URL.

```bash
git init
git add .
git commit -m "Add Zanzibar aquaculture web mapping course"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/zanzibar-aquaculture-course.git
git push -u origin main
```

4. In GitHub, open **Settings → Pages**. Choose **Deploy from a branch**, select **main** and **/(root)**, then save.
5. When GitHub shows the published Pages URL, share that URL with students. Do not share the repository code URL as the course homepage.

Typical project URL pattern, shown only as a placeholder:

`https://YOUR_USERNAME.github.io/zanzibar-aquaculture-course/`

Share individual pages by appending `lessons/01-html.html` or `labs/01-layout.html`. Every local link and asset uses a relative path so the site works under a repository subdirectory. The root `.nojekyll` file is included. Check your account/repository's GitHub Pages availability if the Pages setting is unavailable.

For browser uploads instead of Git, upload the contents of this folder to the repository root. Retain `.nojekyll`; Git is the easiest way to include it.

Official publishing instructions: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Preview locally

From this repository folder:

```bash
# macOS/Linux
python3 -m http.server 8000
# Windows with the Python launcher
py -m http.server 8000
```

Visit http://localhost:8000. VS Code Live Server is also supported. Use its supplied URL. Stop the Python server with Ctrl+C. If port 8000 is taken, use another port and browse that port.

## Edit the course

- `index.html`: course home and lesson/lab overview.
- `lessons/`: six complete lesson pages.
- `labs/`: four step-by-step practical pages with copyable code.
- `assets/course.css`: course theme and responsive layout.
- `assets/course.js`: copy buttons, mobile menu and device-local study checklist.
- `resources.html`: downloads, setup and technical references.
- `assessment.html`: submission requirements, rubric and troubleshooting.
- `instructor.html`: schedule and teaching guidance.
- `demo/`: working reference atlas with its own HTML/CSS/JavaScript/GeoJSON.
- `downloads/`: student starter ZIP, reference solution ZIP and GeoJSON.

Edit HTML directly. There is no generation/build step. If you change the demo's source files, also update the reference solution ZIP and any corresponding code examples so the course stays consistent. `scripts/package-downloads.py` refreshes the downloadable ZIP files; it requires only Python's standard library.

The core course pages remain readable if JavaScript is disabled. Copy controls and study-progress tracking are optional enhancements. Clipboard copying works on HTTPS GitHub Pages; when it is unavailable, the button selects the code for manual copying. Study progress is kept only in the student's browser and is not a grade or a record sent to an instructor.

## Data and access

The dataset contains 437 location records linked to 301 responses from the supplied September 2026 survey: 407 seaweed, 18 sea cucumber, 1 crab, and 11 unspecified activities. Ten records share exact coordinates. The crab label conflicts with response-level activity and is flagged. Area units in the location-sheet header are unspecified. Coverage is primarily southern Unguja; do not present this as a complete Zanzibar farm inventory.

Personal names, contact numbers, photographs, enumerator details and submission identifiers are excluded. The original workbook is not included. Exact locations may still require controlled sharing; review your permissions before publishing this data to a public repository. GitHub Pages is a static publisher, so all included files should be treated as accessible to the site's audience. It does not provide a private submission or authentication system for this course.

The course stylesheet and scripts use local assets. The atlas demo needs internet for Leaflet 1.9.4 and OpenStreetMap tiles. Keep attribution visible and review the tile provider's policy before wider public use. Do not bulk-download OSM tiles for offline use.

## Technical references

- Leaflet: https://leafletjs.com/reference.html
- MDN network requests: https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Network_requests
- GeoJSON RFC 7946: https://www.rfc-editor.org/rfc/rfc7946.html
- OSM tile policy: https://operations.osmfoundation.org/policies/tiles/

## Fieldwork page and member profiles

`fieldwork.html` presents the study context, recorded collection structure, confirmed tools, descriptive findings and atlas preparation steps. It distinguishes verified export evidence from unconfirmed field protocols and student analyses.

To add confirmed members, put their photo files in `assets/team/`, then edit `data/team.json`. Use an array of profiles like this template; replace every example value with confirmed information:

```json
[
  {
    "name": "Confirmed member name",
    "photo": "assets/team/member-photo.jpg",
    "program": "Confirmed academic program",
    "institution": "Confirmed institution",
    "role": "Confirmed field role"
  }
]
```

Use photographs the members have agreed to share. Omit `photo` when no photograph is available; no stock portrait is substituted. The page stays readable if the team data cannot load. Serve through HTTP/HTTPS to load team.json. Add collection-platform/device names, field protocol and student analyses directly to fieldwork.html after confirmation.
