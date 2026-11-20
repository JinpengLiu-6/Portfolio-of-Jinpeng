import { randomInt, randomBytes } from 'node:crypto';
export const SIZES = {5:[2,3,2,3,3],6:[2,3,4,3,4],7:[2,3,4,3,4],8:[3,4,4,5,5],9:[3,4,4,5,5],10:[3,4,4,5,5]};
export const EVIL = {5:2,6:2,7:3,8:3,9:3,10:4};
export const ROLE = {merlin:'梅林',percival:'派西维尔',loyal:'忠臣',assassin:'刺客',morgana:'莫甘娜',mordred:'莫德雷德',oberon:'奥伯伦',minion:'爪牙'};
export const DEFAULT_SETTINGS = {pace:'host',discussSeconds:90,actionSeconds:30,resultSeconds:8};
const evil = role => ['assassin','morgana','mordred','oberon','minion'].includes(role);
const need = (value,message) => { if(!value) throw Error(message); };
export const token = () => randomBytes(24).toString('hex');
export function settings(value = DEFAULT_SETTINGS) {
  need(value && typeof value === 'object','设置无效');
  need(['host','timer'].includes(value.pace),'推进模式无效');
  const out = {pace:value.pace};
  for (const [key,min,max] of [['discussSeconds',15,600],['actionSeconds',10,180],['resultSeconds',3,60]]) {
    need(Number.isInteger(value[key]) && value[key]>=min && value[key]<=max,'倒计时时长超出范围');
    out[key] = value[key];
  }
  return out;
}
export function firstLeader(n,now=Date.now()) {
  const time=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Shanghai',hour:'2-digit',minute:'2-digit',hour12:false}).format(now);
  const digit=Number(time.at(-1));
  return {seat:((digit-1)%n+n)%n,time,digit};
}
export function roles(n, mode='standard') {
  need(SIZES[n],'需要 5–10 位玩家');
  const bad=['assassin'],good=['merlin'];
  if(mode!=='basic') {good.push('percival');bad.push('morgana');if(n>=7)bad.push('mordred');if(n===10)bad.push('oberon');}
  while(bad.length<EVIL[n])bad.push('minion');
  while(good.length<n-EVIL[n])good.push('loyal');
  return [...good,...bad];
}
function shuffle(a) { for(let i=a.length-1;i>0;i--){const j=randomInt(i+1);[a[i],a[j]]=[a[j],a[i]];} return a; }
function name(s) {need(typeof s==='string'&&s.trim().length>0&&s.trim().length<=12,'昵称需为 1–12 个字');return s.trim();}
export function create(code,nick,preferences) {
  const p={id:token(),name:name(nick),ready:false};
  return {code,version:0,host:p.id,phase:'lobby',players:[p],mode:'standard',settings:settings(preferences),history:[],results:[],created:Date.now(),updated:Date.now()};
}
export function join(r,nick) {
  need(r.phase==='lobby','本局已经开始，无法加入');need(r.players.length<10,'房间已满');nick=name(nick);
  need(!r.players.some(p=>p.name===nick),'昵称已被使用');
  const p={id:token(),name:nick,ready:false};r.players.push(p);if(!r.host)r.host=p.id;return p.id;
}
function move(r,phase,now) {
  r.phase=phase;r.stage=(r.stage||0)+1;r.phaseStarted=now;
  const s=r.settings||DEFAULT_SETTINGS;
  const seconds=phase==='team'?s.discussSeconds:['voteResult','result'].includes(phase)?s.resultSeconds:s.actionSeconds;
  r.deadline=s.pace==='timer'&&!['lobby','end','assassinate'].includes(phase)?now+seconds*1000:null;
}
function finish(r,winner,reason,now) {r.winner=winner;r.reason=reason;move(r,'end',now);}
function advance(r,now) {
  if(r.phase==='identity') {need(r.ack.length===r.players.length,'请等待所有玩家确认身份');move(r,'team',now);return;}
  if(r.phase==='voteResult') {
    if(r.history.at(-1).passed) {r.cards={};move(r,'quest',now);}
    else {r.leader=(r.leader+1)%r.players.length;r.team=[];move(r,'team',now);}
    return;
  }
  need(r.phase==='result','当前阶段不可手动推进');
  if(r.results.filter(x=>x.success).length===3) move(r,'assassinate',now);
  else if(r.results.filter(x=>!x.success).length===3) finish(r,'evil','三次任务失败',now);
  else {r.round++;r.leader=(r.leader+1)%r.players.length;r.team=[];move(r,'team',now);}
}
// A deadline never invents a vote, a quest card or a team. Only completed result screens advance automatically.
export function tick(r,now=Date.now()) {
  if((r.settings||DEFAULT_SETTINGS).pace!=='timer') return false;
  if(r.phase==='identity' && r.ack.length===r.players.length) {advance(r,now);return true;}
  if(['voteResult','result'].includes(r.phase) && r.deadline!==null && now>=r.deadline) {advance(r,now);return true;}
  return false;
}
export function act(r,id,a,now=Date.now()) {
  const p=r.players.find(p=>p.id===id);need(p,'座位失效，请重新加入');
  const host=()=>need(r.host===id,'只有房主可以操作');
  const phase=s=>need(r.phase===s,'阶段已变化，请刷新后操作');
  if(a.type==='disband') {
    host();r.closed=true;r.phase='closed';r.deadline=null;r.players=[];r.host=null;
    r.votes={};r.cards={};r.ack=[];r.team=[];r.history=[];r.results=[];return;
  }
  if(a.type==='ready') {phase('lobby');p.ready=!p.ready;return;}
  if(a.type==='settings') {phase('lobby');host();r.settings=settings(a.settings);for(const x of r.players)x.ready=false;return;}
  if(a.type==='end') {
    host();need(!['lobby','end'].includes(r.phase),'当前没有进行中的对局');
    // An interrupted game has no winner and never publishes incomplete ballots.
    r.votes={};r.cards={};finish(r,null,'房主提前结束本局',now);return;
  }
  if(a.type==='mode') {phase('lobby');host();need(['basic','standard'].includes(a.mode),'未知配置');r.mode=a.mode;for(const x of r.players)x.ready=false;return;}
  if(a.type==='leave'||a.type==='kick') {
    if(a.type==='leave'&&r.phase==='end'){
      // Keep revealed seat numbers stable for players still reviewing results.
      p.left=true;if(r.host===id)r.host=r.players.find(x=>!x.left)?.id;
      if(!r.host)r.closed=true;return;
    }
    phase('lobby');if(a.type==='kick')host();const target=a.type==='leave'?id:a.target;
    need(r.players.some(x=>x.id===target),'找不到玩家');r.players=r.players.filter(x=>x.id!==target);if(r.host===target)r.host=r.players[0]?.id;return;
  }
  if(a.type==='start') {
    phase('lobby');host();need(SIZES[r.players.length],'需要 5–10 位玩家');need(r.players.every(x=>x.ready),'请等待所有玩家准备');
    shuffle(roles(r.players.length,r.mode)).forEach((role,i)=>{r.players[i].role=role;});
    r.game=token();r.firstLeader=firstLeader(r.players.length,now);r.leader=r.firstLeader.seat;r.round=0;r.rejects=0;r.team=[];r.votes={};r.cards={};r.ack=[];
    move(r,'identity',now);return;
  }
  if(a.type==='ack') {phase('identity');need(!r.ack.includes(id),'已确认身份');r.ack.push(id);tick(r,now);return;}
  if(a.type==='advance') {host();need((r.settings||DEFAULT_SETTINGS).pace==='host','倒计时模式将自动推进');advance(r,now);return;}
  if(a.type==='team') {
    phase('team');need(r.players[r.leader].id===id,'请等待队长选人');
    need(Array.isArray(a.team)&&a.team.length===SIZES[r.players.length][r.round]&&new Set(a.team).size===a.team.length&&a.team.every(x=>r.players.some(p=>p.id===x)),'队伍人数不正确');
    r.team=[...a.team];r.votes={};
    if(r.rejects===2){r.history.push({round:r.round,leader:r.players[r.leader].id,team:[...r.team],approve:null,reject:null,passed:true,forced:true,attempt:3});r.rejects=0;move(r,'voteResult',now);}
    else move(r,'vote',now);return;
  }
  if(a.type==='vote') {
    phase('vote');need(typeof a.yes==='boolean','无效投票');need(!(id in r.votes),'你已经投票');r.votes[id]=a.yes;
    if(Object.keys(r.votes).length===r.players.length) {
      const approve=Object.values(r.votes).filter(Boolean).length,passed=approve>r.players.length/2;
      // Deliberately retain totals only: no per-seat voting record, including after game end.
      r.history.push({round:r.round,leader:r.players[r.leader].id,team:[...r.team],attempt:r.rejects+1,approve,reject:r.players.length-approve,passed});
      r.votes={};r.rejects=passed?0:Math.min(2,r.rejects+1);move(r,'voteResult',now);
    }
    return;
  }
  if(a.type==='quest') {
    phase('quest');need(r.team.includes(id),'只有任务队员可以出牌');need(typeof a.success==='boolean','无效任务票');
    need(!(id in r.cards),'已提交任务票');need(a.success||evil(p.role),'好人只能提交成功');r.cards[id]=a.success;
    if(Object.keys(r.cards).length===r.team.length) {
      const fails=Object.values(r.cards).filter(x=>!x).length,threshold=r.players.length>=7&&r.round===3?2:1;
      r.results.push({team:[...r.team],fails,success:fails<threshold});r.cards={};move(r,'result',now);
    }
    return;
  }
  if(a.type==='assassinate') {
    phase('assassinate');need(p.role==='assassin','只有刺客可以刺杀');const t=r.players.find(x=>x.id===a.target);
    need(t&&t.id!==id,'请选择其他玩家');
    // Oberon is unknown to the Assassin; excluding him would reveal his secret identity.
    need(!evil(t.role)||t.role==='oberon','不能刺杀已知的邪恶同伴');
    r.target=t.id;finish(r,t.role==='merlin'?'evil':'good',t.role==='merlin'?'刺客找到了梅林':'三次任务成功，梅林存活',now);return;
  }
  if(a.type==='reset') {
    phase('end');host();r.history=[];r.results=[];r.votes={};r.cards={};r.ack=[];r.team=[];
    r.players=r.players.filter(p=>!p.left);
    for(const x of r.players){delete x.role;x.ready=false;}
    delete r.winner;delete r.reason;delete r.target;move(r,'lobby',now);return;
  }
  throw Error('未知操作');
}
export function view(r,id,presence={},now=Date.now()) {
  const me=r.players.find(x=>x.id===id);need(me,'座位失效，请重新加入');const seat=x=>r.players.findIndex(p=>p.id===x);
  let intel=[];
  if(me.role==='merlin') intel=r.players.filter(x=>evil(x.role)&&x.role!=='mordred').map(x=>({seat:seat(x.id),label:'邪恶阵营'}));
  else if(me.role==='percival') intel=r.players.filter(x=>['merlin','morgana'].includes(x.role)).map(x=>({seat:seat(x.id),label:'梅林候选人'}));
  else if(evil(me.role)&&me.role!=='oberon') intel=r.players.filter(x=>evil(x.role)&&x.role!=='oberon'&&x!==me).map(x=>({seat:seat(x.id),label:'邪恶同伴'}));
  const canAdvance=(r.phase==='identity'&&r.ack?.length===r.players.length)||['voteResult','result'].includes(r.phase);
  return {
    code:r.code,version:r.version,turn:turn(r),phase:r.phase,mode:r.mode,settings:r.settings||DEFAULT_SETTINGS,
    serverNow:now,deadline:r.deadline??null,canAdvance:!!canAdvance,me:seat(id),host:seat(r.host),
    players:r.players.map((p,i)=>({seat:i,name:p.name,ready:p.ready,left:!!p.left,online:!p.left&&now-(presence[p.id]||0)<20000,...(r.phase==='end'?{role:p.role,evil:evil(p.role)}:{})})),
    role:me.role,evil:evil(me.role),intel,
    assassinTargets:r.phase==='assassinate'&&me.role==='assassin'?r.players.flatMap((p,i)=>p!==me&&(!evil(p.role)||p.role==='oberon')?[i]:[]):[],
    setup:SIZES[r.players.length]?roles(r.players.length,r.mode).map(x=>ROLE[x]):[],
    firstLeader:r.firstLeader,leader:r.leader,round:r.round,rejects:r.rejects,team:(r.team||[]).map(seat),sizes:SIZES[r.players.length]||[],
    submitted:r.phase==='vote'?Object.keys(r.votes).length:r.phase==='quest'?Object.keys(r.cards).length:r.phase==='identity'?(r.ack||[]).length:0,
    didSubmit:r.phase==='vote'?id in r.votes:r.phase==='quest'?id in r.cards:r.phase==='identity'?(r.ack||[]).includes(id):false,
    history:r.history.map(h=>({round:h.round,leader:seat(h.leader),team:h.team.map(seat),approve:h.forced?null:h.approve??Object.values(h.votes||{}).filter(Boolean).length,reject:h.forced?null:h.reject??Object.values(h.votes||{}).filter(x=>!x).length,passed:h.passed,forced:!!h.forced,attempt:h.attempt})),
    results:r.results.map(h=>({team:h.team.map(seat),fails:h.fails,success:h.success})),winner:r.winner,reason:r.reason,target:r.target?seat(r.target):null
  };
}
export function resolveAction(r,a) {
  const out={...a};if(Array.isArray(a.team))out.team=a.team.map(i=>Number.isInteger(i)?r.players[i]?.id:undefined);
  if('target' in a)out.target=Number.isInteger(a.target)?r.players[a.target]?.id:undefined;return out;
}
export function turn(r) {return r.phase==='lobby'?'lobby:'+r.version:[r.game,r.stage||0,r.phase,r.round,r.history.length,r.results.length].join(':');}
