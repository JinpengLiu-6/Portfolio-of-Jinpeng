const $=s=>document.querySelector(s),app=$('#app'),modal=$('#modal');
const ROLE={merlin:'梅林',percival:'派西维尔',loyal:'忠臣',assassin:'刺客',morgana:'莫甘娜',mordred:'莫德雷德',oberon:'奥伯伦',minion:'爪牙'};
const DESC={merlin:'你知道下方玩家属于邪恶阵营。莫德雷德对你隐藏。保护自己的身份。',percival:'下方两人中，一位是梅林，一位是莫甘娜。两人没有顺序或标记区别，你无法分辨。',loyal:'你没有额外身份线索。通过语音讨论与任务结果寻找同伴。',assassin:'三次任务成功后，由你发动刺杀。已知邪恶同伴不可选为目标。',morgana:'你会和梅林一起出现在派西维尔的候选人中，但不会显示你的真实身份。',mordred:'梅林看不到你的身份。你与除奥伯伦外的邪恶同伴相互认识。',oberon:'你不知道邪恶同伴是谁，他们也不认识你。梅林可以看见你。',minion:'你与下方邪恶同伴相互认识。奥伯伦对你隐藏。'};
const DEFAULT={pace:'host',discussSeconds:90,actionSeconds:30,resultSeconds:8};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let session;try{session=JSON.parse(localStorage.getItem('avalon.web.v2.session'));}catch{}
let state=null,selected=[],busy=false,refreshing=false,atHome=!session,version=-1,serverOffset=0,toastTimer,promptedTurn=null;
const nickname=i=>esc(state.players[i]?.name||''),seatName=i=>`${i+1} 号 ${nickname(i)}`,seatNames=arr=>arr.map(seatName).join('、');
const pulse=()=>navigator.vibrate?.(12);
function notify(text){$('#toast').textContent=text;$('#toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),2800);}
function store(){try{if(session)localStorage.setItem('avalon.web.v2.session',JSON.stringify(session));else localStorage.removeItem('avalon.web.v2.session');}catch{notify('无法保存座位，请勿关闭页面');}}
function preferences(){try{return JSON.parse(localStorage.getItem('avalon.web.v2.settings'))||DEFAULT;}catch{return DEFAULT;}}
function show(html,kind='info'){modal.className=kind;$('#modal-body').innerHTML=html;if(!modal.open)modal.showModal();}
$('#modal-close').onclick=()=>modal.close();modal.addEventListener('click',e=>{if(e.target===modal)modal.close();});modal.addEventListener('close',()=>{if(!modal.open)$('#modal-body').innerHTML='';});
async function api(path,body){
  // Some mobile browsers support AbortController but not AbortSignal.timeout.
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),10000);
  try{
    const res=await fetch('/api/avalon/'+path,{method:body?'POST':'GET',headers:{...(body?{'Content-Type':'application/json'}:{}),...(session?{Authorization:'Bearer '+session.token}:{})},body:body?JSON.stringify(body):undefined,signal:controller.signal});
    const data=await res.json();
    if(!res.ok){const error=Error(data.error||'请求失败');error.status=res.status;throw error;}
    return data;
  }catch(error){
    if(controller.signal.aborted)throw Error('连接超时，请检查网络后重试。');
    throw error;
  }finally{clearTimeout(timer);}
}
function home(){document.body.classList.remove('in-room');atHome=true;const code=(new URLSearchParams(location.search).get('room')||'').replace(/\D/g,'').slice(0,6);app.innerHTML=`<section class="welcome"><span class="kicker">5–10 人 · 语音搭子专用</span><h1>朋友就位，<br>圆桌开局。</h1><p>语音里讨论，这里只做决定。</p></section><section class="panel entry">${session?'<button class="secondary wide" id="resume">回到刚才的房间</button>':''}<form id="entry-form"><label for="nickname">你的昵称</label><input id="nickname" maxlength="12" placeholder="让朋友一眼认出你" autocomplete="nickname" required><button id="create" type="button" class="wide">创建房间</button><div class="divider">或加入朋友</div><label for="room-code">房间码</label><div class="join-row"><input id="room-code" inputmode="numeric" maxlength="6" value="${esc(code)}" placeholder="6 位数字" aria-label="房间码"><button type="submit" class="secondary">加入</button></div></form></section><p id="service-status" class="footnote" role="status"></p><p class="footnote">先打开你们的语音软件 · 刷新可恢复座位</p>`;
$('#resume')?.addEventListener('click',()=>{atHome=false;version=-1;refresh();});$('#create').onclick=()=>enter('create');$('#entry-form').onsubmit=e=>{e.preventDefault();enter('join');};checkService();}
async function enter(type,confirmed=false){if(busy)return;const name=$('#nickname').value.trim(),room=$('#room-code').value.trim();if(!name)return $('#nickname').reportValidity();if(type==='join'&&!/^\d{6}$/.test(room))return notify('请输入 6 位房间码');if(session&&!confirmed){show('<h2>切换房间？</h2><p>新座位会替换本浏览器保存的旧座位。</p><button class="wide" id="new-room">确认切换</button>');$('#new-room').onclick=()=>{modal.close();enter(type,true);};return;}
busy=true;app.querySelectorAll('button').forEach(b=>b.disabled=true);try{session=await api(type,{name,room,settings:preferences()});store();atHome=false;state=null;version=-1;history.replaceState(null,'','/avalon/?room='+session.room);await refresh();}catch(e){notify(e.message);}finally{busy=false;if(state&&!atHome)render();else app.querySelectorAll('button').forEach(b=>b.disabled=false);}}
async function refresh(){if(!session||refreshing)return;refreshing=true;const requested=session;try{const s=await api('state?room='+requested.room);if(session!==requested)return;serverOffset=s.serverNow-Date.now();$('#network').hidden=true;const changed=version!==s.version||state?.players.map(p=>p.online).join()!==s.players.map(p=>p.online).join();if(state&&state.turn!==s.turn){selected=[];if(modal.open)modal.close();if(state.phase!==s.phase){pulse();if(!atHome)window.scrollTo({top:0,behavior:'smooth'});}}state=s;version=s.version;if(changed&&!atHome)render();updateClock();if(!atHome)maybePrompt();}catch(e){if(session!==requested)return;if(e.status===401||e.status===404||e.message.includes('座位失效')){exitRoom();notify(e.message);}else $('#network').hidden=false;}finally{refreshing=false;}}
async function send(action,expectedTurn=state?.turn){if(busy||!state)return;busy=true;app.querySelectorAll('.actions button').forEach(b=>b.disabled=true);try{await api('action',{...action,room:session.room,turn:expectedTurn});if(action.type==='settings'){try{localStorage.setItem('avalon.web.v2.settings',JSON.stringify(action.settings));}catch{}}if(['leave','disband'].includes(action.type)){exitRoom();return;}await refresh();pulse();}catch(e){notify(e.message);await refresh();}finally{busy=false;if(state&&!atHome)render();}}
function exitRoom(){if(modal.open)modal.close();session=null;state=null;selected=[];version=-1;promptedTurn=null;store();$('#network').hidden=true;history.replaceState(null,'','/avalon/');home();}
function confirmAction(title,description,action){const expectedTurn=state.turn;show(`<h2>${title}</h2><p>${description}</p><button id="confirm" class="wide">确认${title}</button>`);$('#confirm').onclick=()=>{modal.close();send(action,expectedTurn);};}
function role(){const s=state;show(`<span class="kicker">仅你可见 · 你是 ${s.me+1} 号</span><h2 class="identity">${ROLE[s.role]}</h2><span class="side ${s.evil?'evil':'good'}">${s.evil?'邪恶阵营':'正义阵营'}</span><p>${DESC[s.role]}</p><div class="intel-grid">${s.intel.length?s.intel.map(x=>`<div class="intel-person"><b>${x.seat+1} 号</b><strong>${nickname(x.seat)}</strong><span>${x.label}</span></div>`).join(''):'<p class="muted">没有额外可见身份</p>'}</div>${s.role==='percival'?'<p class="privacy-note">两张提示样式相同，按座位号排列；不代表身份顺序。</p>':''}${s.phase==='identity'&&!s.didSubmit?'<button class="wide" id="ack-role">已记住，确认身份</button>':''}`);$('#ack-role')?.addEventListener('click',()=>{const t=s.turn;modal.close();send({type:'ack'},t);});}
function settingsDialog(){const s=state.settings;show(`<h2>流程设置</h2><p>保存后全员需重新准备。重开保留设置。</p><form id="settings-form"><label for="pace">推进方式</label><select id="pace"><option value="host" ${s.pace==='host'?'selected':''}>房主手动推进</option><option value="timer" ${s.pace==='timer'?'selected':''}>倒计时自动推进</option></select><div class="setting-grid"><label>讨论 / 选人（秒）<input id="discuss" type="number" min="15" max="600" value="${s.discussSeconds}" required></label><label>确认 / 投票 / 出牌（秒）<input id="action-seconds" type="number" min="10" max="180" value="${s.actionSeconds}" required></label><label>结果展示（秒）<input id="result-seconds" type="number" min="3" max="60" value="${s.resultSeconds}" required></label></div><p class="privacy-note">倒计时结束时，未完成操作会继续等待。结果页自动推进；刺杀不设时限。</p><button class="wide" type="submit">保存设置</button></form>`);$('#settings-form').onsubmit=e=>{e.preventDefault();const value={pace:$('#pace').value,discussSeconds:Number($('#discuss').value),actionSeconds:Number($('#action-seconds').value),resultSeconds:Number($('#result-seconds').value)};modal.close();send({type:'settings',settings:value});};}
function updateClock(){const clock=$('#clock');if(!clock||!state)return;if(!state.deadline){clock.textContent=state.phase==='assassinate'?'刺客行动':state.phase==='end'?'已结束':state.settings.pace==='host'?'手动模式':'不限时';return;}const left=Math.max(0,Math.ceil((state.deadline-Date.now()-serverOffset)/1000));clock.textContent=left>0?`${Math.floor(left/60)}:${String(left%60).padStart(2,'0')}`:['result','voteResult'].includes(state.phase)?'正在推进':'已到时 · 等待操作';clock.classList.toggle('expired',left===0);}
function roster(selectable){const s=state;return `<div class="players">${s.players.map(p=>{const blocked=s.phase==='assassinate'&&!s.assassinTargets.includes(p.seat),selectedHere=selected.includes(p.seat),team=s.team.includes(p.seat)&&!['lobby','identity','team','assassinate','end'].includes(s.phase);const active=selectable&&!blocked;let meta=s.phase==='lobby'?(p.ready?'已准备':'未准备'):s.phase==='end'?ROLE[p.role]:s.phase==='assassinate'&&blocked&&s.role==='assassin'?(p.seat===s.me?'你自己':'已知同伴 · 不可刺杀'):p.seat===s.leader?'队长':team?'任务队员':'';return `<${selectable?'button':'div'} class="player ${selectedHere||team?'selected':''} ${p.seat===s.me?'self':''}" ${selectable?`data-seat="${p.seat}" aria-pressed="${selectedHere}" ${active?'':'disabled'}`:''}><span class="seat-no">${p.seat+1}</span><span class="player-info"><strong>${esc(p.name)}${p.seat===s.me?' · 你':''}</strong><small>${meta}${p.left?' · 已离开':!p.online?(meta?' · 离线':'离线'):''}</small></span>${selectedHere||team?'<span class="check" aria-hidden="true">✓</span>':''}</${selectable?'button':'div'}>`;}).join('')}</div>`;}
function progress(){const s=state;if(['lobby','identity'].includes(s.phase))return '';return `<div class="quests">${s.sizes.map((n,i)=>`<div class="quest ${s.results[i]?(s.results[i].success?'win':'lose'):s.round===i?'current':''}"><span>任务 ${i+1}</span><b>${s.results[i]?(s.results[i].success?'成功':'失败'):n+' 人'}</b></div>`).join('')}</div>`;}
function ballot(){
  const s=state;if(!s||s.didSubmit||!['vote','quest'].includes(s.phase)||s.phase==='quest'&&!s.team.includes(s.me))return;
  promptedTurn=s.turn;
  const vote=s.phase==='vote',options=vote?[['true','赞成','让这支队伍出发','approve'],['false','反对','换下一位队长','reject']]:[['true','成功','助力任务完成','approve'],...(s.evil?[['false','失败','阻止任务完成','reject']]:[])];
  show(`<span class="kicker">任务 ${s.round+1} · ${vote?'匿名表决':'秘密出牌'}</span><h2>${vote?'这一队，出发吗？':'选择你的任务牌'}</h2><p class="ballot-team">队员：${s.team.map(i=>i+1+' 号').join('、')}</p><div class="ballot-cards ${options.length===1?'single-card':''}">${options.map(([value,title,desc,cls])=>`<button class="ballot-card ${cls}" data-choice="${value}" aria-pressed="false"><span class="card-symbol" aria-hidden="true">${value==='true'?'✓':'×'}</span><strong>${title}</strong><span>${desc}</span><span class="card-selected" aria-hidden="true">已选</span></button>`).join('')}</div><p class="privacy-note">只公布总票数 · 提交后不可修改</p><button id="submit-ballot" class="wide" disabled>先选择一张卡片</button>`,'ballot-dialog');
  let choice;
  modal.querySelectorAll('[data-choice]').forEach(b=>b.onclick=()=>{
    choice=b.dataset.choice==='true';pulse();
    modal.querySelectorAll('[data-choice]').forEach(card=>card.setAttribute('aria-pressed',String(card===b)));
    const submit=$('#submit-ballot');submit.disabled=false;submit.textContent='确认提交'+(vote?(choice?'赞成':'反对'):(choice?'成功牌':'失败牌'));
  });
  $('#submit-ballot').onclick=()=>{if(choice===undefined||busy)return;modal.close();send(vote?{type:'vote',yes:choice}:{type:'quest',success:choice},s.turn);};
}
function maybePrompt(){if(!state||atHome||document.hidden||busy||modal.open||promptedTurn===state.turn||state.didSubmit)return;if(state.phase==='vote'||state.phase==='quest'&&state.team.includes(state.me))ballot();}
function records(){const s=state;show(`<h2>本局记录</h2>${s.history.length?s.history.map(h=>`<div class="record"><b>任务 ${h.round+1} · ${h.leader+1} 号队长</b><p>队员 ${h.team.map(x=>x+1+' 号').join('、')}</p><span>${h.forced?'第三队 · 免投票':`${h.approve} 赞成 / ${h.reject} 反对 · ${h.passed?'通过':'否决'}`}</span></div>`).reverse().join(''):'<p>还没有组队记录。</p>'}${s.firstLeader?`<p class="privacy-note">首任队长：北京时间 ${s.firstLeader.time}，${s.firstLeader.seat+1} 号开始；之后顺位轮换。</p>`:''}`);}
function roomMenu(){
  const s=state,host=s.host===s.me,lobby=s.phase==='lobby';
  show(`<span class="kicker">房间 ${s.code}</span><h2>房间菜单</h2><div class="menu-grid"><button class="secondary" id="menu-share">邀请朋友</button><button class="secondary" id="menu-rules">游戏规则</button><button class="secondary" id="menu-records">本局记录</button>${lobby&&host?'<button class="secondary" id="menu-settings">流程设置</button><button class="secondary" id="menu-mode">角色配置</button><button class="secondary" id="menu-manage">管理座位</button>':''}</div>${host?'<button class="wide danger" id="menu-disband">解散房间并退出</button>':''}${s.phase==='end'?'<button class="wide secondary" id="menu-leave">退出房间</button>':''}${lobby?`<p class="privacy-note">${s.setup.length?s.setup.join(' · '):'5–10 人，人数确定后自动配角'}</p><button class="wide secondary" id="menu-leave">离开房间</button>`:host&&s.phase!=='end'?'<button class="wide danger" id="menu-end">结束本局</button>':''}`);
  $('#menu-share').onclick=share;$('#menu-rules').onclick=()=>$('#rules-open').click();$('#menu-records').onclick=records;
  $('#menu-settings')?.addEventListener('click',settingsDialog);
  $('#menu-mode')?.addEventListener('click',()=>{show(`<h2>角色配置</h2><label for="mode">保存后全员需重新准备</label><select id="mode"><option value="standard" ${s.mode==='standard'?'selected':''}>进阶：梅林、派西维尔及邪恶特殊角色</option><option value="basic" ${s.mode==='basic'?'selected':''}>基础：梅林、刺客、忠臣和爪牙</option></select><button id="save-mode" class="wide">保存配置</button>`);$('#save-mode').onclick=()=>{const mode=$('#mode').value;modal.close();send({type:'mode',mode});};});
  $('#menu-manage')?.addEventListener('click',()=>{show(`<h2>管理座位</h2>${s.players.filter(p=>p.seat!==s.me).map(p=>`<button class="secondary wide" data-kick="${p.seat}">移除 ${seatName(p.seat)}</button>`).join('')||'<p>目前只有你一人。</p>'}`);modal.querySelectorAll('[data-kick]').forEach(b=>b.onclick=()=>confirmAction('移除玩家',seatName(+b.dataset.kick),{type:'kick',target:+b.dataset.kick}));});
  $('#menu-disband')?.addEventListener('click',()=>confirmAction('解散房间','所有人将立即退出并返回首页，房间码失效。无需先结束本局。',{type:'disband'}));
  $('#menu-leave')?.addEventListener('click',()=>confirmAction('离开房间','座位将释放，可以重新加入。',{type:'leave'}));
  $('#menu-end')?.addEventListener('click',()=>confirmAction('结束本局','所有玩家将看到结束页和公开身份。本局不判胜负，之后可以重新开局。',{type:'end'}));
}
function render(){
  if(!state||atHome)return;
  document.body.classList.add('in-room');
  const s=state,host=s.host===s.me,leader=s.leader===s.me,lobby=s.phase==='lobby',latest=s.history.at(-1),forced=s.phase==='team'&&s.rejects===2;
  const selectable=s.phase==='team'&&leader||s.phase==='assassinate'&&s.role==='assassin';
  const allReady=s.players.length>=5&&s.players.every(p=>p.ready);
  const title={lobby:allReady?'大家准备好了':'等朋友入座',identity:'确认你的身份',team:leader?'选出任务队员':`${s.leader+1} 号队长选人中`,vote:s.didSubmit?'已投票，等待结果':'这支队伍能出发吗？',voteResult:latest?.forced?'第三队，直接出发':latest?.passed?'队伍通过':'队伍未通过',quest:s.didSubmit?'已出牌，等待结果':s.team.includes(s.me)?'轮到你出牌':'等待队员出牌',result:s.results.at(-1)?.success?'任务成功':'任务失败',assassinate:s.role==='assassin'?'选择刺杀目标':'等待刺客行动',end:s.winner==='good'?'正义获胜':s.winner==='evil'?'邪恶获胜':'本局已结束'}[s.phase];
  const note={lobby:'确认昵称，在语音里找到彼此。',identity:'核对座位号，秘密查看你的角色。',team:forced?'本次选满即出发，不再投票。':`需要 ${s.sizes[s.round]} 位队员，可选自己。`,vote:'匿名表决 · 严格过半通过',voteResult:latest?.forced?'免投票，不生成赞成或反对票。':latest?.passed?'语音讨论结束后，进入任务。':'下一位队长重新选人。',quest:'任务牌只公布成功与失败总数。',result:s.players.length>=7&&s.round===3?'本轮需要 2 张失败牌才失败。':'1 张失败牌即判任务失败。',assassinate:s.role==='assassin'?'已知邪恶同伴不能选。':'继续语音讨论，等刺客作出决定。',end:s.reason}[s.phase];
  let summary='';
  if(s.phase==='voteResult'&&!latest.forced)summary=`<div class="tally"><span><b>${latest.approve}</b> 赞成</span><span><b>${latest.reject}</b> 反对</span></div>`;
  if(s.phase==='result'){const r=s.results.at(-1);summary=`<div class="tally"><span><b>${r.team.length-r.fails}</b> 成功</span><span><b>${r.fails}</b> 失败</span></div>`;}
  const tag=lobby?`${s.players.length} 人圆桌 · ${s.settings.pace==='host'?'房主推进':'倒计时'}`:s.phase==='identity'?'身份确认':s.phase==='assassinate'?'最终刺杀':s.phase==='end'?'身份揭晓':`任务 ${s.round+1} · 第 ${['team','vote'].includes(s.phase)?s.rejects+1:latest?.attempt||1} 队`;
  app.innerHTML=`<div class="game-screen ${s.players.length>8?'large-table':''}"><div class="game-topbar"><div class="my-seat"><b>${s.me+1}</b><span><strong>${nickname(s.me)}</strong><small>${host?'房主 · ':''}房间 ${s.code}</small></span></div><div class="top-tools">${!lobby?'<button id="role-open" class="small secondary">身份</button>':''}<button id="room-menu" class="small secondary" aria-label="更多房间操作">更多</button></div></div>${progress()}<section class="game-panel"><div class="phase-heading"><div class="phase-row"><span class="kicker">${tag}</span>${!lobby?'<span id="clock" class="clock"></span>':'<button class="text-button" id="invite">邀请</button>'}</div><h2>${title}</h2><p class="phase-note">${esc(note)}</p>${summary}</div>${roster(selectable)}</section>${actionbar()}</div>`;
  $('#role-open')?.addEventListener('click',role);$('#room-menu').onclick=roomMenu;$('#invite')?.addEventListener('click',share);
  app.querySelectorAll('[data-seat]').forEach(b=>b.onclick=()=>{
    const i=+b.dataset.seat;
    if(s.phase==='assassinate'){if(!s.assassinTargets.includes(i))return;selected=selected[0]===i?[]:[i];}
    else if(selected.includes(i))selected=selected.filter(x=>x!==i);
    else if(selected.length<s.sizes[s.round])selected.push(i);
    else return notify('人数已满，先取消一位再替换');
    pulse();render();
  });
  app.querySelectorAll('[data-action]').forEach(b=>b.onclick=()=>{
    const type=b.dataset.action;
    if(type==='leave')return confirmAction('退出房间','退出后返回首页。',{type:'leave'});
    if(type==='role')return role();if(type==='ballot')return ballot();
    if(type==='team')return confirmAction(forced?'直接出发':'提交队伍',`队员：${seatNames(selected)}。${forced?'本次无需投票。':''}`,{type,team:[...selected]});
    if(type==='assassinate')return confirmAction('发动刺杀',`目标：${seatNames(selected)}。确认后立即判定胜负。`,{type,target:selected[0]});
    send({type});
  });
  updateClock();maybePrompt();
}
function actionbar(){
  const s=state,host=s.host===s.me;
  const btn=(text,type,disabled=false,cls='')=>`<button data-action="${type}" ${disabled||busy?'disabled':''} class="${cls}">${text}</button>`;
  const wait=text=>`<div class="waiting">${text}</div>`;
  let hint='',buttons='';
  if(s.phase==='lobby'){hint=`${s.players.filter(p=>p.ready).length}/${s.players.length} 人已准备`;buttons=btn(s.players[s.me].ready?'取消准备':'准备好了','ready',false,'secondary')+(host?btn('开始游戏','start',s.players.length<5||s.players.some(p=>!p.ready)):'');}
  if(s.phase==='identity'){hint=`${s.submitted}/${s.players.length} 人已确认`;buttons=!s.didSubmit?btn('查看并确认身份','role'):s.settings.pace==='host'&&host?btn('进入组队','advance',!s.canAdvance):wait(s.canAdvance?'等待房主开始':'等待其他人确认');}
  if(s.phase==='team'){hint=s.leader===s.me?`已选 ${selected.length}/${s.sizes[s.round]} 人${s.rejects===2?' · 免投票':''}`:s.rejects===2?'第三队 · 免投票':`连续否决 ${s.rejects}/2`;buttons=s.leader===s.me?btn(forcedTeamLabel(s),'team',selected.length!==s.sizes[s.round]):wait(`等待 ${s.leader+1} 号队长`);}
  if(s.phase==='vote'){hint=`${s.submitted}/${s.players.length} 人已投票`;buttons=s.didSubmit?wait('等待匿名结果'):btn('打开投票卡','ballot');}
  if(s.phase==='quest'){hint=`${s.submitted}/${s.team.length} 张牌已提交`;buttons=s.didSubmit?wait('等待任务结果'):s.team.includes(s.me)?btn('打开任务卡','ballot'):wait('本次无需你出牌');}
  if(['voteResult','result'].includes(s.phase)){hint=s.settings.pace==='host'?'讨论结束后，由房主继续':'倒计时结束后自动继续';const label=s.phase==='voteResult'?(s.history.at(-1).passed?'进入任务':'下一位队长'):s.results.filter(x=>x.success).length===3?'进入刺杀':s.results.filter(x=>!x.success).length===3?'查看胜负':'下一次任务';buttons=s.settings.pace==='host'?(host?btn(label,'advance'):wait('等待房主继续')):wait('结果展示中');}
  if(s.phase==='assassinate'){hint=s.role==='assassin'?(selected.length?`已选 ${selected[0]+1} 号`:'点选一位玩家'):'三次任务成功 · 最终刺杀';buttons=s.role==='assassin'?btn('确认刺杀','assassinate',selected.length!==1,'danger'):wait('等待刺客');}
  if(s.phase==='end'){hint='身份已公开 · 个人票型不公开';buttons=btn('退出房间','leave',false,'secondary')+(host?btn('再来一局','reset'):'');}
  return `<div class="actionbar"><div class="action-hint" aria-live="polite">${hint}</div><div class="actions">${buttons}</div></div>`;
}
function forcedTeamLabel(s){return s.rejects===2?'确认队伍，直接出发':'提交队伍';}

