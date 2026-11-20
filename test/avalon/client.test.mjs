import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import http from 'node:http';
import {once} from 'node:events';
import {LocalStore} from '../../lib/avalon/local-store.mjs';
import {makeHandler} from '../../lib/avalon/handler.mjs';

// Execute the shipped request function in a browser-like context without the
// newer static timeout API. This reproduces the affected phone's capability.
const source=await readFile(new URL('../../public/avalon/app.js',import.meta.url),'utf8');
const requestSource=source.slice(source.indexOf('async function api('),source.indexOf('\nfunction home('));
function client(overrides={}){
  const context=vm.createContext({AbortController,AbortSignal:{},fetch,setTimeout,clearTimeout,session:null,...overrides});
  vm.runInContext(requestSource,context);
  return context;
}

test('browser without AbortSignal.timeout can create, join as fifth player and ready',async()=>{
  const store=new LocalStore(),server=http.createServer(makeHandler({storeFactory:()=>store}));
  server.listen(0,'127.0.0.1');await once(server,'listening');
  const base=`http://127.0.0.1:${server.address().port}`;
  const clients=Array.from({length:5},()=>client({fetch:(url,options)=>fetch(base+url,options)}));
  try{
    const host=clients[0];host.session=await host.api('create',{name:'Host'});
    for(const [i,c] of clients.slice(1).entries())c.session=await c.api('join',{room:host.session.room,name:'P'+(i+2)});
    const fifth=clients[4],state=await fifth.api('state?room='+fifth.session.room);
    assert.equal(state.players.length,5);assert.equal(state.me,4);
    await fifth.api('action',{type:'ready',room:fifth.session.room,turn:state.turn});
    assert.equal((await host.api('state?room='+host.session.room)).players[4].ready,true);
  }finally{server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}
});

test('request deadline covers response body and clears timer with a readable error',async()=>{
  let expire,cleared=false;
  const c=client({setTimeout:fn=>{expire=fn;return 42;},clearTimeout:id=>{assert.equal(id,42);cleared=true;},
    fetch:async(_url,{signal})=>({ok:true,json:()=>new Promise((_resolve,reject)=>{
      signal.addEventListener('abort',()=>reject(Error('aborted')),{once:true});expire();
    })})});
  await assert.rejects(()=>c.api('health'),/连接超时，请检查网络后重试/);
  assert.equal(cleared,true);
});

test('HTTP errors keep their status and clear the request timer',async()=>{
  let cleared=false;
  const c=client({setTimeout:()=>42,clearTimeout:()=>{cleared=true;},fetch:async()=>({ok:false,status:401,json:async()=>({error:'座位失效，请重新加入。'})})});
  await assert.rejects(()=>c.api('state?room=123456'),e=>e.status===401&&e.message.includes('座位失效'));
  assert.equal(cleared,true);
});
