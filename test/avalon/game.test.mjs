import test from 'node:test';
import assert from 'node:assert/strict';
import {create,join,act,view,roles,SIZES,EVIL,turn,tick,firstLeader,DEFAULT_SETTINGS,resolveAction} from '../../lib/avalon/game.mjs';
const NOW=Date.parse('2026-11-20T18:45:00+08:00');
function setup(n=5,pace='host',mode='standard') {
  const r=create('123456','P1',{...DEFAULT_SETTINGS,pace});
  for(let i=1;i<n;i++)join(r,'P'+(i+1));r.mode=mode;
  for(const p of r.players)act(r,p.id,{type:'ready'},NOW);
  act(r,r.host,{type:'start'},NOW);
  for(const p of r.players)act(r,p.id,{type:'ack'},NOW);
  if(pace==='host')act(r,r.host,{type:'advance'},NOW);
  return r;
}
function advance(r){if(r.settings.pace==='host')act(r,r.host,{type:'advance'},NOW);else assert.equal(tick(r,r.deadline),true);}
function propose(r,members=r.players.slice(0,SIZES[r.players.length][r.round])){act(r,r.players[r.leader].id,{type:'team',team:members.map(p=>p.id)},NOW);}
function vote(r,yesCount=r.players.length){const before=turn(r);r.players.forEach((p,i)=>{act(r,p.id,{type:'vote',yes:i<yesCount},NOW);if(i<r.players.length-1)assert.equal(turn(r),before);});assert.equal(r.phase,'voteResult');assert.equal(r.history.at(-1).approve,yesCount);assert.equal(r.history.at(-1).reject,r.players.length-yesCount);}
function questSuccess(r){propose(r);vote(r);advance(r);for(const id of r.team)act(r,id,{type:'quest',success:true},NOW);assert.equal(r.phase,'result');advance(r);}
for(const n of [5,6,7,8])for(const pace of ['host','timer']) {
  test(`${n} 人 / ${pace}：完整三成功、刺杀可用、莫甘娜不可刺杀、匿名数据、重开保留设置`,()=>{
    const r=setup(n,pace);assert.equal(r.leader,4);assert.equal(r.firstLeader.time,'18:45');
    const initialLeader=r.leader;
    for(let i=0;i<3;i++){questSuccess(r);if(i<2)assert.equal(r.leader,(initialLeader+i+1)%n);}
    assert.equal(r.phase,'assassinate');const assassin=r.players.find(p=>p.role==='assassin'),morgana=r.players.find(p=>p.role==='morgana'),merlin=r.players.find(p=>p.role==='merlin');
    const av=view(r,assassin.id);assert.ok(av.assassinTargets.includes(r.players.indexOf(merlin)));assert.ok(!av.assassinTargets.includes(r.players.indexOf(morgana)));
    assert.throws(()=>act(r,assassin.id,{type:'assassinate',target:morgana.id},NOW),/邪恶同伴/);assert.equal(r.phase,'assassinate');
    assert.throws(()=>act(r,merlin.id,{type:'assassinate',target:assassin.id},NOW),/只有刺客/);
    for(const p of r.players){const v=view(r,p.id);assert.equal(v.history.length,3);for(const h of v.history){assert.equal(h.approve,n);assert.equal(h.reject,0);assert.equal('votes' in h,false);}for(const q of r.players)assert.equal(JSON.stringify(v).includes(q.id),false);assert.equal(v.players.some(p=>'role' in p),false);}
    act(r,assassin.id,{type:'assassinate',target:merlin.id},NOW);assert.equal(r.winner,'evil');assert.equal(view(r,assassin.id).history.some(h=>'votes' in h),false);
    const saved=structuredClone(r.settings);act(r,r.host,{type:'reset'},NOW);assert.equal(r.phase,'lobby');assert.deepEqual(r.settings,saved);assert.ok(r.players.every(p=>!p.role&&!p.ready));
  });
  test(`${n} 人 / ${pace}：否决两次、轮换回绕、第三队免投票、下一任务重新计数`,()=>{
    const r=setup(n,pace),start=r.leader;
    for(let i=0;i<2;i++){propose(r);vote(r,Math.floor(n/2));assert.equal(r.history.at(-1).passed,false);assert.equal(r.rejects,i+1);advance(r);assert.equal(r.leader,(start+i+1)%n);}
    propose(r);assert.equal(r.phase,'voteResult');assert.equal(r.history.at(-1).forced,true);assert.equal(r.history.at(-1).approve,null);assert.equal(r.history.at(-1).reject,null);assert.equal(r.history.at(-1).attempt,3);assert.equal(r.rejects,0);
    assert.throws(()=>act(r,r.host,{type:'vote',yes:true},NOW),/阶段/);advance(r);assert.equal(r.phase,'quest');
    for(const id of r.team)act(r,id,{type:'quest',success:true},NOW);advance(r);assert.equal(r.round,1);assert.equal(r.leader,(start+3)%n);propose(r);assert.equal(r.phase,'vote');
  });
}
test('北京时间分钟个位与 0、超过人数的映射',()=>{for(let n=5;n<=10;n++)for(let digit=0;digit<=9;digit++){const now=Date.parse(`2026-11-20T18:4${digit}:59+08:00`);assert.equal(firstLeader(n,now).seat,((digit-1)%n+n)%n);}assert.equal(firstLeader(6,NOW).seat,4);assert.equal(firstLeader(6,Date.parse('2026-11-20T18:40:00+08:00')).seat,5);});
test('5–8 人随机发牌 80 局：派西维尔恰好看到两位相同标记、没有角色映射',()=>{
  for(let n=5;n<=8;n++)for(let run=0;run<20;run++){
    const r=setup(n);assert.equal(r.players.filter(p=>view(r,p.id).evil).length,EVIL[n]);
    const percival=r.players.find(p=>p.role==='percival'),v=view(r,percival.id);
    assert.equal(v.intel.length,2);assert.deepEqual(v.intel.map(x=>x.seat),r.players.flatMap((p,i)=>['merlin','morgana'].includes(p.role)?[i]:[]));assert.ok(v.intel.every(x=>x.label==='梅林候选人'));assert.ok(v.intel.every(x=>Object.keys(x).sort().join()==='label,seat'));assert.ok(v.players.every(x=>!('role' in x)&&!('evil' in x)));
    const merlin=r.players.find(p=>p.role==='merlin');assert.deepEqual(view(r,merlin.id).intel.map(x=>x.seat),r.players.flatMap((p,i)=>view(r,p.id).evil&&p.role!=='mordred'?[i]:[]));
  }
});
test('5–8 人第四任务：失败牌阈值及好人不能失败',()=>{for(const n of [5,6,7,8])for(const fails of [1,2]){const r=setup(n);r.round=3;const bad=r.players.filter(p=>view(r,p.id).evil),good=r.players.filter(p=>!view(r,p.id).evil);const team=[...bad.slice(0,fails),...good].slice(0,SIZES[n][3]);propose(r,team);vote(r);advance(r);for(const p of team){if(!view(r,p.id).evil)assert.throws(()=>act(r,p.id,{type:'quest',success:false},NOW));act(r,p.id,{type:'quest',success:!bad.slice(0,fails).includes(p)},NOW);}assert.equal(r.results[0].success,n>=7&&fails===1);assert.equal(r.results[0].fails,fails);assert.deepEqual(r.cards,{});}});
test('计时到期不代投、不代选；结果仅按服务端期限推进；非房主不能推进',()=>{
  const r=setup(6,'timer');assert.equal(tick(r,r.deadline+99999),false);assert.equal(r.phase,'team');propose(r);assert.equal(tick(r,r.deadline+99999),false);assert.equal(r.phase,'vote');act(r,r.host,{type:'vote',yes:true},NOW);assert.equal(view(r,r.host).didSubmit,true);assert.equal('votes' in view(r,r.host),false);assert.equal('cards' in view(r,r.host),false);assert.throws(()=>act(r,r.host,{type:'vote',yes:false},NOW));for(const p of r.players.filter(p=>p.id!==r.host))act(r,p.id,{type:'vote',yes:true},NOW);assert.equal(tick(r,r.deadline-1),false);assert.equal(tick(r,r.deadline),true);assert.equal(r.phase,'quest');assert.equal(tick(r,r.deadline+99999),false);assert.deepEqual(r.cards,{});
  const manual=setup(5);assert.throws(()=>act(manual,manual.players[1].id,{type:'advance'},NOW));propose(manual);vote(manual);assert.equal(tick(manual,NOW+999999),false);
});
test('身份未确认齐全时房主不可跳过；计时到期依然等待',()=>{for(const pace of ['host','timer']){const r=create('123456','一',{...DEFAULT_SETTINGS,pace});for(let i=0;i<4;i++)join(r,'玩家'+i);for(const p of r.players)act(r,p.id,{type:'ready'},NOW);act(r,r.host,{type:'start'},NOW);act(r,r.host,{type:'ack'},NOW);assert.throws(()=>act(r,r.host,{type:'advance'},NOW));assert.equal(tick(r,NOW+999999),false);assert.equal(r.phase,'identity');}});
test('非法票型、队伍、目标编号、重复提交被拦截',()=>{const r=setup();assert.throws(()=>act(r,r.players[(r.leader+1)%5].id,{type:'team',team:[]},NOW));assert.throws(()=>act(r,r.players[r.leader].id,{type:'team',team:[r.host,r.host]},NOW));assert.equal(resolveAction(r,{target:'1'}).target,undefined);propose(r);assert.throws(()=>act(r,r.host,{type:'vote',yes:'false'},NOW));assert.throws(()=>act(r,r.host,{type:'vote',yes:1},NOW));vote(r);advance(r);assert.throws(()=>act(r,r.team[0],{type:'quest',success:'true'},NOW));act(r,r.team[0],{type:'quest',success:true},NOW);assert.throws(()=>act(r,r.team[0],{type:'quest',success:false},NOW));const outsider=r.players.find(p=>!r.team.includes(p.id));assert.throws(()=>act(r,outsider.id,{type:'quest',success:true},NOW));});
test('三次失败和刺杀失误的胜负',()=>{for(const n of [5,6,7,8]){const r=setup(n);for(let i=0;i<3;i++){const bad=r.players.find(p=>view(r,p.id).evil);propose(r,[bad,...r.players.filter(p=>p!==bad).slice(0,SIZES[n][r.round]-1)]);vote(r);advance(r);for(const id of r.team)act(r,id,{type:'quest',success:id!==bad.id},NOW);advance(r);}assert.equal(r.winner,'evil');const g=setup(n);for(let i=0;i<3;i++)questSuccess(g);act(g,g.players.find(p=>p.role==='assassin').id,{type:'assassinate',target:g.players.find(p=>p.role==='loyal').id},NOW);assert.equal(g.winner,'good');}});
test('设置校验、保存、房主授权、重置准备和空房间恢复',()=>{const r=create('123456','一');const second=join(r,'二');act(r,r.host,{type:'ready'});const prefs={pace:'timer',discussSeconds:120,actionSeconds:45,resultSeconds:10};assert.throws(()=>act(r,second,{type:'settings',settings:prefs}));assert.throws(()=>act(r,r.host,{type:'settings',settings:{...prefs,resultSeconds:0}}));act(r,r.host,{type:'settings',settings:prefs});assert.deepEqual(r.settings,prefs);assert.equal(r.players[0].ready,false);act(r,r.host,{type:'leave'});assert.equal(r.host,second);act(r,second,{type:'leave'});const fresh=join(r,'三');assert.equal(r.host,fresh);assert.throws(()=>act(r,fresh,{type:'chat',text:'removed'}));});

