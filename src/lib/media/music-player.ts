import type { HTMLAttributes } from 'svelte/elements';

export interface MusicTrack {
  /** Stable, unique identity within the playlist. */
  id: string;
  title: string;
  artist?: string;
  /** An audio URL, imported asset URL, Blob or File. */
  src: string | Blob;
}

export const musicPlayerLabels = {
  player: 'Music player', open: 'Open cassette', close: 'Close cassette',
  play: 'Play music', pause: 'Pause', previous: 'Previous track', next: 'Next track',
  shuffleOn: 'Turn shuffle on', shuffleOff: 'Turn shuffle off',
  mute: 'Mute music', unmute: 'Unmute music', volume: 'Volume', seek: 'Track position',
  progress: 'Track progress', side: 'Side A', quiet: 'Quiet', loud: 'Loud',
  empty: 'No tracks', untitled: 'Untitled track', error: 'Audio could not be played.',
  retry: 'Retry playback', pauseMotion: 'Pause animation', resumeMotion: 'Resume animation',
} as const;
export type MusicPlayerLabels = { [Key in keyof typeof musicPlayerLabels]: string };
export interface MusicPlayerProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  tracks?: readonly MusicTrack[];
  /** Initial shuffle state; bind to observe or change it from the host. */
  shuffle?: boolean;
  /** Music volume from 0 to 1, independent of feedback sounds. */
  volume?: number;
  /** Optional button feedback audio. Omit for silent buttons. */
  clickSound?: string | Blob;
  clickVolume?: number;
  labels?: Partial<MusicPlayerLabels>;
}

export function mediaLevel(value: number): number {
  return Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0;
}
