// Local development/test store only. Production handler never imports this module.
import fs from 'node:fs';
import path from 'node:path';
import {ROOM_TTL,ServiceError} from './store.mjs';
export class LocalStore {
  constructor(file=null){this.file=file;this.rooms=file&&fs.existsSync(file)?JSON.parse(fs.readFileSync(file,'utf8')):{};this.limits=new Map();this.online={};}
  save(){if(!this.file)return;fs.mkdirSync(path.dirname(this.file),{recursive:true});fs.writeFileSync(this.file+'.tmp',JSON.stringify(this.rooms),{mode:0o600});fs.renameSync(this.file+'.tmp',this.file);}
  async ping(){return true;}
  async read(code){const row=this.rooms[code];if(!row||row.expires<Date.now())return null;return {raw:row.raw,room:JSON.parse(row.raw)};}
  async create(room){if(this.rooms[room.code]?.expires>Date.now())return false;this.rooms[room.code]={raw:JSON.stringify(room),expires:Date.now()+ROOM_TTL*1000};this.save();return true;}
  async compareAndSet(code,raw,room){const row=this.rooms[code];if(!row||row.expires<Date.now()||row.raw!==raw)return false;this.rooms[code]={raw:JSON.stringify(room),expires:Date.now()+ROOM_TTL*1000};this.save();return true;}
  async rate(key,max){const now=Date.now();let bucket=this.limits.get(key);if(!bucket||bucket.until<now){bucket={count:0,until:now+60000};this.limits.set(key,bucket);}if(++bucket.count>max)throw new ServiceError('操作太频繁，请一分钟后重试。',429);}
  async presence(code,id,now){const all=this.online[code]||={};all[id]=now;return {...all};}
}
