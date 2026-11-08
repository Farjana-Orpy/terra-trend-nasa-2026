/* Terra Trend science engine. No third-party dependencies. NASA POWER monthly JSON -> annual -> OLS. */
(function (root) {
  'use strict';
  const VARIABLES = Object.freeze({
    T2M: { name:'Air temperature', short:'Temperature', unit:'°C', type:'mean', decimals:2, description:'2-metre air temperature', source:'MERRA-2' },
    PRECTOTCORR: { name:'Precipitation', short:'Rainfall', unit:'mm/year', type:'sum', decimals:0, description:'Corrected precipitation estimate', source:'POWER precipitation' },
    RH2M: { name:'Relative humidity', short:'Humidity', unit:'%', type:'mean', decimals:1, description:'Relative humidity at 2 metres', source:'MERRA-2' },
    WS10M: { name:'Wind speed', short:'Wind', unit:'m/s', type:'mean', decimals:2, description:'Wind speed at 10 metres', source:'MERRA-2' },
    ALLSKY_SFC_SW_DWN: { name:'Solar irradiance', short:'Solar energy', unit:'kWh/m²/day', type:'mean', decimals:2, description:'All-sky surface shortwave irradiance', source:'CERES / POWER' }
  });
  function daysInMonth(year, month) { return new Date(Date.UTC(year,month,0)).getUTCDate(); }
  function validNumber(v){ return typeof v==='number' && Number.isFinite(v) && v>-900; }
  function annualizeMonthly(payload, key, startYear, endYear){
    if (!VARIABLES[key]) throw new Error('Unsupported environmental variable.');
    const m=payload?.properties?.parameter?.[key];
    if(!m || typeof m !== 'object') throw new Error('NASA did not return this variable.');
    const annual=[], excluded=[];
    for(let year=startYear;year<=endYear;year++){
      let weighted=0, days=0, good=0;
      for(let month=1;month<=12;month++){
        const k=String(year)+String(month).padStart(2,'0');
        const raw=m[k];
        if(!validNumber(raw)) continue;
        const count=daysInMonth(year,month);
        weighted+=raw*count;
        days+=count;good++;
      }
      if(good!==12){excluded.push({year,completeMonths:good});continue;}
      annual.push({year, value:VARIABLES[key].type==='sum'?weighted:weighted/days, completeMonths:good});
    }
    return {annual,excluded, variable:key, units:VARIABLES[key].unit, rawSource:payload?.header?.title || 'NASA POWER', firstYear:startYear, lastYear:endYear};
  }
  function logGamma(z){
    const c=[0.99999999999980993,676.5203681218851,-1259.1392167224028,771.3234287776531,-176.6150291621406,12.507343278686905,-0.13857109526572012,9.9843695780195716e-6,1.5056327351493116e-7];
    if(z<0.5) return Math.log(Math.PI)-Math.log(Math.sin(Math.PI*z))-logGamma(1-z);
    z-=1;let x=c[0];for(let i=1;i<c.length;i++)x+=c[i]/(z+i);
    const t=z+7.5;return 0.5*Math.log(2*Math.PI)+(z+0.5)*Math.log(t)-t+Math.log(x);
  }
  function betaFraction(a,b,x){
    const MAX=250, EPS=3e-13, TINY=1e-300;
    let qab=a+b,qap=a+1,qam=a-1,c=1,d=1-qab*x/qap;
    if(Math.abs(d)<TINY)d=TINY;d=1/d;let h=d;
    for(let m=1;m<=MAX;m++){
      let m2=2*m;
      let aa=m*(b-m)*x/((qam+m2)*(a+m2));
      d=1+aa*d;if(Math.abs(d)<TINY)d=TINY;
      c=1+aa/c;if(Math.abs(c)<TINY)c=TINY;
      d=1/d;h*=d*c;
      aa=-(a+m)*(qab+m)*x/((a+m2)*(qap+m2));
      d=1+aa*d;if(Math.abs(d)<TINY)d=TINY;
      c=1+aa/c;if(Math.abs(c)<TINY)c=TINY;
      d=1/d;const delta=d*c;h*=delta;
      if(Math.abs(delta-1)<EPS)break;
    }
    return h;
  }
  function regIncompleteBeta(x,a,b){
    if(x<=0) return 0;if(x>=1)return 1;
    const factor=Math.exp(logGamma(a+b)-logGamma(a)-logGamma(b)+a*Math.log(x)+b*Math.log(1-x));
    if(x<(a+1)/(a+b+2))return factor*betaFraction(a,b,x)/a;
    return 1-factor*betaFraction(b,a,1-x)/b;
  }
  function tTwoSidedP(absT,df){
    if(!Number.isFinite(absT))return absT===Infinity?0:1;
    return Math.max(0,Math.min(1,regIncompleteBeta(df/(df+absT*absT),df/2,0.5)));
  }
  function tCritical95(df){let lo=0,hi=32;for(let i=0;i<90;i++){const mid=(lo+hi)/2;if(tTwoSidedP(mid,df)>0.05)lo=mid;else hi=mid;}return(hi+lo)/2;}
  function regress(points){
    const data=points.filter(p=>Number.isFinite(p?.year)&&Number.isFinite(p?.value));
    if(data.length<3)throw new Error('At least three complete years are needed for a trend test.');
    const n=data.length;
    const mx=data.reduce((a,p)=>a+p.year,0)/n, my=data.reduce((a,p)=>a+p.value,0)/n;
    let sxx=0,sxy=0,syy=0;for(const p of data){let dx=p.year-mx,dy=p.value-my;sxx+=dx*dx;sxy+=dx*dy;syy+=dy*dy;}
    if(sxx===0)throw new Error('At least three distinct years are required.');
    const slope=sxy/sxx,intercept=my-slope*mx;
    let rss=0;for(const p of data){let e=p.value-(intercept+slope*p.year);rss+=e*e;}
    const df=n-2;
    const standardError=Math.sqrt((rss/df)/sxx);
    const t=standardError===0?(slope===0?0:Infinity):Math.abs(slope/standardError);
    const pValue=tTwoSidedP(t,df),crit=tCritical95(df);
    const ciLow=slope-crit*standardError,ciHigh=slope+crit*standardError;
    const firstYear=Math.min(...data.map(p=>p.year)),lastYear=Math.max(...data.map(p=>p.year));
    const significant=pValue<0.05;
    const change=slope*(lastYear-firstYear);
    return{n,slope,intercept,standardError,pValue,ciLow,ciHigh,r2:syy===0?(rss===0?1:0):Math.max(0,1-rss/syy),firstYear,lastYear,firstValue:data.find(p=>p.year===firstYear).value,lastValue:data.find(p=>p.year===lastYear).value,change,significant,direction:slope>0?'increase':slope<0?'decrease':'flat'};
  }
  function powerUrl(lat,lon,start,end,key){
    const params=new URLSearchParams({parameters:key, community:'AG',latitude:String(lat),longitude:String(lon),start:String(start),end:String(end),format:'JSON'});
    return `https://power.larc.nasa.gov/api/temporal/monthly/point?${params.toString()}`;
  }
  function readableP(p){return p<0.0001?'<0.0001':p.toFixed(4);}
  root.TerraScience={VARIABLES,daysInMonth,annualizeMonthly,regress,tTwoSidedP,tCritical95,powerUrl,readableP};
})(typeof window !== 'undefined'?window:globalThis);
