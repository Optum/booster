"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[4255],{3905:(e,t,n)=>{n.d(t,{Zo:()=>c,kt:()=>p});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var l=a.createContext({}),u=function(e){var t=a.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},c=function(e){var t=u(e.components);return a.createElement(l.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},m=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,l=e.parentName,c=s(e,["components","mdxType","originalType","parentName"]),m=u(n),p=r,h=m["".concat(l,".").concat(p)]||m[p]||d[p]||o;return n?a.createElement(h,i(i({ref:t},c),{},{components:n})):a.createElement(h,i({ref:t},c))}));function p(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,i=new Array(o);i[0]=m;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:r,i[1]=s;for(var u=2;u<o;u++)i[u]=n[u];return a.createElement.apply(null,i)}return a.createElement.apply(null,n)}m.displayName="MDXCreateElement"},5162:(e,t,n)=>{n.d(t,{Z:()=>i});var a=n(7294),r=n(6010);const o="tabItem_Ymn6";function i(e){let{children:t,hidden:n,className:i}=e;return a.createElement("div",{role:"tabpanel",className:(0,r.Z)(o,i),hidden:n},t)}},4866:(e,t,n)=>{n.d(t,{Z:()=>w});var a=n(7462),r=n(7294),o=n(6010),i=n(2466),s=n(6550),l=n(1980),u=n(7392),c=n(12);function d(e){return function(e){return r.Children.map(e,(e=>{if((0,r.isValidElement)(e)&&"value"in e.props)return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))}(e).map((e=>{let{props:{value:t,label:n,attributes:a,default:r}}=e;return{value:t,label:n,attributes:a,default:r}}))}function m(e){const{values:t,children:n}=e;return(0,r.useMemo)((()=>{const e=t??d(n);return function(e){const t=(0,u.l)(e,((e,t)=>e.value===t.value));if(t.length>0)throw new Error(`Docusaurus error: Duplicate values "${t.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[t,n])}function p(e){let{value:t,tabValues:n}=e;return n.some((e=>e.value===t))}function h(e){let{queryString:t=!1,groupId:n}=e;const a=(0,s.k6)(),o=function(e){let{queryString:t=!1,groupId:n}=e;if("string"==typeof t)return t;if(!1===t)return null;if(!0===t&&!n)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return n??null}({queryString:t,groupId:n});return[(0,l._X)(o),(0,r.useCallback)((e=>{if(!o)return;const t=new URLSearchParams(a.location.search);t.set(o,e),a.replace({...a.location,search:t.toString()})}),[o,a])]}function f(e){const{defaultValue:t,queryString:n=!1,groupId:a}=e,o=m(e),[i,s]=(0,r.useState)((()=>function(e){let{defaultValue:t,tabValues:n}=e;if(0===n.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(t){if(!p({value:t,tabValues:n}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${t}" but none of its children has the corresponding value. Available values are: ${n.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return t}const a=n.find((e=>e.default))??n[0];if(!a)throw new Error("Unexpected error: 0 tabValues");return a.value}({defaultValue:t,tabValues:o}))),[l,u]=h({queryString:n,groupId:a}),[d,f]=function(e){let{groupId:t}=e;const n=function(e){return e?`docusaurus.tab.${e}`:null}(t),[a,o]=(0,c.Nk)(n);return[a,(0,r.useCallback)((e=>{n&&o.set(e)}),[n,o])]}({groupId:a}),k=(()=>{const e=l??d;return p({value:e,tabValues:o})?e:null})();(0,r.useLayoutEffect)((()=>{k&&s(k)}),[k]);return{selectedValue:i,selectValue:(0,r.useCallback)((e=>{if(!p({value:e,tabValues:o}))throw new Error(`Can't select invalid tab value=${e}`);s(e),u(e),f(e)}),[u,f,o]),tabValues:o}}var k=n(2389);const g="tabList__CuJ",y="tabItem_LNqP";function b(e){let{className:t,block:n,selectedValue:s,selectValue:l,tabValues:u}=e;const c=[],{blockElementScrollPositionUntilNextRender:d}=(0,i.o5)(),m=e=>{const t=e.currentTarget,n=c.indexOf(t),a=u[n].value;a!==s&&(d(t),l(a))},p=e=>{var t;let n=null;switch(e.key){case"Enter":m(e);break;case"ArrowRight":{const t=c.indexOf(e.currentTarget)+1;n=c[t]??c[0];break}case"ArrowLeft":{const t=c.indexOf(e.currentTarget)-1;n=c[t]??c[c.length-1];break}}null==(t=n)||t.focus()};return r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,o.Z)("tabs",{"tabs--block":n},t)},u.map((e=>{let{value:t,label:n,attributes:i}=e;return r.createElement("li",(0,a.Z)({role:"tab",tabIndex:s===t?0:-1,"aria-selected":s===t,key:t,ref:e=>c.push(e),onKeyDown:p,onClick:m},i,{className:(0,o.Z)("tabs__item",y,null==i?void 0:i.className,{"tabs__item--active":s===t})}),n??t)})))}function v(e){let{lazy:t,children:n,selectedValue:a}=e;if(n=Array.isArray(n)?n:[n],t){const e=n.find((e=>e.props.value===a));return e?(0,r.cloneElement)(e,{className:"margin-top--md"}):null}return r.createElement("div",{className:"margin-top--md"},n.map(((e,t)=>(0,r.cloneElement)(e,{key:t,hidden:e.props.value!==a}))))}function N(e){const t=f(e);return r.createElement("div",{className:(0,o.Z)("tabs-container",g)},r.createElement(b,(0,a.Z)({},e,t)),r.createElement(v,(0,a.Z)({},e,t)))}function w(e){const t=(0,k.Z)();return r.createElement(N,(0,a.Z)({key:String(t)},e))}},8143:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>l,default:()=>p,frontMatter:()=>s,metadata:()=>u,toc:()=>d});var a=n(7462),r=(n(7294),n(3905)),o=n(5162),i=n(4866);const s={describe:"Authorization mechanisms to access Booster Commands and Read Models"},l="Authorization",u={unversionedId:"security/authorization",id:"security/authorization",title:"Authorization",description:"Booster uses a whitelisting approach to authorize users to perform commands and read models. This means that you must explicitly specify which users are allowed to perform each action. In order to do that you must configure the authorize policy parameter on every Command or Read Model. This parameter accepts one of the following options:",source:"@site/docs/04_security/02_authorization.mdx",sourceDirName:"04_security",slug:"/security/authorization",permalink:"/security/authorization",draft:!1,editUrl:"https://github.com/boostercloud/booster/tree/main/website/docs/04_security/02_authorization.mdx",tags:[],version:"current",lastUpdatedBy:"Juan Sagasti",lastUpdatedAt:1678879719,formattedLastUpdatedAt:"Mar 15, 2023",sidebarPosition:2,frontMatter:{describe:"Authorization mechanisms to access Booster Commands and Read Models"},sidebar:"docs",previous:{title:"Authentication",permalink:"/security/authentication"},next:{title:"GraphQL API",permalink:"/graphql"}},c={},d=[{value:"Making commands and read models public",id:"making-commands-and-read-models-public",level:2},{value:"Simple Role-based authorization",id:"simple-role-based-authorization",level:2},{value:"Defining @Roles",id:"defining-roles",level:3},{value:"Protecting commands and read models with roles",id:"protecting-commands-and-read-models-with-roles",level:3},{value:"Associating users with roles",id:"associating-users-with-roles",level:3},{value:"Extended roles using the Authentication Booster Rocket for AWS",id:"extended-roles-using-the-authentication-booster-rocket-for-aws",level:3},{value:"Custom authorization functions",id:"custom-authorization-functions",level:2},{value:"Command Authorizers",id:"command-authorizers",level:3},{value:"Read Model Authorizers",id:"read-model-authorizers",level:3},{value:"Event Stream Authorizers",id:"event-stream-authorizers",level:3}],m={toc:d};function p(e){let{components:t,...n}=e;return(0,r.kt)("wrapper",(0,a.Z)({},m,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"authorization"},"Authorization"),(0,r.kt)("p",null,"Booster uses a whitelisting approach to authorize users to perform commands and read models. This means that you must explicitly specify which users are allowed to perform each action. In order to do that you must configure the ",(0,r.kt)("inlineCode",{parentName:"p"},"authorize")," policy parameter on every Command or Read Model. This parameter accepts one of the following options:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"'all'"),": The command or read-model is explicitly public, any user can access it."),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"[Role1, Role2, ...]"),": An array of authorized ",(0,r.kt)("a",{parentName:"li",href:"#defining-roles"},"Roles"),", this means that only those authenticated users that have any of the roles listed there are authorized to execute the command."),(0,r.kt)("li",{parentName:"ul"},"An authorizer function that matches the ",(0,r.kt)("inlineCode",{parentName:"li"},"CommandAuthorizer")," interface for commands or the ",(0,r.kt)("inlineCode",{parentName:"li"},"ReadModelAuthorizer")," interface for read models.")),(0,r.kt)("h2",{id:"making-commands-and-read-models-public"},"Making commands and read models public"),(0,r.kt)("p",null,"Setting the option ",(0,r.kt)("inlineCode",{parentName:"p"},"authorize: 'all'")," in a command or read model will make it publicly accessible to anyone that has access to the GraphQL endpoint. For example, the following command can be executed by anyone, even if they don't provide a valid JWT token:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-typescript",metastring:'title="src/commands/create-comment.ts"',title:'"src/commands/create-comment.ts"'},"@Command({\n  authorize: 'all',\n})\nexport class CreateComment {\n  ...\n}\n")),(0,r.kt)("admonition",{type:"danger"},(0,r.kt)("p",{parentName:"admonition"},(0,r.kt)("strong",{parentName:"p"},"Think twice if you really need fully open GraphQL endpoints in your application"),", this might be useful during development, but we recommend to ",(0,r.kt)("strong",{parentName:"p"},"avoid exposing your endpoints in this way in production"),". Even for public APIs, it might be useful to issue API keys to avoid abuse. Booster is designed to scale to any given demand, but scaling also increases the cloud bill! (See ",(0,r.kt)("a",{parentName:"p",href:"https://www.sciencedirect.com/science/article/pii/S221421262100079X"},"Denial of wallet attacks"),")")),(0,r.kt)("h2",{id:"simple-role-based-authorization"},"Simple Role-based authorization"),(0,r.kt)("p",null,"Booster provides a simple role-based authentication mechanism that will work in many standard scenarios. It is based on the concept of roles, which are just a set of permissions. For example, a ",(0,r.kt)("inlineCode",{parentName:"p"},"User")," role might have the permission to ",(0,r.kt)("inlineCode",{parentName:"p"},"create")," and ",(0,r.kt)("inlineCode",{parentName:"p"},"read")," comments, while an ",(0,r.kt)("inlineCode",{parentName:"p"},"Admin")," role might have the permission to ",(0,r.kt)("inlineCode",{parentName:"p"},"create"),", ",(0,r.kt)("inlineCode",{parentName:"p"},"read"),", and ",(0,r.kt)("inlineCode",{parentName:"p"},"delete")," comments. You can define as many roles as you want, and then assign them to users."),(0,r.kt)("h3",{id:"defining-roles"},"Defining @Roles"),(0,r.kt)("p",null,"As many other Booster artifacts, Booster Roles are defined as simple decorated classes. We recommend them to be defined in the ",(0,r.kt)("inlineCode",{parentName:"p"},"src/config/roles.ts")," file, but it is not limited to that file. To define a role, you only need to decorate an empty class with the ",(0,r.kt)("inlineCode",{parentName:"p"},"@Role")," decorator as follows:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-typescript",metastring:'title="src/config/roles.ts"',title:'"src/config/roles.ts"'},"@Role()\nexport class User {}\n\n@Role()\nexport class Admin {}\n")),(0,r.kt)("h3",{id:"protecting-commands-and-read-models-with-roles"},"Protecting commands and read models with roles"),(0,r.kt)("p",null,"Once you have defined your roles, you can use them to protect your commands and read models. For example, the following command can only be executed by users that have the role ",(0,r.kt)("inlineCode",{parentName:"p"},"Admin"),":"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-typescript",metastring:'title="src/commands/create-comment.ts"',title:'"src/commands/create-comment.ts"'},"@Command({\n  authorize: [Admin],\n})\nexport class CreateComment {\n  ...\n}\n")),(0,r.kt)("p",null,"This command will not be available to users with the role ",(0,r.kt)("inlineCode",{parentName:"p"},"User"),"."),(0,r.kt)("h3",{id:"associating-users-with-roles"},"Associating users with roles"),(0,r.kt)("p",null,"Booster will read the roles from the JWT token that you provide in the request. The token must include a claim with the key you specidied in the ",(0,r.kt)("inlineCode",{parentName:"p"},"rolesClaim")," field. Booster will read such field and compare it with the declared ones in the ",(0,r.kt)("inlineCode",{parentName:"p"},"authorize")," field of the protected command or read model."),(0,r.kt)("p",null,"For example, given the following setup:"),(0,r.kt)(i.Z,{groupId:"auth-roles-example",mdxType:"Tabs"},(0,r.kt)(o.Z,{value:"booster-config",label:"Booster Config",default:!0,mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-typescript",metastring:'title="src/config/config.ts"',title:'"src/config/config.ts"'},"Booster.configure('production', (config: BoosterConfig): void => {\n  config.appName = 'my-store'\n  config.providerPackage = '@boostercloud/framework-provider-x'\n  config.tokenVerifiers = [\n    new JwksUriTokenVerifier(\n      'https://my-auth0-tenant.auth0.com/', // Issuer\n      'https://my-auth0-tenant.auth0.com/.well-known/jwks.json', // JWKS URL\n      // highlight-next-line\n      'firebase:groups' // <- roles are read from 'firebase:groups' claim from the token\n    ),\n  ]\n})\n"))),(0,r.kt)(o.Z,{value:"decoded-token",label:"Decoded Token",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-json"},'{\n  // highlight-next-line\n  "firebase:groups": "User", // <- roles are read from \'firebase:groups\' claim\n  "iss": "https://securetoken.google.com/demoapp",\n  "aud": "demoapp",\n  "auth_time": 1604676721,\n  "user_id": "xJY5Y6fTbVggNtDjaNh7cNSBd7q1",\n  "sub": "xJY5Y6fTbVggNtDjaNh7cNSBd7q1",\n  "iat": 1604676721,\n  "exp": 1604680321,\n  "phone_number": "+999999999",\n  "firebase": {}\n}\n'))),(0,r.kt)(o.Z,{value:"booster-command",label:"Booster Command",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-typescript",metastring:'title="src/commands/create-comment.ts"',title:'"src/commands/create-comment.ts"'},"@Command({\n  authorize: [Admin],\n})\nexport class CreateComment {\n  ...\n}\n"))),(0,r.kt)(o.Z,{value:"booster-roles",label:"Booster Roles",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-typescript",metastring:'title="src/config/roles.ts"',title:'"src/config/roles.ts"'},"@Role()\nexport class User {}\n\n@Role()\nexport class Admin {}\n")))),(0,r.kt)("p",null,"Booster will check that the token contains the ",(0,r.kt)("inlineCode",{parentName:"p"},"firebase:groups")," claim and that it contains the ",(0,r.kt)("inlineCode",{parentName:"p"},"Admin")," role.\nAlso, if the token doesn't contain the ",(0,r.kt)("inlineCode",{parentName:"p"},"Admin")," role, the command will not be executed. As you can see, the decoded token\nhas ",(0,r.kt)("inlineCode",{parentName:"p"},"User")," as value of the ",(0,r.kt)("inlineCode",{parentName:"p"},"firebase:groups")," claim, so the command will not be executed."),(0,r.kt)("h3",{id:"extended-roles-using-the-authentication-booster-rocket-for-aws"},"Extended roles using the ",(0,r.kt)("a",{parentName:"h3",href:"https://github.com/boostercloud/rocket-auth-aws-infrastructure"},"Authentication Booster Rocket for AWS")),(0,r.kt)("p",null,"The Authentication Rocket for AWS is an opinionated implementation of a JWT tokens issuer on top of AWS Cognito that includes out-of-the-box features like\nsign-up, sign-in, passwordless tokens, change password and many other features. When a user goes through the sign up and sign in mecanisms provided by the rocket,\nthey'll get a standard JWT access token that can be included in any request as a Bearer token and will work in the same way as any other JWT token."),(0,r.kt)("p",null,"When you use this rocket, you can use extra configuration parameters in the ",(0,r.kt)("inlineCode",{parentName:"p"},"@Role")," decorator to enable some of these features. In the following example we define ",(0,r.kt)("inlineCode",{parentName:"p"},"Admin"),", ",(0,r.kt)("inlineCode",{parentName:"p"},"User"),", ",(0,r.kt)("inlineCode",{parentName:"p"},"SuperUser")," and ",(0,r.kt)("inlineCode",{parentName:"p"},"SuperUserWithoutConfirmation")," roles. They all contain an extra ",(0,r.kt)("inlineCode",{parentName:"p"},"auth")," configuration attribute that set the behavior of the authorization role for each role:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-typescript"},"@Role({\n  auth: {\n    signUpMethods: [], // Using an empty array here prevents sign-ups (Admin has no special treatment. If you don't enable signup, you'll need to create the first admin manually in the AWS console)\n  },\n})\nexport class Admin {}\n\n@Role({\n  auth: {\n    signUpMethods: ['email'], // Enable email sign-ups for Users\n  },\n})\nexport class User {}\n\n@Role({\n  auth: {\n    signUpMethods: ['email', 'phone'], // Can sign up by email or phone\n    skipConfirmation: false, // It requires email or phone confirmation. The rocket will send either an email or a SMS with a confirmation link.\n  },\n})\nexport class SuperUser {}\n\n@Role({\n  auth: {\n    signUpMethods: ['email', 'phone'],\n    skipConfirmation: true, // It doesn't require email or phone confirmation\n  },\n})\nexport class SuperUserWithoutConfirmation {}\n")),(0,r.kt)("p",null,"To learn more about the Authorization rocket for AWS, please read the ",(0,r.kt)("a",{parentName:"p",href:"https://github.com/boostercloud/rocket-auth-aws-infrastructure/blob/main/README.md"},"README")," in its Github repository."),(0,r.kt)("h2",{id:"custom-authorization-functions"},"Custom authorization functions"),(0,r.kt)("p",null,"Booster also allows you to implement your own authorization functions, in case the role-based authorization model doesn't work for your application. In order to\napply your own authorization functions, you need to provide them in the ",(0,r.kt)("inlineCode",{parentName:"p"},"authorize")," field of the command or read model. As authorization functions are regular\nJavaScript functions, you can easily reuse them in your project or even in other Booster projects as a library."),(0,r.kt)("h3",{id:"command-authorizers"},"Command Authorizers"),(0,r.kt)("p",null,"As mentioned, the ",(0,r.kt)("inlineCode",{parentName:"p"},"authorize")," parameter of the ",(0,r.kt)("inlineCode",{parentName:"p"},"@Command")," can receive a function. However, this function must match the ",(0,r.kt)("inlineCode",{parentName:"p"},"CommandAuthorizer")," type. This function will receive two parameters and return a ",(0,r.kt)("inlineCode",{parentName:"p"},"Promise")," that will resolve if the user is authorized to execute the command or reject if not:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-typescript"},"export type CommandAuthorizer = (currentUser?: UserEnvelope, input?: CommandInput) => Promise<void>\n")),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"Parameter"),(0,r.kt)("th",{parentName:"tr",align:null},"Type"),(0,r.kt)("th",{parentName:"tr",align:null},"Description"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"currentUser"),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"UserEnvelope")),(0,r.kt)("td",{parentName:"tr",align:null},"User data decoded from the provided token")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"input"),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"CommandInput")),(0,r.kt)("td",{parentName:"tr",align:null},"The input of the command")))),(0,r.kt)("p",null,"For instance, if you want to restrict a command to users that have a permission named ",(0,r.kt)("inlineCode",{parentName:"p"},"Permission-To-Rock")," in the ",(0,r.kt)("inlineCode",{parentName:"p"},"permissions")," claim you can do this:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-typescript"},"\nconst CustomCommandAuthorizer: CommandAuthorizer = async (currentUser) => {\n    if (!currentUser.claims['permissions'].includes('Permission-To-Rock')) {\n      throw new Error(`User ${currentUser.username} should not be rocking!`) // <- This will reject the access to the command\n    }\n  }\n\n@Command({\n  authorize: CustomCommandAuthorizer,\n})\nexport class PerformIncredibleGuitarSolo {\n  ...\n}\n")),(0,r.kt)("h3",{id:"read-model-authorizers"},"Read Model Authorizers"),(0,r.kt)("p",null,"As with commands, the ",(0,r.kt)("inlineCode",{parentName:"p"},"authorize")," parameter of the ",(0,r.kt)("inlineCode",{parentName:"p"},"@ReadModel")," decorator can also receive a function. However, this function must match the ",(0,r.kt)("inlineCode",{parentName:"p"},"ReadModelAuthorizer")," type. This function will receive two parameters and return a ",(0,r.kt)("inlineCode",{parentName:"p"},"Promise")," that will resolve if the user is authorized to execute the command or reject if not:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-typescript"},"export type ReadModelAuthorizer<TReadModel extends ReadModelInterface> = (\n  currentUser?: UserEnvelope,\n  readModelRequestEnvelope?: ReadModelRequestEnvelope<TReadModel>\n) => Promise<void>\n")),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"Parameter"),(0,r.kt)("th",{parentName:"tr",align:null},"Type"),(0,r.kt)("th",{parentName:"tr",align:null},"Description"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"currentUser"),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"UserEnvelope")),(0,r.kt)("td",{parentName:"tr",align:null},"User data decoded from the provided token")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"input"),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"CommandInput")),(0,r.kt)("td",{parentName:"tr",align:null},"The input of the command")))),(0,r.kt)("p",null,"For instance, you may want to restrict access to a specific resource only to people that has been granted read permission:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-typescript"},"const CustomReadModelAuthorizer: ReadModelAuthorizer = async (currentUser, readModelRequestEnvelope) => {\n    const userPermissions = Booster.entity(UserPermissions, currentUser.username)\n    if (!userPermissions || !userPermissions.accessTo[readModelRequestEnvelope.className].includes(readModelRequestEnvelope.key.id)) {\n      throw new Error(`User ${currentUser.username} should not be looking here`)\n    }\n  }\n\n@ReadModel({\n  authorize: CustomReadModelAuthorizer\n})\n")),(0,r.kt)("h3",{id:"event-stream-authorizers"},"Event Stream Authorizers"),(0,r.kt)("p",null,"You can restrict the access to the ",(0,r.kt)("a",{parentName:"p",href:"/features/event-stream"},"Event Stream")," of an ",(0,r.kt)("inlineCode",{parentName:"p"},"Entity")," by providing an ",(0,r.kt)("inlineCode",{parentName:"p"},"authorizeReadEvents")," function in the ",(0,r.kt)("inlineCode",{parentName:"p"},"@Entity")," decorator. This function is called every time an event stream is requested. The function must match the ",(0,r.kt)("inlineCode",{parentName:"p"},"EventStreamAuthorizer")," type receives the current user and the event search request as parameters. The function must return a ",(0,r.kt)("inlineCode",{parentName:"p"},"Promise<void>"),". If the promise is rejected, the request will be denied. If the promise is resolved successfully, the request will be allowed."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-typescript"},"export type EventStreamAuthorizer = (\n  currentUser?: UserEnvelope,\n  eventSearchRequest?: EventSearchRequest\n) => Promise<void>\n")),(0,r.kt)("p",null,"For instance, you can restrict access to entities that the current user own."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-typescript"},"const CustomEventAuthorizer: EventStreamAuthorizer = async (currentUser, eventSearchRequest) => {\n  const { entityID } = eventSearchRequest.parameters\n  if (!entityID) {\n    throw new Error(`${currentUser.username} cannot list carts`)\n  }\n  const cart = Booster.entity(Cart, entityID)\n  if (cart.ownerUserName !== currentUser.userName) {\n    throw new Error(`${currentUser.username} cannot see events in cart ${entityID}`)\n  }\n}\n\n\n@Entity({\n  authorizeReadEvents: CustomEventAuthorizer\n})\nexport class Cart {\n  public constructor(\n    readonly id: UUID,\n    readonly ownerUserName: string,\n    readonly cartItems: Array<CartItem>,\n    public shippingAddress?: Address,\n    public checks = 0\n  ) {}\n  ...\n}\n")))}p.isMDXComponent=!0}}]);