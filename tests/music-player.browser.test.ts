import { afterEach, expect, test } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/svelte';
import { page, userEvent } from 'vitest/browser';
import type { MusicTrack } from '../src/lib';
import Fixture from './MusicPlayerFixture.svelte';
import { audioBlob } from './music-player-audio';

afterEach(async () => { cleanup(); await page.viewport(1280, 900); });
const songs = (): MusicTrack[] => ['One', 'Two', 'Three'].map((title, i) => ({ id: title, title, src: audioBlob(220 + i * 110) }));
const music = (root: ParentNode = document) => root.querySelector('audio') as HTMLAudioElement;
const title = () => screen.getByRole('status').textContent;
const playButton = () => within(screen.queryByRole('dialog') ?? document.body).getByRole('button', { name: 'Play music' });
async function open() { await userEvent.click(screen.getByRole('button', { name: 'Open cassette' })); }

test('shuffle is disabled for a single track even when requested initially', async () => {
  const tracks = songs();
  const view = render(Fixture, { tracks: tracks.slice(0, 1), shuffle: true });
  await open();
  const shuffle = screen.getByRole('button', { name: 'Turn shuffle on' }) as HTMLButtonElement;
  expect(shuffle.disabled).toBe(true);
  expect(shuffle.getAttribute('aria-pressed')).toBe('false');
  expect(screen.getByRole('button', { name: 'Next track' })).toBeDisabled();
  await view.rerender({ tracks });
  await expect.poll(() => screen.getByRole('button', { name: 'Turn shuffle off' }).getAttribute('aria-pressed')).toBe('true');
  expect(screen.getByRole('button', { name: 'Turn shuffle off' })).toBeEnabled();
});

test('music starts only on request and keeps playing when the cassette closes', async () => {
  render(Fixture, { tracks: songs() });
  const audio = music();
  expect(audio.getAttribute('src')).toBeNull();
  await open();
  expect(audio.getAttribute('src')).toBeNull();
  await userEvent.click(playButton());
  await expect.poll(() => !audio.paused && audio.currentTime > 0).toBe(true);
  const beforeClose = audio.currentTime;
  await userEvent.click(screen.getByRole('button', { name: 'Close cassette' }));
  await expect.poll(() => screen.queryByRole('dialog')).toBeNull();
  expect(audio.paused).toBe(false);
  expect(audio.currentTime).toBeGreaterThanOrEqual(beforeClose);
  await userEvent.click(screen.getByRole('button', { name: 'Pause' }));
  const position = audio.currentTime;
  expect(audio.paused).toBe(true);
  await userEvent.click(playButton());
  await expect.poll(() => audio.currentTime).toBeGreaterThan(position);
});

test('shuffle visits every track once per cycle and previous follows navigation history', async () => {
  render(Fixture, { tracks: songs(), shuffle: true });
  await open();
  const cycle = [title()];
  for (let i = 0; i < 2; i++) { await userEvent.click(screen.getByRole('button', { name: 'Next track' })); cycle.push(title()); }
  expect(new Set(cycle).size).toBe(3);
  await userEvent.click(screen.getByRole('button', { name: 'Previous track' }));
  expect(title()).toBe(cycle[1]);
  await userEvent.click(screen.getByRole('button', { name: 'Next track' }));
  expect(title()).toBe(cycle[2]);
  const second = [];
  for (let i = 0; i < 3; i++) { await userEvent.click(screen.getByRole('button', { name: 'Next track' })); second.push(title()); }
  expect(new Set(second).size).toBe(3);
  expect(second[0]).not.toBe(cycle[2]);
  expect(music().getAttribute('src')).toBeNull();
});

test('removing or replacing the current source reconciles playback and empty playlists safely', async () => {
  const tracks = songs();
  const view = render(Fixture, { tracks });
  await userEvent.click(playButton());
  await expect.poll(() => music().paused).toBe(false);
  const prior = music().src;
  await view.rerender({ tracks: tracks.slice(1) });
  await expect.poll(title).toBe('Two');
  await expect.poll(() => music().paused).toBe(false);
  expect(music().src).not.toBe(prior);
  const replaced = music().src;
  await view.rerender({ tracks: [{ ...tracks[1], src: audioBlob(500) }] });
  await expect.poll(() => music().src).not.toBe(replaced);
  await expect.poll(() => music().paused).toBe(false);
  await view.rerender({ tracks: [] });
  await expect.poll(title).toBe('No tracks');
  expect(music().paused).toBe(true);
  expect(playButton()).toBeDisabled();
  await open();
  expect(screen.getByRole('button', { name: 'Turn shuffle on' })).toBeDisabled();
});

