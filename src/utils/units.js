// Temperature conversion and formatting helpers. Weatherstack gives us
// Celsius by default, so that's always the input here.

// Convert Celsius to Fahrenheit. No rounding so the caller can decide.
export function celsiusToFahrenheit(c) {
  return (c * 9) / 5 + 32;
}

// Format a Celsius number for display, converting to F if needed.
// Returns '—' if the input isn't a valid number. No degree symbol - the
// caller adds that so it can be styled separately.
export function formatTemp(c, units) {
  if (c === null || c === undefined || Number.isNaN(Number(c))) {
    return '—';
  }

  const value = units === 'F' ? celsiusToFahrenheit(Number(c)) : Number(c);
  return String(Math.round(value));
}
