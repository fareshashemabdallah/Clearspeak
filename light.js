'use strict';
(()=>{
 const $=id=>document.getElementById(id);
 const phrases={
  en:{eyebrow:'FOR THOSE MOMENTS YOU WANT TO BE HEARD',hero1:'Find the words.',hero2:'Keep your voice.',sub:"Your thought doesn't need to be perfect. Start wherever you are.",question:'What do you want to say?',placeholder:'Write it just as it comes out…',try:'Try an example',meeting:'At work',interrupted:'Interrupted',home:'At home',create:'Help me say it',quietNote:'No pressure. No perfect wording. Just a clearer way forward.',back:'Edit my thought',resultEyebrow:"HERE'S A WAY TO SAY IT",resultTitle1:'Clear.',resultTitle2:'Still you.',practice:'Try saying it',listen:'Hear it',copy:'Copy',shorter:'Shorter',longer:'Full version',offline:'A simple on-device phrasing guide, not an AI rewrite. Check your meaning before using it.',backResult:'Back to my wording',practiceEyebrow:'YOUR TURN',practiceTitle1:'Say it',practiceTitle2:'without reading.',practiceIntro:"Remember only these cues. Speak naturally; you don't need to repeat the script word for word.",seconds:'seconds',start:'Start speaking',restart:'Start again',stop:'Stop timer',reset:'Reset timer',showScript:'Show script',hideScript:'Hide script',finish:'Did your main point come first?',yes:'Yes, it did',again:'Not yet — retry',footer:'One clear thought at a time.',footerTrain:'Explore the 28-day programme',train:'My training',empty:'Write a thought, or tap an example to try it.',listening:'Speaking…',unavailable:'Speech playback is not available in this browser.',copied:'Copied',copyFail:'Select the text and copy it manually.',shorttip:'Say the point first. You can explain more when someone asks.',gentletip:'Your point comes first. A short pause lets it land.',success:'That counts. One clear thought is progress.',retry:'Great. Try again, starting with the main point.',length:'About {n} sec to say',point:'MAIN POINT',reason:'ONE REASON',close:'NEXT STEP',pause:'•  small pause  •',samples:{meeting:'I want every country office to prepare for anticipated emergencies because delays in responding can cost time, money and lives.',interrupted:'People often interrupt me before I can finish, and I want to respond without raising my voice.',home:'I want us to plan a simple weekend activity with the kids without making it a long discussion.'}},
  ar:{eyebrow:'لمّا يكون عندك كلام مهم بدّك توصّله',hero1:'لا تضيع الفكرة.',hero2:'عبّر بطريقتك.',sub:'مش ضروري تكون كلماتك مرتّبة من أول مرة. ابدأ كما أنت.',question:'شو بدك تقول؟',placeholder:'اكتب الفكرة متل ما عم تجي ببالك…',try:'جرّب مثال',meeting:'بالشغل',interrupted:'عند المقاطعة',home:'بالبيت',create:'ساعدني عبّر عنها',quietNote:'بدون ضغط. بدون كلمات مثالية. بس فكرة أوضح.',back:'عدّل فكرتي',resultEyebrow:'هي طريقة أوضح للتعبير',resultTitle1:'واضحة.',resultTitle2:'وبتشبهك.',practice:'جرّب تقولها',listen:'اسمعها',copy:'انسخ',shorter:'اختصر',longer:'النص الكامل',offline:'أداة بسيطة لتنظيم الكلام على جهازك، وليست إعادة صياغة بالذكاء الاصطناعي. تأكد أن المعنى يناسبك.',backResult:'ارجع للنص',practiceEyebrow:'هلق دورك',practiceTitle1:'احكيها',practiceTitle2:'من دون قراءة.',practiceIntro:'تذكّر هالنقاط بس. احكي بطريقتك؛ مش لازم تحفظ النص حرفياً.',seconds:'ثانية',start:'بلّش احكي',restart:'بلّش من جديد',stop:'وقف التوقيت',reset:'إعادة التوقيت',showScript:'شوف النص',hideScript:'اخفي النص',finish:'بلّشت بالفكرة الأساسية؟',yes:'إيه، بلّشت فيها',again:'بعد لأ — جرّب مجدداً',footer:'فكرة واضحة، مرة ورا مرة.',footerTrain:'البرنامج التدريبي لـ ٢٨ يوم',train:'تدريبي',empty:'اكتب فكرتك أو جرّب مثالاً.',listening:'عم يقرأ…',unavailable:'تشغيل الصوت غير متوفر في هذا المتصفح.',copied:'تم النسخ',copyFail:'حدد النص وانسخه يدوياً.',shorttip:'بلّش بالخلاصة، وزيد التفاصيل إذا سألوك.',gentletip:'خلّي الفكرة الأساسية أول شي، وخد وقفة قصيرة.',success:'ممتاز. التعبير عن فكرة واحدة بوضوح تقدّم.',retry:'حلو. جرّب مرة ثانية، وبلّش بالفكرة الأساسية.',length:'حوالي {n} ثانية',point:'الفكرة الرئيسية',reason:'السبب',close:'الخطوة التالية',pause:'•  وقفة قصيرة  •',samples:{meeting:'بدي كل مكتب قطري يكون مستعد للأزمات المتوقعة لأن التأخير بالاستجابة بيكلّف وقت ومصاري وأرواح.',interrupted:'الناس بتقاطعني قبل ما خلّص فكرتي وبدي رد من دون ما أرفع صوتي.',home:'بدي نخطط لنشاط بسيط مع الأولاد بنهاية الأسبوع من دون نقاش طويل.'}}
 };

 Object.assign(phrases.en,{
  footerTrain:'A little practice every day',doneSpeaking:"I’ve finished speaking",timerHint:'You can finish whenever you’re ready.',timeUp:'Time is up. You can finish or try again.',backPracticeShort:'Back to practice',checkEyebrow:'A MOMENT TO REFLECT',checkTitle:'You did it.',checkTitle2:'Keep going.',checkIntro:'How did it feel to say your message in your own words?',feelEasy:'Clear and comfortable',feelOkay:'A little hesitant',feelHard:'I struggled',nextFocus:'ONE THING TO TRY NEXT',selfReported:'Based on your reflection, not an analysis of your voice.',nextThought:'Try another thought',nextExercise:'Next speaking moment',returnTraining:'See my daily practice',retrySpeak:'Say it once more',train:'My training',trainingBack:'Back to speaking help',trainingEyebrow:'YOUR GENTLE DAILY PRACTICE',trainingTitle:'One small step.',trainingTitle2:'A stronger voice.',trainingIntro:'Three short speaking moments, one at a time. No scores, no pressure.',trainingPrivacy:'Your daily progress stays in this browser.',todayProgress:'Today · {n} of 3',begin:'Begin this moment',finishedToday:'You showed up today.',finishedDesc:'Three moments of practice completed. That is enough for today.',finishedNudge:'Come back tomorrow—or practise another thought whenever you like.',trainingDone:'Try another thought',tipEasy:'Great. Next time, pause after your first sentence and let the point land.',tipOkay:'Next time, say only your main point first. Add one reason after a small pause.',tipHard:'Try just one clear sentence. It is enough to be understood before adding detail.',trainingPrompts:[
   {title:'Start with your point',desc:'A colleague asks why preparation matters. Say your main message first.',nudge:'Lead with one sentence.',sample:'meeting'},
   {title:'Stay calm when interrupted',desc:'Someone speaks before you finish. Reclaim your turn without raising your voice.',nudge:'Calm is more persuasive than loud.',sample:'interrupted'},
   {title:'Make a simple request',desc:'Suggest a plan at home without giving a long explanation.',nudge:'One request. One reason.',sample:'home'}]
 });
 Object.assign(phrases.ar,{
  footerTrain:'شوية تدريب كل يوم',doneSpeaking:'خلّصت كلامي',timerHint:'فيك تخلّص وقت ما بتكون جاهز.',timeUp:'خلص الوقت. فيك تكمّل أو تعيد المحاولة.',backPracticeShort:'ارجع للتجربة',checkEyebrow:'لحظة صغيرة للتقييم',checkTitle:'عملتها.',checkTitle2:'كمّل بطريقتك.',checkIntro:'كيف حسّيت لما حكيت الفكرة بكلماتك؟',feelEasy:'كانت واضحة ومريحة',feelOkay:'تردّدت شوي',feelHard:'كانت صعبة',nextFocus:'شغلة واحدة للمرة الجاية',selfReported:'هيدا اقتراح مبني على تقييمك، مش على تحليل صوتك.',nextThought:'جرّب فكرة تانية',nextExercise:'التدريب اللي بعده',returnTraining:'شوف تدريبي اليوم',retrySpeak:'احكيها مرة تانية',train:'تدريبي',trainingBack:'ارجع لمساعدة الكلام',trainingEyebrow:'تدريب يومي خفيف',trainingTitle:'خطوة صغيرة.',trainingTitle2:'وصوت أقوى.',trainingIntro:'ثلاث مواقف قصيرة، واحد بعد التاني. بلا علامات وبلا ضغط.',trainingPrivacy:'تقدّمك محفوظ على هالمتصفح.',todayProgress:'اليوم · {n} من ٣',begin:'بلّش هالموقف',finishedToday:'تدرّبت اليوم!',finishedDesc:'خلصت ثلاث مواقف قصيرة. هالقد بكفّي لليوم.',finishedNudge:'ارجع بكرا أو جرّب فكرة جديدة بوقتك.',trainingDone:'جرّب فكرة تانية',tipEasy:'حلو. المرة الجاية خد وقفة بعد أول جملة وخلي الفكرة توصل.',tipOkay:'المرة الجاية بلّش بالفكرة الأساسية، وبعد وقفة قصيرة أعطِ سبب واحد.',tipHard:'جرّب جملة واحدة واضحة بس. مش ضروري تشرح كل التفاصيل.',trainingPrompts:[
   {title:'بلّش بالخلاصة',desc:'زميل بيسألك ليش الاستعداد مهم. قول الفكرة الأساسية أولاً.',nudge:'جملة أساسية واحدة تكفي.',sample:'meeting'},
   {title:'رد بهدوء على المقاطعة',desc:'حدا بيقاطعك قبل ما تخلّص. اطلب تكمل من دون ما تعلّي صوتك.',nudge:'الهدوء بيوصل الفكرة.',sample:'interrupted'},
   {title:'اطلب طلب بسيط',desc:'اقترح نشاط بالبيت من دون شرح طويل.',nudge:'طلب واحد وسبب واحد.',sample:'home'}]
 });

 const examples={
 en:{
  meeting:{parts:['Every country office should prepare for anticipated emergencies.','Delays in responding can cost time, money, and lives.'],cues:['Country offices','Prepare in advance','Lives and time']},
  interrupted:{parts:["I'd like to finish my thought before we move on.","Then I'd be glad to hear your view."],cues:['Finish my point','Stay calm','Invite response']},
  home:{parts:["Could we choose one simple activity for the weekend?","I'd love us to enjoy time with the kids without overplanning."],cues:['One activity','Family time','Keep it simple']}
 },ar:{
  meeting:{parts:['لازم كل مكتب قطري يكون مستعد للطوارئ المتوقعة.','لأن أي تأخير بالاستجابة ممكن يكلّفنا وقت ومصاري، والأهم أرواح.'],cues:['كل مكتب قطري','الاستعداد المبكر','توفير الوقت والأرواح']},
  interrupted:{parts:['خلّيني كمّل فكرتي بالأول.','وبعدها أكيد بدي أسمع رأيك.'],cues:['كمّل الفكرة','بهدوء','اسمع رأيهم']},
  home:{parts:['شو رأيكم نختار نشاط بسيط لنهاية الأسبوع؟','هيك منقضي وقت حلو مع الولاد من دون ما نعقّد الخطة.'],cues:['نشاط واحد','وقت عائلي','ببساطة']}
 }};
 let lang='en'; try{lang=localStorage.getItem('cs_light_lang')==='ar'?'ar':'en'}catch(_){}
 let chosenSample=null;let output=null;let timer=null;let remaining=20;let short=false;let active='entry';
 let mode='quick',selectedFeeling=null,trainingStep=0;
 const localDate=()=>{const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')};
 function loadTraining(){try{const v=JSON.parse(localStorage.getItem('cs_light_daily_v1')||'null');if(v&&v.date===localDate())return Math.max(0,Math.min(3,Number(v.step)||0))}catch(_){}return 0}
 function saveTraining(){try{localStorage.setItem('cs_light_daily_v1',JSON.stringify({date:localDate(),step:trainingStep}))}catch(_){}}
 trainingStep=loadTraining();
 const tr=(key)=>phrases[lang][key];
 const normalize=s=>String(s||'').replace(/\s+/g,' ').trim().replace(/[\s.!?؟؛،]+$/u,'');
 const sentence=s=>{const c=normalize(s);return c?(c+(/[?؟]\s*$/.test(s)?(lang==='ar'?'؟':'?'):'.')):''};
 const capitalize=s=>s?s[0].toUpperCase()+s.slice(1):s;
 const wc=s=>(s.match(/[\p{L}\p{N}]+/gu)||[]).length;
 function language(){document.documentElement.lang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.title=lang==='ar'?'ClearSpeak — احكيها بطريقتك':'ClearSpeak — Your words, easier to say.';$('langButton').textContent=lang==='ar'?'English':'عربي';document.querySelectorAll('[data-t]').forEach(el=>{el.textContent=tr(el.dataset.t)});document.querySelectorAll('[data-placeholder]').forEach(el=>{el.placeholder=tr(el.dataset.placeholder)});$('trainLink').innerHTML=tr('train')+' <span aria-hidden="true">↗</span>';$('shorter').querySelector('[data-t]').textContent=short?tr('longer'):tr('shorter');if(output&&active!=='entry'){if(chosenSample&&output.sampleKey)output={...examples[lang][output.sampleKey],sampleKey:output.sampleKey};renderResult();renderCues()} renderTraining();if(selectedFeeling)renderFeedback(); if(active==='checkin')updateNextLabel();}
 function screen(id){active=id;for(const key of ['entry','result','practiceScreen','checkin','training'])$(key).hidden=key!==id;window.scrollTo({top:0,behavior:'instant'});}
 function sample(key){chosenSample=key; $('thought').value=tr('samples')[key];$('error').hidden=true;build();}
 function cleanEnglish(input){let s=normalize(input).replace(/^(um+|uh+|well|actually|basically|you know|I mean)[,\s]+/i,'').replace(/^(I just wanted to say that|I wanted to say that)\s+/i,'');s=s.replace(/^I want every country office to prepare\b/i,'Every country office should prepare');s=s.replace(/^I think we should\b/i,'We should').replace(/^I feel like we should\b/i,'We should');s=s.replace(/^I want us to\b/i,'We should');s=s.replace(/^I want to\b/i,'I would like to');return capitalize(s)}
 function generic(input){const raw=normalize(input);if(lang==='en'){
 let c=cleanEnglish(raw);const split=c.split(/\s+(?:because|since|as a result of)\s+/i);let parts=[];
 if(split.length>1){parts=[split[0],split.slice(1).join(' because ')];}
 else{parts=c.split(/(?<=[.!?])\s+/).map(normalize).filter(Boolean);}
 if(parts.length===1 && parts[0].length>200){const clause=parts[0].match(/^(.{15,170}?)(?:,\s+|;\s+)(.{10,})$/);if(clause)parts=[clause[1],clause[2]]}
 parts=parts.slice(0,3).map(p=>capitalize(normalize(p))).filter(Boolean);return{parts,cues:parts.slice(0,3).map(p=>p.split(/\s+/).slice(0,4).join(' '))};
 }else{
 let c=raw.replace(/^(يعني|اممم|بصراحة)\s*[,،]?\s*/u,'');let p=c.split(/\s+(?:لأن|لانو|لأنه|لإن|بسبب)\s+/u);if(p.length<2)p=c.split(/(?<=[.!؟؛])\s+/u);p=p.slice(0,3).map(normalize).filter(Boolean);return{parts:p,cues:p.slice(0,3).map(x=>x.split(/\s+/).slice(0,4).join(' '))};
 }}
 function build(){const input=normalize($('thought').value);if(!input){$('error').textContent=tr('empty');$('error').hidden=false;$('thought').focus();return;}const exact=chosenSample&&input===normalize(tr('samples')[chosenSample]);output=exact?{...examples[lang][chosenSample],sampleKey:chosenSample}:generic(input);if(!output.parts.length){$('error').textContent=tr('empty');$('error').hidden=false;return}short=false;renderResult();screen('result');}
 function displayParts(){if(!output)return [];return short?output.parts.slice(0,1):output.parts}
 function outputText(){return displayParts().map(sentence).filter(Boolean).join(' ')}
 function renderResult(){if(!output)return;const root=$('script');root.replaceChildren();displayParts().forEach((s,i)=>{if(i){const pause=document.createElement('span');pause.className='softpause';pause.textContent='···';root.append(pause)}const p=document.createElement('p');p.textContent=sentence(s);root.append(p)});const estimated=Math.max(5,Math.round(wc(outputText())/(lang==='ar'?2.1:2.4)));$('lengthEstimate').textContent=tr('length').replace('{n}',estimated);$('tip').textContent=short?tr('shorttip'):tr('gentletip');$('shorter').querySelector('[data-t]').textContent=short?tr('longer'):tr('shorter');$('shorter').hidden=output.parts.length<2}
 function renderCues(){if(!output)return;const root=$('cues');root.replaceChildren();let labels=output.cues?.length?output.cues:output.parts.map(s=>s.split(' ').slice(0,4).join(' '));for(let i=0;i<Math.min(3,labels.length);i++){const box=document.createElement('div');box.className='cue';const meta=document.createElement('div');meta.className='cue-index';meta.textContent=([tr('point'),tr('reason'),tr('close')][i]||tr('point'));const val=document.createElement('span');val.className='cue-text';val.textContent=labels[i];box.append(meta,val);root.append(box)}}
 async function copy(){try{await navigator.clipboard.writeText(outputText());const b=$('copy').querySelector('[data-t]');b.textContent=tr('copied');setTimeout(()=>b.textContent=tr('copy'),1500)}catch(e){$('tip').textContent=tr('copyFail')}}
 function hear(){if(!('speechSynthesis' in window)){ $('tip').textContent=tr('unavailable');return;}speechSynthesis.cancel();const utter=new SpeechSynthesisUtterance(outputText());utter.lang=lang==='ar'?'ar':'en-US';utter.rate=0.92;utter.onstart=()=>{$('listen').querySelector('[data-t]').textContent=tr('listening')};utter.onend=utter.onerror=()=>{$('listen').querySelector('[data-t]').textContent=tr('listen')};speechSynthesis.speak(utter)}
 function tick(){remaining--;$('countdown').textContent=String(remaining);if(remaining<=0){clearInterval(timer);timer=null;$('timerHint').textContent=tr('timeUp');$('startTimer').querySelector('[data-t]').textContent=tr('restart')}}
 function startTimer(){if(timer){clearInterval(timer);timer=null;$('startTimer').querySelector('[data-t]').textContent=tr('restart');return}remaining=20;$('countdown').textContent='20';$('timerHint').textContent=tr('timerHint');$('startTimer').querySelector('[data-t]').textContent=tr('stop');timer=setInterval(tick,1000)}
 function resetTimer(){clearInterval(timer);timer=null;remaining=20;$('countdown').textContent='20';$('timerHint').textContent=tr('timerHint');$('startTimer').querySelector('[data-t]').textContent=tr('start')}
 $('langButton').addEventListener('click',()=>{lang=lang==='ar'?'en':'ar';try{localStorage.setItem('cs_light_lang',lang)}catch(_){}if(chosenSample&&$('thought').value===phrases[lang==='ar'?'en':'ar'].samples[chosenSample])$('thought').value=tr('samples')[chosenSample];language()});
 $('thought').addEventListener('input',()=>{chosenSample=null;$('error').hidden=true});
 $('thought').addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key==='Enter')build()});
 document.querySelectorAll('[data-sample]').forEach(b=>b.addEventListener('click',()=>{mode='quick';sample(b.dataset.sample)}));
 $('create').addEventListener('click',()=>{mode='quick';build()});
 $('backResult').addEventListener('click',()=>screen('entry'));
 $('practice').addEventListener('click',()=>{resetTimer();renderCues();$('reveal').hidden=true;$('showScript').textContent=tr('showScript');screen('practiceScreen')});
 $('backPractice').addEventListener('click',()=>{resetTimer();screen('result')});
 $('shorter').addEventListener('click',()=>{short=!short;renderResult()});
 $('copy').addEventListener('click',copy);
 $('listen').addEventListener('click',hear);
 $('startTimer').addEventListener('click',startTimer);
 $('resetTimer').addEventListener('click',resetTimer);
 $('showScript').addEventListener('click',()=>{$('reveal').hidden=!$('reveal').hidden;$('reveal').textContent=outputText();$('showScript').textContent=$('reveal').hidden?tr('showScript'):tr('hideScript')});

 function renderTraining(){
   const content=phrases[lang];
   $('trainingProgress').textContent=tr('todayProgress').replace('{n}',trainingStep);
   [...$('dailyDots').children].forEach((el,i)=>el.classList.toggle('filled',i<trainingStep));
   const completed=trainingStep>=3;
   const item=content.trainingPrompts[Math.min(trainingStep,2)];
   $('dailyTitle').textContent=completed?tr('finishedToday'):item.title;
   $('dailyDescription').textContent=completed?tr('finishedDesc'):item.desc;
   $('dailyNudge').textContent=completed?tr('finishedNudge'):item.nudge;
   $('trainingAction').textContent=completed?tr('trainingDone'):tr('begin');
 }
 function showTraining(){resetTimer();mode='daily';trainingStep=loadTraining();renderTraining();screen('training')}
 function beginTraining(){if(trainingStep>=3){mode='quick';newThought();return;}
   const sampleKey=phrases[lang].trainingPrompts[trainingStep].sample;
   chosenSample=sampleKey;$('thought').value=tr('samples')[sampleKey];build();
 }
 function completePractice(){resetTimer();selectedFeeling=null;$('coachTip').hidden=true;
   $('nextAction').disabled=true;document.querySelectorAll('[data-feeling]').forEach(b=>{b.classList.remove('selected');b.setAttribute('aria-pressed','false')});
   updateNextLabel();screen('checkin');
 }
 function renderFeedback(){if(!selectedFeeling)return;
   $('coachAdvice').textContent=tr(selectedFeeling==='easy'?'tipEasy':selectedFeeling==='okay'?'tipOkay':'tipHard');
   $('coachTip').hidden=false;
 }
 function updateNextLabel(){ $('nextAction').querySelector('[data-t]').textContent=mode==='daily'?(trainingStep===2?tr('returnTraining'):tr('nextExercise')):tr('nextThought') }
 function chooseFeeling(feeling){selectedFeeling=feeling;document.querySelectorAll('[data-feeling]').forEach(b=>{const v=b.dataset.feeling===feeling;b.classList.toggle('selected',v);b.setAttribute('aria-pressed',String(v))});renderFeedback();$('nextAction').disabled=false;}
 function newThought(){mode='quick';chosenSample=null;output=null;short=false;$('thought').value='';$('error').hidden=true;screen('entry');}
 function advance(){if(!selectedFeeling)return;try{localStorage.setItem('cs_light_practice_count',String((Number(localStorage.getItem('cs_light_practice_count'))||0)+1))}catch(_){}
   if(mode==='daily'){trainingStep=Math.min(3,trainingStep+1);saveTraining();if(trainingStep<3)beginTraining();else showTraining()}else newThought();
 }
 $('trainLink').addEventListener('click',showTraining);
 $('footerTrain').addEventListener('click',showTraining);
 $('backTraining').addEventListener('click',()=>{mode='quick';screen('entry')});
 $('launchTraining').addEventListener('click',beginTraining);
 $('doneSpeaking').addEventListener('click',completePractice);
 $('backCheckin').addEventListener('click',()=>{selectedFeeling=null;resetTimer();screen('practiceScreen')});
 document.querySelectorAll('[data-feeling]').forEach(b=>b.addEventListener('click',()=>chooseFeeling(b.dataset.feeling)));
 $('retrySpeaking').addEventListener('click',()=>{selectedFeeling=null;resetTimer();screen('practiceScreen')});
 $('nextAction').addEventListener('click',advance);
 document.addEventListener('visibilitychange',()=>{if(document.hidden){clearInterval(timer);timer=null;window.speechSynthesis?.cancel?.()}});
 language();screen('entry');
})();