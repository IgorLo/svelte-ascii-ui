<script lang="ts">
  import { onMount, tick } from 'svelte';
  import AsciiBackground from '../src/lib/effects/Background.svelte';
  import { createSineWaves, type AsciiPattern } from '../src/lib/effects/ascii-patterns';
  let paused = $state(false), opacity = $state(.35), outside = $state(false);
  let result = $state('Running component checks…');
  let host: HTMLDivElement;
  let frames = 0, lastTime = 0;
  const sine = createSineWaves();
  const pattern: AsciiPattern = context => {
    if (!context.row && !context.column) { frames++; lastTime = context.time; }
    return sine(context);
  };
  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  onMount(() => {
    let active = true;
    void (async () => {
      const checks: Record<string, unknown> = {};
      await wait(300); if (!active) return;
      frames = 0; const timeBefore = lastTime;
      await wait(2000); if (!active) return;
      checks.framesIn2SecondsAt12fps = frames;
      checks.timeAdvanced = lastTime - timeBefore;
      checks.cadencePass = frames >= 21 && frames <= 26 && lastTime - timeBefore > .6 && lastTime - timeBefore < .8;
      paused = true; await tick(); await wait(100); frames = 0;
      await wait(300); checks.pausePass = frames === 0;
      const canvas = host.querySelector('canvas')!;
      const ctx = canvas.getContext('2d')!;
      const reference = document.createElement('canvas'); reference.width = canvas.width; reference.height = canvas.height;
      const ref = reference.getContext('2d')!;
      const ratio = Math.min(devicePixelRatio,2), width = 560, height = 240, dx = 14, dy = 18;
      ref.setTransform(ratio,0,0,ratio,0,0);ref.font=`${Math.min(dx*1.3,dy*.8)}px monospace`;ref.textAlign='center';ref.textBaseline='middle';ref.fillStyle='#c4ed83';
      const columns=Math.ceil(width/dx),rows=Math.ceil(height/dy);
      for(let row=0;row<rows;row++)for(let column=0;column<columns;column++){
        const x=(column+.5)*dx,y=(row+.5)*dy;
        const cell=sine({x,y,column,row,width,height,columns,rows,cellWidth:dx,cellHeight:dy,time:lastTime});
        if(cell){ref.globalAlpha=.35*(cell.opacity??1);ref.fillText(cell.character,x,y);}
      }
      const before=ref.getImageData(0,0,canvas.width,canvas.height).data,after=ctx.getImageData(0,0,canvas.width,canvas.height).data;
      checks.differentPixelChannels=before.reduce((n,v,i)=>n+Number(v!==after[i]),0);
      checks.pixelsPass=checks.differentPixelChannels===0;
      paused=false; opacity=0; await tick(); await wait(100);frames=0;
      await wait(300);checks.transparentPass=frames===0;
      opacity=.35;outside=true;await tick();await wait(150);frames=0;
      await wait(300);checks.offscreenPass=frames===0;
      outside=false;await tick();await wait(200);checks.resumePass=frames>0;
      paused=true;
      checks.complete=true;
      checks.allPassed=Object.entries(checks).filter(([key])=>key.endsWith('Pass')).every(([,value])=>value===true);
      result=JSON.stringify(checks,null,2);
    })();
    return () => {active=false;};
  });
</script>
<h1>Actual component verification</h1><pre id="results">{result}</pre>
<div bind:this={host} style:margin-top={outside ? '200vh' : '0'} style="width:560px;height:240px"><AsciiBackground {pattern} {paused} {opacity} fps={12} /></div>
