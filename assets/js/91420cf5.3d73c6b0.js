"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[3530],{3905:(e,t,r)=>{r.d(t,{Zo:()=>c,kt:()=>y});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function u(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var s=n.createContext({}),l=function(e){var t=n.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},c=function(e){var t=l(e.components);return n.createElement(s.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,o=e.originalType,s=e.parentName,c=u(e,["components","mdxType","originalType","parentName"]),d=l(r),y=a,h=d["".concat(s,".").concat(y)]||d[y]||p[y]||o;return r?n.createElement(h,i(i({ref:t},c),{},{components:r})):n.createElement(h,i({ref:t},c))}));function y(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=r.length,i=new Array(o);i[0]=d;var u={};for(var s in t)hasOwnProperty.call(t,s)&&(u[s]=t[s]);u.originalType=e,u.mdxType="string"==typeof e?e:a,i[1]=u;for(var l=2;l<o;l++)i[l]=r[l];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}d.displayName="MDXCreateElement"},3865:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>s,contentTitle:()=>i,default:()=>p,frontMatter:()=>o,metadata:()=>u,toc:()=>l});var n=r(7462),a=(r(7294),r(3905));const o={},i="Queries",u={unversionedId:"architecture/queries",id:"architecture/queries",title:"Queries",description:"ReadModels offer read operations over reduced events. On the other hand, Queries provide a way to do custom read operations.",source:"@site/docs/03_architecture/08_queries.mdx",sourceDirName:"03_architecture",slug:"/architecture/queries",permalink:"/architecture/queries",draft:!1,editUrl:"https://github.com/boostercloud/booster/tree/main/website/docs/03_architecture/08_queries.mdx",tags:[],version:"current",lastUpdatedBy:"gonzalojaubert",lastUpdatedAt:1694600247,formattedLastUpdatedAt:"Sep 13, 2023",sidebarPosition:8,frontMatter:{}},s={},l=[{value:"Queries naming convention",id:"queries-naming-convention",level:2},{value:"Creating a query",id:"creating-a-query",level:2},{value:"The query handler function",id:"the-query-handler-function",level:2},{value:"Validating data",id:"validating-data",level:3},{value:"Throw an error",id:"throw-an-error",level:4},{value:"Registering events",id:"registering-events",level:3},{value:"Authorizing queries",id:"authorizing-queries",level:2},{value:"Querying",id:"querying",level:2}],c={toc:l};function p(e){let{components:t,...r}=e;return(0,a.kt)("wrapper",(0,n.Z)({},c,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"queries"},"Queries"),(0,a.kt)("p",null,"ReadModels offer read operations over reduced events. On the other hand, Queries provide a way to do custom read operations."),(0,a.kt)("p",null,"Queries are classes decorated with the ",(0,a.kt)("inlineCode",{parentName:"p"},"@Query")," decorator that have a ",(0,a.kt)("inlineCode",{parentName:"p"},"handle")," method."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-typescript"},"import { Booster, NonExposed, Query } from '@boostercloud/framework-core'\nimport { QueryInfo, QueryInput, UserEnvelope, UUID } from '@boostercloud/framework-types'\nimport { Cart } from '../entities/cart'\nimport {\n  beforeHookQueryID,\n  beforeHookQueryMultiply,\n  queryHandlerErrorCartId,\n  queryHandlerErrorCartMessage,\n} from '../constants'\n\n@Query({\n  authorize: 'all',\n})\nexport class CartTotalQuantity {\n  public constructor(readonly cartId: UUID, @NonExposed readonly multiply: number) {}\n\n  public static async handle(query: CartTotalQuantity, queryInfo: QueryInfo): Promise<number> {\n    const cart = await Booster.entity(Cart, query.cartId)\n    if (!cart || !cart.cartItems || cart.cartItems.length === 0) {\n      return 0\n    }\n    return cart?.cartItems\n      .map((cartItem) => cartItem.quantity)\n      .reduce((accumulator, value) => {\n        return accumulator + value\n      }, 0)\n  }\n}\n")),(0,a.kt)("h2",{id:"queries-naming-convention"},"Queries naming convention"),(0,a.kt)("p",null,"We recommend use the ",(0,a.kt)("inlineCode",{parentName:"p"},"Query")," suffix in your queries name."),(0,a.kt)("p",null,"Despite you can place your queries in any directory, we strongly recommend you to put them in ",(0,a.kt)("inlineCode",{parentName:"p"},"<project-root>/src/queries"),"."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-text"},"<project-root>\n\u251c\u2500\u2500 src\n\u2502\xa0\xa0 \u251c\u2500\u2500 commands\n\u2502\xa0\xa0 \u251c\u2500\u2500 common\n\u2502\xa0\xa0 \u251c\u2500\u2500 config\n\u2502\xa0\xa0 \u251c\u2500\u2500 entities\n\u2502\xa0\xa0 \u251c\u2500\u2500 read-models\n\u2502\xa0\xa0 \u251c\u2500\u2500 events\n\u2502\xa0\xa0 \u251c\u2500\u2500 queries      <------ put them here\n\u2502\xa0\xa0 \u2514\u2500\u2500 index.ts\n")),(0,a.kt)("h2",{id:"creating-a-query"},"Creating a query"),(0,a.kt)("p",null,"The preferred way to create a query is by using the generator, e.g."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell"},"boost new:query ItemsInCountry --fields country:string\n")),(0,a.kt)("p",null,"The generator will create a Typescript class under the queries directory ",(0,a.kt)("inlineCode",{parentName:"p"},"<project-root>/src/queries/items-in-country.ts"),"."),(0,a.kt)("p",null,"Queries classes can also be created by hand and there are no restrictions. The structure of the data is totally open and can be as complex as you can manage in your projection functions."),(0,a.kt)("h2",{id:"the-query-handler-function"},"The query handler function"),(0,a.kt)("p",null,"Each query class must have a method called ",(0,a.kt)("inlineCode",{parentName:"p"},"handle"),". This function is the command handler, and it will be called by the framework every time one instance of this query is submitted. Inside the handler you can run validations, return errors and query entities to make decisions."),(0,a.kt)("p",null,"Handler function receive a QueryInfo object to let users interact with the execution context. It can be used for a variety of purposes, including:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"Access the current signed in user, their roles and other claims included in their JWT token"),(0,a.kt)("li",{parentName:"ul"},"Access the request context or alter the HTTP response headers")),(0,a.kt)("h3",{id:"validating-data"},"Validating data"),(0,a.kt)("p",null,"Booster uses the typed nature of GraphQL to ensure that types are correct before reaching the handler, so you don't have to validate types."),(0,a.kt)("h4",{id:"throw-an-error"},"Throw an error"),(0,a.kt)("p",null,"There are still business rules to be checked before proceeding with a query. For example, a given number must be between a threshold or a string must match a regular expression. In that case, it is enough just to throw an error in the handler. Booster will use the error's message as the response to make it descriptive."),(0,a.kt)("h3",{id:"registering-events"},"Registering events"),(0,a.kt)("p",null,"Within the query handler execution, it is not possible to register domain events. If you need to register events, then use a Command. For more details about events and the register parameter, see the ",(0,a.kt)("a",{parentName:"p",href:"/architecture/event"},(0,a.kt)("inlineCode",{parentName:"a"},"Events"))," section."),(0,a.kt)("h2",{id:"authorizing-queries"},"Authorizing queries"),(0,a.kt)("p",null,"You can define who is authorized to access your queries. The Booster authorization feature is covered in ",(0,a.kt)("a",{parentName:"p",href:"/security/authentication"},"the auth section"),". So far, we have seen that you can make a query publicly accessible by authorizing ",(0,a.kt)("inlineCode",{parentName:"p"},"'all'")," to query it, or you can set specific roles providing an array of roles in this way: ",(0,a.kt)("inlineCode",{parentName:"p"},"authorize: [Admin]"),"."),(0,a.kt)("h2",{id:"querying"},"Querying"),(0,a.kt)("p",null,"For every query, Booster automatically creates the corresponding GraphQL query. For example, given this ",(0,a.kt)("inlineCode",{parentName:"p"},"CartTotalQuantityQuery"),":"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-typescript"},"@Query({\n  authorize: 'all',\n})\nexport class CartTotalQuantityQuery {\n  public constructor(readonly cartId: UUID) {}\n\n  public static async handle(query: CartTotalQuantity, queryInfo: QueryInfo): Promise<number> {\n    const cart = await Booster.entity(Cart, query.cartId)\n    if (!cart || !cart.cartItems || cart.cartItems.length === 0) {\n      return 0\n    }\n    return cart?.cartItems\n      .map((cartItem) => cartItem.quantity)\n      .reduce((accumulator, value) => {\n        return accumulator + value\n      }, 0)\n  }\n}\n")),(0,a.kt)("p",null,"You will get the following GraphQL query and subscriptions:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-graphQL"},"query CartTotalQuantityQuery($cartId: ID!): Float!\n")),(0,a.kt)("blockquote",null,(0,a.kt)("p",{parentName:"blockquote"},"[!NOTE]"," Query subscriptions are not supported yet")))}p.isMDXComponent=!0}}]);