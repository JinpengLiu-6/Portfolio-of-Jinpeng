import assert from 'node:assert/strict';
import {AvalonService} from '../../lib/avalon/service.mjs';
export async function concurrentAssassination(store){
  const service=()=>new AvalonService(store);
  const host=await service().create({name:'Host'},'assassin-test'),players=[host];
  for(let i=1;i<7;i++)players.push(await service().join({room:host.room,name:'P'+i},'assassin-test'));
  const state=p=>service().state(host.room,p.token);
  const action=async(p,a,turn)=>service().action({room:host.room,turn:turn||(await state(p)).turn,...a},p.token);
  for(const p of players)await action(p,{type:'ready'});await action(host,{type:'start'});
  for(const p of players)await action(p,{type:'ack'});await action(host,{type:'advance'});
  const views=await Promise.all(players.map(state)),bySeat=seat=>players[views.findIndex(v=>v.me===seat)];
  const assassin=bySeat(views.find(v=>v.role==='assassin').me),loyal=views.find(v=>v.role==='loyal').me;
  let s=await state(host);await action(bySeat(s.leader),{type:'team',team:[0,1]});await action(host,{type:'vote',yes:true});
  s=await state(assassin);const before=s.turn;
  const results=await Promise.allSettled([action(assassin,{type:'assassinate',target:loyal},before),action(assassin,{type:'assassinate',target:loyal},before)]);
  assert.equal(results.filter(r=>r.status==='fulfilled').length,1);
  for(const p of players){const v=await state(p);assert.equal(v.phase,'vote');assert.equal(v.submitted,1);assert.equal(v.assassinationUsed,true);assert.equal(v.canAssassinate,false);assert.ok(v.players.every(p=>!('role' in p)));}
  await assert.rejects(()=>action(players[1],{type:'vote',yes:true},before),e=>e.status===409);
  await assert.rejects(()=>action(assassin,{type:'assassinate',target:loyal}),/机会已用尽/);
  for(const p of players.slice(1))await action(p,{type:'vote',yes:true});assert.equal((await state(host)).history.at(-1).approve,7);
  await action(host,{type:'end'});await action(host,{type:'reset'});
  for(const p of players)await action(p,{type:'ready'});await action(host,{type:'start'});
  const next=await Promise.all(players.map(state));assert.ok(next.every(v=>!v.assassinationUsed));assert.equal(next.filter(v=>v.canAssassinate).length,1);
  await assert.rejects(()=>action(assassin,{type:'assassinate',target:loyal},before),e=>e.status===409);
}
