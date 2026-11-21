import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import net from 'node:net';
import path from 'node:path';
import {spawn,execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {once} from 'node:events';
import {RedisStore} from '../../lib/avalon/store.mjs';
import {playShared} from './play-shared.mjs';
import {concurrentAssassination} from './assassination-shared.mjs';
const exec=promisify(execFile);
test('real Redis + REST adapter: atomic Lua and 5–8 player games across function instances', {skip:!process.env.REDIS_TEST_BIN,timeout:120000}, async t=>{
  const bin=process.env.REDIS_TEST_BIN;
  const probe=net.createServer();probe.listen(0,'127.0.0.1');await once(probe,'listening');const port=probe.address().port;await new Promise(resolve=>probe.close(resolve));
  const redis=spawn(path.join(bin,'redis-server'),['--port',String(port),'--bind','127.0.0.1','--save','','--appendonly','no']);
  let bridge;
  try {
    await new Promise((resolve,reject)=>{redis.stdout.on('data',b=>{if(String(b).includes('Ready to accept connections'))resolve();});redis.once('error',reject);redis.once('exit',c=>reject(Error('Redis exited '+c)));});
    bridge=http.createServer(async(req,res)=>{try{
      assert.equal(req.headers.authorization,'Bearer test-rest-token');let raw='';for await(const b of req)raw+=b;
      const cmd=JSON.parse(raw);const out=await exec(path.join(bin,'redis-cli'),['-p',String(port),'--json',...cmd.map(String)],{maxBuffer:1024*1024});
      res.setHeader('Content-Type','application/json');res.end(JSON.stringify({result:JSON.parse(out.stdout)}));
    }catch{res.statusCode=500;res.end('{}');}});
    bridge.listen(0,'127.0.0.1');await once(bridge,'listening');
    const createStore=prefix=>new RedisStore({url:`http://127.0.0.1:${bridge.address().port}`,token:'test-rest-token',prefix});
    for(const n of [5,6,7,8])for(const pace of ['host','timer'])await t.test(`${n} players, ${pace}`,()=>playShared(createStore(`test:${n}:${pace}`),n,pace));
    await t.test('concurrent assassination persists a single use',()=>concurrentAssassination(createStore('assassination')));
    const store=createStore('expiry');assert.equal(await store.create({code:'999999',version:0}),true);assert.equal(await store.create({code:'999999',version:1}),false);
    await store.command(['EXPIRE',store.key('999999'),0]);assert.equal(await store.compareAndSet('999999',JSON.stringify({code:'999999',version:0}),{code:'999999',version:2}),false);assert.equal(await store.read('999999'),null);
    await store.rate('one',1);await assert.rejects(()=>store.rate('one',1),e=>e.status===429);
  }finally{if(bridge){bridge.closeAllConnections();await new Promise(resolve=>bridge.close(resolve));}if(redis.exitCode===null){const done=once(redis,'exit');redis.kill();await done;}}
});
