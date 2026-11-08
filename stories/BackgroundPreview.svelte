<script lang="ts">
import Background from '../src/lib/effects/Background.svelte';import{createSineWaves,createAmbientWaves}from'../src/lib/effects/ascii-patterns';
let{preset='sine',cellWidth=14,cellHeight=14,speed=.35,opacity=.2,color='#70cfff',fps=12,paused=false,seed=42,amplitude=100,wavelength=500,spacing=500,wavelengthVariability=.5,waveRandomness=.9,angle=-25,height=350}:{preset?:'sine'|'ambient';cellWidth?:number;cellHeight?:number;speed?:number;opacity?:number;color?:string;fps?:number;paused?:boolean;seed?:number;amplitude?:number;wavelength?:number;spacing?:number;wavelengthVariability?:number;waveRandomness?:number;angle?:number;height?:number}=$props();
const pattern=$derived(preset==='sine'?createSineWaves({seed,amplitude,wavelength,spacing,wavelengthVariability,waveRandomness,angle}):createAmbientWaves());
</script>
<div style:height={`${height}px`}><Background {pattern} {cellWidth} {cellHeight} {speed} {opacity} {color} {fps} {paused}/></div>
