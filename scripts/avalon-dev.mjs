import http from 'node:http';
import {createServer} from 'vite';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {makeHandler} from '../lib/avalon/handler.mjs';
import {LocalStore} from '../lib/avalon/local-store.mjs';
import {RedisStore,redisConfiguration} from '../lib/avalon/store.mjs';
const root=fileURLToPath(new URL('..',import.meta.url));
const cloud=process.argv.includes('--cloud');
const store=cloud?new RedisStore(redisConfiguration()):new LocalStore(path.join(root,'.avalon-local/rooms.json'));
const handler=makeHandler({storeFactory:()=>store});
const vite=await createServer({root,server:{middlewareMode:true},appType:'mpa'});
const server=http.createServer((req,res)=>{
  const url=new URL(req.url,'http://localhost');
  if(url.pathname.startsWith('/api/avalon/'))return handler(req,res);
  if(url.pathname==='/avalon'){res.writeHead(308,{Location:'/avalon/'+url.search});return res.end();}
  if(url.pathname==='/avalon/')req.url='/avalon/index.html'+url.search;
  vite.middlewares(req,res,()=>{res.writeHead(404);res.end('Not found');});
});
server.listen(Number(process.env.PORT||5174),'127.0.0.1',()=>console.log(`Portfolio http://localhost:${server.address().port}/\nAvalon http://localhost:${server.address().port}/avalon/\nStorage: ${cloud?'configured Redis':'local development only'}`));
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,async()=>{server.close();await vite.close();process.exit();});
