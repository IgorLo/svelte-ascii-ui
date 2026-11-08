import { createSineWaves } from '../src/lib/effects/ascii-patterns.ts';
const stage = document.querySelector('#stage'), results = document.querySelector('#results');
const nextFrame = () => new Promise(requestAnimationFrame);
const median = a => [...a].sort((a,b)=>a-b)[Math.floor(a.length/2)];
const p95 = a => [...a].sort((a,b)=>a-b)[Math.floor(a.length*.95)];
const round = n => Math.round(n*1000)/1000;
document.querySelector('#run').onclick = async () => {
  document.querySelector('#run').disabled = true;
  const report = { userAgent:navigator.userAgent, dpr:devicePixelRatio, results:[] };
  for (const [width,height] of [[960,300],[1920,1080]]) {
    for (const mode of ['fillText','skip-empty','sprites','DOM']) {
      stage.replaceChildren(); stage.style.width=width+'px'; stage.style.height=height+'px';
      const dx=14,dy=18,columns=Math.ceil(width/dx),rows=Math.ceil(height/dy),ratio=Math.min(devicePixelRatio,2);
      const fontSize=Math.min(dx*1.3,dy*.8),font=`${fontSize}px monospace`, color='#c4ed83';
      const pattern=createSineWaves(), points=[], spans=[], sprites=new Map();
      let canvas,ctx;
      if(mode!=='DOM') {
        canvas=document.createElement('canvas'); canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);
        canvas.style.width=width+'px';canvas.style.height=height+'px';stage.append(canvas);
        ctx=canvas.getContext('2d');ctx.setTransform(ratio,0,0,ratio,0,0);ctx.font=font;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=color;
      }
      for(let row=0;row<rows;row++) for(let column=0;column<columns;column++) {
        points.push({x:(column+.5)*dx,y:(row+.5)*dy,row,column,width,height,rows,columns,cellWidth:dx,cellHeight:dy,time:0});
        if(mode==='DOM') {const s=document.createElement('span');s.className='cell';s.style.cssText=`left:${column*dx}px;top:${row*dy}px;width:${dx}px;height:${dy}px;line-height:${dy}px;font-family:monospace;font-size:${fontSize}px;color:${color}`;stage.append(s);spans.push(s);}
      }
      if(mode==='sprites') for(const c of ' .:-=+*#') {
        const s=document.createElement('canvas');s.width=Math.ceil(dx*ratio);s.height=Math.ceil(dy*ratio);
        const sc=s.getContext('2d');sc.setTransform(ratio,0,0,ratio,0,0);sc.font=font;sc.textAlign='center';sc.textBaseline='middle';sc.fillStyle=color;sc.fillText(c,dx/2,dy/2);sprites.set(c,s);
      }
      const compute=[], draw=[], intervals=[];let previous=await nextFrame();
      for(let f=0;f<70;f++) {
        const now=await nextFrame(); if(f>=10) intervals.push(now-previous);previous=now;
        const t=performance.now();
        const cells=points.map(p=>pattern({...p,time:f/24*.35}));
        const computed=performance.now();
        ctx?.clearRect(0,0,width,height);
        for(let i=0;i<cells.length;i++) {
          const c=cells[i],p=points[i];
          if(mode==='DOM') {if(spans[i].textContent!==c.character)spans[i].textContent=c.character;spans[i].style.opacity=String(c.opacity*.35);}
          else {if(mode==='skip-empty' && (c.character===' ' || !c.character || c.opacity===0))continue;ctx.globalAlpha=c.opacity*.35;if(mode==='sprites'){const s=sprites.get(c.character);ctx.drawImage(s,p.x-dx/2,p.y-dy/2,s.width/ratio,s.height/ratio);}else ctx.fillText(c.character,p.x,p.y);}
        }
        // Include pending style/layout work for DOM; raster/GPU completion is NOT measured.
        void stage.offsetHeight;
        if(f>=10) {compute.push(computed-t);draw.push(performance.now()-computed);}
      }
      report.results.push({mode,width,height,cells:points.length,computeMedianMs:round(median(compute)),updateMedianMs:round(median(draw)),updateP95Ms:round(p95(draw)),frameIntervalMedianMs:round(median(intervals)),frameIntervalP95Ms:round(p95(intervals))});
      results.textContent=JSON.stringify(report,null,2);
    }
  }
  stage.replaceChildren(); results.textContent=JSON.stringify({...report,complete:true},null,2); document.querySelector('#run').disabled=false;
};
