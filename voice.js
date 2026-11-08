/* ClearSpeak Voice Moments: optional, private-in-tab playback and focused articulation practice.
   No audio is uploaded or stored by this app. Optional browser speech recognition may use vendor services. */
'use strict';
(()=>{
 const $=id=>document.getElementById(id);
 const text={
  en:{focus:'SAY THIS CLEARLY',rhythm:'YOUR RHYTHM',ending:'YOUR ENDING',warm:'Slowly → naturally → in your sentence.',pace:'Add a small pause after the main point. Keep the rest conversational.',influence:'Finish your recommendation calmly, with a gentle downward tone.',hear:'Hear word',change:'Another word',start:'With microphone permission, you can listen to your own attempt.',recording:'Recording your attempt…',saved:'Your recording is ready below.',unavailable:'Mic unavailable here. You can still practise normally.',denied:'Microphone not available or permission denied. You can still finish your practice.',reviewTitle:'Listen to your attempt',reviewDesc:'Notice one thing: was the key word clear, and did your message finish confidently?',reviewTip:'A playback is for your own listening—not an automated pronunciation score.',speech:'Check spoken words (optional)',speechHint:'This uses your browser’s speech service, which may process audio online. Not a pronunciation test.',speechGo:'Speak your sentence again',speechWorking:'Listening to your second attempt…',speechHeard:'Browser heard:',speechNo:'Browser speech recognition is unavailable; you can use the recording instead.',speechError:'Speech recognition did not return words. Try again or review your recording.',speechRecognized:'Your key word was recognized. Now listen for pace and clear endings.',speechUnrecognized:'The key word was not captured in this transcript. Listen to your recording; recognition can be inaccurate.',speechNoWord:'Compare your main point with the transcript, then listen for rhythm.',noRec:'Practice without recording is perfectly fine.',paceNote:'Practise the pause before your closing point.',wordNote:'Listen to the word, then repeat it slowly and at normal speed.',influenceNote:'End the recommendation, then stop—no extra explanation.'},
  ar:{focus:'ركّز على هالكلمة',rhythm:'إيقاع الكلام',ending:'خاتمة واضحة',warm:'ببطء ← بطبيعتك ← ضمن الجملة.',pace:'خُد وقفة صغيرة بعد الفكرة الأساسية واحكِ الباقي بطبيعتك.',influence:'اختم توصيتك بصوت هادئ ونبرة مستقرة.',hear:'اسمع الكلمة',change:'كلمة تانية',start:'إذا سمحت للميكروفون، فيك تسمع محاولتك بعد الكلام.',recording:'عم نسجّل محاولتك…',saved:'صار فيك تسمع تسجيلك تحت.',unavailable:'الميكروفون غير متاح. فيك تكمّل التدريب بشكل عادي.',denied:'الميكروفون مش متاح أو ما عطيت إذن. فيك تكمّل بشكل عادي.',reviewTitle:'اسمع محاولتك',reviewDesc:'انتبه لشغلة واحدة: الكلمة طلعت واضحة؟ وختمت فكرتك بثقة؟',reviewTip:'الاستماع لتسجيلك تدريب شخصي، مش تقييم آلي للفظ.',speech:'تعرّف على الكلمات (اختياري)',speechHint:'قد يستخدم المتصفح خدمة خارجية لتحويل صوتك لنص. هيدا مش اختبار لفظ.',speechGo:'احكي الجملة مرة تانية',speechWorking:'عم يسمع محاولتك التانية…',speechHeard:'الكلمات اللي فهمها المتصفح:',speechNo:'التعرّف على الكلام مش متاح. فيك تسمع تسجيلك.',speechError:'ما قدر المتصفح يفهم الكلام. جرّب من جديد أو اسمع تسجيلك.',speechRecognized:'المتصفح تعرّف على الكلمة. هلّق ركّز على الإيقاع والخاتمة.',speechUnrecognized:'المتصفح ما التقط هالكلمة. اسمع التسجيل؛ ممكن يكون التعرف على الكلام أخطأ.',speechNoWord:'قارن أول فكرة بالنص، واسمع الإيقاع.',noRec:'فيك تتدرّب من دون تسجيل.',paceNote:'ركّز على الوقفة قبل الخاتمة.',wordNote:'اسمع الكلمة، وقلها ببطء وبعدين بطبيعتك.',influenceNote:'اختم التوصية ووقف؛ مش ضروري تشرح زيادة.'}
 };
 let language='en', words=[], wordIndex=0, step=0, mode='quick', recording=null, stream=null, chunks=[], audioURL=null, requestId=0, recognizer=null;
 let started=false, speaking=false, sessionEpoch=0;
 const t=k=>text[language][k];
 const findWords=(message,lc)=>{
   const all=(message.match(/[\p{L}\p{M}]+/gu)||[]).map(w=>w.replace(/^ال/u,'ال'));
   const seen=new Set();
   const stop=lc==='ar'?new Set(['المكتب','المكاتب','يجب','لأن','هذا','تكون','نحن','على','عندما','بشكل']):new Set(['because','should','would','there','their','every','office','before','people','really','the','this']);
   let candidates=all.filter(w=>{
     const s=w.toLocaleLowerCase(); if(seen.has(s)||stop.has(s)||w.length<(lc==='ar'?5:7))return false;
     seen.add(s);return true;
   });
   const weights=lc==='en'?['preparedness','emergencies','anticipat','recommend','communicat','priorit','responsib','interruption','scenario']:['الجاهزي','الطوارئ','الاستجاب','التحضير','الاستعداد','المتوقعة','الأولوي','التوصي'];
   const rank=w=>{const v=w.toLocaleLowerCase();const i=weights.findIndex(x=>v.includes(x));return (i>=0?150-i*7:0)+Math.min(w.length,18)};
   candidates.sort((a,b)=>rank(b)-rank(a));
   if(!candidates.length)candidates=all.filter(w=>w.length>=4).slice(0,3);
   return candidates.slice(0,8);
 };
 const audioWidget=$('voiceAudio'), review=$('voiceReview'), micState=$('micState'), focusBox=$('speakingFocus');
 function setStatus(message){micState.textContent=message;}
 function render(){
   language=document.documentElement.lang==='ar'?'ar':'en';
   $('voiceFocusLabel').textContent=mode==='daily'&&step===1?t('rhythm'):mode==='daily'&&step===2?t('ending'):t('focus');
   $('voiceFocusHelp').textContent=step===1&&mode==='daily'?t('pace'):step===2&&mode==='daily'?t('influence'):t('warm');
   const target=words[wordIndex]||'';
   $('voiceFocusWord').textContent=target || (language==='ar'?'كلمتك':'Your word');
   $('hearWord').textContent='◖)) '+t('hear');
   $('nextWord').textContent=t('change');
   $('nextWord').hidden=words.length<=1||(mode==='daily'&&step!==0);
   focusBox.classList.toggle('focus-less',mode==='daily'&&step>0);
   $('voiceReviewTitle').textContent=t('reviewTitle');
   $('voiceReviewDesc').textContent=t('reviewDesc');
   $('voiceReviewTip').textContent=t('reviewTip');
   $('recognitionSummary').textContent=t('speech');
   $('recognitionHint').textContent=t('speechHint');
   $('recognitionStart').textContent=t('speechGo');
   if(!started&&!speaking)setStatus(t('start'));
 }
 function prepare({message,lang,trainingStep=0,trainingMode='quick'}){
   reset(); language=lang==='ar'?'ar':'en';mode=trainingMode;step=trainingStep;
   words=findWords(message,language);wordIndex=0;render();
 }
 function hearWord(){
   const w=words[wordIndex];if(!w||!('speechSynthesis' in window))return;
   speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(w);u.lang=language==='ar'?'ar':'en-US';u.rate=.76; speechSynthesis.speak(u);
 }
 function clearStream(){if(stream){stream.getTracks().forEach(t=>t.stop());stream=null}}
 function stop(){requestId++;started=false;
   if(recording&&recording.state!=='inactive')try{recording.stop()}catch(_){}
   clearStream();
 }
 function reset(){sessionEpoch++;stop();if(recognizer){try{recognizer.abort()}catch(_){} recognizer=null;}
   if(audioURL){URL.revokeObjectURL(audioURL);audioURL=null}
   chunks=[];review.hidden=true; audioWidget.removeAttribute('src');audioWidget.load();
   $('heardWords').hidden=true;$('heardWords').textContent='';$('speechTip').textContent='';$('recognitionStart').disabled=false;
   $('recognitionPanel').open=false;setStatus(t('start'));speaking=false;
 }
 async function start(){
   stop();const current=++requestId;const epoch=sessionEpoch;review.hidden=true;chunks=[];started=true;
   if(!navigator.mediaDevices?.getUserMedia||typeof MediaRecorder==='undefined'){setStatus(t('unavailable'));return}
   try{
     const s=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true}});
     if(current!==requestId||!started){s.getTracks().forEach(t=>t.stop());return}
     stream=s;
     const preferred=['audio/mp4','audio/webm;codecs=opus','audio/webm'].find(type=>MediaRecorder.isTypeSupported?.(type));
     recording=new MediaRecorder(s,preferred?{mimeType:preferred}:undefined);
     const type=recording.mimeType||preferred||'audio/webm';
     const recordedAt=performance.now();
     recording.ondataavailable=e=>{if(e.data?.size)chunks.push(e.data)};
     recording.onstop=()=>{
       if(epoch!==sessionEpoch||!chunks.length)return;
       if(audioURL)URL.revokeObjectURL(audioURL);
       const blob=new Blob(chunks,{type});
       audioURL=URL.createObjectURL(blob);
       audioWidget.src=audioURL;review.hidden=false;setStatus(t('saved'));
       document.dispatchEvent(new CustomEvent('clearspeak:recording',{detail:{blob,durationMs:performance.now()-recordedAt}}));
     };
     recording.onerror=()=>setStatus(t('unavailable'));
     recording.start();setStatus(t('recording'));
   }catch(_){started=false;clearStream();setStatus(t('denied'))}
 }
 function finish(){stop();}
 function nextWord(){if(!words.length)return;wordIndex=(wordIndex+1)%words.length;render()}
 function showTranscription(){
   const Speech=window.SpeechRecognition||window.webkitSpeechRecognition;
   if(!Speech){$('speechTip').textContent=t('speechNo');return}
   if(recognizer)try{recognizer.abort()}catch(_){}
   const rec=new Speech();recognizer=rec;rec.lang=language==='ar'?'ar-SA':'en-US';rec.continuous=false;rec.interimResults=false;rec.maxAlternatives=1;
   $('recognitionStart').disabled=true;$('speechTip').textContent=t('speechWorking');$('heardWords').hidden=true;
   rec.onresult=e=>{
     const heard=Array.from(e.results).map(r=>r[0]?.transcript||'').join(' ').trim();
     $('heardWords').textContent=t('speechHeard')+' '+heard;$('heardWords').hidden=false;
     const word=words[wordIndex];
     $('speechTip').textContent=word?(heard.toLocaleLowerCase().includes(word.toLocaleLowerCase())?t('speechRecognized'):t('speechUnrecognized')):t('speechNoWord');
   };
   rec.onerror=()=>{$('speechTip').textContent=t('speechError')};
   rec.onend=()=>{$('recognitionStart').disabled=false;recognizer=null};
   try{rec.start()}catch(_){$('recognitionStart').disabled=false;$('speechTip').textContent=t('speechError')}
 }
 $('hearWord').addEventListener('click',hearWord);
 $('nextWord').addEventListener('click',nextWord);
 $('recognitionStart').addEventListener('click',showTranscription);
 const supported=!!(window.SpeechRecognition||window.webkitSpeechRecognition);
 $('recognitionPanel').hidden=!supported;
 window.CSVoice={prepare,render,start,stop,reset,finish,getFocus:()=>words[wordIndex]||'',getTip:()=>step===1&&mode==='daily'?t('paceNote'):step===2&&mode==='daily'?t('influenceNote'):t('wordNote')};
 render();
})();