/** Coordinates and dimensions are CSS pixels; time is seconds multiplied by speed. */
export interface AsciiPatternContext {
  x: number; y: number; column: number; row: number;
  width: number; height: number; columns: number; rows: number;
  cellWidth: number; cellHeight: number; time: number;
}
export interface AsciiCell { character: string; opacity?: number }
/** Return null for an empty cell. Keep this function pure: it runs once per cell per frame. */
export type AsciiPattern = (context: AsciiPatternContext) => AsciiCell | null;

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const positive = (value: number, fallback: number) => Number.isFinite(value) && value > 0 ? value : fallback;
function ramp(characters: string) {
  const glyphs = Array.from(characters || ' ');
  return (value: number): AsciiCell => {
    const brightness = clamp(value);
    return { character: glyphs[Math.min(glyphs.length - 1, Math.floor(brightness * glyphs.length))], opacity: .15 + .85 * brightness };
  };
}

/** The original ambient interference pattern. */
export function createAmbientWaves({ scale = 1, characters = ' .:-=+*#' } = {}): AsciiPattern {
  const s = positive(scale, 1), sample = ramp(characters);
  return ({ x, y, time }) => sample((1 + (Math.sin(x / (150 * s) + time) + Math.sin(y / (100 * s) - time * .63) + Math.sin((x + y) / (190 * s) + time * .37)) / 3) / 2);
}

/** Rotated parallel bands whose center lines follow a traveling sine wave. */
export function createSineWaves({ angle = -25, amplitude = 36, wavelength = 240, wavelengthVariability = 0, waveRandomness = 0, seed = 1, spacing = 90, characters = ' .:-=+*#' } = {}): AsciiPattern {
  const radians = (Number.isFinite(angle) ? angle : -25) * Math.PI / 180;
  const cos = Math.cos(radians), sin = Math.sin(radians);
  const length = positive(wavelength, 240), gap = positive(spacing, 90);
  const height = Number.isFinite(amplitude) ? amplitude : 36;
  const variability = Number.isFinite(wavelengthVariability) ? clamp(wavelengthVariability) : 0;
  const randomness = Number.isFinite(waveRandomness) ? clamp(waveRandomness) : 0;
  const seedValue = Number.isFinite(seed) ? seed | 0 : 1;
  // Stateless integer hash: repeatable for negative indices and arbitrary time jumps.
  const randomAt = (index: number) => {
    let value = Math.imul(index | 0, 0x45d9f3b) ^ seedValue;
    value = Math.imul(value ^ (value >>> 16), 0x45d9f3b);
    value = Math.imul(value ^ (value >>> 16), 0x45d9f3b);
    return ((value ^ (value >>> 16)) >>> 0) / 4294967295 * 2 - 1;
  };
  const sample = ramp(characters);
  return ({ x, y, time }) => {
    const u = x * cos + y * sin, v = -x * sin + y * cos;
    // Continuous transverse coordinate avoids seams from rounding to a band index.
    // Both coordinates travel with the pattern, keeping each region consistent.
    const across = v / gap - time * .35 / (Math.PI * 2);
    let randomShift = 0;
    if (randomness > 0) {
      const index = Math.floor(across), fraction = across - index;
      // Smooth interpolation, with zero slope at boundaries, prevents band seams.
      const blend = fraction * fraction * (3 - 2 * fraction);
      const left = randomAt(index), right = randomAt(index + 1);
      randomShift = (left + (right - left) * blend) * randomness * Math.PI;
    }
    const phase = u / length * Math.PI * 2 - time + randomShift;
    // Modulate traveling phase, not frame time: each stretched region travels intact.
    // The derivative along the traveling phase stays in [0.25, 1.75].
    const warped = variability === 0 ? phase : phase + variability * (
      .5 / .37 * Math.sin(.37 * phase + .8) + .25 / .79 * Math.sin(.79 * phase - 1.2)
    );
    const center = height * Math.sin(warped);
    const band = (1 + Math.cos((v - center) / gap * Math.PI * 2 - time * .35)) / 2;
    return sample(band ** 3);
  };
}

export const defaultAsciiPattern = createAmbientWaves();
