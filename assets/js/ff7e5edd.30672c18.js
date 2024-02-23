"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[6888],{3747:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>d,contentTitle:()=>o,default:()=>m,frontMatter:()=>a,metadata:()=>c,toc:()=>l});var i=t(5893),r=t(1151),s=t(5163);const a={},o="Event",c={id:"architecture/event",title:"Event",description:"An event is a fact of something that has happened in your application. Every action that takes place on your application should be stored as an event. They are stored in a single collection, forming a set of immutable records of facts that contain the whole story of your application. This collection of events is commonly known as the Event Store.",source:"@site/docs/03_architecture/03_event.mdx",sourceDirName:"03_architecture",slug:"/architecture/event",permalink:"/architecture/event",draft:!1,unlisted:!1,editUrl:"https://github.com/boostercloud/booster/tree/main/website/docs/03_architecture/03_event.mdx",tags:[],version:"current",lastUpdatedBy:"Jorge Rodr\xedguez",lastUpdatedAt:1708603384,formattedLastUpdatedAt:"Feb 22, 2024",sidebarPosition:3,frontMatter:{},sidebar:"docs",previous:{title:"Command",permalink:"/architecture/command"},next:{title:"Event handler",permalink:"/architecture/event-handler"}},d={},l=[{value:"Creating an event",id:"creating-an-event",level:2},{value:"Declaring an event",id:"declaring-an-event",level:2},{value:"Events and entities",id:"events-and-entities",level:2},{value:"Registering events in the event store",id:"registering-events-in-the-event-store",level:2},{value:"Registering events from command handlers",id:"registering-events-from-command-handlers",level:3},{value:"Registering events from event handlers",id:"registering-events-from-event-handlers",level:3},{value:"Events naming convention",id:"events-naming-convention",level:2}];function h(e){const n={a:"a",admonition:"admonition",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,r.a)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.h1,{id:"event",children:"Event"}),"\n",(0,i.jsxs)(n.p,{children:["An event is a fact of something that has happened in your application. Every action that takes place on your application should be stored as an event. They are stored in a single collection, forming a set of ",(0,i.jsx)(n.strong,{children:"immutable records of facts"})," that contain the whole story of your application. This collection of events is commonly known as the ",(0,i.jsx)(n.strong,{children:"Event Store"}),"."]}),"\n",(0,i.jsx)(n.h2,{id:"creating-an-event",children:"Creating an event"}),"\n",(0,i.jsx)(n.p,{children:"The Booster CLI will help you to create new events. You just need to run the following command and the CLI will generate all the boilerplate for you:"}),"\n",(0,i.jsx)(s.Z,{children:(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-shell",children:"boost new:event StockMoved --fields productID:string origin:string destination:string quantity:number\n"})})}),"\n",(0,i.jsxs)(n.p,{children:["This will generate a new file called ",(0,i.jsx)(n.code,{children:"stock-moved.ts"})," in the ",(0,i.jsx)(n.code,{children:"src/events"})," directory. You can also create the file manually, but you will need to create the class and decorate it, so we recommend using the CLI."]}),"\n",(0,i.jsx)(n.h2,{id:"declaring-an-event",children:"Declaring an event"}),"\n",(0,i.jsxs)(n.p,{children:["Events are the cornerstone of Booster because of its event-driven and event-sourced nature. Booster events are TypeScript classes decorated with ",(0,i.jsx)(n.code,{children:"@Event"}),". An event class may look like this:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-typescript",metastring:'title="src/events/event-name.ts"',children:"@Event\nexport class EventName {\n  public constructor(readonly field1: SomeType, readonly field2: SomeOtherType) {}\n}\n"})}),"\n",(0,i.jsx)(n.p,{children:"The class name is the name of the event. The event name is used to identify the event in the application. It is also used to generate the GraphQL schema. The class parameter names are the names of the fields of the event and their types are the types of the fields of the event."}),"\n",(0,i.jsx)(n.h2,{id:"events-and-entities",children:"Events and entities"}),"\n",(0,i.jsxs)(n.p,{children:["Events and ",(0,i.jsx)(n.a,{href:"entity",children:"Entities"})," are closely related. Each event will be aggregated (or ",(0,i.jsx)(n.em,{children:"reduced"}),") into an entity. Therefore, Booster needs a way to know which entity is associated with each event. For that reason, it is required to provide an entity ID with each event. You can declare it with a class function named ",(0,i.jsx)(n.code,{children:"entityID"}),". For example:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-typescript",metastring:'title="src/events/cart-paid.ts"',children:"@Event\nexport class CartPaid {\n  public constructor(readonly cartID: UUID, readonly paymentID: UUID) {}\n\n  // highlight-start\n  public entityID(): UUID {\n    // returns cartID because we want to associate it with\n    // (and reduce it within) the Cart entity\n    return this.cartID\n  }\n  // highlight-end\n}\n"})}),"\n",(0,i.jsx)(n.admonition,{type:"tip",children:(0,i.jsxs)(n.p,{children:["If your domain requires a ",(0,i.jsx)(n.strong,{children:(0,i.jsx)(n.em,{children:"Singleton"})})," entity, where there's only one instance of that entity in your whole application, you can return a constant value."]})}),"\n",(0,i.jsx)(n.admonition,{type:"caution",children:(0,i.jsxs)(n.p,{children:["Make sure that the ",(0,i.jsx)(n.code,{children:"entityID"})," method always returns the same value for the same event's instance. Otherwise, the result of the entity reduction will be unpredictable."]})}),"\n",(0,i.jsx)(n.h2,{id:"registering-events-in-the-event-store",children:"Registering events in the event store"}),"\n",(0,i.jsxs)(n.p,{children:["We have shown you how to ",(0,i.jsx)(n.em,{children:"declare"})," an event in Booster, but we haven't explained how to store them in the event store. In Booster terminology, creating an instance of an event and storing in the event store is known as ",(0,i.jsx)(n.code,{children:"registering"})," it. You can do that on Booster using the ",(0,i.jsx)(n.code,{children:"register.events(...)"})," function. The ",(0,i.jsx)(n.code,{children:"register"})," object is provided as a parameter in the ",(0,i.jsx)(n.code,{children:"handle"})," method of both ",(0,i.jsx)(n.a,{href:"command#registering-events",children:"commands"})," and the ",(0,i.jsx)(n.a,{href:"event-handler#registering-events",children:"event handlers"}),". For example:"]}),"\n",(0,i.jsx)(n.h3,{id:"registering-events-from-command-handlers",children:"Registering events from command handlers"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-typescript",metastring:'title="src/commands/move-stock.ts"',children:"@Command({\n  authorize: [Admin],\n})\nexport class MoveStock {\n  public constructor(\n    readonly productID: string,\n    readonly origin: string,\n    readonly destination: string,\n    readonly quantity: number\n  ) {}\n\n  public static async handle(command: MoveStock, register: Register): Promise<void> {\n    if (!command.enoughStock(command.origin, command.quantity, command.productID)) {\n      // highlight-next-line\n      register.events(new ErrorEvent(`There is not enough stock for ${command.productID} at ${command.origin}`))\n    }\n  }\n}\n"})}),"\n",(0,i.jsx)(n.h3,{id:"registering-events-from-event-handlers",children:"Registering events from event handlers"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-typescript",metastring:'title="src/event-handlers/stock-moved.ts"',children:"@EventHandler(StockMoved)\nexport class HandleAvailability {\n  public static async handle(event: StockMoved, register: Register): Promise<void> {\n      // highlight-next-line\n      register.events(new ProductAvailabilityChanged(event.productID, event.quantity))\n    }\n  }\n}\n"})}),"\n",(0,i.jsx)(n.h2,{id:"events-naming-convention",children:"Events naming convention"}),"\n",(0,i.jsx)(n.p,{children:"As with commands, you can name events in any way you want, depending on your application's domain. However, we recommend you to choose short sentences written in past tense because events are facts that have happened and can't be changed. Some event names would be:"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"ProductCreated"}),"\n",(0,i.jsx)(n.li,{children:"ProductUpdated"}),"\n",(0,i.jsx)(n.li,{children:"ProductDeleted"}),"\n",(0,i.jsx)(n.li,{children:"CartItemChanged"}),"\n",(0,i.jsx)(n.li,{children:"StockMoved"}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:"As with other Booster files, events have their own directory:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-text",children:"<project-root>\n\u251c\u2500\u2500 src\n\u2502   \u251c\u2500\u2500 commands\n\u2502   \u251c\u2500\u2500 common\n\u2502   \u251c\u2500\u2500 config\n\u2502   \u251c\u2500\u2500 entities\n\u2502   \u251c\u2500\u2500 events <------ put them here\n\u2502   \u251c\u2500\u2500 index.ts\n\u2502   \u2514\u2500\u2500 read-models\n"})})]})}function m(e={}){const{wrapper:n}={...(0,r.a)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(h,{...e})}):h(e)}},5163:(e,n,t)=>{t.d(n,{Z:()=>s});t(7294);const i={terminalWindow:"terminalWindow_wGrl",terminalWindowHeader:"terminalWindowHeader_o9Cs",row:"row_Rn7G",buttons:"buttons_IGLB",right:"right_fWp9",terminalWindowAddressBar:"terminalWindowAddressBar_X8fO",dot:"dot_fGZE",terminalWindowMenuIcon:"terminalWindowMenuIcon_rtOE",bar:"bar_Ck8N",terminalWindowBody:"terminalWindowBody_tzdS"};var r=t(5893);function s(e){let{children:n}=e;return(0,r.jsxs)("div",{className:i.terminalWindow,children:[(0,r.jsx)("div",{className:i.terminalWindowHeader,children:(0,r.jsxs)("div",{className:i.buttons,children:[(0,r.jsx)("span",{className:i.dot,style:{background:"#f25f58"}}),(0,r.jsx)("span",{className:i.dot,style:{background:"#fbbe3c"}}),(0,r.jsx)("span",{className:i.dot,style:{background:"#58cb42"}})]})}),(0,r.jsx)("div",{className:i.terminalWindowBody,children:n})]})}},1151:(e,n,t)=>{t.d(n,{Z:()=>o,a:()=>a});var i=t(7294);const r={},s=i.createContext(r);function a(e){const n=i.useContext(s);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:a(e.components),i.createElement(s.Provider,{value:n},e.children)}}}]);