test('owned Blob sources stop and are released when the player unmounts', async () => {
  const view = render(Fixture, { tracks: songs().slice(0, 1) });
  const audio = music();
  await userEvent.click(playButton());
  await expect.poll(() => audio.paused).toBe(false);
  const url = audio.currentSrc;
  expect((await fetch(url)).ok).toBe(true);
  view.unmount();
  expect(audio.paused).toBe(true);
  await expect(fetch(url)).rejects.toThrow();
});

test('a failed audio source can be replaced with a playable track', async () => {
  render(Fixture, { tracks: [{ id: 'bad', title: 'Bad audio', src: new Blob(['invalid'], { type: 'audio/wav' }) }, ...songs()] });
  await userEvent.click(playButton());
  await expect.poll(() => screen.queryByRole('alert')?.textContent).toContain('Audio could not be played.');
  await open();
  await userEvent.click(screen.getByRole('button', { name: 'Next track' }));
  await userEvent.click(playButton());
  await expect.poll(() => music().paused).toBe(false);
  expect(screen.queryByRole('alert')).toBeNull();
});

test('cassette contains focus on narrow screens and restores its own opener', async () => {
  await page.viewport(320, 568);
  render(Fixture, { tracks: songs() });
  const opener = screen.getByRole('button', { name: 'Open cassette' });
  await open();
  const dialog = screen.getByRole('dialog', { name: 'Music player' });
  expect(dialog.getBoundingClientRect().width).toBe(320);
  expect(dialog.getBoundingClientRect().bottom).toBeLessThanOrEqual(568);
  const close = screen.getByRole('button', { name: 'Close cassette' });
  const volume = screen.getByRole('slider', { name: 'Volume' });
  volume.focus();
  await userEvent.keyboard('{Tab}');
  expect(document.activeElement).toBe(close);
  await userEvent.keyboard('{Shift>}{Tab}{/Shift}');
  expect(document.activeElement).toBe(volume);
  close.focus();
  await userEvent.keyboard('{Escape}');
  await expect.poll(() => screen.queryByRole('dialog')).toBeNull();
  expect(document.activeElement).toBe(opener);
});

test('two players keep independent audio, dialogs and selection', async () => {
  const first = render(Fixture, { tracks: songs(), labels: { player: 'First player' } });
  const second = render(Fixture, { tracks: songs(), labels: { player: 'Second player' } });
  await userEvent.click(within(screen.getByRole('region', { name: 'First player' })).getByRole('button', { name: 'Play music' }));
  await userEvent.click(within(screen.getByRole('region', { name: 'Second player' })).getByRole('button', { name: 'Play music' }));
  await expect.poll(() => !music(first.container).paused && !music(second.container).paused).toBe(true);
  await userEvent.click(within(screen.getByRole('region', { name: 'First player' })).getByRole('button', { name: 'Open cassette' }));
  await userEvent.click(screen.getByRole('button', { name: 'Next track' }));
  expect(within(first.container).getByRole('status').textContent).toBe('Two');
  expect(within(second.container).getByRole('status', { hidden: true }).textContent).toBe('One');
});


test('a single track repeats with seek and duration still available', async () => {
  render(Fixture, { tracks: songs().slice(0, 1) });
  await open();
  await userEvent.click(playButton());
  await expect.poll(() => music().paused).toBe(false);
  const seek = screen.getByRole('slider', { name: 'Track position' });
  await expect.poll(() => (seek as HTMLInputElement).disabled).toBe(false);
  seek.focus();
  await userEvent.keyboard('{End}');
  await expect.poll(() => !music().paused && music().currentTime < 1).toBe(true);
  expect(seek).toBeEnabled();
});

test('rapid next-next-pause keeps the last selected track paused', async () => {
  render(Fixture, { tracks: songs() });
  await open();
  await userEvent.click(playButton());
  await expect.poll(() => music().paused).toBe(false);
  const next = screen.getByRole('button', { name: 'Next track' });
  next.click(); next.click();
  within(screen.getByRole('dialog')).getByRole('button', { name: 'Pause' }).click();
  await expect.poll(() => title()).toBe('Three');
  await expect.poll(() => music().paused).toBe(true);
  await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  expect(music().paused).toBe(true);
  expect(playButton()).toBeEnabled();
});

test('button feedback is one third volume and sliders or mute do not restart it', async () => {
  render(Fixture, { tracks: songs(), clickSound: audioBlob(600) });
  await open();
  const feedback = document.querySelectorAll('audio')[1];
  await expect.poll(() => !feedback.paused && feedback.currentTime > .1).toBe(true);
  expect(feedback.volume).toBeCloseTo(.333333, 5);
  await userEvent.click(playButton());
  await expect.poll(() => !music().paused && feedback.currentTime > .1).toBe(true);
  const beforeSeek = feedback.currentTime;
  screen.getByRole('slider', { name: 'Track position' }).focus();
  await userEvent.keyboard('{ArrowRight}');
  expect(feedback.currentTime).toBeGreaterThanOrEqual(beforeSeek);
  const beforeVolume = feedback.currentTime;
  screen.getByRole('slider', { name: 'Volume' }).focus();
  await userEvent.keyboard('{ArrowRight}');
  expect(feedback.currentTime).toBeGreaterThanOrEqual(beforeVolume);
  const beforeMute = feedback.currentTime;
  await userEvent.click(screen.getByRole('button', { name: 'Mute music' }));
  expect(feedback.currentTime).toBeGreaterThanOrEqual(beforeMute);
  expect(music().muted).toBe(true);
});

