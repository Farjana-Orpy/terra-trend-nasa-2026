/* TerraTrend: NASA POWER data and transparent statistical analysis. */
(function(){
'use strict';
const S=window.TerraScience,V=S.VARIABLES;
const LOCATIONS={
 sylhet:{name:'Sylhet, Bangladesh',lat:24.89,lon:91.87},
 dhaka:{name:'Dhaka, Bangladesh',lat:23.81,lon:90.41},
 delhi:{name:'New Delhi, India',lat:28.61,lon:77.21},
 london:{name:'London, United Kingdom',lat:51.51,lon:-0.13},
 newyork:{name:'New York, United States',lat:40.71,lon:-74.01},
 cairo:{name:'Cairo, Egypt',lat:30.04,lon:31.24},
 nairobi:{name:'Nairobi, Kenya',lat:-1.29,lon:36.82},
 sydney:{name:'Sydney, Australia',lat:-33.87,lon:151.21},
 saopaulo:{name:'São Paulo, Brazil',lat:-23.55,lon:-46.63},
 reykjavik:{name:'Reykjavík, Iceland',lat:64.15,lon:-21.94}
};
const $=id=>document.getElementById(id);const set=(id,text)=>{$(id).textContent=text;};
const current={primary:null,compare:null,runNo:0,compareNo:0};
const sourceLabel=()=> 'NASA POWER';
const lastFullYear=Math.min(2025,new Date().getFullYear()-1);
$('endYear').max=lastFullYear;$('endYear').value=lastFullYear;$('startYear').max=lastFullYear-2;
$('compareB').value='london';
function toast(msg){const box=$('toast');box.textContent=msg;box.classList.add('visible');clearTimeout(toast.t);toast.t=setTimeout(()=>box.classList.remove('visible'),3500);}
function status(msg,type='ready'){set('apiStatus',msg);$('apiDot').className='status-dot'+(type==='busy'?' busy':type==='error'?' error':'');}
function signed(num,digits=2){return (num>0?'+':'')+num.toFixed(digits)}
function format(num,variable,digits){return Number(num).toLocaleString('en-US',{maximumFractionDigits:digits??V[variable].decimals,minimumFractionDigits:digits??V[variable].decimals})}
function escapeXML(t){return String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function validCoords(lat,lon){return Number.isFinite(lat)&&Number.isFinite(lon)&&lat>=-90&&lat<=90&&lon>=-180&&lon<=180}
function fmtCoord(num,axis){return Math.abs(num).toFixed(2)+'° '+(axis==='lat'?(num>=0?'N':'S'):(num>=0?'E':'W'));}
function location(){const key=$('presetLocation').value;if(key==='custom'){const lat=parseFloat($('latitude').value),lon=parseFloat($('longitude').value);return{lat,lon,name:`Selected point (${fmtCoord(lat,'lat')}, ${fmtCoord(lon,'lon')})`};}return {...LOCATIONS[key]};}

function updateMode(){
 $('runButton').firstChild.textContent='Analyze NASA data ';
 status('Ready to analyze NASA POWER data');
}
function invalidateResults(){
 current.runNo++;
 current.compareNo++;
 current.primary=null;current.compare=null;
 $('runButton').disabled=false; $('compareButton').disabled=false;
 $('runArrow').textContent='↗';
 for(const id of ['downloadCsv','copyFinding','printReport'])$(id).disabled=true;
 for(const [id,val] of Object.entries({statSlope:'—',statChange:'—',statSignificance:'—',statYears:'—',statSlopeHelp:'Awaiting new analysis',statChangeHelp:'Across the study period',statSigHelp:'p-value at α = 0.05',statYearsHelp:'Complete calendar years',chartHeading:'Decades of change',chartSub:'Run an investigation to visualize the selected indicator.',chartUnit:'',dataYears:'—',compareStatus:'AWAITING COMPARISON'}))set(id,val);
 $('trendChart').innerHTML='';$('chartEmpty').hidden=false;
 $('compareChart').innerHTML='';$('compareEmpty').hidden=false;
 $('chartTip').hidden=true;
 $('errorBanner').hidden=true;
 $('compareSummaries').innerHTML='<div class="compare-summary"><span>LOCATION A</span><strong>—</strong><p>Awaiting analysis</p></div><div class="compare-summary"><span>LOCATION B</span><strong>—</strong><p>Awaiting analysis</p></div>';
 set('compareInterpretation','The comparison will use the same indicator and period for two places.');
 set('dataBadge','AWAITING NASA DATA');
 set('caseTitle','A story written in evidence.');
 set('caseNarrative','Select a location and run a new investigation to explore changes over time.');
 set('caseNotes','No result is interpreted until authentic NASA POWER data is retrieved.');
 set('chartLegendData','NASA POWER annual data');
 updateMode();
}
function onSettingsChanged(){invalidateResults();}
for(const id of ['variable','startYear','endYear'])$(id).addEventListener('change',onSettingsChanged);
function resetComparison(message='AWAITING COMPARISON'){
 current.compareNo++; current.compare=null;
 $('compareButton').disabled=false;
 $('compareChart').innerHTML=''; $('compareEmpty').hidden=false;
 $('compareSummaries').innerHTML='<div class="compare-summary"><span>LOCATION A</span><strong>—</strong><p>Run comparison to see results</p></div><div class="compare-summary"><span>LOCATION B</span><strong>—</strong><p>Run comparison to see results</p></div>';
 set('compareInterpretation','Choose two locations and click Compare evidence to examine the same indicator over the same years.');
 set('compareStatus',message);
}
for(const id of ['compareA','compareB'])$(id).addEventListener('change',()=>resetComparison('SELECTION CHANGED — RUN COMPARISON'));

function syncMap(){const l=location(),markers=$('mapMarkers');markers.innerHTML='';if(!validCoords(l.lat,l.lon)){set('mapCoords','Enter valid coordinates');return;}
 const x=(l.lon+180)*2.5,y=(90-l.lat)*2.5;
 markers.innerHTML=`<circle cx="${x}" cy="${y}" r="17" class="map-pin-outer"/><circle cx="${x}" cy="${y}" r="6" class="map-pin"/><path d="M${x+5} ${y-9} L${x+23} ${y-25}" stroke="#b3f6e5" stroke-width="1"/><text class="map-marker-label" x="${Math.min(x+24,740)}" y="${Math.max(y-30,19)}">${escapeXML(l.name.slice(0,29))}</text>`;
 set('mapSelected',l.name);set('mapCoords',`${fmtCoord(l.lat,'lat')} / ${fmtCoord(l.lon,'lon')}`);
}
$('presetLocation').addEventListener('change',()=>{const p=LOCATIONS[$('presetLocation').value];if(p){$('latitude').value=p.lat;$('longitude').value=p.lon;}syncMap();onSettingsChanged();});
for(const id of ['latitude','longitude'])$(id).addEventListener('input',()=>{$('presetLocation').value='custom';syncMap();onSettingsChanged();});
$('worldMap').addEventListener('click',e=>{
 const svg=$('worldMap'),point=svg.createSVGPoint();point.x=e.clientX;point.y=e.clientY;
 const ctm=svg.getScreenCTM();if(!ctm)return;const pos=point.matrixTransform(ctm.inverse());
 if(pos.x<0||pos.x>900||pos.y<0||pos.y>450)return;
 const lon=Math.max(-180,Math.min(180,pos.x/2.5-180)),lat=Math.max(-90,Math.min(90,90-pos.y/2.5));
 $('latitude').value=lat.toFixed(2);$('longitude').value=lon.toFixed(2);$('presetLocation').value='custom';syncMap();onSettingsChanged();
});syncMap();
function readPeriod(){const start=Number($('startYear').value),end=Number($('endYear').value);
 if(!Number.isInteger(start)||!Number.isInteger(end)||start<1984||end>lastFullYear||end-start<2||start>end)throw new Error(`Select at least 3 full years between 1984 and ${lastFullYear}.`);
 return{start,end};
}
function endpoint(lat,lon,start,end,key){
 const nasa=S.powerUrl(lat,lon,start,end,key);
 // Cloudflare Pages uses a same-origin function to retrieve NASA POWER data.
 const qs=nasa.split('?')[1];
 const host=locationHost();
 const proxyFlag=document.querySelector('meta[name="terra-proxy"]')?.content==='cloudflare-pages';
 const localHost=host==='localhost'||host==='127.0.0.1'||window.location.protocol==='file:';
 const hostedProxy=!localHost&&(proxyFlag||/(^|\.)pages\.dev$/.test(host));
 return{api:hostedProxy?`/api/power?${qs}`:nasa,nasa};
}
function locationHost(){return window.location.hostname||'';}
async function fetchNASA(lat,lon,start,end,key){
 const {api,nasa}=endpoint(lat,lon,start,end,key);const cacheKey=`terratrend-v4:${lat.toFixed(2)}:${lon.toFixed(2)}:${start}:${end}:${key}`;
 try{const cached=localStorage.getItem(cacheKey);if(cached){const obj=JSON.parse(cached);if(Date.now()-obj.time<24*60*60*1000)return{payload:obj.data,nasa,cache:true};}}catch(_){ }
 const controller=new AbortController(),t=setTimeout(()=>controller.abort(),65000);
 try{
   const res=await fetch(api,{signal:controller.signal,mode:'cors',credentials:'omit',headers:{Accept:'application/json'}});
   if(!res.ok)throw new Error(`NASA POWER request returned HTTP ${res.status}${res.status===429?' (rate limited)':''}.`);
   const payload=await res.json();
   if(payload?.messages?.some(m=>/error/i.test(String(m))))throw new Error('NASA returned a data error.');
   if(!payload?.properties?.parameter?.[key])throw new Error('NASA returned no usable data for this indicator and region.');
   try{localStorage.setItem(cacheKey,JSON.stringify({time:Date.now(),data:payload}));}catch(_){ }
   return{payload,nasa,cache:false};
 }catch(err){if(err.name==='AbortError')throw new Error('The NASA request timed out. Please retry or select a shorter period.');if(err instanceof TypeError)throw new Error('The browser could not reach NASA POWER. Please retry or check the website data connection.');throw err;
 }finally{clearTimeout(t);}
}

async function acquireData(lat,lon,start,end,key){
 return await fetchNASA(lat,lon,start,end,key);
}

function rejectWarning(data){return data.excluded.length?`${data.excluded.length} year(s) excluded because not all 12 months were available: ${data.excluded.slice(0,9).map(y=>y.year).join(', ')}${data.excluded.length>9?'…':''}.`:'';}
function fmtTrend(t,key){const unit=V[key].unit;return `${signed(t.slope*10,V[key].decimals)} ${unit} / decade`;}
function narrative(data,stats,l,key){const meta=V[key],direction=stats.direction==='increase'?'rising':stats.direction==='decrease'?'falling':'unchanged';
 const mag=`${Math.abs(stats.slope*10).toFixed(meta.decimals)} ${meta.unit} per decade`;
 const verdict=stats.significant?`The linear slope is statistically distinguishable from zero at the 5% level (two-sided p ${S.readableP(stats.pValue)}).`:`The regression does not provide sufficient evidence of a nonzero linear slope at the 5% threshold (two-sided p ${S.readableP(stats.pValue)}).`;
 return `For ${l.name}, NASA POWER ${meta.name.toLowerCase()} series from ${stats.firstYear}–${stats.lastYear} suggests a ${direction} linear trend of ${mag}, based on ${stats.n} complete annual values. The fitted change across this period is ${signed(stats.change,meta.decimals)} ${meta.unit}. ${verdict} The 95% confidence interval for change per decade is ${signed(stats.ciLow*10,meta.decimals)} to ${signed(stats.ciHigh*10,meta.decimals)} ${meta.unit}. This is a descriptive statistical association, not proof of cause.`;
}
function renderStats(data,stats,l,key,nasa){
 const meta=V[key];set('statSlope',signed(stats.slope*10,meta.decimals));set('statSlopeHelp',`${meta.unit} per decade`);
 set('statChange',signed(stats.change,meta.decimals));set('statChangeHelp',`${meta.unit} · fitted ${stats.firstYear}–${stats.lastYear}`);
 set('statSignificance',stats.significant?'Detected':'Inconclusive');set('statSigHelp',`Two-sided p ${S.readableP(stats.pValue)} · α = 0.05`);
 set('statYears',String(stats.n));set('statYearsHelp',data.excluded.length?`${data.excluded.length} incomplete years excluded`:'All requested years complete');
 set('caseTitle',`${meta.short}: ${stats.significant?'a measurable trend':'a question still open'}.`);
 set('caseNarrative',narrative(data,stats,l,key));
 set('caseNotes',`Source: NASA POWER monthly point API. ${key==='PRECTOTCORR'?'Annual precipitation is the sum of monthly daily mean estimates multiplied by calendar-month days.':'Annual values are calendar-day-weighted means of 12 monthly estimates.'} ${rejectWarning(data)} Ordinary least squares assumes independent residuals; year-to-year autocorrelation can affect p-values. No causal claim is made.`);
 $('copyFinding').disabled=false;$('printReport').disabled=false;$('downloadCsv').disabled=false;
 $('copyFinding').onclick=()=>copyText(`TERRA TREND — ${sourceLabel()}\n${narrative(data,stats,l,key)}\n\n${nasa}\nSource: NASA POWER (https://power.larc.nasa.gov/).`);
 $('downloadCsv').onclick=()=>downloadCSV(data,stats,l,key,nasa);
 $('printReport').onclick=()=>window.print();
}
function downloadCSV(data,stats,l,key,nasa){const lines=[`# TerraTrend | NASA POWER | ${l.name}`,`# Coordinates: ${l.lat}, ${l.lon}`,`# Variable: ${key} (${V[key].unit})`,`# Data provenance: ${nasa}`,`# P-value (two-sided OLS): ${stats.pValue}`,`# Trend per decade: ${stats.slope*10}`,`# Excluded incomplete years: ${data.excluded.map(i=>i.year).join(';')}`,`year,annual_value,ols_fitted_value,unit`];
 for(const p of data.annual)lines.push(`${p.year},${p.value.toFixed(6)},${(stats.intercept+stats.slope*p.year).toFixed(6)},${V[key].unit}`);
 downloadFile('terratrend-'+l.name.toLowerCase().replace(/[^a-z0-9]+/g,'-')+'-'+key+'.csv',lines.join('\\r\\n'),'text/csv;charset=utf-8');toast('NASA data CSV downloaded');}
function downloadFile(name,text,type){const blob=new Blob([text],{type}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);}
async function copyText(str){try{await navigator.clipboard.writeText(str);toast('Copied to clipboard');}catch(_){const a=document.createElement('textarea');a.value=str;a.style.position='fixed';a.style.opacity='0';document.body.appendChild(a);a.select();try{if(document.execCommand('copy'))toast('Copied to clipboard');else toast('Clipboard permission unavailable. Try copying from the page.');}catch(e){toast('Clipboard permission unavailable. Try copying from the page.');}a.remove();}}
const NS='http://www.w3.org/2000/svg';function element(tag,attrs={},parent){const el=document.createElementNS(NS,tag);for(const[k,v] of Object.entries(attrs))el.setAttribute(k,v);if(parent)parent.appendChild(el);return el;}
function textEl(svg,x,y,str,attrs={}){const el=element('text',{x,y,...attrs},svg);el.textContent=str;return el;}
function plot(svg,dataSets,trendSets,key,tooltip=true){svg.innerHTML='';const width=850,height=322,left=77,right=20,top=28,bottom=52,wi=width-left-right,he=height-top-bottom;
 const all=dataSets.flatMap(s=>s.values),minYear=Math.min(...all.map(p=>p.year)),maxYear=Math.max(...all.map(p=>p.year));
 let lo=Math.min(...all.map(p=>p.value)),hi=Math.max(...all.map(p=>p.value));for(let i=0;i<trendSets.length;i++){const s=trendSets[i];lo=Math.min(lo,s.intercept+s.slope*minYear,s.intercept+s.slope*maxYear);hi=Math.max(hi,s.intercept+s.slope*minYear,s.intercept+s.slope*maxYear);}
 const pad=Math.max(0.15,(hi-lo)*.17);lo-=pad;hi+=pad;
 const x=y=>left+(y-minYear)/Math.max(1,maxYear-minYear)*wi, y=v=>top+(hi-v)/(hi-lo)*he;
 for(let i=0;i<=4;i++){const val=lo+(hi-lo)*i/4,yy=y(val);element('line',{x1:left,y1:yy,x2:width-right,y2:yy,class:'svg-grid'},svg);textEl(svg,left-11,yy+3,Math.abs(val)>=100?val.toFixed(0):val.toFixed(1),{class:'svg-tick','text-anchor':'end'});}
 element('line',{x1:left,y1:top+he,x2:width-right,y2:top+he,class:'svg-axis'},svg);
 const interval=Math.max(1,Math.ceil((maxYear-minYear)/5));for(let yr=minYear;yr<=maxYear;yr+=interval){const xx=x(yr);element('line',{x1:xx,y1:top+he,x2:xx,y2:top+he+6,class:'svg-axis'},svg);textEl(svg,xx,top+he+25,String(yr),{class:'svg-tick','text-anchor':'middle'});}if((maxYear-minYear)%interval!==0)textEl(svg,x(maxYear),top+he+25,String(maxYear),{class:'svg-tick','text-anchor':'middle'});
 for(let n=0;n<dataSets.length;n++){
 const s=dataSets[n],isB=n===1,lineClass=isB?'svg-line-b':'svg-line',dotClass=isB?'svg-point-b':'svg-point';
 const sorted=s.values.slice().sort((a,b)=>a.year-b.year);const path=sorted.map((p,i)=>(i?'L':'M')+x(p.year).toFixed(2)+' '+y(p.value).toFixed(2)).join(' ');
 element('path',{d:path,class:lineClass},svg);
 sorted.forEach(p=>{const dot=element('circle',{cx:x(p.year),cy:y(p.value),r:4,class:dotClass,tabindex:0,role:'img','aria-label':`${p.year}: ${p.value.toFixed(2)} ${V[key].unit}`},svg);
 if(tooltip){dot.addEventListener('pointerenter',()=>showTip(p,x(p.year),y(p.value),key));dot.addEventListener('pointerleave',hideTip);dot.addEventListener('focus',()=>showTip(p,x(p.year),y(p.value),key));dot.addEventListener('blur',hideTip);}
 });
 if(trendSets[n]){const t=trendSets[n];element('line',{x1:x(minYear),y1:y(t.intercept+t.slope*minYear),x2:x(maxYear),y2:y(t.intercept+t.slope*maxYear),class:isB?'svg-line-b':'svg-trend',opacity:isB?.65:1,'stroke-dasharray':isB?'5 5':'6 5'},svg);}
 }
}
function showTip(p,x,y,key){const tip=$('chartTip');tip.textContent=`${p.year} · ${format(p.value,key)} ${V[key].unit}`;tip.hidden=false;tip.style.left=`${Math.min(82,(x/850)*100)}%`;tip.style.top=`${Math.max(8,(y/322)*100-18)}%`;}function hideTip(){$('chartTip').hidden=true;}
async function investigate(){const btn=$('runButton'),banner=$('errorBanner');banner.hidden=true;let l,period,key;
 try{l=location();period=readPeriod();key=$('variable').value;if(!validCoords(l.lat,l.lon))throw new Error('Enter latitude from −90 to 90 and longitude from −180 to 180.');}
 catch(err){banner.textContent=err.message;banner.hidden=false;banner.scrollIntoView({block:'nearest',behavior:'smooth'});return;}
 const runId=++current.runNo;btn.disabled=true;btn.firstChild.textContent='Analyzing NASA data ';set('runArrow','◌');status('Requesting NASA POWER data…','busy');set('dataBadge','CONTACTING NASA');
 try{const result=await acquireData(l.lat,l.lon,period.start,period.end,key);if(runId!==current.runNo)return;
 const data=S.annualizeMonthly(result.payload,key,period.start,period.end),stats=S.regress(data.annual);
 current.primary={data,stats,l,key,nasa:result.nasa};
 plot($('trendChart'),[{values:data.annual}],[stats],key,true);$('chartEmpty').hidden=true;
 set('chartHeading',`${V[key].name} in ${l.name.split(',')[0]}`);set('chartSub',`${l.name} · ${stats.firstYear}–${stats.lastYear} · ${stats.n} complete years`);set('chartUnit',V[key].unit);
 set('dataBadge',result.cache?'NASA · CACHED':'NASA · RETRIEVED');set('chartLegendData','NASA POWER annual data');set('dataYears',`${stats.firstYear}–${stats.lastYear}`);
 renderStats(data,stats,l,key,result.nasa);status(`NASA data analyzed · ${stats.n} complete years`);toast('NASA evidence analyzed successfully');
 const share=new URL(window.location.href);share.hash='explore';share.searchParams.set('location',$('presetLocation').value);share.searchParams.set('lat',String(l.lat));share.searchParams.set('lon',String(l.lon));share.searchParams.set('indicator',key);share.searchParams.set('start',String(period.start));share.searchParams.set('end',String(period.end));try{history.replaceState(null,'',share);}catch(_){ }
 }catch(err){set('dataBadge','REQUEST FAILED');status('Unable to retrieve NASA data','error');banner.innerHTML=`<strong>We could not complete this investigation.</strong> ${escapeXML(err.message)} <a href="${escapeXML(S.powerUrl(l.lat,l.lon,period.start,period.end,key))}" target="_blank" rel="noopener noreferrer">Open the raw NASA request ↗</a>. No findings are displayed until NASA data are retrieved.`;banner.hidden=false;
 }finally{if(runId===current.runNo){btn.disabled=false;btn.firstChild.textContent='Analyze NASA data ';set('runArrow','↗');}}
}
$('runButton').addEventListener('click',investigate);
function fmtCompare(name,t,key){return `${fmtTrend(t,key)} · ${t.significant?'statistically significant':'not statistically significant'} (p ${S.readableP(t.pValue)})`}
async function compare(){const a=LOCATIONS[$('compareA').value],b=LOCATIONS[$('compareB').value];if(!a||!b){toast('Select two places');return;}if(a===b||$('compareA').value===$('compareB').value){toast('Choose two different locations');return;}
 let period;try{period=readPeriod();}catch(err){toast(err.message);return;}
 const key=$('variable').value,btn=$('compareButton'),jobId=++current.compareNo;btn.disabled=true;set('compareStatus','REQUESTING NASA');
 try{
 const [ra,rb]=await Promise.all([acquireData(a.lat,a.lon,period.start,period.end,key),acquireData(b.lat,b.lon,period.start,period.end,key)]);
 if(jobId!==current.compareNo)return;
 const da=S.annualizeMonthly(ra.payload,key,period.start,period.end),db=S.annualizeMonthly(rb.payload,key,period.start,period.end);
 
 const yearsA=new Set(da.annual.map(p=>p.year)),shared= new Set(db.annual.filter(p=>yearsA.has(p.year)).map(p=>p.year));
 const one=da.annual.filter(p=>shared.has(p.year)),two=db.annual.filter(p=>shared.has(p.year));
 if(shared.size<3)throw new Error('Not enough complete overlapping years to compare.');
 const sa=S.regress(one),sb=S.regress(two);
 plot($('compareChart'),[{values:one},{values:two}],[sa,sb],key,false);$('compareEmpty').hidden=true;set('compareStatus','NASA · '+shared.size+' SHARED YEARS');
 const differences=sa.slope*10-sb.slope*10;
 $('compareSummaries').innerHTML=`<div class="compare-summary"><span>● LOCATION A · ${escapeXML(a.name)}</span><strong>${escapeXML(fmtTrend(sa,key))}</strong><p>${escapeXML(fmtCompare(a.name,sa,key))}</p></div><div class="compare-summary"><span style="color:var(--amber)">● LOCATION B · ${escapeXML(b.name)}</span><strong>${escapeXML(fmtTrend(sb,key))}</strong><p>${escapeXML(fmtCompare(b.name,sb,key))}</p></div>`;
 set('compareInterpretation',`${a.name} and ${b.name}: difference in estimated slopes = ${signed(differences,V[key].decimals)} ${V[key].unit} per decade. This is a descriptive contrast, not a statistical test of the difference between slopes. ${shared.size} shared complete calendar years (${Math.min(...shared)}–${Math.max(...shared)}) were used. Compare with geographic and data-source context.`);
 toast('Comparison complete with NASA data');current.compare={a,b,one,two,sa,sb,key};
 }catch(err){if(jobId===current.compareNo){set('compareStatus','REQUEST FAILED');toast(err.message);$('compareInterpretation').textContent=err.message+' No comparison values are invented.';}}
 finally{if(jobId===current.compareNo)btn.disabled=false;}
}
$('compareButton').addEventListener('click',compare);
function initShare(){try{const p=new URLSearchParams(locationSearch());const key=p.get('location'),v=p.get('indicator');if(key&&LOCATIONS[key]){$('presetLocation').value=key;$('latitude').value=LOCATIONS[key].lat;$('longitude').value=LOCATIONS[key].lon;}
 else if(key==='custom'&&p.has('lat')&&p.has('lon')){$('presetLocation').value='custom';$('latitude').value=p.get('lat');$('longitude').value=p.get('lon');}
 if(V[v])$('variable').value=v;const s=Number(p.get('start')),e=Number(p.get('end'));if(s>=1984&&e<=lastFullYear&&e-s>=2){$('startYear').value=s;$('endYear').value=e;}syncMap();}catch(_){}}
function locationSearch(){return window.location.search;}initShare();updateMode();
// highlight navigation section currently in view
if('IntersectionObserver' in window){const sections=[...document.querySelectorAll('main section[id]')];const observer=new IntersectionObserver(es=>{for(const e of es){if(e.isIntersecting){document.querySelectorAll('.main-nav a').forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id));}}},{rootMargin:'-30% 0px -60% 0px'});sections.forEach(s=>observer.observe(s));}
})();
