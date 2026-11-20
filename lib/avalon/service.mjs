import { randomInt } from 'node:crypto';
import {create,join,act,view,resolveAction,turn,tick} from './game.mjs';
import {ServiceError} from './store.mjs';
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const validCode=code=>{if(typeof code!=='string'||!/^\d{6}$/.test(code))throw new ServiceError('请输入 6 位房间码。',400);};
const authenticate=(r,id)=>{if(!id||!r.players.some(p=>p.id===id))throw new ServiceError('座位失效，请重新加入。',401);};
// Every update is compared against the exact snapshot read from Redis. Failed CAS attempts rerun all permissions and turn checks.
export class AvalonService {
  constructor(store,now=()=>Date.now()){this.store=store;this.now=now;}
  async update(code,transform){
    validCode(code);
    for(let attempt=0;attempt<20;attempt++){
      const snapshot=await this.store.read(code);if(!snapshot)throw new ServiceError('房间不存在或已过期。',404);
      const room=structuredClone(snapshot.room),now=this.now();
      const {changed,result}=transform(room,now);
      if(!changed)return result;
      room.version++;room.updated=now;
      if(await this.store.compareAndSet(code,snapshot.raw,room))return result;
      await sleep(Math.min(50,2+attempt*3+randomInt(5)));
    }
    throw new ServiceError('房间正在同步，请重试。',409);
  }
  async create(body,ip){
    await this.store.rate(`create:${ip}`,12);
    for(let attempt=0;attempt<12;attempt++){
      const room=create(String(randomInt(100000,1000000)),body.name,body.settings);
      if(await this.store.create(room))return {room:room.code,token:room.host};
    }
    throw new ServiceError('暂时无法创建房间，请稍后重试。');
  }
  async join(body,ip){
    await this.store.rate(`join:${ip}`,60);
    return this.update(body.room,r=>({changed:true,result:{room:r.code,token:join(r,body.name)}}));
  }
  async state(code,id){
    // Deadlines live in Redis. The next authenticated poll advances an elapsed result exactly once, even after a cold start.
    const r=await this.update(code,(r,now)=>{authenticate(r,id);const changed=tick(r,now);return {changed,result:r};});
    const now=this.now(),presence=await this.store.presence(code,id,now);
    return view(r,id,presence,now);
  }
  async action(body,id){
    const result=await this.update(body.room,(r,now)=>{
      authenticate(r,id);
      if(tick(r,now))return {changed:true,result:{stale:true}};
      if(body.turn!==turn(r))throw new ServiceError('房间状态已更新，请确认后重试。',409);
      act(r,id,resolveAction(r,body),now);
      return {changed:true,result:{ok:true}};
    });
    if(result.stale)throw new ServiceError('阶段已自动推进，请确认后重试。',409);
    return result;
  }
}