test('房主可提前结束各阶段；不判胜负、不泄露未完成投票，且可以重开',()=>{
  for(const phase of ['identity','team','vote','voteResult','quest','result','assassinate']){
    const r=setup(8,'timer');r.phase=phase;r.votes={[r.host]:true};r.cards={[r.host]:false};
    assert.throws(()=>act(r,r.players[1].id,{type:'end'},NOW),/只有房主/);
    act(r,r.host,{type:'end'},NOW);
    assert.equal(r.phase,'end');assert.equal(r.winner,null);assert.equal(r.deadline,null);
    assert.deepEqual(r.votes,{});assert.deepEqual(r.cards,{});
    for(const p of r.players){const v=view(r,p.id);assert.equal(v.phase,'end');assert.ok(v.players.every(x=>x.role));assert.ok(!('votes' in v)&&!('cards' in v));}
    assert.equal(tick(r,NOW+999999),false);
    assert.throws(()=>act(r,r.host,{type:'end'},NOW),/没有进行中的对局/);
    act(r,r.host,{type:'reset'},NOW);assert.equal(r.phase,'lobby');assert.ok(r.players.every(p=>!p.ready&&!p.role));
    assert.throws(()=>act(r,r.host,{type:'end'},NOW),/没有进行中的对局/);
  }
});

