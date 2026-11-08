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
 '<h1 id="convTitle">Tell me the <em>situation.</em></h1>'+
 '<p class="csconv-sub">Who do you want to speak to, and why? Just a sentence or two is enough.</p>'+
 '<div id="convChooser"><label class="csconv-question" for="convSituation">What is happening?</label>'+
 '<textarea id="convSituation" rows="4" maxlength="750" placeholder="I met someone at a conference. I would like to reconnect, but I am not sure how to start…"></textarea>'+
 '<p class="csconv-channel-label">How will you connect?</p><div class="csconv-choices">'+
 '<button type="button" data-conv="meet" class="selected" aria-pressed="true"><span class="csconv-symbol">✳</span><strong>In person</strong></button>'+
 '<button type="button" data-conv="call" aria-pressed="false"><span class="csconv-symbol">☎</span><strong>Phone call</strong></button>'+
 '<button type="button" data-conv="chat" aria-pressed="false"><span class="csconv-symbol">✉</span><strong>Message</strong></button>'+
 '</div><div class="csconv-examples"><span>Try an example</span>'+
 '<button type="button" data-example="conference">After an event</button><button type="button" data-example="school">Another parent</button>'+
 '<button type="button" data-example="work">New colleague</button></div>'+
 '<p id="convSetupStatus" class="csconv-notice" role="status"></p>'+
 '<button type="button" id="convPrepare" class="primary-btn">Guide me →</button>'+
 '<p class="csconv-disclaimer">Guided examples work without AI. When connected, your description is sent to a secure AI coaching service.</p></div>'+
 '<div id="convPlan" hidden>'+
 '<button type="button" class="back-link" id="convEdit">← Edit the situation</button>'+
 '<p class="csconv-context" id="convPlanContext"></p>'+
 '<div class="csconv-card"><span class="csconv-eyebrow">A natural way to start</span><p id="convOpener"></p>'+
 '<button type="button" id="convOther" class="csconv-use">Try a different opening ↻</button></div>'+
 '<div class="csconv-plan-list"><div><span class="csconv-eyebrow">If they respond</span><p id="convFollowOne"></p></div>'+
 '<div><span class="csconv-eyebrow">Keep it mutual</span><p id="convFollowTwo"></p></div>'+
 '<div><span class="csconv-eyebrow">Close naturally</span><p id="convClosing"></p></div></div>'+
 '<p id="convPlanSource" class="csconv-disclaimer"></p>'+
 '<button type="button" id="convPractice" class="primary-btn">Practise the conversation →</button></div>'+
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
 const trigger=document.createElement('button');trigger.type='button';trigger.id='conversationOpen';trigger.className='csconv-home';trigger.innerHTML='<span class="csconv-home-icon">✳</span><span><strong>Start a conversation</strong><small>Describe your situation. Find natural words.</small></span><span aria-hidden="true">→</span>';
 const beneath=home.querySelector('.beneath');
 if(beneath) beneath.insertAdjacentElement('afterend',trigger);else home.append(trigger);
 const endpoint=String(window.CS_COACH_API_URL||'').trim().replace(/\/$/,'');
 const aiReady=/^https:\/\/[a-z0-9.-]+(?:\/[a-z0-9/_-]+)?$/i.test(endpoint);
 const state={scene:'meet',situation:'',plan:null,alternate:false,manualChannel:false,turn:0,history:[],userLines:[],busy:false,aiFailed:false,recognizer:null,session:0};
 function msg(role,line){const box=document.createElement('div');box.className='csconv-message '+(role==='you'?'csconv-you':'csconv-other');const cap=document.createElement('span');cap.textContent=role==='you'?'You':'The other person';const p=document.createElement('p');p.textContent=line;box.append(cap,p);$('convMessages').append(box);$('convMessages').scrollTop=$('convMessages').scrollHeight}
 function status(t){$('convNotice').textContent=t}
 function setStage(open){document.body.classList.toggle('csconv-open',open);$('conversationScreen').hidden=!open; if(open){$('entry').hidden=true; window.scrollTo(0,0)}else{stopVoice();$('entry').hidden=false;window.scrollTo(0,0)} }
 function stopVoice(){if(state.recognizer){try{state.recognizer.abort()}catch(_){}state.recognizer=null}}
 function setScene(key,manual=true){if(!scenes[key])return;state.scene=key;if(manual)state.manualChannel=true;document.querySelectorAll('[data-conv]').forEach(b=>{const selected=b.dataset.conv===key;b.classList.toggle('selected',selected);b.setAttribute('aria-pressed',String(selected))})}
 function detectScene(input){const t=input.toLowerCase();return /\b(phone|call|telephone|ring)\b/.test(t)?'call':/\b(whatsapp|text|message|dm|email|online chat)\b/.test(t)?'chat':'meet'}
 function suggestPlan(situation,scene){
  const t=situation.toLowerCase();const has=re=>re.test(t);
  const school=has(/\b(school|teacher|daycare|parent|children|kids|pickup)\b/);
  const event=has(/\b(conference|event|seminar|networking|workshop)\b/);
  const coworker=has(/\b(colleague|coworker|co-worker|manager|boss|team)\b/);
  const neighbor=has(/\b(neighbou?r|building)\b/);
  const wedding=has(/\b(wedding|bride|groom)\b/);
  const know=has(/\b(met|spoke|talked|chatted|reconnect|again|already know|catch up)\b/);
  const advice=has(/\b(advice|guidance|opinion|perspective|recommendation)\b/);
  let opener='',alternate='',followOne='',followTwo='',close='';
  if(school){opener="Hi, I think we've seen each other around school. How's your week going?";alternate="Hi, nice to meet you. How has the school routine been for you?";
   followOne="If they mention their children, ask what the kids have been enjoying lately.";followTwo="Share one small detail about your own family's experience.";close="Nice chatting. See you around school!";
  }else if(event){opener=know?"Hi, it was nice meeting you at the event. How have things been since?":"Hi, I don't think we've met. What brought you to this event?";
   alternate="What has been the most interesting part of this event for you?";followOne="Follow up on one thing they found interesting at the event.";followTwo="Share what drew you to the event, then invite their perspective.";close="I enjoyed chatting. Hope we cross paths again!";
  }else if(coworker){opener="Hi, I don't think we've properly met yet. How's your week going?";alternate=advice?"Would you mind if I asked your perspective on something?":"What brought you into this line of work?";
   followOne="Ask what they enjoy or find most interesting about their work.";followTwo="Offer a little about what you do, without turning it into a presentation.";close="It was great meeting you. Hope we get to chat again.";
  }else if(neighbor){opener="Hi, I don't think we've properly met. How are you doing?";alternate="Hi! Have you been living around here long?";
   followOne="Ask about a local place or activity they mention.";followTwo="Share one genuine thing you enjoy about the neighborhood.";close="Nice meeting you. See you around!";
  }else if(wedding){opener="Hi, I don't think we've met. How do you know the couple?";alternate="What a lovely occasion. Are you here with family or friends?";
   followOne="If they share a story, ask how they know the couple.";followTwo="Share a small personal story if it fits naturally.";close="Lovely chatting. Enjoy the celebration!";
  }else{opener=know?"Hi, good to see you again! How have things been?":"Hi, I don't think we've met. How's your day going?";
   alternate=advice?"Could I ask your perspective on something?":"What's been keeping you busy lately?";
   followOne="Pick up one detail they mention and ask an easy follow-up.";followTwo="Share one genuine detail about yourself so it doesn't feel like an interview.";close="Nice talking with you. Enjoy the rest of your day!";
  }
  if(scene==='call'){opener=know?"Hi, it's nice to catch up. Is now a good time for a quick chat?":"Hi, is now a good time for a quick call? I'd like to introduce myself.";alternate="Would you have a few minutes to talk? I wanted to connect.";}
  if(scene==='chat'){opener=know?"Hi! It was good meeting you. How has your week been?":coworker?"Hi! I thought I'd introduce myself since we're on the same team. How's your week going?":"Hi! I thought I'd reach out and say hello. How's your week going?";alternate="Hey, I hope your week is going well. How have things been?";}
  const topic=has(/\b(emergency|preparedness|humanitarian)\b/)?'emergency preparedness':
    has(/\b(logistics|supply chain|procurement)\b/)?'supply chain work':
    has(/\b(travel|vacation|trip)\b/)?'travel':
    has(/\b(technology|software|ai)\b/)?'technology':
    has(/\b(sport|football)\b/)?'sports':'';
  if(topic)followOne='If the subject comes up, ask what interests them about '+topic+'.';
  if(advice&&!coworker)followTwo="If you're seeking advice, ask permission first, then keep your question specific.";
  return {opener,alternate,followups:[followOne,followTwo],closing:close,source:'guided'};
 }
 function planSource(){return state.plan?.source==='ai'?'AI-tailored suggestions. Adjust the words to your own voice.':
  (state.aiFailed?'AI unavailable; these are guided examples based on your description.':
   'Guided examples based on a few details in your description. They are not live AI analysis.');}
 function renderPlan(){if(!state.plan)return;const p=state.plan;
  $('convPlanContext').textContent=scenes[state.scene].label+' · '+state.situation.slice(0,160)+(state.situation.length>160?'…':'');
  $('convOpener').textContent=state.alternate?p.alternate:p.opener;
  $('convOther').textContent=state.alternate?'Back to first opening ↻':'Try a different opening ↻';
  $('convFollowOne').textContent=p.followups[0];$('convFollowTwo').textContent=p.followups[1];
  $('convClosing').textContent=p.closing;$('convPlanSource').textContent=planSource();
 }
 async function prepare(){const situation=$('convSituation').value.replace(/\s+/g,' ').trim();
  if(situation.length<7){$('convSetupStatus').textContent='Please describe the situation in a few words, or try an example.';$('convSituation').focus();return}
  state.situation=situation;state.session++;const session=state.session;state.alternate=false;state.aiFailed=false;
  state.plan=suggestPlan(situation,state.scene);$('convChooser').hidden=true;$('convPlan').hidden=false;$('convActive').hidden=true;$('convDone').hidden=true;renderPlan();
  if(!aiReady)return;
  $('convPlanSource').textContent='Guided ideas ready. Checking for an AI-tailored suggestion…';
  const ctrl=new AbortController();const timeout=setTimeout(()=>ctrl.abort(),12000);
  try{
   const res=await fetch(endpoint+'/conversation-plan',{method:'POST',mode:'cors',credentials:'omit',cache:'no-store',
      headers:{'Content-Type':'application/json'},signal:ctrl.signal,body:JSON.stringify({situation,channel:state.scene})});
   if(!res.ok)throw Error('unavailable');const p=await res.json();
   if(session!==state.session||$('convPlan').hidden)return;
   if(typeof p.opener==='string'&&typeof p.alternate==='string'&&Array.isArray(p.followups)&&p.followups.length>=2&&typeof p.closing==='string'){
    const safe=x=>String(x||'').trim().slice(0,350);
    state.plan={opener:safe(p.opener),alternate:safe(p.alternate),followups:p.followups.slice(0,2).map(safe),closing:safe(p.closing),source:'ai'};
   }
  }catch(_){state.aiFailed=true}finally{clearTimeout(timeout);if(session===state.session&&!$('convPlan').hidden)renderPlan()}
 }
 function open(){state.session++;state.busy=false;state.scene='meet';state.situation='';state.plan=null;state.manualChannel=false;state.turn=0;state.history=[];state.userLines=[];state.aiFailed=false;
   $('convChooser').hidden=false;$('convPlan').hidden=true;$('convActive').hidden=true;$('convDone').hidden=true;$('convSituation').value='';$('convSetupStatus').textContent='';setScene('meet',false);
   $('convMessages').replaceChildren();$('convPrivacy').textContent=aiReady?'Your description and typed replies may be sent to your configured AI coaching service.':'Guided preview: your description and replies stay in this browser tab; no AI scoring.';
   setStage(true)
 }
 function close(){state.session++;setStage(false)}
 function start(){if(!state.plan)return;state.session++;state.busy=false;state.turn=0;state.history=[];state.userLines=[];state.aiFailed=false;
  $('convInput').hidden=false;$('convSend').hidden=false;$('convUse').hidden=false;
  $('convChooser').hidden=true;$('convPlan').hidden=true;$('convDone').hidden=true;$('convActive').hidden=false;
  $('convLabel').textContent=scenes[state.scene].label;$('convScene').textContent=state.situation;$('convMessages').replaceChildren();$('convFinish').hidden=true;
  $('convInput').value='';$('convSuggestion').textContent=state.alternate?state.plan.alternate:state.plan.opener;$('convSuggestLabel').textContent='Start with an opening';$('convStep').textContent='1 of 3';
  $('convSend').disabled=false;$('convSend').textContent='Continue the conversation →';status('A starting line, not a script you have to memorize.');
  $('convInput').focus();
 }
 function applySuggestion(){const v=$('convSuggestion').textContent.trim();$('convInput').value=v;$('convInput').focus();status('Make it sound like you. Change any details that do not fit.')}
 function guidedResponse(line){
  const n=Math.min(state.turn,2),t=state.situation.toLowerCase();
  let replies=[],next=[];
  if(/\b(school|teacher|daycare|parent|children|kids|pickup)\b/.test(t)){
   replies=["Hi! Nice meeting you. It's been a busy week with the kids. How about you?","They've been enjoying their time outside lately. What about yours?","It was lovely chatting. See you at pickup!"];
   next=["That sounds nice. What have the kids been enjoying recently?","It's nice to meet another parent here. What do you like doing with the kids after school?"];
  }else if(/\b(colleague|coworker|co-worker|manager|boss|team)\b/.test(t)){
   replies=["Hi! Nice meeting you too. I'm still getting to know everyone. How long have you been here?","There's a lot to learn, but I'm enjoying it. How about your work?","It was good chatting. Let's catch up again sometime."];
   next=["That's interesting. What part of your work do you enjoy most?","I've enjoyed hearing your perspective. What got you interested in this work?"];
  }else if(/\b(conference|event|seminar|networking|workshop)\b/.test(t)){
   replies=["Nice to hear from you! It was an interesting event. How have you been?","I enjoyed meeting people from different backgrounds. What about you?","I'm glad we caught up. Let's stay in touch."];
   next=["I enjoyed the chance to connect too. What stood out to you most at the event?","That's interesting. Have you been to other events like it?"];
  }else if(/\b(neighbou?r|building)\b/.test(t)){
   replies=["Hi, nice meeting you! It's been a lovely week. How about yours?","I've been enjoying the area. Have you been here long?","It was good chatting. See you around!"];
   next=["Nice! Is there a place nearby you especially like?","It's good getting to know the neighbours. What's your favourite thing about the area?"];
  }else if(/\b(wedding|bride|groom)\b/.test(t)){
   replies=["Nice to meet you! I've known the couple for a while. How about you?","It's such a lovely celebration, isn't it?","Lovely chatting. Enjoy the rest of the day!"];
   next=["That's lovely. How long have you known them?","Have you had a favourite moment of the day so far?"];
  }else{
   const d=scenes[state.scene];replies=d.replies;
   next=d.next;
  }
  return {reply:replies[n],suggestion:next[n]||state.plan?.closing||scenes[state.scene].ending,
   tip:'This is a fictional practice reply. Listen for one detail and respond naturally.',source:'guided'};
 }
 async function aiResponse(line){
  if(!aiReady||state.aiFailed)return null;
  const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),12000);
  try{
   const response=await fetch(endpoint+'/conversation',{method:'POST',credentials:'omit',mode:'cors',cache:'no-store',headers:{'Content-Type':'application/json'},signal:controller.signal,
    body:JSON.stringify({scenario:state.scene,situation:state.situation,turn:state.turn+1,latest:line,history:state.history.slice(-6)})});
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
   $('convSuggestion').textContent=state.plan?.closing||scenes[state.scene].ending;
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
 document.querySelectorAll('[data-conv]').forEach(b=>b.addEventListener('click',()=>setScene(b.dataset.conv)));
 $('convSituation').addEventListener('input',()=>{if(!state.manualChannel)setScene(detectScene($('convSituation').value),false);$('convSetupStatus').textContent=''});
 const samples={conference:"I met someone briefly at a conference and I want to reconnect, but I'm unsure how to begin.",
 school:"I see another parent at school pickup and I would like to introduce myself and have a friendly chat.",
 work:"A new colleague joined the team and I want to introduce myself naturally."};
 document.querySelectorAll('[data-example]').forEach(b=>b.addEventListener('click',()=>{$('convSituation').value=samples[b.dataset.example];state.manualChannel=false;setScene('meet',false)}));
 $('convPrepare').addEventListener('click',prepare);
 $('convEdit').addEventListener('click',()=>{state.session++;$('convPlan').hidden=true;$('convChooser').hidden=false});
 $('convOther').addEventListener('click',()=>{state.alternate=!state.alternate;renderPlan()});
 $('convPractice').addEventListener('click',start);
 $('convUse').addEventListener('click',applySuggestion);$('convSend').addEventListener('click',send);
 $('convInput').addEventListener('keydown',e=>{if(e.key==='Enter'&&(e.ctrlKey||e.metaKey)){e.preventDefault();send()}});
 $('convFinish').addEventListener('click',finish);$('convAgain').addEventListener('click',open);
 const speechSupported=!!(window.SpeechRecognition||window.webkitSpeechRecognition);$('convDictate').hidden=!speechSupported;
 $('convDictate').addEventListener('click',dictate);
 ['trainLink','footerTrain'].forEach(id=>$(id)?.addEventListener('click',()=>{if(document.body.classList.contains('csconv-open'))close()},true));
 window.addEventListener('pagehide',stopVoice);
 window.CSConversation={open,close};
})();