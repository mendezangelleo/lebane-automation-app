import type { UnitsFormData } from '../pages/UnitsPage';

// List of available typologies expected in the system
const TYPOLOGIES = [
  'Baulera Propia',
  'Local',
  'Dos ambientes',
  'Cinco Ambientes',
  'Dos dormitorios'
];

/**
 * Helper to generate a random integer between min and max (inclusive).
 */
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Helper to pick a random item from an array.
 */
function randomItem<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Generates random data for Unit/Area creation.
 * Randomizes numerical values to ensure the system handles different inputs correctly.
 */
export function createRandomUnitsData(): UnitsFormData {
  return {
    pricePerM2: randomInt(1000, 5000).toString(),

    floors: randomInt(2, 12).toString(),

    unitsPerFloor: randomInt(2, 6).toString(),

    typologySearch: randomItem(TYPOLOGIES),
  };
}