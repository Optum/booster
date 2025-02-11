"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[3146],{9973:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>r,default:()=>d,frontMatter:()=>i,metadata:()=>a,toc:()=>l});var o=n(5893),s=n(1151);const i={},r="Frequently Asked Questions",a={id:"frequently-asked-questions",title:"Frequently Asked Questions",description:'1.- When deploying my application in AWS for the first time, I got an error saying _"StagingBucket your app name -toolkit-bucket already exists"_',source:"@site/docs/11_frequently-asked-questions.md",sourceDirName:".",slug:"/frequently-asked-questions",permalink:"/frequently-asked-questions",draft:!1,unlisted:!1,editUrl:"https://github.com/boostercloud/booster/tree/main/website/docs/11_frequently-asked-questions.md",tags:[],version:"current",lastUpdatedBy:"Mario Castro Squella",lastUpdatedAt:1739304003,formattedLastUpdatedAt:"Feb 11, 2025",sidebarPosition:11,frontMatter:{},sidebar:"docs",previous:{title:"Storing events in batches",permalink:"/going-deeper/event-batches"},next:{title:"Contributing to Booster",permalink:"/contributing"}},c={},l=[];function u(e){const t={code:"code",em:"em",h1:"h1",p:"p",strong:"strong",...(0,s.a)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(t.h1,{id:"frequently-asked-questions",children:"Frequently Asked Questions"}),"\n",(0,o.jsx)(t.p,{children:(0,o.jsxs)(t.strong,{children:["1.- When deploying my application in AWS for the first time, I got an error saying ",(0,o.jsx)(t.em,{children:'"StagingBucket your app name -toolkit-bucket already exists"'})]})}),"\n",(0,o.jsxs)(t.p,{children:["When you deploy a Booster application to AWS, an S3 bucket needs to be created to upload the application code. Booster names that bucket using your application name as a prefix. In AWS, bucket names must be unique ",(0,o.jsx)(t.em,{children:"globally"}),", so if there is another bucket in the world with exactly the same name as the one generated for your application, you will get this error."]}),"\n",(0,o.jsxs)(t.p,{children:["The solution is to ",(0,o.jsx)(t.strong,{children:"change your application name in the configuration file so that the bucket name is unique."})]}),"\n",(0,o.jsx)(t.p,{children:(0,o.jsxs)(t.strong,{children:["2.- I tried following the video guide but the function ",(0,o.jsx)(t.code,{children:"Booster.fetchEntitySnapshot"})," is not found in BoostApp."]})}),"\n",(0,o.jsxs)(t.p,{children:["The function ",(0,o.jsx)(t.code,{children:"Booster.fetchEntitySnapshot"})," was renamed to ",(0,o.jsx)(t.code,{children:"Booster.entity"}),", so please replace it when following old tutorials."]})]})}function d(e={}){const{wrapper:t}={...(0,s.a)(),...e.components};return t?(0,o.jsx)(t,{...e,children:(0,o.jsx)(u,{...e})}):u(e)}},1151:(e,t,n)=>{n.d(t,{Z:()=>a,a:()=>r});var o=n(7294);const s={},i=o.createContext(s);function r(e){const t=o.useContext(i);return o.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function a(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:r(e.components),o.createElement(i.Provider,{value:t},e.children)}}}]);