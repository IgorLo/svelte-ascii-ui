// Original PCM audio: real browser playback without network or media-method mocks.
export function audioBlob(frequency = 220, seconds = 8): Blob {
  const rate = 8000, count = rate * seconds;
  const buffer = new ArrayBuffer(44 + count * 2), view = new DataView(buffer);
  function text(offset: number, value: string) {
    for (let i = 0; i < value.length; i++) view.setUint8(offset + i, value.charCodeAt(i));
  }
  text(0, 'RIFF'); view.setUint32(4, 36 + count * 2, true); text(8, 'WAVEfmt ');
  view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true);
  view.setUint32(24, rate, true); view.setUint32(28, rate * 2, true);
  view.setUint16(32, 2, true); view.setUint16(34, 16, true); text(36, 'data'); view.setUint32(40, count * 2, true);
  for (let i = 0; i < count; i++) view.setInt16(44 + i * 2, Math.round(Math.sin(2 * Math.PI * frequency * i / rate) * 1200), true);
  return new Blob([buffer], { type: 'audio/wav' });
}
