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
