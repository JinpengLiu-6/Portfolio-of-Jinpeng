import { createHash } from 'node:crypto';
export const ROOM_TTL=7*24*60*60;
export class ServiceError extends Error {constructor(message,status=503){super(message);this.status=status;}}
export const CAS_SCRIPT=`
local current = redis.call('GET', KEYS[1])
if current ~= ARGV[1] then return 0 end
redis.call('SET', KEYS[1], ARGV[2], 'EX', ARGV[3])
return 1`;
export const RATE_SCRIPT=`
local count = redis.call('INCR', KEYS[1])
if count == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]) end
return count`;
export const PRESENCE_SCRIPT=`
redis.call('HSET', KEYS[1], ARGV[1], ARGV[2])
redis.call('EXPIRE', KEYS[1], 60)
return redis.call('HGETALL', KEYS[1])`;
export const hash=s=>createHash('sha256').update(String(s)).digest('hex').slice(0,24);
export function redisConfiguration(env=process.env){
  const url=env.UPSTASH_REDIS_REST_URL||env.KV_REST_API_URL;
  const token=env.UPSTASH_REDIS_REST_TOKEN||env.KV_REST_API_TOKEN;
  if(!url||!token)throw new ServiceError('联机服务尚未配置，暂时无法创建或加入房间。');
  if(new URL(url).protocol!=='https:')throw new ServiceError('联机服务配置异常，请联系房主。');
  const scope=env.VERCEL_ENV==='production'?'production':`${env.VERCEL_ENV||'local'}:${hash(env.VERCEL_GIT_COMMIT_REF||'local')}`;
  return {url,token,prefix:env.AVALON_REDIS_PREFIX||`avalon:v2:${scope}`};
}
export class RedisStore {
  constructor(config,fetcher=fetch){this.config=config;this.fetcher=fetcher;}
  async command(args){
    try {
      const response=await this.fetcher(this.config.url,{method:'POST',headers:{Authorization:`Bearer ${this.config.token}`,'Content-Type':'application/json'},body:JSON.stringify(args),signal:AbortSignal.timeout(5000)});
      if(!response.ok)throw Error('Redis response failed');
      const payload=await response.json();if(payload.error)throw Error('Redis command failed');return payload.result;
    }catch {throw new ServiceError('联机服务暂时不可用，请稍后重试。');}
  }
  key(code){return `${this.config.prefix}:room:${code}`;}
  async ping(){return await this.command(['PING'])==='PONG';}
  async read(code){const raw=await this.command(['GET',this.key(code)]);return raw===null?null:{raw,room:JSON.parse(raw)};}
  async create(room){return await this.command(['SET',this.key(room.code),JSON.stringify(room),'NX','EX',ROOM_TTL])==='OK';}
  async compareAndSet(code,raw,room){return Number(await this.command(['EVAL',CAS_SCRIPT,1,this.key(code),raw,JSON.stringify(room),ROOM_TTL]))===1;}
  async rate(key,max){const count=await this.command(['EVAL',RATE_SCRIPT,1,`${this.config.prefix}:rate:${hash(key)}`,60]);if(Number(count)>max)throw new ServiceError('操作太频繁，请一分钟后重试。',429);}
  async presence(code,id,now){const pairs=await this.command(['EVAL',PRESENCE_SCRIPT,1,`${this.key(code)}:presence`,id,now]);const out={};for(let i=0;i<pairs.length;i+=2)out[pairs[i]]=Number(pairs[i+1]);return out;}
}
