import test from 'node:test';
import assert from 'node:assert/strict';
import {LocalStore} from '../../lib/avalon/local-store.mjs';
import {AvalonService} from '../../lib/avalon/service.mjs';
import {RedisStore,redisConfiguration,ServiceError} from '../../lib/avalon/store.mjs';
import {makeHandler} from '../../lib/avalon/handler.mjs';
import http from 'node:http';
import {once} from 'node:events';
import {playShared} from './play-shared.mjs';
for(const n of [5,6,7,8])for(const pace of ['host','timer'])test(`${n} players / ${pace}: independent function instances share consistent state`,()=>playShared(new LocalStore(),n,pace));
test('CAS mismatch cannot overwrite a concurrent action',async()=>{const store=new LocalStore(),service=new AvalonService(store),p=await service.create({name:'H'},'ip');const snap=await store.read(p.room);await service.join({room:p.room,name:'P'},'ip');assert.equal(await store.compareAndSet(p.room,snap.raw,snap.room),false);assert.equal((await store.read(p.room)).room.players.length,2);});
test('production requires shared storage, secrets stay out of error messages, namespace isolates previews',async()=>{
  assert.throws(()=>redisConfiguration({}),/尚未配置/);
  const config={UPSTASH_REDIS_REST_URL:'https://test.upstash.io',UPSTASH_REDIS_REST_TOKEN:'private-write-token'};
  assert.notEqual(redisConfiguration({...config,VERCEL_ENV:'production'}).prefix,redisConfiguration({...config,VERCEL_ENV:'preview'}).prefix);
  const store=new RedisStore(redisConfiguration(config),async()=>{throw Error('private-write-token');});await assert.rejects(()=>store.ping(),e=>e.status===503&&!e.message.includes('private-write-token'));
});
test('HTTP wrapper validates origins, credentials, payloads and never caches secrets',async()=>{
  const store=new LocalStore(),server=http.createServer(makeHandler({storeFactory:()=>store}));server.listen(0,'127.0.0.1');await once(server,'listening');const base=`http://127.0.0.1:${server.address().port}/api/avalon/`;
  try {
    let res=await fetch(base+'health');assert.equal(res.status,200);assert.match(res.headers.get('cache-control'),/no-store/);
    res=await fetch(base+'create',{method:'POST',headers:{'Content-Type':'application/json',Origin:'https://attacker.example'},body:'{}'});assert.equal(res.status,403);
    res=await fetch(base+'create',{method:'POST',headers:{'Content-Type':'application/json'},body:'{'});assert.equal(res.status,400);
    res=await fetch(base+'create',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:'Host'})});const p=await res.json();assert.equal(res.status,200);
    res=await fetch(base+'state?room='+p.room);assert.equal(res.status,401);
    res=await fetch(base+'state?room='+p.room,{headers:{Authorization:'Bearer '+p.token}});assert.equal(res.status,200);assert.equal((await res.json()).players.length,1);
    res=await fetch(base+'create',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:'a'.repeat(9000)})});assert.equal(res.status,413);
    res=await fetch(base+'other');assert.equal(res.status,404);
  }finally{server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}
});
test('ending a shared room invalidates pending actions and synchronizes all players',async()=>{
  const store=new LocalStore(),service=new AvalonService(store),host=await service.create({name:'Host'},'end-test');
  const peers=[];for(let i=0;i<4;i++)peers.push(await service.join({room:host.room,name:'P'+i},'end-test'));
  const players=[host,...peers];
  const action=async(p,a,t)=>(new AvalonService(store)).action({room:host.room,turn:t||(await service.state(host.room,p.token)).turn,...a},p.token);
  for(const p of players)await action(p,{type:'ready'});
  await action(host,{type:'start'});const old=(await service.state(host.room,host.token)).turn;
  await assert.rejects(()=>action(peers[0],{type:'end'},old),/只有房主/);
  await action(host,{type:'end'},old);
  await assert.rejects(()=>action(peers[0],{type:'ack'},old),e=>e.status===409);
  for(const p of players){const v=await (new AvalonService(store)).state(host.room,p.token);assert.equal(v.phase,'end');assert.equal(v.winner,null);}
  await action(host,{type:'reset'});assert.equal((await service.state(host.room,peers[0].token)).phase,'lobby');
});
test('host disbands at every stage despite stale turns; no one can revive or rejoin',async()=>{
  for(const phase of ['lobby','identity','team','vote','voteResult','quest','result','assassinate','end']){
    const store=new LocalStore(),service=new AvalonService(store),host=await service.create({name:'Host'},'disband');
    const peer=await service.join({room:host.room,name:'Peer'},'disband');
    const snap=await store.read(host.room),r=structuredClone(snap.room);r.phase=phase;r.settings.pace='timer';r.deadline=0;r.history=[{passed:true}];r.votes={[peer.token]:false};
    await store.compareAndSet(host.room,snap.raw,r);
    await assert.rejects(()=>service.action({room:host.room,type:'disband',turn:'stale'},peer.token),/只有房主/);
    const before=await store.read(host.room);
    await service.action({room:host.room,type:'disband',turn:'stale'},host.token);
    for(const p of [host,peer])await assert.rejects(()=>service.state(host.room,p.token),e=>e.status===404);
    await assert.rejects(()=>service.join({room:host.room,name:'Late'},'disband'),e=>e.status===404);
    await assert.rejects(()=>service.action({room:host.room,type:'ready',turn:'stale'},peer.token),e=>e.status===404);
    assert.equal(await store.compareAndSet(host.room,before.raw,before.room),false);
    const closed=(await store.read(host.room)).room;assert.equal(closed.closed,true);assert.deepEqual(closed.players,[]);assert.deepEqual(closed.votes,{});
  }
});
test('finished players can leave; seats stay stable until reset and host transfers',async()=>{
  const store=new LocalStore(),service=new AvalonService(store),host=await service.create({name:'Host'},'leave-end');
  const players=[host];for(let i=1;i<5;i++)players.push(await service.join({room:host.room,name:'P'+i},'leave-end'));
  const act=async(p,type)=>service.action({room:host.room,turn:(await service.state(host.room,p.token)).turn,type},p.token);
  for(const p of players)await act(p,'ready');await act(host,'start');await act(host,'end');await act(players[2],'leave');
  await assert.rejects(()=>service.state(host.room,players[2].token),e=>e.status===401);
  assert.equal((await service.state(host.room,players[4].token)).me,4);
  await act(host,'leave');const s=await service.state(host.room,players[1].token);assert.equal(s.host,1);assert.equal(s.players[2].left,true);
  await act(players[1],'reset');const lobby=await service.state(host.room,players[1].token);assert.equal(lobby.phase,'lobby');assert.equal(lobby.players.length,3);assert.equal(lobby.host,0);
});
