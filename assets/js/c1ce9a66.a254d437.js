"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[1543],{5685:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>l,contentTitle:()=>a,default:()=>h,frontMatter:()=>o,metadata:()=>c,toc:()=>d});var i=t(5893),r=t(1151),s=t(2991);const o={},a="Scaling Booster Azure Functions",c={id:"going-deeper/azure-scale",title:"Scaling Booster Azure Functions",description:"Booster Azure Provider relies on CosmosDB change feed processor to consume new events.",source:"@site/docs/10_going-deeper/azure-scale.mdx",sourceDirName:"10_going-deeper",slug:"/going-deeper/azure-scale",permalink:"/going-deeper/azure-scale",draft:!1,unlisted:!1,editUrl:"https://github.com/boostercloud/booster/tree/main/website/docs/10_going-deeper/azure-scale.mdx",tags:[],version:"current",lastUpdatedBy:"Mario Castro Squella",lastUpdatedAt:1739304003,formattedLastUpdatedAt:"Feb 11, 2025",frontMatter:{},sidebar:"docs",previous:{title:"Remove events",permalink:"/going-deeper/remove-events"},next:{title:"Storing events in batches",permalink:"/going-deeper/event-batches"}},l={},d=[{value:"Parameters",id:"parameters",level:2},{value:"Infrastructure",id:"infrastructure",level:2},{value:"Recommendations",id:"recommendations",level:2}];function u(e){const n={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",li:"li",p:"p",pre:"pre",ul:"ul",...(0,r.a)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.h1,{id:"scaling-booster-azure-functions",children:"Scaling Booster Azure Functions"}),"\n",(0,i.jsxs)(n.p,{children:["Booster Azure Provider relies on CosmosDB ",(0,i.jsx)(n.a,{href:"https://learn.microsoft.com/en-us/azure/cosmos-db/nosql/change-feed-processor",children:"change feed processor"})," to consume new events.\nIn CosmosDB, the partition keys are distributed in ranges, where each range represents a physical partition. ",(0,i.jsx)(n.a,{href:"https://learn.microsoft.com/en-us/azure/cosmos-db/partitioning-overview#physical-partitions",children:"Unlike logical partitions,\nphysical partitions are an internal implementation of the system and Azure Cosmos DB entirely manages physical partitions"})]}),"\n",(0,i.jsx)(n.p,{children:"With Booster EventStream functionality, we could define the number of physical partitions our events are split and create instances for each partition."}),"\n",(0,i.jsxs)(n.p,{children:["To enable EventStream, set the ",(0,i.jsx)(n.code,{children:"EventStreamConfiguration"})," in the configuration object:"]}),"\n",(0,i.jsx)(n.admonition,{type:"warning",children:(0,i.jsx)(n.p,{children:"Currently, only available for Azure provider."})}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-typescript",children:"  config.eventStreamConfiguration = {\n    enabled: true,\n    parameters: {\n      streamTopic: 'test',\n      partitionCount: 3,\n      messageRetention: 1,\n      maxRetries: 5,\n      mode: 'exponential'\n    },\n  }\n"})}),"\n",(0,i.jsx)(n.h2,{id:"parameters",children:"Parameters"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"StreamTopic: Define the internal topic name Booster will use."}),"\n",(0,i.jsx)(n.li,{children:"PartitionCount: Number of Event Hub partitions. The number of functions app consumer instances will match the partition count"}),"\n",(0,i.jsx)(n.li,{children:"MessageRetention: Specifies the number of days to retain the events for this Event Hub"}),"\n",(0,i.jsx)(n.li,{children:"MaxRetries: Number of retries to consume an event"}),"\n",(0,i.jsxs)(n.li,{children:["Mode: Retry mode. It could be ",(0,i.jsx)(n.code,{children:"fixed"})," or ",(0,i.jsx)(n.code,{children:"exponential"})]}),"\n"]}),"\n",(0,i.jsxs)(n.p,{children:["Note: ",(0,i.jsx)(n.code,{children:"maxRetries"})," and ",(0,i.jsx)(n.code,{children:"mode"})," are configured at Function level"]}),"\n",(0,i.jsx)(n.h2,{id:"infrastructure",children:"Infrastructure"}),"\n",(0,i.jsxs)(n.p,{children:["Enabling ",(0,i.jsx)(n.code,{children:"EventStreamConfiguration"})," will apply some changes to the infrastructure:"]}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["Two functions will be created","\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"One function with a CosmosDB consumer that will produce Event Hubs events. Also, it will include the readModels functions, schedule functions app, etc..."}),"\n",(0,i.jsx)(n.li,{children:"One function with an Event Hub consumer function app. This function will allow you to define the number of instances to be created"}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(n.li,{children:"A new container to handle duplicated consumed events"}),"\n",(0,i.jsx)(n.li,{children:"A new Event Hub will be added for event handling."}),"\n"]}),"\n",(0,i.jsx)(n.h2,{id:"recommendations",children:"Recommendations"}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.a,{href:"https://learn.microsoft.com/en-us/azure/event-hubs/dynamically-add-partitions#recommendations",children:"From the Azure documentation"}),":"]}),"\n",(0,i.jsx)(n.p,{children:"Dynamically adding partitions isn't recommended. While the existing data preserves ordering, partition hashing will be broken for messages hashed after the\npartition count changes due to addition of partitions."}),"\n",(0,i.jsx)(s.Z,{})]})}function h(e={}){const{wrapper:n}={...(0,r.a)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(u,{...e})}):u(e)}},2991:(e,n,t)=>{t.d(n,{Z:()=>g});t(7294);var i=t(512),r=t(3438),s=t(3692),o=t(3919),a=t(5999),c=t(2503);const l={cardContainer:"cardContainer_fWXF",cardTitle:"cardTitle_rnsV",cardDescription:"cardDescription_PWke"};var d=t(5893);function u(e){let{href:n,children:t}=e;return(0,d.jsx)(s.Z,{href:n,className:(0,i.Z)("card padding--lg",l.cardContainer),children:t})}function h(e){let{href:n,icon:t,title:r,description:s}=e;return(0,d.jsxs)(u,{href:n,children:[(0,d.jsxs)(c.Z,{as:"h2",className:(0,i.Z)("text--truncate",l.cardTitle),title:r,children:[t," ",r]}),s&&(0,d.jsx)("p",{className:(0,i.Z)("text--truncate",l.cardDescription),title:s,children:s})]})}function m(e){let{item:n}=e;const t=(0,r.LM)(n);return t?(0,d.jsx)(h,{href:t,icon:"\ud83d\uddc3\ufe0f",title:n.label,description:n.description??(0,a.I)({message:"{count} items",id:"theme.docs.DocCard.categoryDescription",description:"The default description for a category card in the generated index about how many items this category includes"},{count:n.items.length})}):null}function p(e){let{item:n}=e;const t=(0,o.Z)(n.href)?"\ud83d\udcc4\ufe0f":"\ud83d\udd17",i=(0,r.xz)(n.docId??void 0);return(0,d.jsx)(h,{href:n.href,icon:t,title:n.label,description:n.description??i?.description})}function f(e){let{item:n}=e;switch(n.type){case"link":return(0,d.jsx)(p,{item:n});case"category":return(0,d.jsx)(m,{item:n});default:throw new Error(`unknown item type ${JSON.stringify(n)}`)}}function x(e){let{className:n}=e;const t=(0,r.jA)();return(0,d.jsx)(g,{items:t.items,className:n})}function g(e){const{items:n,className:t}=e;if(!n)return(0,d.jsx)(x,{...e});const s=(0,r.MN)(n);return(0,d.jsx)("section",{className:(0,i.Z)("row",t),children:s.map(((e,n)=>(0,d.jsx)("article",{className:"col col--6 margin-bottom--lg",children:(0,d.jsx)(f,{item:e})},n)))})}},1151:(e,n,t)=>{t.d(n,{Z:()=>a,a:()=>o});var i=t(7294);const r={},s=i.createContext(r);function o(e){const n=i.useContext(s);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:o(e.components),i.createElement(s.Provider,{value:n},e.children)}}}]);