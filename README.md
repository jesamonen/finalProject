# Naija Explorer — Discover Nigeria

A responsive travel-discovery website built with **Node.js, Express, and modular vanilla JavaScript**. It is an educational starter project: destination descriptions, images, and budget estimates are illustrative and should be verified before real travel.

## Features

- Search destinations by name, state, category, and description.
- Filter by experience and state.
- Save favourite destinations in browser local storage.
- Build an itinerary, remove stops, estimate a budget, and export a `.txt` itinerary.
- Look up place coordinates through a small Express API endpoint backed by OpenStreetMap Nominatim.
- Convert currencies using a public reference-rate endpoint, with USD as a pivot so NGN can be converted when the service supplies both rates.
- Responsive layout and reduced-motion support.

## Requirements

- Node.js 18 or newer
- Internet connection for remote images, Google Fonts, location lookup, and exchange rates

## Run locally

1. Extract the project folder.
2. Open a terminal in the `naija-explorer` folder.
3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the app:

   ```bash
   npm start
   ```

5. Open `http://localhost:3000` in your browser.

For automatic server restarts while developing, run `npm run dev`.

## Project structure

```text
naija-explorer/
├── server.js
├── package.json
├── README.md
└── public/
    ├── index.html
    ├── css/
    │   └── styles.css
    └── js/
        ├── main.js
        ├── data/
        │   └── destinations.js
        └── modules/
            ├── Animation.js
            ├── CurrencyService.js
            ├── DestinationService.js
            ├── ImageService.js
            ├── ItineraryManager.js
            ├── LocationService.js
            ├── Storage.js
            └── UI.js
```

## Modular programming approach

- `DestinationService` owns destination lookup, searching, and filtering.
- `ItineraryManager` owns trip stops and estimated totals.
- `Storage` wraps local storage and safely handles unavailable storage.
- `CurrencyService` handles reference-rate conversion.
- `LocationService` calls the server-side geocoding endpoint.
- `ImageService` centralizes destination image selection.
- `UI` renders destination cards and itinerary rows.
- `Animation` handles reveal effects and toast messages.
- `main.js` connects modules to page events.
- `server.js` serves the frontend and exposes the location API.

## APIs and data notes

- **OpenStreetMap Nominatim** is used for geocoding. Follow its usage policy and avoid sending frequent automated requests.
- **Open ER API** is used for indicative exchange rates. It is an external service, so rate availability and uptime can change. Always verify rates before making spending decisions.
- Destination details, travel durations, costs, and image choices are starter content, not authoritative travel advice. Replace with researched, sourced information and verified image assets before submission or public launch.
- External image URLs are illustrative Unsplash images; some may change or be unavailable. Local, properly licensed images are recommended for a final release.

## Deployment note

This project needs a Node.js host (for example, Render) because it includes an Express server. GitHub Pages alone cannot run `server.js` or the `/api/geocode` endpoint. You can deploy the frontend and server together to a Node-compatible host.
