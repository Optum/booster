"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[6038],{5277:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>i,contentTitle:()=>c,default:()=>h,frontMatter:()=>a,metadata:()=>s,toc:()=>d});var o=t(5893),r=t(1151);const a={},c="Booster instrumentation",s={id:"going-deeper/instrumentation",title:"Booster instrumentation",description:"Trace Decorator",source:"@site/docs/10_going-deeper/instrumentation.md",sourceDirName:"10_going-deeper",slug:"/going-deeper/instrumentation",permalink:"/going-deeper/instrumentation",draft:!1,unlisted:!1,editUrl:"https://github.com/boostercloud/booster/tree/main/website/docs/10_going-deeper/instrumentation.md",tags:[],version:"current",lastUpdatedBy:"Jorge Rodr\xedguez",lastUpdatedAt:1708603384,formattedLastUpdatedAt:"Feb 22, 2024",frontMatter:{},sidebar:"docs",previous:{title:"Framework packages",permalink:"/going-deeper/framework-packages"},next:{title:"Scaling Booster Azure Functions",permalink:"/going-deeper/azure-scale"}},i={},d=[{value:"Trace Decorator",id:"trace-decorator",level:2},{value:"Usage",id:"usage",level:3},{value:"TraceActionTypes",id:"traceactiontypes",level:3},{value:"TraceInfo",id:"traceinfo",level:3},{value:"Adding the Trace Decorator to Your own async methods",id:"adding-the-trace-decorator-to-your-own-async-methods",level:3}];function l(e){const n={code:"code",h1:"h1",h2:"h2",h3:"h3",p:"p",pre:"pre",strong:"strong",...(0,r.a)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(n.h1,{id:"booster-instrumentation",children:"Booster instrumentation"}),"\n",(0,o.jsx)(n.h2,{id:"trace-decorator",children:"Trace Decorator"}),"\n",(0,o.jsxs)(n.p,{children:["The Trace Decorator is a ",(0,o.jsx)(n.strong,{children:"Booster"})," functionality that facilitates the reception of notifications whenever significant events occur in Booster's core, such as event dispatching or migration execution."]}),"\n",(0,o.jsx)(n.h3,{id:"usage",children:"Usage"}),"\n",(0,o.jsx)(n.p,{children:"To configure a custom tracer, you need to define an object with two methods: onStart and onEnd. The onStart method is called before the traced method is invoked, and the onEnd method is called after the method completes. Both methods receive a TraceInfo object, which contains information about the traced method and its arguments."}),"\n",(0,o.jsx)(n.p,{children:"Here's an example of a custom tracer that logs trace events to the console:"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-typescript",children:"import {\n  TraceParameters,\n  BoosterConfig,\n  TraceActionTypes,\n} from '@boostercloud/framework-types'\n\nclass MyTracer {\n  static async onStart(config: BoosterConfig, actionType: string, traceParameters: TraceParameters): Promise<void> {\n    console.log(`Start ${actionType}: ${traceParameters.className}.${traceParameters.methodName}`)\n  }\n\n  static async onEnd(config: BoosterConfig, actionType: string, traceParameters: TraceParameters): Promise<void> {\n    console.log(`End ${actionType}: ${traceParameters.className}.${traceParameters.methodName}`)\n  }\n}\n"})}),"\n",(0,o.jsx)(n.p,{children:"You can then configure the tracer in your Booster application's configuration:"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-typescript",children:"import { BoosterConfig } from '@boostercloud/framework-types'\nimport { MyTracer } from './my-tracer'\n\nconst config: BoosterConfig = {\n// ...other configuration options...\n  trace: {\n    enableTraceNotification: true,\n    onStart: MyTracer.onStart,\n    onEnd: MyTracer.onStart,\n  }\n}\n"})}),"\n",(0,o.jsx)(n.p,{children:"In the configuration above, we've enabled trace notifications and specified our onStart and onEnd as the methods to use. Verbose disable will reduce the amount of information generated excluding the internal parameter in the trace parameters."}),"\n",(0,o.jsxs)(n.p,{children:["Setting ",(0,o.jsx)(n.code,{children:"enableTraceNotification: true"})," would enable the trace for all actions. You can either disable them by setting it to ",(0,o.jsx)(n.code,{children:"false"})," or selectively enable only specific actions using an array of TraceActionTypes."]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-typescript",children:"import { BoosterConfig, TraceActionTypes } from '@boostercloud/framework-types'\nimport { MyTracer } from './my-tracer'\n\nconst config: BoosterConfig = {\n// ...other configuration options...\n  trace: {\n    enableTraceNotification: [TraceActionTypes.DISPATCH_EVENT, TraceActionTypes.MIGRATION_RUN, 'OTHER'],\n    includeInternal: false,\n    onStart: MyTracer.onStart,\n    onEnd: MyTracer.onStart,\n  }\n}\n"})}),"\n",(0,o.jsx)(n.p,{children:"In this example, only DISPATCH_EVENT, MIGRATION_RUN and 'OTHER' actions will trigger trace notifications."}),"\n",(0,o.jsx)(n.h3,{id:"traceactiontypes",children:"TraceActionTypes"}),"\n",(0,o.jsx)(n.p,{children:"The TraceActionTypes enum defines all the traceable actions in Booster's core:"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-typescript",children:"export enum TraceActionTypes {\n  CUSTOM,\n  EVENT_HANDLERS_PROCESS,\n  HANDLE_EVENT,\n  DISPATCH_ENTITY_TO_EVENT_HANDLERS,\n  DISPATCH_EVENTS,\n  FETCH_ENTITY_SNAPSHOT,\n  STORE_SNAPSHOT,\n  LOAD_LATEST_SNAPSHOT,\n  LOAD_EVENT_STREAM_SINCE,\n  ENTITY_REDUCER,\n  READ_MODEL_FIND_BY_ID,\n  GRAPHQL_READ_MODEL_SEARCH,\n  READ_MODEL_SEARCH,\n  COMMAND_HANDLER,\n  MIGRATION_RUN,\n  GRAPHQL_DISPATCH,\n  GRAPHQL_RUN_OPERATION,\n  SCHEDULED_COMMAND_HANDLER,\n  DISPATCH_SUBSCRIBER_NOTIFIER,\n  READ_MODEL_SCHEMA_MIGRATOR_RUN,\n  SCHEMA_MIGRATOR_MIGRATE,\n}\n"})}),"\n",(0,o.jsx)(n.h3,{id:"traceinfo",children:"TraceInfo"}),"\n",(0,o.jsx)(n.p,{children:"The TraceInfo interface defines the data that is passed to the tracer's onBefore and onAfter methods:"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-typescript",children:"export interface TraceInfo {\n  className: string\n  methodName: string\n  args: Array<unknown>\n  traceId: UUID\n  elapsedInvocationMillis?: number\n  internal: {\n    target: unknown\n    descriptor: PropertyDescriptor\n  }\n  description?: string\n}\n"})}),"\n",(0,o.jsxs)(n.p,{children:[(0,o.jsx)(n.code,{children:"className"})," and ",(0,o.jsx)(n.code,{children:"methodName"})," identify the function that is being traced."]}),"\n",(0,o.jsx)(n.h3,{id:"adding-the-trace-decorator-to-your-own-async-methods",children:"Adding the Trace Decorator to Your own async methods"}),"\n",(0,o.jsx)(n.p,{children:"In addition to using the Trace Decorator to receive notifications when events occur in Booster's core, you can also use it to trace your own methods. To add the Trace Decorator to your own methods, simply add @Trace() before your method declaration."}),"\n",(0,o.jsx)(n.p,{children:"Here's an example of how to use the Trace Decorator on a custom method:"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-typescript",children:"import { Trace } from '@boostercloud/framework-core'\nimport { BoosterConfig, Logger } from '@boostercloud/framework-types'\n\nexport class MyCustomClass {\n  @Trace('OTHER')\n  public async myCustomMethod(config: BoosterConfig, logger: Logger): Promise<void> {\n    logger.debug('This is my custom method')\n    // Do some custom logic here...\n  }\n}\n"})}),"\n",(0,o.jsx)(n.p,{children:"In the example above, we added the @Trace('OTHER') decorator to the myCustomMethod method. This will cause the method to emit trace events when it's invoked, allowing you to trace the flow of your application and detect performance bottlenecks or errors."}),"\n",(0,o.jsx)(n.p,{children:"Note that when you add the Trace Decorator to your own methods, you'll need to configure your Booster instance to use a tracer that implements the necessary methods to handle these events."})]})}function h(e={}){const{wrapper:n}={...(0,r.a)(),...e.components};return n?(0,o.jsx)(n,{...e,children:(0,o.jsx)(l,{...e})}):l(e)}},1151:(e,n,t)=>{t.d(n,{Z:()=>s,a:()=>c});var o=t(7294);const r={},a=o.createContext(r);function c(e){const n=o.useContext(a);return o.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function s(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:c(e.components),o.createElement(a.Provider,{value:n},e.children)}}}]);