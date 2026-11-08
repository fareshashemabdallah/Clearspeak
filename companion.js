/* ClearSpeak Chat Companion: deliberate paste, optional local memory, no automatic sending. */
'use strict';
(()=>{
const $=id=>document.getElementById(id),main=document.querySelector('main'),home=$('entry');
if(!main||!home)return;
const store='cs-chat-companion-v1',api=String(window.CS_COACH_API_URL||'').trim().replace(/\/$/,'');
const aiReady=/^https:\/\/[a-z0-9.-]+(?:\/[a-z0-9/_-]+)?$/i.test(api);
const view=document.createElement('section');
view.id='cscompScreen';view.className='screen cscomp';view.hidden=true;
view.innerHTML=[
'<button type="button" id="compBack" class="back-link">← Back to ClearSpeak</button>',
'<div class="small-welcome">✳ &nbsp; CHAT COMPANION</div>',
'<h1>Find a reply that <em>sounds like you.</em></h1>',
'<p class="comp-sub">Bring a message from WhatsApp, LinkedIn, Instagram or any chat. You choose what to share and what to send.</p>',
'<div class="comp-panel"><label for="compSaved">Conversation</label><div class="comp-row"><select id="compSaved"><option value="">New conversation</option></select><button type="button" class="comp-light" id="compNew">New</button></div>',
'<div class="comp-grid"><label>Who is this with?<input id="compPerson" maxlength="60" placeholder="Name or nickname (optional)"></label>',
'<label>Messaging app<select id="compPlatform"><option>WhatsApp</option><option>LinkedIn</option><option>Instagram</option><option>Messenger</option><option>Telegram</option><option>Other</option></select></label></div>',
'<label for="compContext">Anything I should know? <span class="comp-muted">(optional)</span></label>',
'<textarea id="compContext" maxlength="650" rows="2"></textarea></div>',
'<label for="compIncoming">What did they say?</label><textarea id="compIncoming" maxlength="3500" rows="5" placeholder="Paste a message or short exchange here…"></textarea>',
'<div class="comp-paste"><button type="button" id="compPaste" class="comp-light">Paste from clipboard</button><span>No access to your inbox. Only content you paste here.</span></div>',
'<details class="comp-draft"><summary>Already have a reply in mind?</summary><label for="compDraft">Your draft (optional)</label><textarea id="compDraft" maxlength="1500" rows="3" placeholder="Write it just as it comes out…"></textarea></details>',
'<label class="comp-check"><input type="checkbox" id="compRemember"> Remember this conversation on this device</label>',
'<p class="comp-muted comp-privacy">Local browser storage is not encrypted. If enabled, messages and drafts stay on this device until deleted. When connected, AI coaching sends selected text to the configured service.</p>',
'<button type="button" id="compHelp" class="primary-btn comp-full">Help me reply →</button><p id="compStatus" class="comp-status" role="status" aria-live="polite"></p>',
'<div id="compResult" class="comp-result" hidden><div class="comp-header"><span class="csconv-eyebrow">ONE NATURAL SUGGESTION</span><span id="compSource"></span></div>',
'<label for="compReply">Edit before you send</label><textarea id="compReply" maxlength="1500" rows="4"></textarea>',
'<p id="compReason" class="comp-note"></p><p id="compCaution" class="comp-warning"></p>',
'<div class="comp-actions"><button type="button" id="compCopy" class="primary-btn">Copy reply</button><button type="button" id="compNext" class="comp-light">Next message</button></div>',
'<div class="comp-refine"><label for="compFeedback">Not quite how you would say it?</label>',
'<div class="comp-chips"><button type="button" data-comp-refine="Less formal, more like something I would actually type">More natural</button><button type="button" data-comp-refine="Shorter and simpler">Shorter</button><button type="button" data-comp-refine="More reserved, no assumptions or pressure">Less eager</button></div>',
'<div class="comp-row"><input id="compFeedback" maxlength="400" placeholder="What feels wrong?"><button type="button" id="compAdjust" class="comp-light">Adjust</button></div></div></div>',
'<div class="comp-history"><div class="comp-historyhead"><h2>Conversation history</h2><button type="button" id="compDelete" hidden>Delete saved conversation</button></div>',
'<div id="compTimeline"><p class="comp-muted">Nothing is saved unless you choose to remember it.</p></div></div>',
'<p class="comp-muted comp-footer">ClearSpeak cannot know what someone really feels from a message. It cannot read or send messages in your social apps.</p>'
].join('');
main.append(view);
const btn=document.createElement('button');btn.type='button';btn.className='csconv-home comp-home';btn.id='compOpen';
btn.innerHTML='<span class="csconv-home-icon">✉</span><span><strong>Reply to a message</strong><small>Paste a chat, find your words, continue naturally.</small></span><span aria-hidden="true">→</span>';
const other=$('conversationOpen');if(other)other.insertAdjacentElement('beforebegin',btn);else home.append(btn);
const state={id:'',history:[],busy:false};
const status=s=>$('compStatus').textContent=s;
function read(){try{const all=JSON.parse(localStorage.getItem(store)||'[]');return Array.isArray(all)?all.filter(x=>x&&x.id).slice(0,25):[]}catch(_){return []}}
function write(all){try{localStorage.setItem(store,JSON.stringify(all.slice(0,25)));return true}catch(_){status('Could not save to browser storage.');return false}}
function options(){const s=$('compSaved');s.replaceChildren(new Option('New conversation',''));read().forEach(x=>s.add(new Option(x.name||'Unnamed conversation',x.id)));s.value=state.id}
function timeline(){const el=$('compTimeline');el.replaceChildren();if(!state.history.length){const p=document.createElement('p');p.className='comp-muted';p.textContent='Only messages you choose to remember appear here.';el.append(p);return}state.history.slice(-8).forEach(x=>{const d=document.createElement('div');d.className='comp-historyitem';const a=document.createElement('p');const bold=document.createElement('strong');bold.textContent='Incoming: ';a.append(bold,document.createTextNode(x.incoming||''));d.append(a);if(x.reply){const b=document.createElement('p'),label=document.createElement('strong');label.textContent='Your reply: ';b.append(label,document.createTextNode(x.reply));d.append(b)}el.append(d)})}
function save(){if(!$('compRemember').checked)return;const r={id:state.id||(self.crypto&&crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+Math.random().toString(36).slice(2)),name:$('compPerson').value.trim().slice(0,60)||'Unnamed conversation',platform:$('compPlatform').value,context:$('compContext').value.trim().slice(0,650),history:state.history.slice(-8),incoming:$('compIncoming').value.trim().slice(0,3500),draft:$('compDraft').value.trim().slice(0,1500),reply:$('compReply').value.trim().slice(0,1500),updated:Date.now()};if(write([r,...read().filter(x=>x.id!==r.id)])){state.id=r.id;options();$('compDelete').hidden=false}}
function reset(){state.id='';state.history=[];for(const id of ['compPerson','compContext','compIncoming','compDraft','compReply','compFeedback'])$(id).value='';$('compPlatform').value='WhatsApp';$('compResult').hidden=true;$('compRemember').checked=false;$('compDelete').hidden=true;options();timeline();status('')}
function load(id){if(!id){reset();return}const r=read().find(x=>x.id===id);if(!r){reset();return}state.id=r.id;state.history=Array.isArray(r.history)?r.history.slice(-8):[];$('compPerson').value=r.name==='Unnamed conversation'?'':r.name;$('compPlatform').value=r.platform||'Other';$('compContext').value=r.context||'';$('compIncoming').value=r.incoming||'';$('compDraft').value=r.draft||'';$('compReply').value=r.reply||'';$('compResult').hidden=!r.reply;$('compSource').textContent='Saved draft';$('compReason').textContent=r.reply?'Your earlier draft is ready for review.':'';$('compCaution').textContent='Only you decide whether to send.';$('compRemember').checked=true;$('compDelete').hidden=false;options();timeline();status('Conversation loaded. Paste the next message to continue.')}
function open(){document.body.classList.add('comp-open');home.hidden=true;view.hidden=false;options();timeline();window.scrollTo(0,0)}
function close(){document.body.classList.remove('comp-open');view.hidden=true;home.hidden=false;window.scrollTo(0,0)}
function guided(incoming){const v=incoming.toLowerCase(),draft=$('compDraft').value.trim();
if(/\b(not interested|please stop|do not contact|don't contact)\b/.test(v))return {reply:'Understood. Wishing you well.',reason:'A simple acknowledgement respects a clear boundary.',caution:'Do not pursue further contact.'};
if(/\b(don.t|do not|dont) (really )?remember\b|\bwho are you\b/.test(v))return {reply:"We exchanged a few messages online quite a while back, so I wouldn't expect you to remember. Hope you've been well!",reason:'Provides context without assuming familiarity.',caution:'Use only if this accurately describes your past interaction.'};
if(/\b(maybe sometime|things are hectic|very busy)\b/.test(v))return {reply:'Of course, no rush. Hope things settle down soon!',reason:'Accepts uncertainty without pushing.',caution:"Don't interpret a vague answer as an invitation."};
return {reply:draft,reason:'AI coaching is not connected. You can edit your draft here and copy it to your chat.',caution:'Offline examples are limited; they do not understand the full conversation.'}}
async function coach(feedback){const incoming=$('compIncoming').value.trim();const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),16000);try{const r=await fetch(api+'/message-coach',{method:'POST',mode:'cors',credentials:'omit',cache:'no-store',headers:{'Content-Type':'application/json'},signal:ctrl.signal,body:JSON.stringify({incoming,draft:$('compDraft').value.trim(),previous:$('compReply').value.trim(),feedback:feedback||'',platform:$('compPlatform').value,context:$('compContext').value.trim(),history:state.history.slice(-4).map(x=>({incoming:String(x.incoming||'').slice(0,450),reply:String(x.reply||'').slice(0,350)}))})});if(!r.ok)throw Error('Service unavailable');const data=await r.json();if(!data||typeof data.reply!=='string')throw Error('Bad suggestion');window.CSPlans?.recordAI?.();return {reply:data.reply.slice(0,1500),reason:String(data.reason||'').slice(0,350),caution:String(data.caution||'').slice(0,350)}}finally{clearTimeout(timer)}}
function render(data,mode){$('compReply').value=data.reply||'';$('compReason').textContent=data.reason||'';$('compCaution').textContent=data.caution||'';$('compSource').textContent=mode;$('compResult').hidden=false;$('compFeedback').value='';save();view.querySelector('#compResult').scrollIntoView({behavior:'smooth',block:'nearest'})}
async function help(feedback=''){if(state.busy)return;const incoming=$('compIncoming').value.trim();if(incoming.length<3){status('Paste a message first.');return}state.busy=true;$('compHelp').disabled=true;$('compAdjust').disabled=true;status('');try{if(aiReady){render(await coach(feedback),'AI coaching');status('Review the reply before sending. ClearSpeak never sends automatically.')}else if(feedback){status('AI coaching needs to be activated to adjust suggestions. You can edit the reply directly.')}else{render(guided(incoming),'Guided preview');status('Limited on-device example: personalized AI is not yet connected.')}}catch(_){if(feedback)status('AI unavailable. Your previous reply was kept.');else{render(guided(incoming),'Guided preview');status('AI unavailable, showing limited on-device guidance.')}}finally{state.busy=false;$('compHelp').disabled=false;$('compAdjust').disabled=false}}
function next(){const incoming=$('compIncoming').value.trim();if(!incoming){status('Paste a message first.');return}state.history.push({incoming:incoming.slice(0,3500),reply:$('compReply').value.trim().slice(0,1500)});state.history=state.history.slice(-8);timeline();$('compIncoming').value='';$('compDraft').value='';$('compReply').value='';$('compResult').hidden=true;save();status($('compRemember').checked?'Saved on this device.':'Continued in this tab only.');$('compIncoming').focus()}
btn.addEventListener('click',open);$('compBack').addEventListener('click',close);$('compNew').addEventListener('click',reset);$('compSaved').addEventListener('change',e=>load(e.target.value));
$('compRemember').addEventListener('change',()=>{if($('compRemember').checked){save();status('Memory enabled for this conversation on this device.')}else status('Memory off. Existing saved conversations remain until deleted.');timeline()});
for(const id of ['compPerson','compPlatform','compContext','compIncoming','compDraft'])$(id).addEventListener('change',save);
$('compHelp').addEventListener('click',()=>help());$('compAdjust').addEventListener('click',()=>{const f=$('compFeedback').value.trim();if(f)help(f);else status('Say what feels wrong about the suggestion.')});
view.querySelectorAll('[data-comp-refine]').forEach(b=>b.addEventListener('click',()=>{const f=b.dataset.compRefine;$('compFeedback').value=f;help(f)}));
$('compNext').addEventListener('click',next);$('compReply').addEventListener('change',save);
$('compCopy').addEventListener('click',async()=>{const t=$('compReply').value.trim();if(!t){status('Write or edit a reply first.');return}try{await navigator.clipboard.writeText(t);status('Copied. Review it before sending in your messaging app.')}catch(_){$('compReply').select();status('Select and copy the highlighted reply manually.')}});
$('compDelete').addEventListener('click',()=>{if(state.id&&confirm('Delete this saved conversation from this device?')&&write(read().filter(x=>x.id!==state.id)))reset()});
$('compPaste').addEventListener('click',async()=>{try{if(!navigator.clipboard?.readText)throw Error('unsupported');const t=await navigator.clipboard.readText();if(t){$('compIncoming').value=t.slice(0,3500);status('Pasted. Review the content before submitting.')}else status('The clipboard is empty.')}catch(_){status('Use Paste in the message box. Clipboard reading is not available or was not permitted.');$('compIncoming').focus()}});
if(new URLSearchParams(location.search).get('clearspeak')==='reply')open();
window.CSCompanion={open};
})();