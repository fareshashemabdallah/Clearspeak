/* ClearSpeak Plans: pricing and local, explicitly non-billing usage preview.
   Paid entitlement and actual quotas MUST be verified on the private AI server. */
(()=>{
'use strict';
const PLANS=Object.freeze({
 starter:{name:'Starter',price:'$2.99',limit:100,desc:'For occasional help finding the right words.'},
 plus:{name:'Plus',price:'$4.99',limit:500,desc:'For frequent messages and conversation practice.'},
 power:{name:'Power',price:'$7.99',limit:1500,desc:'For those who use ClearSpeak every day.'}
});
const USAGE_KEY='cs_ai_usage_device_preview_v1';
const PLAN_KEY='cs_plan_interest_preview_v1';
const monthKey=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')};
function readUsage(){try{const x=JSON.parse(localStorage.getItem(USAGE_KEY)||'null');if(x?.month===monthKey()&&Number.isSafeInteger(x.count))return Math.min(100000,Math.max(0,x.count))}catch(_){}return 0}
function planChoice(){try{const p=localStorage.getItem(PLAN_KEY);return Object.prototype.hasOwnProperty.call(PLANS,p)?p:'plus'}catch(_){return 'plus'}}
let selected=planChoice(),dialog=null,used=readUsage(),lastFocus=null;
function create(){
 if(dialog)return;
 const nav=document.createElement('button');nav.id='csPlanNav';nav.type='button';nav.className='csplan-nav';nav.textContent='Plans';nav.setAttribute('aria-haspopup','dialog');nav.addEventListener('click',open);
 const right=document.querySelector('.topright');if(right)right.prepend(nav);
 const d=document.createElement('dialog');d.id='csPlansDialog';d.className='csplan-dialog';d.setAttribute('aria-labelledby','csplanTitle');
 d.innerHTML=`<div class="csplan-wrap">
  <div class="csplan-header"><div><span class="csplan-eyebrow">CLEARSPEAK MEMBERSHIP</span><h2 id="csplanTitle" class="csplan-title">Choose what suits you.</h2><p class="csplan-lead">Same helpful tools. Different amounts of AI assistance.</p></div><button id="csplanClose" class="csplan-close" type="button" aria-label="Close plans">×</button></div>
  <p class="csplan-notice"><strong>Plans preview only.</strong> Subscriptions and payments are not active. You cannot be charged or enrolled here. The existing free, on-device tools remain available.</p>
  <div class="csplan-grid" id="csplanGrid">
   <article class="csplan-card" data-plan="starter"><h3>Starter</h3><div class="csplan-price">$2.99 <span>/ month</span></div><div class="csplan-allotment">100 AI replies</div><p class="csplan-note">Occasional help with messages and conversations.</p><button type="button" class="csplan-pick" data-pick="starter">Preview Starter</button></article>
   <article class="csplan-card" data-plan="plus"><h3>Plus</h3><div class="csplan-price">$4.99 <span>/ month</span></div><div class="csplan-allotment">500 AI replies</div><p class="csplan-note">Regular support for messages and real conversations.</p><button type="button" class="csplan-pick" data-pick="plus">Preview Plus</button></article>
   <article class="csplan-card" data-plan="power"><h3>Power</h3><div class="csplan-price">$7.99 <span>/ month</span></div><div class="csplan-allotment">1,500 AI replies</div><p class="csplan-note">Everyday confidence for frequent communicators.</p><button type="button" class="csplan-pick" data-pick="power">Preview Power</button></article>
  </div>
  <div class="csplan-use"><div class="csplan-use-head"><h3 id="csplanUsageLabel">How usage would look</h3><strong id="csplanUsageValue">0 / 500</strong></div><div class="csplan-meter" role="progressbar" aria-label="Device-only AI reply count compared to preview plan" aria-valuemin="0" aria-valuemax="500" aria-valuenow="0" id="csplanProgress"><div id="csplanFill" class="csplan-meter-fill" style="width:0%"></div></div><p id="csplanUsageHelp">Only successful AI-generated replies on this device are counted for this illustration. This is not an official subscription balance.</p></div>
  <div class="csplan-guidance"><h3>Simple, predictable billing</h3><p>One AI reply means one completed AI-generated response or rewrite. Asking for a new version counts as another reply. Local writing suggestions and practice exercises stay free and do not count.</p><ul><li>The same core features and AI quality across all three plans.</li><li>Monthly allowances renew each billing cycle; unused replies do not roll over.</li><li>No automatic overage charges. At 80%, show a friendly reminder; at 100%, offer an upgrade or wait for renewal. The production server must enforce these rules.</li><li>Live AI voice calls are not included; recording and playback on your device remain available.</li></ul></div>
  <div class="csplan-cta"><p id="csplanStatus" class="csplan-status" role="status">Select a plan to compare allowances. No payment is taken.</p><button type="button" id="csplanDone">Continue free preview</button></div>
 </div>`;
 document.body.append(d);dialog=d;
 d.querySelector('#csplanClose').addEventListener('click',close);
 d.querySelector('#csplanDone').addEventListener('click',close);
 d.querySelectorAll('[data-pick]').forEach(btn=>btn.addEventListener('click',()=>choose(btn.dataset.pick)));
 d.addEventListener('click',e=>{if(e.target===d)close()});
 d.addEventListener('close',()=>{document.body.classList.remove('csplan-open');lastFocus?.focus?.()});
 render();
}
function render(){
 if(!dialog)return;
 const p=PLANS[selected],meter=dialog.querySelector('#csplanProgress');
 dialog.querySelectorAll('[data-plan]').forEach(card=>{const active=card.dataset.plan===selected;card.dataset.selected=String(active);card.querySelector('button').textContent=active?'Preview selected':'Preview '+PLANS[card.dataset.plan].name;card.querySelector('button').setAttribute('aria-pressed',String(active))});
 dialog.querySelector('#csplanUsageLabel').textContent=p.name+' · example monthly allowance';
 dialog.querySelector('#csplanUsageValue').textContent=used.toLocaleString()+' / '+p.limit.toLocaleString();
 meter.setAttribute('aria-valuemax',String(p.limit));meter.setAttribute('aria-valuenow',String(Math.min(used,p.limit)));
 dialog.querySelector('#csplanFill').style.width=Math.min(100,100*used/p.limit)+'%';
 const help=dialog.querySelector('#csplanUsageHelp');
 help.textContent=used>=p.limit?'This device has recorded at least the example allowance. A real plan would pause paid AI replies without extra charges until renewal or an upgrade. No paid limit is active here.':used>=p.limit*.8?'An 80% reminder would appear now. Your actual account quota would be maintained securely on the server, not in this browser.':'Only completed AI replies on this device are counted for illustration. This is not an official account or billing balance.';
}
function choose(p){if(!PLANS[p])return;selected=p;try{localStorage.setItem(PLAN_KEY,p)}catch(_){}render();dialog.querySelector('#csplanStatus').textContent=PLANS[p].name+' preview selected. You have not subscribed or been charged.'}
function open(){create();lastFocus=document.activeElement;if(typeof dialog.showModal==='function')dialog.showModal();else dialog.setAttribute('open','');document.body.classList.add('csplan-open')}
function close(){if(!dialog)return;if(typeof dialog.close==='function'&&dialog.open)dialog.close();else dialog.removeAttribute('open');document.body.classList.remove('csplan-open');lastFocus?.focus?.()}
function recordAI(){
 // This display count is informative only. It MUST NOT grant or enforce paid access.
 used=readUsage()+1;
 try{localStorage.setItem(USAGE_KEY,JSON.stringify({month:monthKey(),count:used}))}catch(_){}
 render();
}
document.addEventListener('DOMContentLoaded',create);
window.CSPlans={open,recordAI,plans:PLANS};
})();
