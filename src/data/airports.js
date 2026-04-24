// Hardcoded list of airports used for the "Suggested Locations" grid on
// Home. Just 6 popular hubs to show new visitors with no favorites yet.
// Shape matches what the API wrapper's normalize() returns.

const SUGGESTED = [
  { iata: 'JFK', city: 'New York',    name: 'John F. Kennedy International', country: 'United States' },
  { iata: 'LAX', city: 'Los Angeles', name: 'Los Angeles International',     country: 'United States' },
  { iata: 'LHR', city: 'London',      name: 'Heathrow',                      country: 'United Kingdom' },
  { iata: 'HND', city: 'Tokyo',       name: 'Haneda',                        country: 'Japan' },
  { iata: 'DXB', city: 'Dubai',       name: 'Dubai International',           country: 'United Arab Emirates' },
  { iata: 'SYD', city: 'Sydney',      name: 'Kingsford Smith',               country: 'Australia' },
];

// Returns the suggested list.
export function getSuggestedAirports() {
  return SUGGESTED;
}
