/* ClearSpeak Conversation Practice — optional conversational coaching; no scripts/keys required */
'use strict';
(()=>{
 const $=id=>document.getElementById(id);
 const scenes={
  meet:{label:'Meet someone',icon:'✳',where:"You're at a social gathering. You'd like to introduce yourself to someone new.",opener:"Hi, I don't think we've met. I'm glad to meet you. How do you know the host?",replies:["Nice to meet you! We used to work together. How about you?","I actually moved here recently, so I'm still getting to know people.","It's been really nice chatting with you. I hope we run into each other again."],next:["It's nice to meet someone connected to them. Have you known each other long?","What's been your favorite thing about moving here?","I enjoyed talking with you. Hopefully we'll chat again soon."],ending:'Leave them with a warm goodbye, without forcing the conversation to continue.'},
  call:{label:'Make a call',icon:'☎',where:"You're calling someone you met recently and would like to get to know better.",opener:"Hi, it's nice to speak again. Is now a good time for a quick chat?",replies:["Hi! Yes, I have a few minutes. How have you been?","That sounds interesting. What brought that to mind?","I'm glad you called. Let's catch up again soon."],next:["I've been well, thanks. I enjoyed our last conversation and wanted to reconnect. How have things been with you?","Our last conversation stayed with me. I'd love to hear more about your experience.","Likewise! It was great catching up. Talk again soon."],ending:'A good call closes naturally; you do not need to fill every silence.'},
  chat:{label:'Start a chat',icon:'✉',where:"You want to message someone you met at an event without sounding overly formal.",opener:"Hey! It was nice meeting you the other day. How's your week going?",replies:["Hey! Great to hear from you. My week's been good, thanks. How about yours?","I really enjoyed the event. It was nice meeting different people.","Same here! Would be nice to stay in touch."],next:["It's been good too, thanks! What was your favorite part of the event?","I enjoyed the conversations too. Have you been to anything similar before?","Definitely. It was great chatting with you!"],ending:'Keep a first message easy to answer; friendly, specific, and unpressured.'}
 };
 const html='<section id="conversationScreen" class="screen csconv" hidden aria-labelledby="convTitle">'+
 '<button type="button" id="convBack" class="back-link">← Back to ClearSpeak</button>'+
 '<div class="small-welcome">✳ &nbsp; FEEL COMFORTABLE CONNECTING</div>'+
 '<h1 id="convTitle">Start a <em>conversation.</em></h1>'+
 '<p class="csconv-sub">An introduction, a real reply, and what to say next. One exchange at a time.</p>'+
 '<div id="convChooser"><p class="csconv-question">What would you like to practise?</p><div class="csconv-choices">'+
 '<button type="button" data-conv="meet"><span class="csconv-symbol">✳</span><strong>Meet someone</strong><small>In person</small></button>'+
 '<button type="button" data-conv="call"><span class="csconv-symbol">☎</span><strong>Make a call</strong><small>On the phone</small></button>'+
 '<button type="button" data-conv="chat"><span class="csconv-symbol">✉</span><strong>Start a chat</strong><small>By message</small></button>'+
 '</div></div>'+
 '<div id="convActive" hidden>'+
 '<div class="csconv-context"><span id="convLabel"></span><span id="convStep"></span></div>'+
 '<p id="convScene" class="csconv-scene"></p>'+
 '<div id="convMessages" class="csconv-messages" role="log" aria-label="Practice conversation" aria-live="polite"></div>'+
 '<div class="csconv-card"><span class="csconv-eyebrow" id="convSuggestLabel">A natural way to begin</span>'+
 '<p id="convSuggestion"></p><button type="button" id="convUse" class="csconv-use">Use this idea ↓</button></div>'+
 '<label for="convInput" class="csconv-label">What would you say?</label>'+
 '<textarea id="convInput" maxlength="400" rows="3" placeholder="Write your own words, or use the idea above…"></textarea>'+
 '<p id="convNotice" class="csconv-notice" aria-live="polite"></p>'+
 '<div class="csconv-actions"><button type="button" class="primary-btn" id="convSend">Continue the conversation →</button>'+
 '<button type="button" class="csconv-side" id="convDictate" hidden>🎙 Speak</button></div>'+
 '<button type="button" class="csconv-finish" id="convFinish" hidden>Finish and reflect</button>'+
 '</div>'+
 '<div id="convDone" hidden class="csconv-done"><div class="csconv-flower">✳</div><h2>You made a connection.</h2>'+
 '<p id="convLearning"></p><div class="csconv-takeaway">A good conversation is not a perfect script. Notice what they share, respond with curiosity, and offer a little of yourself.</div>'+
 '<button type="button" id="convAgain" class="primary-btn">Try another situation →</button></div>'+
 '<p class="csconv-disclaimer" id="convPrivacy">Guided practice uses fictional responses, not a real conversation or an assessment of your voice.</p>'+
 '</section>';
 const main=document.querySelector('main'),home=$('entry');
 if(!main||!home)return;
 main.insertAdjacentHTML('beforeend',html);
 const trigger=document.createElement('button');trigger.type='button';trigger.id='conversationOpen';trigger.className='csconv-home';trigger.innerHTML='<span class="csconv-home-icon">✳</span><span><strong>Start a conversation</strong><small>Meet someone, make a call, or start a chat</small></span><span aria-hidden="true">→</span>';
 const beneath=home.querySelector('.beneath');
 if(beneath) beneath.insertAdjacentElement('afterend',trigger);else home.append(trigger);
 const endpoint=String(window.CS_COACH_API_URL||'').trim().replace(/\/$/,'');
 const aiReady=/^https:\/\/[a-z0-9.-]+(?:\/[a-z0-9/_-]+)?$/i.test(endpoint);
 const state={scene:null,turn:0,history:[],userLines:[],busy:false,aiFailed:false,recognizer:null,session:0};
 function msg(role,line){const box=document.createElement('div');box.className='csconv-message '+(role==='you'?'csconv-you':'csconv-other');const cap=document.createElement('span');cap.textContent=role==='you'?'You':'The other person';const p=document.createElement('p');p.textContent=line;box.append(cap,p);$('convMessages').append(box);$('convMessages').scrollTop=$('convMessages').scrollHeight}
 function status(t){$('convNotice').textContent=t}
 function setStage(open){document.body.classList.toggle('csconv-open',open);$('conversationScreen').hidden=!open; if(open){$('entry').hidden=true; window.scrollTo(0,0)}else{stopVoice();$('entry').hidden=false;window.scrollTo(0,0)} }
 function stopVoice(){if(state.recognizer){try{state.recognizer.abort()}catch(_){}state.recognizer=null}}
 function open(){state.session++;state.busy=false;state.scene=null;state.turn=0;state.history=[];state.userLines=[];state.aiFailed=false;$('convChooser').hidden=false;$('convActive').hidden=true;$('convDone').hidden=true;$('convMessages').replaceChildren();$('convPrivacy').textContent=aiReady?'AI practice, when available: your typed messages are sent to your configured coaching service. Otherwise guided examples are used.':'Guided preview: fictional responses; your text stays in this browser tab. No AI scoring.';setStage(true)}
 function close(){setStage(false)}
 function start(key){if(!scenes[key])return;state.session++;state.busy=false;state.scene=key;state.turn=0;state.history=[];state.userLines=[];state.aiFailed=false;
  $('convInput').hidden=false;$('convSend').hidden=false;$('convUse').hidden=false;
  const d=scenes[key];$('convChooser').hidden=true;$('convDone').hidden=true;$('convActive').hidden=false;
  $('convLabel').textContent=d.label;$('convScene').textContent=d.where;$('convMessages').replaceChildren();$('convFinish').hidden=true;
  $('convInput').value='';$('convSuggestion').textContent=d.opener;$('convSuggestLabel').textContent='One natural opening';$('convStep').textContent='1 of 3';
  $('convSend').disabled=false;$('convSend').textContent='Continue the conversation →';status('A helpful starting line, not a script you must memorize.');
  $('convInput').focus();
 }
 function applySuggestion(){const v=$('convSuggestion').textContent.trim();$('convInput').value=v;$('convInput').focus();status('Make it sound like you. Change any details that do not fit.')}
 function guidedResponse(line){
  const d=scenes[state.scene],n=Math.min(state.turn,2);
  const reply=d.replies[n],suggestion=d.next[n];
  return {reply,suggestion,tip:'Respond to something they shared, then ask one easy question or offer a small detail about yourself.',source:'guided'};
 }
 async function aiResponse(line){
  if(!aiReady||state.aiFailed)return null;
  const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),12000);
  try{
   const response=await fetch(endpoint+'/conversation',{method:'POST',credentials:'omit',mode:'cors',cache:'no-store',headers:{'Content-Type':'application/json'},signal:controller.signal,
    body:JSON.stringify({scenario:state.scene,turn:state.turn+1,latest:line,history:state.history.slice(-6)})});
   if(!response.ok)throw Error('unavailable');
   const data=await response.json();
   if(typeof data.reply!=='string'||typeof data.suggestion!=='string'||!data.reply.trim()||!data.suggestion.trim())throw Error('invalid');
   return {reply:data.reply.slice(0,380),suggestion:data.suggestion.slice(0,380),tip:typeof data.tip==='string'?data.tip.slice(0,200):'',source:'ai'};
  }catch(_){state.aiFailed=true;return null}finally{clearTimeout(timeout)}
 }
 async function send(){
  if(state.busy||!state.scene||state.turn>=3)return;
  const line=$('convInput').value.trim();
  if(!line){status('Write a line in your own words, or choose “Use this idea.”');$('convInput').focus();return}
  if(line.includes('[')||line.includes(']')){status('Replace the bracketed example with something true for you.');return}
  state.busy=true;const session=state.session;$('convSend').disabled=true;status(aiReady&&!state.aiFailed?'Thinking about a natural reply…':'');
  msg('you',line);state.history.push({role:'you',text:line});state.userLines.push(line);$('convInput').value='';
  const n=state.turn;
  const result=(await aiResponse(line))||guidedResponse(line);
  if(session!==state.session||!document.body.classList.contains('csconv-open')||state.scene===null){state.busy=false;return}
  msg('other',result.reply);state.history.push({role:'other',text:result.reply});state.turn++;
  $('convFinish').hidden=false;
  if(state.turn>=3){
   $('convSuggestion').textContent=scenes[state.scene].ending;
   $('convSuggestLabel').textContent='A natural way to finish';
   $('convInput').hidden=true;$('convSend').hidden=true;$('convUse').hidden=true;$('convStep').textContent='3 of 3';
   $('convFinish').textContent='Finish and reflect →';
  }else{
   $('convStep').textContent=(state.turn+1)+' of 3';
   $('convSuggestLabel').textContent='You could say next';
   $('convSuggestion').textContent=result.suggestion;
   $('convInput').hidden=false;$('convSend').hidden=false;$('convUse').hidden=false;
   $('convSend').disabled=false;$('convSend').textContent='Continue the conversation →';
  }
  status(result.source==='ai'?'AI-generated roleplay. Adjust the suggested wording to sound like you.':(aiReady&&state.aiFailed?'AI unavailable, so this is a guided example, not live AI.':'Guided example — the other person’s reply is fictional.'));
  state.busy=false;
 }
 function finish(){
  if(!state.userLines.length){status('Try one exchange before finishing.');return}
  const txt=state.userLines.join(' '),qs=(txt.match(/[?]/g)||[]).length,share=(txt.match(/\b(I|my|me|mine|we|our)\b/gi)||[]).length;
  let advice;
  if(qs===0) advice='You started the conversation. Next time, ask one genuine follow-up about what the person shared.';
  else if(qs>=3&&share===0)advice='You showed curiosity. Try sharing a small, genuine detail about yourself too, so the conversation feels mutual.';
  else if(share>0&&qs>0)advice='You included both curiosity and something personal. Next time, practise a relaxed closing.';
  else advice='You added something of yourself. Next time, follow up on a detail they shared.';
  $('convLearning').textContent=advice;
  $('convActive').hidden=true;$('convDone').hidden=false;$('convChooser').hidden=true;status('');window.scrollTo(0,0);
 }
 function dictate(){
  const Speech=window.SpeechRecognition||window.webkitSpeechRecognition;if(!Speech)return;
  stopVoice();const rec=new Speech();state.recognizer=rec;rec.lang='en-US';rec.interimResults=false;rec.maxAlternatives=1;status('Listening…');
  rec.onresult=e=>{const heard=Array.from(e.results).map(x=>x[0]?.transcript||'').join(' ').trim();if(heard)$('convInput').value=($('convInput').value.trim()+' '+heard).trim();status('Review the words, then continue.');};
  rec.onerror=()=>status('Microphone dictation is unavailable. You can type or use your phone keyboard microphone.');
  rec.onend=()=>{if(state.recognizer===rec)state.recognizer=null};
  try{rec.start()}catch(_){status('Use your phone keyboard microphone or type your words.')}
 }
 trigger.addEventListener('click',open);$('convBack').addEventListener('click',close);
 document.querySelectorAll('[data-conv]').forEach(b=>b.addEventListener('click',()=>start(b.dataset.conv)));
 $('convUse').addEventListener('click',applySuggestion);$('convSend').addEventListener('click',send);
 $('convInput').addEventListener('keydown',e=>{if(e.key==='Enter'&&(e.ctrlKey||e.metaKey)){e.preventDefault();send()}});
 $('convFinish').addEventListener('click',finish);$('convAgain').addEventListener('click',open);
 const speechSupported=!!(window.SpeechRecognition||window.webkitSpeechRecognition);$('convDictate').hidden=!speechSupported;
 $('convDictate').addEventListener('click',dictate);
 ['trainLink','footerTrain'].forEach(id=>$(id)?.addEventListener('click',()=>{if(document.body.classList.contains('csconv-open'))close()},true));
 window.addEventListener('pagehide',stopVoice);
 window.CSConversation={open,close};
})();