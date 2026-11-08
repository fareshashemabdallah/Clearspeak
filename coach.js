/* ClearSpeak Natural Coach: secure optional AI rewrites, no API keys in the browser. */
'use strict';
(()=>{
 const $=id=>document.getElementById(id);
 const endpoint=String(window.CS_COACH_API_URL||'').trim();
 const configured=/^https:\/\/[a-z0-9.-]+(?:\/[a-z0-9/_-]+)?\/?$/i.test(endpoint);
 let recognizer=null;
 async function rewrite({text,context='general',language='en'}){
  if(!configured||language!=='en')return null;
  const abort=new AbortController();
  const timeout=setTimeout(()=>abort.abort(),14000);
  try{
   const response=await fetch(endpoint.replace(/\/$/,'')+'/rewrite',{
     method:'POST',mode:'cors',cache:'no-store',credentials:'omit',
     headers:{'Content-Type':'application/json'},signal:abort.signal,
     body:JSON.stringify({text:String(text||'').slice(0,1500),context})
   });
   if(!response.ok)throw new Error('Service unavailable');
   const data=await response.json();
   const parts=(Array.isArray(data.parts)?data.parts:[]).filter(x=>typeof x==='string'&&x.trim()).slice(0,3).map(s=>s.trim().slice(0,350));
   const cues=(Array.isArray(data.cues)?data.cues:[]).filter(x=>typeof x==='string'&&x.trim()).slice(0,3).map(s=>s.trim().slice(0,70));
   if(!parts.length)throw new Error('Invalid response');
   return {parts,cues,coachingTip:typeof data.tip==='string'?data.tip.slice(0,180):'',source:'ai'};
  }finally{clearTimeout(timeout)}
 }
 function activateDictation(){
  const btn=$('dictateThought');
  if(!btn)return;
  const Speech=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!Speech){btn.hidden=true;return}
  btn.hidden=false;
  btn.addEventListener('click',()=>{
   if(recognizer){try{recognizer.stop()}catch(_){}return}
   const rec=new Speech();recognizer=rec;
   rec.lang='en-US';rec.continuous=false;rec.interimResults=false;
   btn.textContent='Stop';btn.setAttribute('aria-pressed','true');
   rec.onresult=e=>{
     const words=Array.from(e.results||[]).map(r=>r[0]?.transcript||'').join(' ').trim();
     if(!words)return;
     const field=$('thought');field.value=(field.value.trim()?field.value.trim()+' ':'')+words;
     field.dispatchEvent(new Event('input',{bubbles:true}));field.focus();
   };
   rec.onend=()=>{recognizer=null;btn.textContent='Speak';btn.setAttribute('aria-pressed','false')};
   rec.onerror=()=>{btn.title='Use the microphone on your phone keyboard instead.'};
   try{rec.start()}catch(_){recognizer=null;btn.textContent='Speak';btn.setAttribute('aria-pressed','false')}
  });
 }
 document.addEventListener('DOMContentLoaded',activateDictation);
 window.CSCoach={rewrite,configured};
})();