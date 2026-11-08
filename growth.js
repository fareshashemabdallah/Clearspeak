/* ClearSpeak private before/after practice. Audio stays only in this tab. */
'use strict';
(()=>{
 const $=id=>document.getElementById(id);
 const checkin=$('checkin'),training=$('training');
 if(!checkin||!training)return;
 const KEY='cs_growth_days_v1';
 let takes=[],urls=[],finished=false;
 const card=document.createElement('section');
 card.id='growthCompare';card.className='growth-compare';card.hidden=true;card.setAttribute('aria-live','polite');
 card.innerHTML='<div class="growth-heading"><span class="growth-spark" aria-hidden="true">✳</span><strong>Hear your progress</strong></div><p id="growthHelp" class="growth-help"></p><div id="growthTakes" class="growth-takes"></div><p class="growth-privacy">Listen to your own recordings. There is no AI pronunciation score yet. Recordings are cleared when you start a new thought.</p>';
 const oldReview=$('voiceReview');
 if(oldReview)oldReview.insertAdjacentElement('afterend',card);
 else checkin.querySelector('.feeling-choice')?.insertAdjacentElement('beforebegin',card);
 const week=document.createElement('div');week.className='growth-week';week.id='growthWeek';
 training.querySelector('.daily-disclaimer')?.insertAdjacentElement('beforebegin',week);
 function localDay(d){return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')}
 function history(){try{const a=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(a)?a.filter(s=>typeof s==='string').slice(-90):[]}catch(_){return []}}
 function renderWeek(){
  const today=new Date();today.setHours(12,0,0,0);
  const days=[];for(let i=6;i>=0;i--){const d=new Date(today);d.setDate(d.getDate()-i);days.push(localDay(d))}
  const found=new Set(history());const n=days.filter(d=>found.has(d)).length;
  week.replaceChildren();
  const label=document.createElement('div');label.className='growth-week-label';
  const heading=document.createElement('strong');heading.textContent='Your recent practice';
  const desc=document.createElement('span');desc.textContent=n?'You practised on '+n+' of the last 7 days.':'Your first speaking moment starts here.';
  label.append(heading,desc);
  const marks=document.createElement('div');marks.className='growth-days';marks.setAttribute('aria-hidden','true');
  days.forEach(d=>{const dot=document.createElement('span');dot.className='growth-day'+(found.has(d)?' is-done':'');marks.append(dot)});
  week.append(label,marks);
 }
 function markDay(){try{localStorage.setItem(KEY,JSON.stringify([...new Set([...history(),localDay(new Date())])].sort().slice(-90)))}catch(_){}renderWeek()}
 function draw(){
  card.hidden=!takes.length;if(!takes.length)return;
  if(oldReview)oldReview.hidden=true;
  $('growthHelp').textContent=takes.length<2?
    'This is your first take. Listen once, then choose “Say it once more” to compare your next attempt.':
    'Listen to both. What changed in your clarity, pauses, or ending?';
  const root=$('growthTakes');root.replaceChildren();
  takes.forEach((take,i)=>{
   const item=document.createElement('div');item.className='growth-take';
   const label=document.createElement('div');label.className='growth-take-label';
   const title=document.createElement('strong');title.textContent=i===0?'First take':'Second take';
   const duration=document.createElement('span');duration.textContent=Math.max(1,Math.round(take.durationMs/1000))+' sec';
   label.append(title,duration);
   const audio=document.createElement('audio');audio.controls=true;audio.preload='none';audio.src=take.url;audio.setAttribute('aria-label',title.textContent+' recording');
   item.append(label,audio);root.append(item);
  });
 }
 function clear(){
  urls.forEach(u=>URL.revokeObjectURL(u));urls=[];takes=[];finished=false;
  card.hidden=true;$('growthTakes').replaceChildren();
 }
 document.addEventListener('clearspeak:recording',e=>{
  const blob=e.detail?.blob;if(!(blob instanceof Blob)||blob.size<200)return;
  if(takes.length>=2){URL.revokeObjectURL(urls[1]);takes.pop();urls.pop()}
  const url=URL.createObjectURL(blob);urls.push(url);
  takes.push({url,durationMs:Math.max(0,e.detail.durationMs||0)});
  if(!checkin.hidden)draw();
 });
 $('doneSpeaking')?.addEventListener('click',()=>{finished=true;requestAnimationFrame(draw)});
 $('practice')?.addEventListener('click',clear);
 $('retrySpeaking')?.addEventListener('click',()=>card.hidden=true);
 $('backCheckin')?.addEventListener('click',()=>card.hidden=true);
 $('backResult')?.addEventListener('click',clear);
 $('nextAction')?.addEventListener('click',()=>{if(finished)markDay();clear()});
 $('trainLink')?.addEventListener('click',renderWeek);
 $('footerTrain')?.addEventListener('click',renderWeek);
 window.addEventListener('pagehide',clear);
 renderWeek();
})();