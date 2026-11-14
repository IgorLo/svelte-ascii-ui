import type { Meta, StoryObj } from '@storybook/svelte-vite';
import { MusicPlayer } from '../src/lib';
import one from './assets/music-player-1.wav?url';
import two from './assets/music-player-2.wav?url';
import three from './assets/music-player-3.wav?url';
import clickSound from './assets/music-player-press.wav?url';
const tracks = [
  { id: 'window', title: 'Light in the window', artist: 'Ambient demo', src: one },
  { id: 'rain', title: 'Rain beyond the glass', artist: 'Ambient demo', src: two },
  { id: 'stay', title: 'You can stay a little longer', artist: 'Ambient demo', src: three },
];
const meta = {
  title: 'Media/MusicPlayer', component: MusicPlayer, tags: ['autodocs'],
  args: { tracks, shuffle: false, volume: .4, clickSound, clickVolume: 1 / 3 },
  argTypes: { shuffle: { control: 'boolean' }, volume: { control: { type: 'range', min: 0, max: 1, step: .01 } }, clickVolume: { control: { type: 'range', min: 0, max: 1, step: .01 } } },
} satisfies Meta<typeof MusicPlayer>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playlist: Story = {};
export const SingleTrack: Story = { args: { tracks: tracks.slice(0, 1), shuffle: true } };
export const Empty: Story = { args: { tracks: [] } };
export const Shuffled: Story = { args: { shuffle: true } };
export const SilentButtons: Story = { args: { clickSound: undefined } };
export const LongTitle: Story = { args: { tracks: [{ ...tracks[0], title: 'A long track title that keeps the little cassette moving through a quiet evening by the window' }] } };
export const UnavailableAudio: Story = { args: { tracks: [{ id: 'unavailable', title: 'Unavailable recording', src: '/missing-music-player-demo.wav' }] } };
