import {RedisStore,redisConfiguration,ServiceError} from './store.mjs';
import {AvalonService} from './service.mjs';
export function makeHandler({storeFactory=()=>new RedisStore(redisConfiguration()),now=()=>Date.now()}={}){
  return async function handler(req,res){
    res.setHeader('Content-Type','application/json; charset=utf-8');
    res.setHeader('Cache-Control','private, no-store, max-age=0');
    res.setHeader('CDN-Cache-Control','no-store');
    res.setHeader('Vercel-CDN-Cache-Control','no-store');
    res.setHeader('X-Content-Type-Options','nosniff');
    res.setHeader('Referrer-Policy','no-referrer');
    const send=(status,body)=>{res.statusCode=status;res.end(JSON.stringify(body));};
    try {
      const url=new URL(req.url,'http://localhost');
      const operation=String(req.query?.operation||url.pathname.split('/').filter(Boolean).at(-1));
      if(!['health','state','create','join','action'].includes(operation))return send(404,{error:'接口不存在。'});
      const method=['health','state'].includes(operation)?'GET':'POST';
      if(req.method!==method){res.setHeader('Allow',method);return send(405,{error:'请求方式不支持。'});}
      if(req.headers.origin && new URL(req.headers.origin).host!==req.headers.host)return send(403,{error:'请求来源不符。'});
      let body;
      if(method==='POST'){
        if(!req.headers['content-type']?.startsWith('application/json'))return send(415,{error:'需要 JSON 请求。'});
        if(req.body!==undefined){body=typeof req.body==='string'?JSON.parse(req.body):req.body;if(Buffer.byteLength(JSON.stringify(body))>8192)return send(413,{error:'请求过大。'});}
        else {let raw='';for await(const chunk of req){raw+=chunk;if(Buffer.byteLength(raw)>8192)return send(413,{error:'请求过大。'});}body=JSON.parse(raw);}
        if(!body||typeof body!=='object'||Array.isArray(body))return send(400,{error:'请求格式错误。'});
      }
      const store=storeFactory();
      if(operation==='health'){if(!await store.ping())throw new ServiceError('联机服务暂时不可用。');return send(200,{ok:true});}
      const ip=String(req.headers['x-forwarded-for']||req.socket?.remoteAddress||'unknown').split(',')[0].trim();
      await store.rate(`requests:${ip}`,1200);
      const service=new AvalonService(store,now),id=req.headers.authorization?.replace(/^Bearer /,'');
      if(operation==='state')return send(200,await service.state(url.searchParams.get('room'),id));
      if(operation==='create')return send(200,await service.create(body,ip));
      if(operation==='join')return send(200,await service.join(body,ip));
      return send(200,await service.action(body,id));
    }catch(error){
      if(error instanceof SyntaxError)return send(400,{error:'请求格式错误。'});
      if(error instanceof ServiceError)return send(error.status,{error:error.message});
      // Rule violations are intentionally user-facing; never return a stack, credentials or database response.
      return send(400,{error:error.message||'操作失败，请刷新后重试。'});
    }
  };
}
export default makeHandler();