test('7 人局第三任务 3 人、第四任务 4 人；两失败牌规则只在第四任务',()=>{
  for(const [round,size,oldSize,success] of [[2,3,4,false],[3,4,3,true]]){
    const r=setup(7);r.round=round;
    assert.deepEqual(view(r,r.host).sizes,[2,3,3,4,4]);
    assert.throws(()=>propose(r,r.players.slice(0,oldSize)),/队伍人数不正确/);
    const bad=r.players.find(p=>view(r,p.id).evil);
    const team=[bad,...r.players.filter(p=>!view(r,p.id).evil).slice(0,size-1)];
    propose(r,team);vote(r);advance(r);
    for(const p of team)act(r,p.id,{type:'quest',success:p!==bad},NOW);
    assert.equal(r.phase,'result');assert.equal(r.results[0].team.length,size);
    assert.equal(r.results[0].fails,1);assert.equal(r.results[0].success,success);
  }
});

test('7 人进阶含奥伯伦：梅林可见、坏人互不相认，刺杀选项不泄露他',()=>{
  assert.deepEqual(roles(7).sort(),['merlin','percival','loyal','loyal','assassin','morgana','oberon'].sort());
  assert.equal(roles(7,'basic').includes('oberon'),false);
  assert.equal(roles(8).includes('mordred'),true);assert.equal(roles(8).includes('oberon'),false);
  assert.equal(roles(9).includes('mordred'),true);assert.equal(roles(9).includes('oberon'),false);
  assert.equal(roles(10).includes('mordred'),true);assert.equal(roles(10).includes('oberon'),true);
  const r=setup(7),byRole=role=>r.players.find(p=>p.role===role),seat=role=>r.players.indexOf(byRole(role));
  const oberon=byRole('oberon'),assassin=byRole('assassin'),morgana=byRole('morgana');
  assert.equal(view(r,oberon.id).evil,true);assert.deepEqual(view(r,oberon.id).intel,[]);
  assert.deepEqual(view(r,assassin.id).intel.map(x=>x.seat),[seat('morgana')]);
  assert.deepEqual(view(r,morgana.id).intel.map(x=>x.seat),[seat('assassin')]);
  assert.deepEqual(view(r,byRole('merlin').id).intel.map(x=>x.seat).sort((a,b)=>a-b),[seat('assassin'),seat('morgana'),seat('oberon')].sort((a,b)=>a-b));
  const candidates=view(r,byRole('percival').id).intel;
  assert.deepEqual(candidates.map(x=>x.seat).sort((a,b)=>a-b),[seat('merlin'),seat('morgana')].sort((a,b)=>a-b));
  assert.ok(candidates.every(x=>x.label==='梅林候选人'));
  for(let i=0;i<3;i++)questSuccess(r);
  assert.ok(view(r,assassin.id).assassinTargets.includes(seat('oberon')));
  assert.throws(()=>act(r,assassin.id,{type:'assassinate',target:morgana.id},NOW),/邪恶同伴/);
  act(r,assassin.id,{type:'assassinate',target:oberon.id},NOW);assert.equal(r.winner,'good');
});