async function share(){const url=location.origin+'/avalon/?room='+state.code;try{if(navigator.share)await navigator.share({title:'圆桌之间 · 阿瓦隆',text:'房间 '+state.code,url});else{await navigator.clipboard.writeText(url);notify('邀请链接已复制');}}catch(e){if(e.name!=='AbortError')show(`<h2>邀请朋友</h2><p>房间码 ${state.code}</p><input aria-label="邀请链接" readonly value="${esc(url)}"><p>长按复制，发到语音群。</p>`);}}
$('.brand').onclick=e=>{e.preventDefault();home();window.scrollTo({top:0});};
$('#rules-open').onclick=()=>show(`<h2>你们的圆桌规则</h2><ul><li>首任队长取北京时间分钟个位：5 对应 5 号，0 对应末位，超过人数循环计算。</li><li>否决后队长顺位轮换；连续两次否决，第三次组队直接发车。进入任务后否决次数清零。</li><li>前两次组队需严格过半赞成，平票否决。所有投票仅显示汇总。</li><li>好人只能出成功；坏人可出成功或失败。7 人及以上的第 4 个任务需要至少两张失败才失败，其余一张即失败。</li><li>三次失败邪恶胜；三次成功进入刺杀。只有刺客可以刺杀，且不能选择已知邪恶同伴（包括莫甘娜）。</li><li>派西维尔看到两位相同标记的候选人，不知道各自身份。梅林看不到莫德雷德。</li></ul><p>房主模式：身份确认齐全、投票结果、任务结果，由房主点击继续。倒计时模式：结果自动推进；操作未完成时只等待，不代投。</p><p>7–10 人进阶配置加入莫德雷德；10 人再加入奥伯伦。奥伯伦与邪恶同伴互不认识。</p>`);
document.addEventListener('visibilitychange',()=>{if(document.hidden&&modal.open)modal.close();if(!document.hidden)refresh();});window.addEventListener('online',refresh);window.addEventListener('storage',e=>{if(e.key==='avalon.web.v2.session')location.reload();});
if(session){app.innerHTML='<div class="connection">正在恢复你的座位…</div>';refresh();}else home();setInterval(()=>{if(!document.hidden)refresh();},2000);setInterval(updateClock,250);

async function checkService(){const target=$('#service-status');try{await api('health');if(target?.isConnected)target.textContent='联机服务已就绪';}catch(e){if(target?.isConnected)target.textContent=e.status===503?e.message:'联机服务暂未就绪，请稍后再试。';}}
