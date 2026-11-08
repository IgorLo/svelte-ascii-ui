import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSineWaves } from '../src/lib/effects/ascii-patterns.ts';
const context = (x,y,time) => ({x,y,time,column:0,row:0,width:960,height:300,columns:69,rows:17,cellWidth:14,cellHeight:18});
test('zero variability preserves the original sine formula',()=>{
  const pattern=createSineWaves({angle:0,wavelengthVariability:0});
  for(let x=-100;x<1000;x+=17){
    const y=73,time=2.1;
    const center=36*Math.sin(x/240*Math.PI*2-time);
    const brightness=((1+Math.cos((y-center)/90*Math.PI*2-time*.35))/2)**3;
    const result=pattern(context(x,y,time));
    assert.equal(result.opacity,.15+.85*brightness);
  }
});
test('variability changes the pattern and is deterministic across calls and instances',()=>{
  const options={angle:0,wavelengthVariability:.8};
  const a=createSineWaves(options),b=createSineWaves(options),regular=createSineWaves({angle:0});
  const p=context(170,61,3);
  assert.deepEqual(a(p),b(p));
  a(context(999,222,400));
  assert.deepEqual(a(p),b(p));
  assert.notEqual(a(p).opacity,regular(p).opacity);
});
test('long and short regions travel with the wave, independent of frame history',()=>{
  const pattern=createSineWaves({angle:0,wavelengthVariability:1,waveRandomness:.8,seed:42});
  for(let x=-500;x<1000;x+=23){
    const dt=1.7,p=context(x,63,2);
    const shifted=context(x+240*dt/(Math.PI*2),63+90*.35*dt/(Math.PI*2),2+dt);
    assert.ok(Math.abs(pattern(p).opacity-pattern(shifted).opacity)<1e-12);
    assert.ok(Math.abs(pattern(p).opacity-pattern({...p,time:p.time+1e-5}).opacity)<1e-4);
  }
});
test('seeded wave offsets are repeatable, seed-dependent and not a uniform shift',()=>{
  const options={angle:0,waveRandomness:.8,seed:42};
  const a=createSineWaves(options),b=createSineWaves(options),other=createSineWaves({...options,seed:43});
  const points=Array.from({length:20},(_,i)=>context(170,30+i*31,2));
  assert.deepEqual(points.map(a),points.map(b));
  assert.notDeepEqual(points.map(a),points.map(other));
  assert.notDeepEqual(points.map(a),points.map(createSineWaves({angle:0})));
  const off=createSineWaves({...options,waveRandomness:0});
  assert.deepEqual(points.map(off),points.map(createSineWaves({angle:0})));
  // Crossing the moving noise-cell boundaries must not cause opacity jumps.
  for(let i=-3;i<8;i++) {
    const y=90*(i+2*.35/(Math.PI*2));
    assert.ok(Math.abs(a(context(170,y-1e-6,2)).opacity-a(context(170,y+1e-6,2)).opacity)<1e-5);
  }
});
test('neighboring waves differ with randomness and match without it',()=>{
  const regular=createSineWaves({angle:0,wavelengthVariability:.5});
  const shifted=createSineWaves({angle:0,wavelengthVariability:.5,waveRandomness:.8,seed:42});
  const a=context(170,61,3),b=context(170,151,3);
  assert.ok(Math.abs(regular(a).opacity-regular(b).opacity)<1e-12);
  assert.ok(Math.abs(shifted(a).opacity-shifted(b).opacity)>.01);
  assert.deepEqual(shifted(a),createSineWaves({angle:0,wavelengthVariability:.5,waveRandomness:.8,seed:42})(a));
});
