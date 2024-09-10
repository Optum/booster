"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[2538],{5728:(e,n,r)=>{r.r(n),r.d(n,{assets:()=>d,contentTitle:()=>i,default:()=>h,frontMatter:()=>o,metadata:()=>a,toc:()=>c});var t=r(5893),s=r(1151);const o={},i="Create custom providers",a={id:"going-deeper/custom-providers",title:"Create custom providers",description:"Booster provides an infrastructure layer out of the box with sensible defaults that you can use for rapid development, but if",source:"@site/docs/10_going-deeper/custom-providers.mdx",sourceDirName:"10_going-deeper",slug:"/going-deeper/custom-providers",permalink:"/going-deeper/custom-providers",draft:!1,unlisted:!1,editUrl:"https://github.com/boostercloud/booster/tree/main/website/docs/10_going-deeper/custom-providers.mdx",tags:[],version:"current",lastUpdatedBy:"Mario Castro Squella",lastUpdatedAt:1725973309,formattedLastUpdatedAt:"Sep 10, 2024",frontMatter:{},sidebar:"docs",previous:{title:"Configuring Infrastructure Providers",permalink:"/going-deeper/infrastructure-providers"},next:{title:"Extending Booster with Rockets!",permalink:"/going-deeper/rockets"}},d={},c=[{value:"How do Booster cloud providers work?",id:"how-do-booster-cloud-providers-work",level:2},{value:"The infrastructure interface in detail",id:"the-infrastructure-interface-in-detail",level:2},{value:"The runtime interface in detail",id:"the-runtime-interface-in-detail",level:2},{value:"Events",id:"events",level:3},{value:"Read Models",id:"read-models",level:3},{value:"GraphQL",id:"graphql",level:3},{value:"API responses",id:"api-responses",level:3},{value:"Connections",id:"connections",level:3},{value:"Scheduled",id:"scheduled",level:3},{value:"Tips for developing custom providers",id:"tips-for-developing-custom-providers",level:2}];function l(e){const n={a:"a",br:"br",code:"code",h1:"h1",h2:"h2",h3:"h3",img:"img",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,s.a)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.h1,{id:"create-custom-providers",children:"Create custom providers"}),"\n",(0,t.jsx)(n.p,{children:"Booster provides an infrastructure layer out of the box with sensible defaults that you can use for rapid development, but if\nyou want to have control over the infrastructure deployed to your cloud provider or start from scratch with a fully customized\ninfrastructure implementation. Booster layered architecture allows you to do so by implementing a provider package."}),"\n",(0,t.jsx)(n.h2,{id:"how-do-booster-cloud-providers-work",children:"How do Booster cloud providers work?"}),"\n",(0,t.jsx)(n.p,{children:"Booster providers require the implementation of two specific interfaces, often delivered as separate packages to avoid including dependencies required at\ndeployment time as part of your application package:"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"Infrastructure:"})," This interface is used during deployment to create, destroy and configure all the infrastructure necessary to run the application."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"Runtime:"})," This inteface implements all the interaction between Booster framework and the deployed infrastructure in runtime."]}),"\n"]}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.img,{alt:"architecture",src:r(6658).Z+"",width:"737",height:"441"})}),"\n",(0,t.jsx)(n.h2,{id:"the-infrastructure-interface-in-detail",children:"The infrastructure interface in detail"}),"\n",(0,t.jsxs)(n.p,{children:["The provider infrastructure interface by convention is implemented in a package ending with ",(0,t.jsx)(n.code,{children:"-infrastructure"})," name like the ",(0,t.jsx)(n.code,{children:"framework-provider-aws-infrastructure"}),".",(0,t.jsx)(n.br,{}),"\n","As it has been commented, this package includes all the necessary to deploy and configure cloud elements for running your application. For instance in the case of AWS,\nthis package is in charge of deploy the DynamoDB for your event store, create all the lambdas, and configure all the API gateway configuration for your application."]}),"\n",(0,t.jsx)(n.p,{children:"The infrastructure package interface is composed of four methods:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-ts",children:"    export interface ProviderInfrastructure {\n      deploy?: (config: BoosterConfig) => Promise<void>\n      nuke?: (config: BoosterConfig) => Promise<void>\n      start?: (config: BoosterConfig, port: number) => Promise<void>\n      synth?: (config: BoosterConfig) => Promise<void>\n    }\n"})}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"deploy"}),": This method is called during the deployment by the CLI and it should be in charge to deploy all the neccesary resource for your application and rockets."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"nuke"}),": This is method is charge of destroy all generated resources during the deploy and it is called during the nuke process."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"start"}),": This method is used when the provider implements a server that needs to be started (i.e. the local provider)"]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"synth"}),": This method allows you to export the infrastructure to a file (for instance, if you use the Terraform CDK, you can export the script here to run it using conventional terraform tools)"]}),"\n"]}),"\n",(0,t.jsx)(n.p,{children:"The infrastructure interface just defines an adapter for Booster so the framework knows how to start any of the described processes, but you can use any Infrastructure as Code tool that has a Typescript DSL (CDK)\nor even call other CLI tools or scripts if you rather maintain it using a different technology."}),"\n",(0,t.jsx)(n.h2,{id:"the-runtime-interface-in-detail",children:"The runtime interface in detail"}),"\n",(0,t.jsx)(n.p,{children:"The other key aspect during the implementation of a provider is the runtime package. This package is in charge of the interaction between Booster framework and all deployed resources when the application is running.\nFor instance, this package has the responsability to store data in the event store, performs the data projections, etc..."}),"\n",(0,t.jsxs)(n.p,{children:["The runtime interface (",(0,t.jsx)(n.a,{href:"https://github.com/boostercloud/booster/blob/main/packages/framework-types/src/provider.ts",children:"ProviderLibrary"}),") is divided in seven sections:"]}),"\n",(0,t.jsx)(n.h3,{id:"events",children:"Events"}),"\n",(0,t.jsx)(n.p,{children:"This section is in charge of all operations related to events. the methods of this section are the following:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-ts",children:"export interface ProviderEventsLibrary {\n  rawToEnvelopes(rawEvents: unknown): Array<EventEnvelope>\n  forEntitySince(config: BoosterConfig, entityTypeName: string, entityID: UUID, since?: string): Promise<Array<EventEnvelope>>\n  latestEntitySnapshot(config: BoosterConfig, entityTypeName: string, entityID: UUID): Promise<EventEnvelope | null>\n  search(config: BoosterConfig, parameters: EventSearchParameters): Promise<Array<EventSearchResponse>>\n  store(eventEnvelopes: Array<EventEnvelope>, config: BoosterConfig): Promise<void>\n  searchEntitiesIDs(config: BoosterConfig, limit: number, afterCursor: Record<string, string> | undefined, entityTypeName: string): Promise<PaginatedEntitiesIdsResult>\n}\n"})}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"rawToEnvelopes:"})," Inside the framework all user application data is processed encapsulated in an envelope object. This particular function performs the transformation from the used database data into a Booster framework envelope object."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"forEntitySince:"})," This method have to returns all the events associated with an specific entity."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"latestEntitySnapshot:"})," With this method the framework should be able to obtains the latest snapshot for an specific entity."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"search:"})," This method receives a query and it should perform it in the database used by the provider and return the result."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"store:"})," This method is used to store new events in the database."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"searchEntitiesIDs:"})," This method is used for implementing the pagination in searches."]}),"\n"]}),"\n",(0,t.jsx)(n.h3,{id:"read-models",children:"Read Models"}),"\n",(0,t.jsx)(n.p,{children:"This section of the interface provides to the framework the ability to interact with the database to manage read models thanks to the following methods:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-ts",children:"export interface ProviderReadModelsLibrary {\n  rawToEnvelopes(config: BoosterConfig, rawEvents: unknown): Promise<Array<ReadModelEnvelope>>\n  fetch(config: BoosterConfig, readModelName: string, readModelID: UUID, sequenceKey?: SequenceKey): Promise<ReadOnlyNonEmptyArray<ReadModelInterface>>\n  search<TReadModel extends ReadModelInterface>(config: BoosterConfig, entityTypeName: string, filters: FilterFor<unknown>, sortBy?: SortFor<unknown>, limit?: number, afterCursor?: unknown, paginatedVersion?: boolean): Promise<Array<TReadModel> | ReadModelListResult<TReadModel>>\n  store(config: BoosterConfig, readModelName: string, readModel: ReadModelInterface, expectedCurrentVersion?: number): Promise<unknown>\n  delete(config: BoosterConfig, readModelName: string, readModel: ReadModelInterface | undefined): Promise<any>\n  subscribe(config: BoosterConfig, subscriptionEnvelope: SubscriptionEnvelope): Promise<void>\n  fetchSubscriptions(config: BoosterConfig, subscriptionName: string): Promise<Array<SubscriptionEnvelope>>\n  deleteSubscription(config: BoosterConfig, connectionID: string, subscriptionID: string): Promise<void>\n  deleteAllSubscriptions(config: BoosterConfig, connectionID: string): Promise<void>\n"})}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"rawToEnvelopes:"})," This method is used to transform all database data into read models envelopes."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"fetch:"})," Fetch a specific read model from the database."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"search:"})," This method receives a search query and it should return the read model search result."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"store:"})," Save a new read model projection on the database."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"delete:"})," Delete a read model from the database."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"subscribe:"})," This method is used to susbcribe a client to an specific read model."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"fetchSubscriptions:"})," Get the list of all clients subscribed to a specific read model."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"deleteSubscription:"})," Delete a specific read model subscription."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"deleteAllSubscriptions:"})," Delete all subscription for a specific read model."]}),"\n"]}),"\n",(0,t.jsx)(n.h3,{id:"graphql",children:"GraphQL"}),"\n",(0,t.jsx)(n.p,{children:"This section of the API provides all necessary to receive and return GraphQL query from client side and create the return for requests:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-ts",children:"export interface ProviderGraphQLLibrary {\n  rawToEnvelope(config: BoosterConfig, rawGraphQLRequest: unknown): Promise<GraphQLRequestEnvelope | GraphQLRequestEnvelopeError>\n  handleResult(result?: unknown, headers?: Record<string, string>): Promise<unknown>\n}\n"})}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"rawToEnvelope:"})," This method receives the request from the client with the GraphQL query and it should return the envelope object for the GraphQL query"]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"handleResult"})," This method receives the GraphQL results and it should return the response object for the client."]}),"\n"]}),"\n",(0,t.jsx)(n.h3,{id:"api-responses",children:"API responses"}),"\n",(0,t.jsx)(n.p,{children:"General API response management:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-ts",children:"export interface ProviderAPIHandling {\n  requestSucceeded(body?: unknown, headers?: Record<string, number | string | ReadonlyArray<string>>): Promise<unknown>\n  requestFailed(error: Error): Promise<unknown>\n}\n"})}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"requestSucceeded:"})," This is a general method for processing sucess responses."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"requestFailed:"})," This is a general method for processing error responses."]}),"\n"]}),"\n",(0,t.jsx)(n.h3,{id:"connections",children:"Connections"}),"\n",(0,t.jsx)(n.p,{children:"This section of the API is in charge of the connection management for subscription at API gateway level:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-ts",children:"export interface ProviderConnectionsLibrary {\n  storeData(config: BoosterConfig, connectionID: string, data: ConnectionDataEnvelope): Promise<void>\n  fetchData(config: BoosterConfig, connectionID: string): Promise<ConnectionDataEnvelope | undefined>\n  deleteData(config: BoosterConfig, connectionID: string): Promise<void>\n  sendMessage(config: BoosterConfig, connectionID: string, data: unknown): Promise<void>\n}\n"})}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"storeData:"})," This method receives all the information about the incoming connection and it should store the data on a database."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"fetchData:"})," Fetch the specific client connection information from the database."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"deleteData:"})," Delete all the information about a specific client connection."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"sendMessage:"})," Send a message to a specific client. This method get the message and destination as parameters and it should be able to fetch the connection information from the database and send the provided data to the client."]}),"\n"]}),"\n",(0,t.jsx)(n.h3,{id:"scheduled",children:"Scheduled"}),"\n",(0,t.jsx)(n.p,{children:"Finally, this section of the API is related to scheduled commands:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-ts",children:"export interface ScheduledCommandsLibrary {\n  rawToEnvelope(config: BoosterConfig, rawMessage: unknown): Promise<ScheduledCommandEnvelope>\n}\n"})}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"rawToEnvelope:"})," as in other sections, this method is in charge to transform the scheduled command into a framework envelope."]}),"\n"]}),"\n",(0,t.jsx)(n.h2,{id:"tips-for-developing-custom-providers",children:"Tips for developing custom providers"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"As a starting point, check the implementation of other providers to check how evertyhing is implemented."}),"\n",(0,t.jsx)(n.li,{children:"Start the provider implementation by the infrastructure package because you will get all the infrastructure deployed and later the work with the runtime API will be easier."}),"\n",(0,t.jsxs)(n.li,{children:["If you need support during the development remember that you can have access to our ",(0,t.jsx)(n.a,{href:"https://discord.gg/bDY8MKx",children:"Discord"})," where some community members will can help you."]}),"\n"]})]})}function h(e={}){const{wrapper:n}={...(0,s.a)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(l,{...e})}):l(e)}},6658:(e,n,r)=>{r.d(n,{Z:()=>t});const t=r.p+"assets/images/interface-5bfc32ae502ad2b8b916a0b553aa32e0.jpg"},1151:(e,n,r)=>{r.d(n,{Z:()=>a,a:()=>i});var t=r(7294);const s={},o=t.createContext(s);function i(e){const n=t.useContext(o);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:i(e.components),t.createElement(o.Provider,{value:n},e.children)}}}]);