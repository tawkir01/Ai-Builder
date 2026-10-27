"use strict";(()=>{var e={};e.id=625,e.ids=[625],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},39491:e=>{e.exports=require("assert")},14300:e=>{e.exports=require("buffer")},32081:e=>{e.exports=require("child_process")},6113:e=>{e.exports=require("crypto")},82361:e=>{e.exports=require("events")},57147:e=>{e.exports=require("fs")},73292:e=>{e.exports=require("fs/promises")},13685:e=>{e.exports=require("http")},95687:e=>{e.exports=require("https")},41808:e=>{e.exports=require("net")},72254:e=>{e.exports=require("node:buffer")},87561:e=>{e.exports=require("node:fs")},88849:e=>{e.exports=require("node:http")},22286:e=>{e.exports=require("node:https")},87503:e=>{e.exports=require("node:net")},49411:e=>{e.exports=require("node:path")},97742:e=>{e.exports=require("node:process")},84492:e=>{e.exports=require("node:stream")},76402:e=>{e.exports=require("node:stream/promises")},99557:e=>{e.exports=require("node:stream/web")},41041:e=>{e.exports=require("node:url")},47261:e=>{e.exports=require("node:util")},65628:e=>{e.exports=require("node:zlib")},22037:e=>{e.exports=require("os")},71017:e=>{e.exports=require("path")},77282:e=>{e.exports=require("process")},63477:e=>{e.exports=require("querystring")},12781:e=>{e.exports=require("stream")},24404:e=>{e.exports=require("tls")},76224:e=>{e.exports=require("tty")},57310:e=>{e.exports=require("url")},73837:e=>{e.exports=require("util")},71267:e=>{e.exports=require("worker_threads")},59796:e=>{e.exports=require("zlib")},37311:(e,r,t)=>{t.r(r),t.d(r,{originalPathname:()=>h,patchFetch:()=>m,requestAsyncStorage:()=>l,routeModule:()=>c,serverHooks:()=>q,staticGenerationAsyncStorage:()=>d});var i={};t.r(i),t.d(i,{POST:()=>x});var o=t(49303),s=t(88716),n=t(60670),a=t(87070),p=t(64837);async function u(e,r,t=!1){let i=r.map(e=>`${e.role}: ${e.content}`).join("\n"),o=`
    You are an expert technical recruiter for the role of ${e}.
    Chat history so far:
    ${i}
  `;if(t){let e=`
      ${o}
      
      CRITICAL: The interview is now finished. Provide a detailed final evaluation.
      Output ONLY a JSON object with:
      - "score": number (0-100)
      - "overallFeedback": string
      - "strengths": string[] (3 points)
      - "weaknesses": string[] (3 points)
      - "recommendation": string (one sentence)
    `;return await (0,p.a)(e,!0)}let s=`
    ${o}
    
    Ask the next highly relevant interview question. 
    Mix technical/behavioral based on the previous answers.
    Keep it concise, professional, and slightly challenging.
    Be encouraging but professional.
  `;return await (0,p.a)(s,!1)}async function x(e){try{let{pathName:r,chatHistory:t,evaluate:i=!1}=await e.json();if(!r||!Array.isArray(t))return a.NextResponse.json({error:"Missing pathName or chatHistory"},{status:400});let o=await u(r,t,i);return a.NextResponse.json({reply:o})}catch(e){return console.error("Error in mock interview API:",e),a.NextResponse.json({error:"Failed to generate interview question."},{status:500})}}let c=new o.AppRouteRouteModule({definition:{kind:s.x.APP_ROUTE,page:"/api/ai/mock-interview/route",pathname:"/api/ai/mock-interview",filename:"route",bundlePath:"app/api/ai/mock-interview/route"},resolvedPagePath:"C:\\Users\\taufi\\OneDrive\\Desktop\\AI BUILDER\\src\\app\\api\\ai\\mock-interview\\route.ts",nextConfigOutput:"",userland:i}),{requestAsyncStorage:l,staticGenerationAsyncStorage:d,serverHooks:q}=c,h="/api/ai/mock-interview/route";function m(){return(0,n.patchFetch)({serverHooks:q,staticGenerationAsyncStorage:d})}}};var r=require("../../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),i=r.X(0,[948,972,837],()=>t(37311));module.exports=i})();