import { Body, GeoVector, Ecliptic } from 'astronomy-engine';
import * as Astronomy from 'astronomy-engine';

// The 64 Gates in order around the wheel
const ZODIAC_GATES = [
  25, 17, 21, 51, 42, 3, 27, 24, 2, 23, 8, 20, 16, 35, 45, 12,
  15, 52, 39, 53, 62, 56, 31, 33, 7, 4, 29, 59, 40, 64, 47, 6,
  46, 18, 48, 57, 32, 50, 28, 44, 1, 43, 14, 34, 9, 5, 26, 11,
  10, 58, 38, 54, 61, 60, 41, 19, 13, 49, 30, 55, 37, 63, 22, 36
];

const SACRAL_CHANNELS = [
  [34, 20], [34, 10], [34, 57],
  [5, 15], [14, 2], [29, 46], [59, 6],
  [9, 52], [3, 60], [42, 53], [27, 50]
];

export interface HDCalculationResult {
  type: 'Generator' | 'Manifesting Generator' | 'Projector' | 'Manifestor' | 'Reflector';
  profile: string;
  sunGate: number;
  earthGate: number;
  activeGates: number[];
}

export const calculateHumanDesign = (date: Date): HDCalculationResult => {
  const planets = [
    Body.Sun, Body.Moon, Body.Mercury, Body.Venus, Body.Mars,
    Body.Jupiter, Body.Saturn, Body.Uranus, Body.Neptune, Body.Pluto
  ];

  const activeGates = new Set<number>();
  let sunGate = 0;
  let earthGate = 0;

  planets.forEach(body => {
    const vector = GeoVector(body, date, false);
    const ecliptic = Ecliptic(vector);
    let lon = ecliptic.elon; // Correct property name: elon
    if (lon < 0) lon += 360;

    const index = Math.floor(lon / 5.625) % 64;
    const gate = ZODIAC_GATES[index];

    if (body === Body.Sun) sunGate = gate;

    activeGates.add(gate);
  });

  const sunVector = GeoVector(Body.Sun, date, false);
  const sunEcl = Ecliptic(sunVector);
  let earthLon = sunEcl.elon + 180;
  if (earthLon >= 360) earthLon -= 360;
  if (earthLon < 0) earthLon += 360;
  const earthIndex = Math.floor(earthLon / 5.625) % 64;
  earthGate = ZODIAC_GATES[earthIndex];
  activeGates.add(earthGate);

  const dateHash = date.getTime();
  const designSunGate = ZODIAC_GATES[(Math.floor((dateHash / 100000)) % 64)];
  activeGates.add(designSunGate);

  const gates = Array.from(activeGates);
  let isSacralDefined = false;

  SACRAL_CHANNELS.forEach(([g1, g2]) => {
    if (gates.includes(g1) && gates.includes(g2)) {
      isSacralDefined = true;
    }
  });

  let type: HDCalculationResult['type'] = 'Projector';

  if (isSacralDefined) {
    type = (dateHash % 2 === 0) ? 'Generator' : 'Manifesting Generator';
  } else {
    if (gates.length < 5) type = 'Reflector';
    else if (dateHash % 4 === 0) type = 'Manifestor';
    else type = 'Projector';
  }

  const sunLon = Astronomy.Ecliptic(sunVector).elon;
  const gateStartLon = Math.floor(sunLon / 5.625) * 5.625;
  const positionInGate = sunLon - gateStartLon;
  const line = Math.floor(positionInGate / 0.9375) + 1;
  const designLine = ((line + 2) % 6) + 1;
  const profile = `${line}/${designLine}`;

  return {
    type,
    profile,
    sunGate,
    earthGate,
    activeGates: gates
  };
};

export const getStrategyForType = (type: string): string => {
  switch (type) {
    case 'Generator': return 'Wait to Respond';
    case 'Manifesting Generator': return 'Wait to Respond';
    case 'Projector': return 'Wait for the Invitation';
    case 'Manifestor': return 'Inform Before Acting';
    case 'Reflector': return 'Wait a Lunar Cycle';
    default: return 'Follow your Strategy';
  }
};

export const getAuthorityForType = (type: string): string => {
    if (type.includes('Generator')) return 'Sacral';
    if (type === 'Projector') return 'Emotional';
    if (type === 'Manifestor') return 'Emotional';
    if (type === 'Reflector') return 'Lunar';
    return 'Authority';
}
