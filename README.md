# Weather Unlimited

A React app that lets you look up live weather and flight info for any major airport. Weather comes from [Weatherstack](https://weatherstack.com), flights and airport search come from [Aviationstack](https://aviationstack.com). You can favorite airports so they show up in a dropdown at the top of the page.

---

## Features

- Search airports by city name or IATA code. The dropdown autocompletes as you type by calling the Aviationstack airports endpoint (debounced so it doesn't fire on every keystroke).
- Location page at `/location/:iata` fires the weather, arrivals, and departures requests at the same time.
- Weather details: temperature, feels-like, wind speed / direction / bearing, humidity, pressure, cloud cover, precipitation, UV index, visibility, day or night.
- °C / °F toggle inside the weather card. Your pick is saved to `localStorage`.
- Two short flight boards per location: 3 departures and 3 arrivals. Each row shows the flight number, airline, partner airport, scheduled time, and status.
- Click "Details" on a flight for a modal with the full info: aircraft, terminals, codeshares, live tracking if the plane is in the air.
- Favorites: one click to save an airport. Saved airports show up in a dropdown in the navbar and persist in `localStorage`.
- Recent searches show up inside the search dropdown when the input is focused.
- Home page has 6 suggested airports (JFK, LAX, LHR, HND, DXB, SYD) so you have somewhere to click if you don't know what to search.
- Light and dark mode button in the top-left of the navbar. Saved to `localStorage`.
- Errors (unknown airport, rate limit, paid-only endpoint) show a message with a retry button instead of crashing.
- Two routes using React Router: `/` and `/location/:iata`.

---

## Tools used

| Tool | What for |
|---|---|
| React 18 | UI |
| Vite | Dev server, bundler, and the API proxy |
| React Router v6 | Routing between Home and the location page |
| Weatherstack | Weather data |
| Aviationstack | Flights and airport search |
| CSS Modules | Component-scoped styles |
| `localStorage` | Storing favorites, recents, theme, and °C/°F preference |

---
## What's stored in localStorage

All four values use the same `useLocalStorage` hook (`src/hooks/useLocalStorage.js`), which `JSON.stringify`s on write and `JSON.parse`s on read. Keys are namespaced with `weather-unlimited:` so they don't collide with anything else on the same origin.

| Key | Set by | Shape | Default |
|---|---|---|---|
| `weather-unlimited:favorites` | `FavoritesContext` | Array of airport objects (`{ iata, city, country, ... }`) | `[]` |
| `weather-unlimited:recents` | `RecentsContext` | Array of airport objects, most recent first | `[]` |
| `weather-unlimited:theme` | `ThemeContext` | `"light"` or `"dark"` | `"light"` |
| `weather-unlimited:units` | `UnitsContext` | `"C"` or `"F"` | `"F"` |

A few details worth knowing:

- **Recents are deduped on insert.** If you visit an airport you've already searched, it gets pulled to the front of the list rather than appearing twice.
- **Favorites are deduped too.** Clicking the favorite button on an airport that's already saved is a no-op.
- **Theme is applied via `data-theme` on `<html>`.** The CSS variables in `index.css` switch based on that attribute, so the value flips the whole UI without re-rendering.
- **Writes are wrapped in `try/catch`.** Safari private mode throws on `localStorage.setItem`, so the hook silently ignores failures — the app still works, it just won't persist between reloads.
- **Nothing sensitive is stored.** API keys live in `.env` and never leave the Vite dev server; localStorage only holds UI preferences and airport metadata that's already public.
---

## API endpoints

The browser never calls the external APIs directly. It calls a proxy in `vite.config.js` that adds the access key on the server side.

| My endpoint | Proxies to | What it does |
|---|---|---|
| `/api/weather?query=London` | Weatherstack `/current` | Current weather for a city |
| `/api/flights?dep_iata=JFK` | Aviationstack `/v1/flights` | Departures from an airport |
| `/api/flights?arr_iata=JFK` | Aviationstack `/v1/flights` | Arrivals into an airport |
| `/api/airports?search=London` | Aviationstack `/v1/airports` | Airport search for the autocomplete dropdown |

The weather endpoint takes a `query` param which can be a city name, a `City,Country` string, or a `lat,lon` pair. The flights endpoint uses either `dep_iata` (for departures) or `arr_iata` (for arrivals) — never both. The airports endpoint takes a partial string and returns up to `limit` matches.

---

## Asynchronous fetching

The app does all network work asynchronously so the UI never blocks on a request.

- **Parallel requests on the location page.** `LocationDetail` needs three things — current weather, arrivals, and departures — and they're independent, so it fires them at the same time with `Promise.allSettled([...])`. `allSettled` (instead of `Promise.all`) means one failure doesn't take down the others: if Aviationstack is rate-limited, the weather card still renders and only the flight boards show an inline error.
- **Partial-result rendering.** State is stored as a single object with separate `weatherError` / `flightsError` fields, so each block decides on its own whether to render data or an error with a "Try again" button.
- **`useFetch` hook.** A small custom hook (`src/hooks/useFetch.js`) wraps the standard `data / error / loading` pattern. It tracks mount state with a ref and a `cancelled` flag in the effect cleanup, so if the component unmounts (or the dependency changes) before the promise resolves, the result is ignored — no setState-after-unmount warnings and no stale data flashing on screen.
- **Debounced autocomplete.** `SearchBar` doesn't fire a request on every keystroke. It waits until the input has been idle for a short window, then calls `/api/airports?search=...`. Old in-flight searches are cancelled when a newer keystroke arrives, so the dropdown only ever shows results for the latest query.
- **Retry on demand.** The "Try again" button on an `ErrorMessage` bumps an `attempt` counter that's part of the effect's deps, which re-runs the whole `Promise.allSettled` block.

---

## Getting started

### 1. Install

```bash
npm install
```

### 2. Run the dev server

npm run dev

Followed by opening http://localhost:5173/

## Project structure

```
weather-unlimited/
├── docs/
├── public/
│   └── header.png                      Home hero image
├── src/
│   ├── api/
│   │   ├── weather.js         Weatherstack wrapper
│   │   ├── flights.js         Aviationstack flights wrapper (arrivals and departures)
│   │   └── airports.js        Aviationstack airport search wrapper
│   ├── components/
│   │   ├── NavBar.jsx/.module.css          Top nav + favorites dropdown
│   │   ├── ThemeToggle.jsx/.module.css     Light / dark mode button
│   │   ├── UnitToggle.jsx/.module.css      °C / °F segmented control
│   │   ├── SearchBar.jsx/.module.css       Debounced airport autocomplete
│   │   ├── WeatherCard.jsx/.module.css     Gradient hero + details pills
│   │   ├── WeatherIcon.jsx/.module.css     Inline SVG icons keyed to weather description
│   │   ├── FlightList.jsx/.module.css      Arrivals or departures board
│   │   ├── FlightRow.jsx/.module.css
│   │   ├── FlightModal.jsx/.module.css     Popup with the full flight info
│   │   ├── FavoriteButton.jsx/.module.css
│   │   ├── LocationCard.jsx/.module.css
│   │   ├── HomeBackdrop.jsx/.module.css    Decorative image for the Home hero
│   │   ├── Loader.jsx/.module.css
│   │   └── ErrorMessage.jsx/.module.css
│   ├── context/
│   │   ├── FavoritesContext.jsx
│   │   ├── RecentsContext.jsx
│   │   ├── ThemeContext.jsx   Light / dark mode
│   │   └── UnitsContext.jsx   °C / °F preference
│   ├── data/
│   │   └── airports.js        The 6-airport seed list for the Home page
│   ├── hooks/
│   │   ├── useLocalStorage.js
│   │   └── useFetch.js        Async fetch wrapper with cancel-on-unmount
│   ├── pages/
│   │   ├── Home.jsx/.module.css
│   │   └── LocationDetail.jsx/.module.css   Fires weather + arrivals + departures in parallel
│   ├── utils/
│   │   ├── units.js           Temperature conversion + formatting
│   │   └── flightStatus.js    Maps a flight status string to the pill color class
│   ├── App.jsx                NavBar + route definitions
│   ├── index.css              Small reset + base typography
│   └── main.jsx               React entry, wires providers + router
├── .gitignore
├── index.html
├── package-lock.json
├── package.json
├── README.md
└── vite.config.js             Proxy that adds API keys on the server side
```

## Testing the API with `curl`

The app talks to both APIs through a small proxy in `vite.config.js` that adds the access keys on the server side. That's why the browser's Network tab only ever shows `/api/weather?...`, `/api/flights?...`, and `/api/airports?...` — no key in the URL.

You can hit those same proxy endpoints from the terminal. No keys needed as long as the dev server is running.

### Weather

```bash
# Current weather for a city
curl -s "http://localhost:5173/api/weather?query=London" | jq

# By IATA code
curl -s "http://localhost:5173/api/weather?query=JFK" | jq

# "City,Country" format (what LocationDetail actually uses)
curl -s "http://localhost:5173/api/weather?query=Tokyo%2CJapan" | jq

# Just the 'current' block (what the WeatherCard renders)
curl -s "http://localhost:5173/api/weather?query=Paris" | jq '.current'

# Trigger the "no matching location" error path
curl -s "http://localhost:5173/api/weather?query=zzzzzzzzz" | jq '.error'
```

### Flights

```bash
# Departures from JFK (the "Departing from" board)
curl -s "http://localhost:5173/api/flights?dep_iata=JFK&limit=20" | jq

# Arrivals into JFK (the "Arriving in" board)
curl -s "http://localhost:5173/api/flights?arr_iata=JFK&limit=20" | jq
```

### Airport search

```bash
# What SearchBar fires on each debounced keystroke
curl -s "http://localhost:5173/api/airports?search=London&limit=6" | jq

# Empty-result path (no airport matches)
curl -s "http://localhost:5173/api/airports?search=zzzzzzzzz&limit=6" | jq '.data | length'
```