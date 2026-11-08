import { test } from 'node:test';
import assert from 'node:assert/strict';
import { startAsciiFrames } from '../src/lib/effects/ascii-frame-loop.ts';

function fakeClock(hz = 165) {
  let now = 0, id = 0, wakes = 0;
  const jobs = new Map();
  const add = (callback, at) => { jobs.set(++id,{callback,at}); return id; };
  const clock = {
    now: () => now,
    delay: (callback,ms) => add(callback,now+ms), cancelDelay: id => jobs.delete(id),
    frame: callback => add(()=>callback(now),(Math.floor(now/(1000/hz))+1)*1000/hz), cancelFrame: id=>jobs.delete(id),
  };
  return { clock, get wakes(){return wakes;}, get pending(){return jobs.size;},
    advance(to) { while(jobs.size) { const [id,job]=[...jobs].sort((a,b)=>a[1].at-b[1].at)[0]; if(job.at>to)break; jobs.delete(id);now=job.at;wakes++;job.callback(); }now=to; },
  };
}
test('24 fps on a 165 Hz display sleeps instead of polling every refresh',()=>{
  const fake=fakeClock();let frames=0,elapsed=0;
  const stop=startAsciiFrames(dt=>{frames++;elapsed+=dt;},24,fake.clock);
  fake.advance(10000);
  assert.ok(frames>=238 && frames<=240,`frames=${frames}`);
  assert.ok(fake.wakes<=480,`wakeups=${fake.wakes}`);
  assert.ok(elapsed>9.9 && elapsed<=10+1e-9,`elapsed=${elapsed}`);
  stop();assert.equal(fake.pending,0);
  fake.advance(20000);assert.ok(frames<=240);
});
test('stop cancels a pending animation frame as well as its timer',()=>{
  const fake=fakeClock(60);let frames=0;
  const stop=startAsciiFrames(()=>frames++,24,fake.clock);
  fake.advance(42);stop();fake.advance(1000);
  assert.equal(frames,0);assert.equal(fake.pending,0);
});
test('low frame rates preserve elapsed time rather than slowing the pattern',()=>{
  const fake=fakeClock(60);let elapsed=0,frames=0;
  const stop=startAsciiFrames(dt=>{elapsed+=dt;frames++;},1,fake.clock);
  fake.advance(5100);stop();
  assert.equal(frames,5);assert.ok(elapsed>5 && elapsed<5.1);
});
