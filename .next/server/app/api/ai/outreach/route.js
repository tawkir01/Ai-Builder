"use strict";(()=>{var e={};e.id=98,e.ids=[98],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},39491:e=>{e.exports=require("assert")},14300:e=>{e.exports=require("buffer")},32081:e=>{e.exports=require("child_process")},6113:e=>{e.exports=require("crypto")},82361:e=>{e.exports=require("events")},57147:e=>{e.exports=require("fs")},73292:e=>{e.exports=require("fs/promises")},13685:e=>{e.exports=require("http")},95687:e=>{e.exports=require("https")},41808:e=>{e.exports=require("net")},72254:e=>{e.exports=require("node:buffer")},87561:e=>{e.exports=require("node:fs")},88849:e=>{e.exports=require("node:http")},22286:e=>{e.exports=require("node:https")},87503:e=>{e.exports=require("node:net")},49411:e=>{e.exports=require("node:path")},97742:e=>{e.exports=require("node:process")},84492:e=>{e.exports=require("node:stream")},76402:e=>{e.exports=require("node:stream/promises")},99557:e=>{e.exports=require("node:stream/web")},41041:e=>{e.exports=require("node:url")},47261:e=>{e.exports=require("node:util")},65628:e=>{e.exports=require("node:zlib")},22037:e=>{e.exports=require("os")},71017:e=>{e.exports=require("path")},77282:e=>{e.exports=require("process")},63477:e=>{e.exports=require("querystring")},12781:e=>{e.exports=require("stream")},24404:e=>{e.exports=require("tls")},76224:e=>{e.exports=require("tty")},57310:e=>{e.exports=require("url")},73837:e=>{e.exports=require("util")},71267:e=>{e.exports=require("worker_threads")},59796:e=>{e.exports=require("zlib")},11461:(e,r,t)=>{t.r(r),t.d(r,{originalPathname:()=>x,patchFetch:()=>q,requestAsyncStorage:()=>d,routeModule:()=>l,serverHooks:()=>m,staticGenerationAsyncStorage:()=>h});var o={};t.r(o),t.d(o,{POST:()=>c});var s=t(49303),i=t(88716),a=t(60670),n=t(87070),u=t(64837);async function p(e){let r=`
    You are an expert career coach helping an engineering graduate land their first job.
    Generate a compelling, highly personalized cold email and a short LinkedIn connection note (under 300 characters) for this target position.
    
    Candidate Info:
    - Target Role: ${e.careerPath}
    - Mastered Skills: ${e.skills.join(", ")}
    
    Target Job Info:
    - Company Name: ${e.companyName}
    - Job Description/Requirements: ${e.jobDescription}
    
    Be direct, highlight how their specific mastered skills fit the role description, and show enthusiasm.
    Output ONLY a JSON object with:
    - "emailSubject": string (A catchy, professional subject line)
    - "emailBody": string (The body of the cold email, formatted with line breaks)
    - "linkedinMessage": string (A punchy connection request message, maximum 280 characters)
  `,t=await (0,u.a)(r,!0);try{return JSON.parse((0,u.cleanJson)(t||"{}"))}catch(r){return console.error("Failed to parse outreach",t),{emailSubject:`Applying for ${e.careerPath} opportunities at ${e.companyName}`,emailBody:`Dear Hiring Team,

I hope this email finds you well. I am writing to express my strong interest in the ${e.careerPath} role at ${e.companyName}.

Based on my experience, I have developed skills in ${e.skills.slice(0,3).join(", ")}. I would love to discuss how I can contribute to your team.

Best regards,
[Your Name]`,linkedinMessage:`Hi there, I saw your post about the ${e.careerPath} role at ${e.companyName}. I have skills in ${e.skills.slice(0,2).join(", ")} and would love to connect to learn more about the team's work!`}}}async function c(e){try{let{careerPath:r,skills:t,companyName:o,jobDescription:s}=await e.json();if(!r||!t||!o||!s)return n.NextResponse.json({error:"Missing required fields: careerPath, skills, companyName, or jobDescription"},{status:400});let i=await p({careerPath:r,skills:t,companyName:o,jobDescription:s});return n.NextResponse.json({outreach:i})}catch(e){return console.error("Error in outreach API:",e),n.NextResponse.json({error:"Failed to generate outreach templates."},{status:500})}}let l=new s.AppRouteRouteModule({definition:{kind:i.x.APP_ROUTE,page:"/api/ai/outreach/route",pathname:"/api/ai/outreach",filename:"route",bundlePath:"app/api/ai/outreach/route"},resolvedPagePath:"C:\\Users\\taufi\\OneDrive\\Desktop\\AI BUILDER\\src\\app\\api\\ai\\outreach\\route.ts",nextConfigOutput:"",userland:o}),{requestAsyncStorage:d,staticGenerationAsyncStorage:h,serverHooks:m}=l,x="/api/ai/outreach/route";function q(){return(0,a.patchFetch)({serverHooks:m,staticGenerationAsyncStorage:h})}}};var r=require("../../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),o=r.X(0,[948,972,837],()=>t(11461));module.exports=o})();