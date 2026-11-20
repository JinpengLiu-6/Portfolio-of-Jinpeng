import assert from 'node:assert/strict';
import {AvalonService} from '../../lib/avalon/service.mjs';
export async function playShared(store,n,pace){
  let now=Date.parse('2026-11-20T18:45:00+08:00');
  const fresh=()=>new AvalonService(store,()=>now);
  const host=await fresh().create({name:'Host',settings:{pace,discussSeconds:15,actionSeconds:10,resultSeconds:3}},'test');
  const code=host.room,players=[host,...await Promise.all(Array.from({length:n-1},(_,i)=>fresh().join({room:code,name:'P'+i},'test')))];
  const state=p=>fresh().state(code,p.token);
  async function action(p,a,turn){return fresh().action({room:code,turn:turn||(await state(p)).turn,...a},p.token);}
  async function advance(){if(pace==='host')await action(host,{type:'advance'});else{const s=await state(host);now=s.deadline+1;const views=await Promise.all(players.map(state));assert.equal(new Set(views.map(v=>v.turn)).size,1);}}
  for(const p of players)await action(p,{type:'ready'});
  await action(host,{type:'start'});let s=await state(host);
  assert.equal(s.firstLeader.seat,4);await assert.rejects(()=>action(host,{type:'advance'}));
  await Promise.all(players.map(p=>action(p,{type:'ack'},s.turn)));
  if(pace==='host')await advance();
  const seatPlayers=await Promise.all(players.map(async p=>({p,seat:(await state(p)).me})));
  const bySeat=seat=>seatPlayers.find(x=>x.seat===seat).p;
  // Mixed/potentially tied votes, two rejections, then an unvoted automatic third team.
  for(let k=0;k<2;k++){
    s=await state(host);await action(bySeat(s.leader),{type:'team',team:[...Array(s.sizes[s.round]).keys()]});s=await state(host);
    await Promise.all(players.map((p,i)=>action(p,{type:'vote',yes:i<Math.floor(n/2)},s.turn)));
    s=await state(host);assert.equal(s.history.at(-1).approve,Math.floor(n/2));assert.equal(s.history.at(-1).reject,n-Math.floor(n/2));assert.equal(s.history.at(-1).passed,false);await advance();
  }
  for(let round=0;round<3;round++){
    s=await state(host);assert.equal(s.phase,'team');const team=[...Array(s.sizes[s.round]).keys()];await action(bySeat(s.leader),{type:'team',team});s=await state(host);
    if(round===0){assert.equal(s.phase,'voteResult');assert.equal(s.history.at(-1).forced,true);assert.equal(s.history.at(-1).approve,null);}
    else {assert.equal(s.phase,'vote');const previous=s.turn;await Promise.all(players.map(p=>action(p,{type:'vote',yes:true},previous)));await assert.rejects(()=>action(host,{type:'vote',yes:false},previous));s=await state(host);assert.equal(s.history.at(-1).approve,n);}
    await advance();s=await state(host);assert.equal(s.phase,'quest');await Promise.all(s.team.map(i=>action(bySeat(i),{type:'quest',success:true},s.turn)));s=await state(host);assert.equal(s.results.at(-1).fails,0);await advance();
  }
  const views=await Promise.all(players.map(state));
  for(const v of views){assert.equal(v.phase,'assassinate');assert.ok(v.history.every(h=>!('votes' in h)));assert.ok(!('cards' in v));assert.ok(v.players.every(p=>!('role' in p)));for(const p of players)assert.ok(!JSON.stringify(v).includes(p.token));}
  const per=views.find(v=>v.role==='percival');assert.equal(per.intel.length,2);assert.equal(new Set(per.intel.map(x=>x.label)).size,1);
  const av=views.find(v=>v.role==='assassin'),mv=views.find(v=>v.role==='morgana'),merlin=views.find(v=>v.role==='merlin');
  await assert.rejects(()=>action(bySeat(av.me),{type:'assassinate',target:mv.me}),/邪恶同伴/);
  await action(bySeat(av.me),{type:'assassinate',target:merlin.me});assert.equal((await state(host)).winner,'evil');
  // A new function/service instance still reads the shared result. Reset preserves persisted settings.
  await action(host,{type:'reset'});s=await state(host);assert.equal(s.settings.pace,pace);assert.equal(s.phase,'lobby');return code;
}
