import type { Mark } from './types';

export function clamp(value: number, min: number, max: number) {
  return Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : min;
}

export function align(value: number, min: number, max: number, step: number | 'any') {
  if (step === 'any' || !Number.isFinite(step) || step <= 0) return clamp(value, min, max);
  const last = Math.floor((max - min) / step + 1e-10);
  const index = Math.min(last, Math.round((clamp(value, min, max) - min) / step));
  return clamp(Number((min + index * step).toPrecision(15)), min, max);
}

export function ratio(value: number, min: number, max: number) {
  return max > min ? (clamp(value, min, max) - min) / (max - min) : 0;
}

export function marksFor(marks: boolean | Mark[], min: number, max: number): Mark[] {
  const values = marks === true ? [{ value: min }, { value: (min + max) / 2 }, { value: max }] : marks || [];
  return [...new Map(values.filter(mark => mark.value >= min && mark.value <= max).map(mark => [mark.value, mark])).values()];
}