test('track changes are announced inside the active cassette modal', async () => {
  render(Fixture, { tracks: songs() });
  await open();
  const dialog = screen.getByRole('dialog', { name: 'Music player' });
  expect(within(dialog).getByRole('status')).toHaveTextContent('One');
  await userEvent.click(within(dialog).getByRole('button', { name: 'Next track' }));
  expect(within(dialog).getByRole('status')).toHaveTextContent('Two');
});

test('retry reloads a failed media resource at the same source', async () => {
  render(Fixture, { tracks: [{ id: 'retry', title: 'Retry', src: new Blob(['invalid'], { type: 'audio/wav' }) }] });
  await userEvent.click(playButton());
  await expect.poll(() => screen.queryByRole('alert')?.textContent).toContain('Audio could not be played.');
  let starts = 0;
  music().addEventListener('loadstart', () => starts++);
  await userEvent.click(screen.getByRole('button', { name: 'Retry playback' }));
  await expect.poll(() => starts).toBeGreaterThan(0);
});

test('removing the selected shuffled track does not repeat its fallback selection', async () => {
  const tracks = songs();
  const view = render(Fixture, { tracks, shuffle: true });
  await open();
  await userEvent.click(screen.getByRole('button', { name: 'Next track' }));
  const visited = title();
  const unvisited = tracks.find(item => item.title !== 'One' && item.title !== visited)!;
  await view.rerender({ tracks: [unvisited, tracks[0]] });
  expect(title()).toBe(unvisited.title);
  await userEvent.click(screen.getByRole('button', { name: 'Next track' }));
  expect(title()).toBe('One');
});

test('external media pause updates the transport and one press resumes playback', async () => {
  render(Fixture, { tracks: songs() });
  await userEvent.click(playButton());
  await expect.poll(() => !music().paused && music().currentTime > 0).toBe(true);
  const position = music().currentTime;
  music().pause(); // The same native pause event used by browser/OS media controls.
  await expect.poll(() => screen.queryByRole('button', { name: 'Play music' }) !== null).toBe(true);
  await userEvent.click(playButton());
  await expect.poll(() => !music().paused && music().currentTime > position).toBe(true);
});

test('pausing motion reveals a complete long title without horizontal clipping', async () => {
  await page.viewport(320, 568);
  const long = 'A very long recording title that must remain fully readable when animation is paused';
  render(Fixture, { tracks: [{ ...songs()[0], title: long }] });
  await open();
  await userEvent.click(screen.getByRole('button', { name: 'Pause animation' }));
  await userEvent.click(screen.getByRole('button', { name: 'Close cassette' }));
  const text = screen.getAllByText(long, { exact: true }).find(el => !el.closest('dialog') && el.getAttribute('role') !== 'status' && el.getAttribute('aria-hidden') !== 'true')!;
  const clip = text.parentElement!.parentElement!;
  expect(text.getBoundingClientRect().width).toBeLessThanOrEqual(clip.getBoundingClientRect().width + 1);
  expect(text.getBoundingClientRect().height).toBeGreaterThan(25);
});

test('external pause while playback is starting cancels quietly', async () => {
  render(Fixture, { tracks: songs() });
  playButton().click();
  music().pause();
  await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  expect(music().paused).toBe(true);
  expect(screen.queryByRole('alert')).toBeNull();
  expect(playButton()).toBeEnabled();
});

test('reel artwork toggles animation by click and keyboard without pausing music', async () => {
  render(Fixture, { tracks: songs() });
  await open();
  await userEvent.click(playButton());
  await expect.poll(() => !music().paused && music().currentTime > 0).toBe(true);
  const reels = screen.getByRole('button', { name: 'Pause animation' });
  expect(reels.getBoundingClientRect().width).toBeGreaterThanOrEqual(180);
  expect(reels.getBoundingClientRect().height).toBeGreaterThanOrEqual(80);
  await userEvent.click(reels);
  expect(screen.getByRole('button', { name: 'Resume animation' }).getAttribute('aria-pressed')).toBe('true');
  expect(music().paused).toBe(false);
  reels.focus();
  await userEvent.keyboard(' ');
  expect(screen.getByRole('button', { name: 'Pause animation' }).getAttribute('aria-pressed')).toBe('false');
  expect(music().paused).toBe(false);
});
