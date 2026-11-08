export type Palette = 'phosphor' | 'paper' | 'plum';
export interface ThemeColors { background: string; surface: string; text: string; muted: string; accent: string; danger: string; warning: string }
export const palettes: Record<Palette, ThemeColors> = {
  phosphor: { background:'#181c19',surface:'#202621',text:'#e2e6d9',muted:'#a7b29e',accent:'#c4ed83',danger:'#ffb6a8',warning:'#e6d99b' },
  paper: { background:'#eee9dc',surface:'#e4dece',text:'#2e332c',muted:'#5d6556',accent:'#465d36',danger:'#993e2e',warning:'#775515' },
  plum: { background:'#251e2c',surface:'#302638',text:'#ede1e4',muted:'#b9a7bd',accent:'#e6b1d7',danger:'#ffb5a4',warning:'#e8d29e' },
};
export function asciiFrame(color: string, opacity = 1, stroke = 1): string {
  const safe = color.replace(/[<>&"']/g, '');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36"><path fill="none" stroke="${safe}" stroke-opacity="${opacity}" stroke-width="${stroke}" d="M3 6h6M6 3v6M27 6h6M30 3v6M3 30h6M6 27v6M27 30h6M30 27v6M15 6h6M15 30h6M6 15v6M30 15v6"/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}
export function themeStyle(colors: ThemeColors): string {
  const entries: Record<string,string> = {bg:colors.background,surface:colors.surface,text:colors.text,muted:colors.muted,accent:colors.accent,danger:colors.danger,warning:colors.warning,line:colors.muted,
    'ascii-frame-compact':asciiFrame(colors.muted,1,1.4),'ascii-button-compact':asciiFrame(colors.muted,1,1.4),'ascii-accent-compact':asciiFrame(colors.accent,1,1.4),'ascii-error-compact':asciiFrame(colors.danger,1,1.4),
    'ascii-frame':asciiFrame(colors.muted),'ascii-muted':asciiFrame(colors.muted,.48),'ascii-button':asciiFrame(colors.muted,.85),'ascii-accent':asciiFrame(colors.accent),'ascii-error':asciiFrame(colors.danger),'ascii-focus':asciiFrame(colors.text,1,2.2)};
  return Object.entries(entries).map(([key,value])=>`--${key}:${value}`).join(';');
}
