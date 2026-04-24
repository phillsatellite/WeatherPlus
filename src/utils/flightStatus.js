// Aviationstack's flight_status field can be wrong - flights sometimes stay
// "scheduled" after takeoff or "active" after they've landed. This compares
// the reported status against the clock and fixes the obvious cases.

const TRUSTED_TERMINAL = new Set(['cancelled', 'diverted', 'incident', 'landed']);

// Pick a status to show. Never returns undefined - defaults to 'scheduled'.
export function deriveFlightStatus(flight) {
  const reported = flight?.flight_status || 'scheduled';

  // Trust these states as-is.
  if (TRUSTED_TERMINAL.has(reported)) return reported;

  const now = Date.now();

  // If the plane should already be on the ground, say it landed.
  const arrivalTime = pickTime(
    flight?.arrival?.actual,
    flight?.arrival?.estimated,
    flight?.arrival?.scheduled
  );
  if (arrivalTime != null && arrivalTime <= now) return 'landed';

  // If it's past the departure time, it's in the air.
  const departureTime = pickTime(
    flight?.departure?.actual,
    flight?.departure?.estimated,
    flight?.departure?.scheduled
  );
  if (departureTime != null && departureTime <= now) return 'active';

  return reported;
}

// Returns the first valid timestamp (ms since epoch), or null.
function pickTime(...candidates) {
  for (const c of candidates) {
    if (!c) continue;
    const t = Date.parse(c);
    if (!Number.isNaN(t)) return t;
  }
  return null;
}
