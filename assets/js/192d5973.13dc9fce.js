"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[1300],{9210:(e,t,o)=>{o.r(t),o.d(t,{assets:()=>a,contentTitle:()=>i,default:()=>p,frontMatter:()=>n,metadata:()=>c,toc:()=>d});var s=o(5893),r=o(1151);const n={},i="Static Sites Rocket",c={id:"going-deeper/rockets/rocket-static-sites",title:"Static Sites Rocket",description:"This package is a configurable Booster rocket to add static site deployment to your Booster applications. It uploads your root.",source:"@site/docs/10_going-deeper/rockets/rocket-static-sites.md",sourceDirName:"10_going-deeper/rockets",slug:"/going-deeper/rockets/rocket-static-sites",permalink:"/going-deeper/rockets/rocket-static-sites",draft:!1,unlisted:!1,editUrl:"https://github.com/boostercloud/booster/tree/main/website/docs/10_going-deeper/rockets/rocket-static-sites.md",tags:[],version:"current",lastUpdatedBy:"Mario Castro Squella",lastUpdatedAt:1739304003,formattedLastUpdatedAt:"Feb 11, 2025",frontMatter:{},sidebar:"docs",previous:{title:"Backup Booster Rocket",permalink:"/going-deeper/rockets/rocket-backup-booster"},next:{title:"Webhook Rocket",permalink:"/going-deeper/rockets/rocket-webhook"}},a={},d=[{value:"Usage",id:"usage",level:2}];function l(e){const t={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",p:"p",pre:"pre",...(0,r.a)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(t.h1,{id:"static-sites-rocket",children:"Static Sites Rocket"}),"\n",(0,s.jsx)(t.p,{children:"This package is a configurable Booster rocket to add static site deployment to your Booster applications. It uploads your root."}),"\n",(0,s.jsx)(t.admonition,{type:"info",children:(0,s.jsx)(t.p,{children:(0,s.jsx)(t.a,{href:"https://github.com/boostercloud/rocket-static-sites-aws-infrastructure",children:"GitHub Repo"})})}),"\n",(0,s.jsx)(t.h2,{id:"usage",children:"Usage"}),"\n",(0,s.jsx)(t.p,{children:"Install this package as a dev dependency in your Booster project (It's a dev dependency because it's only used during deployment, but we don't want this code to be uploaded to the project lambdas)"}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-bash",children:"npm install --save-dev @boostercloud/rocket-static-sites-aws-infrastructure\n"})}),"\n",(0,s.jsx)(t.p,{children:"In your Booster config file, pass a RocketDescriptor in the config.rockets array to configuring the static site rocket:"}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-typescript",children:"import { Booster } from '@boostercloud/framework-core'\nimport { BoosterConfig } from '@boostercloud/framework-types'\n\nBooster.configure('development', (config: BoosterConfig): void => {\n config.appName = 'my-store'\n config.rockets = [\n   {\n     packageName: '@boostercloud/rocket-static-sites-aws-infrastructure', \n     parameters: {\n     bucketName: 'test-bucket-name', // Required\n     rootPath: './frontend/dist', // Defaults to ./public\n     indexFile: 'main.html', // File to render when users access the CLoudFormation URL. Defaults to index.html\n     errorFile: 'error.html', // File to render when there's an error. Defaults to 404.html\n     }\n   },\n ]\n})\n"})})]})}function p(e={}){const{wrapper:t}={...(0,r.a)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(l,{...e})}):l(e)}},1151:(e,t,o)=>{o.d(t,{Z:()=>c,a:()=>i});var s=o(7294);const r={},n=s.createContext(r);function i(e){const t=s.useContext(n);return s.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function c(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:i(e.components),s.createElement(n.Provider,{value:t},e.children)}}}]);