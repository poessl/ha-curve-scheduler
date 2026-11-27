/* curve-scheduler-card – built from frontend/src, do not edit */
var ke=globalThis,Ee=ke.ShadowRoot&&(ke.ShadyCSS===void 0||ke.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Ke=Symbol(),ht=new WeakMap,ae=class{constructor(s,e,t){if(this._$cssResult$=!0,t!==Ke)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=s,this.t=e}get styleSheet(){let s=this.o,e=this.t;if(Ee&&s===void 0){let t=e!==void 0&&e.length===1;t&&(s=ht.get(e)),s===void 0&&((this.o=s=new CSSStyleSheet).replaceSync(this.cssText),t&&ht.set(e,s))}return s}toString(){return this.cssText}},ut=o=>new ae(typeof o=="string"?o:o+"",void 0,Ke),E=(o,...s)=>{let e=o.length===1?o[0]:s.reduce((t,i,n)=>t+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+o[n+1],o[0]);return new ae(e,o,Ke)},pt=(o,s)=>{if(Ee)o.adoptedStyleSheets=s.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of s){let t=document.createElement("style"),i=ke.litNonce;i!==void 0&&t.setAttribute("nonce",i),t.textContent=e.cssText,o.appendChild(t)}},je=Ee?o=>o:o=>o instanceof CSSStyleSheet?(s=>{let e="";for(let t of s.cssRules)e+=t.cssText;return ut(e)})(o):o;var{is:ii,defineProperty:si,getOwnPropertyDescriptor:ni,getOwnPropertyNames:ri,getOwnPropertySymbols:oi,getPrototypeOf:ai}=Object,Ae=globalThis,ft=Ae.trustedTypes,li=ft?ft.emptyScript:"",ci=Ae.reactiveElementPolyfillSupport,le=(o,s)=>o,Ge={toAttribute(o,s){switch(s){case Boolean:o=o?li:null;break;case Object:case Array:o=o==null?o:JSON.stringify(o)}return o},fromAttribute(o,s){let e=o;switch(s){case Boolean:e=o!==null;break;case Number:e=o===null?null:Number(o);break;case Object:case Array:try{e=JSON.parse(o)}catch{e=null}}return e}},gt=(o,s)=>!ii(o,s),mt={attribute:!0,type:String,converter:Ge,reflect:!1,useDefault:!1,hasChanged:gt};Symbol.metadata??=Symbol("metadata"),Ae.litPropertyMetadata??=new WeakMap;var L=class extends HTMLElement{static addInitializer(s){this._$Ei(),(this.l??=[]).push(s)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(s,e=mt){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(s)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(s,e),!e.noAccessor){let t=Symbol(),i=this.getPropertyDescriptor(s,t,e);i!==void 0&&si(this.prototype,s,i)}}static getPropertyDescriptor(s,e,t){let{get:i,set:n}=ni(this.prototype,s)??{get(){return this[e]},set(r){this[e]=r}};return{get:i,set(r){let l=i?.call(this);n?.call(this,r),this.requestUpdate(s,l,t)},configurable:!0,enumerable:!0}}static getPropertyOptions(s){return this.elementProperties.get(s)??mt}static _$Ei(){if(this.hasOwnProperty(le("elementProperties")))return;let s=ai(this);s.finalize(),s.l!==void 0&&(this.l=[...s.l]),this.elementProperties=new Map(s.elementProperties)}static finalize(){if(this.hasOwnProperty(le("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(le("properties"))){let e=this.properties,t=[...ri(e),...oi(e)];for(let i of t)this.createProperty(i,e[i])}let s=this[Symbol.metadata];if(s!==null){let e=litPropertyMetadata.get(s);if(e!==void 0)for(let[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let i=this._$Eu(e,t);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(s){let e=[];if(Array.isArray(s)){let t=new Set(s.flat(1/0).reverse());for(let i of t)e.unshift(je(i))}else s!==void 0&&e.push(je(s));return e}static _$Eu(s,e){let t=e.attribute;return t===!1?void 0:typeof t=="string"?t:typeof s=="string"?s.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(s=>this.enableUpdating=s),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(s=>s(this))}addController(s){(this._$EO??=new Set).add(s),this.renderRoot!==void 0&&this.isConnected&&s.hostConnected?.()}removeController(s){this._$EO?.delete(s)}_$E_(){let s=new Map,e=this.constructor.elementProperties;for(let t of e.keys())this.hasOwnProperty(t)&&(s.set(t,this[t]),delete this[t]);s.size>0&&(this._$Ep=s)}createRenderRoot(){let s=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return pt(s,this.constructor.elementStyles),s}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(s=>s.hostConnected?.())}enableUpdating(s){}disconnectedCallback(){this._$EO?.forEach(s=>s.hostDisconnected?.())}attributeChangedCallback(s,e,t){this._$AK(s,t)}_$ET(s,e){let t=this.constructor.elementProperties.get(s),i=this.constructor._$Eu(s,t);if(i!==void 0&&t.reflect===!0){let n=(t.converter?.toAttribute!==void 0?t.converter:Ge).toAttribute(e,t.type);this._$Em=s,n==null?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(s,e){let t=this.constructor,i=t._$Eh.get(s);if(i!==void 0&&this._$Em!==i){let n=t.getPropertyOptions(i),r=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:Ge;this._$Em=i;let l=r.fromAttribute(e,n.type);this[i]=l??this._$Ej?.get(i)??l,this._$Em=null}}requestUpdate(s,e,t,i=!1,n){if(s!==void 0){let r=this.constructor;if(i===!1&&(n=this[s]),t??=r.getPropertyOptions(s),!((t.hasChanged??gt)(n,e)||t.useDefault&&t.reflect&&n===this._$Ej?.get(s)&&!this.hasAttribute(r._$Eu(s,t))))return;this.C(s,e,t)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(s,e,{useDefault:t,reflect:i,wrapped:n},r){t&&!(this._$Ej??=new Map).has(s)&&(this._$Ej.set(s,r??e??this[s]),n!==!0||r!==void 0)||(this._$AL.has(s)||(this.hasUpdated||t||(e=void 0),this._$AL.set(s,e)),i===!0&&this._$Em!==s&&(this._$Eq??=new Set).add(s))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let s=this.scheduleUpdate();return s!=null&&await s,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,n]of this._$Ep)this[i]=n;this._$Ep=void 0}let t=this.constructor.elementProperties;if(t.size>0)for(let[i,n]of t){let{wrapped:r}=n,l=this[i];r!==!0||this._$AL.has(i)||l===void 0||this.C(i,void 0,n,l)}}let s=!1,e=this._$AL;try{s=this.shouldUpdate(e),s?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(t){throw s=!1,this._$EM(),t}s&&this._$AE(e)}willUpdate(s){}_$AE(s){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(s)),this.updated(s)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(s){return!0}update(s){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(s){}firstUpdated(s){}};L.elementStyles=[],L.shadowRootOptions={mode:"open"},L[le("elementProperties")]=new Map,L[le("finalized")]=new Map,ci?.({ReactiveElement:L}),(Ae.reactiveElementVersions??=[]).push("2.1.2");var Ze=globalThis,vt=o=>o,Pe=Ze.trustedTypes,bt=Pe?Pe.createPolicy("lit-html",{createHTML:o=>o}):void 0,Ye="$lit$",O=`lit$${Math.random().toFixed(9).slice(2)}$`,Xe="?"+O,di=`<${Xe}>`,j=document,de=()=>j.createComment(""),he=o=>o===null||typeof o!="object"&&typeof o!="function",Je=Array.isArray,kt=o=>Je(o)||typeof o?.[Symbol.iterator]=="function",qe=`[ 	
\f\r]`,ce=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_t=/-->/g,yt=/>/g,B=RegExp(`>|${qe}(?:([^\\s"'>=/]+)(${qe}*=${qe}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),$t=/'/g,xt=/"/g,Et=/^(?:script|style|textarea|title)$/i,Qe=o=>(s,...e)=>({_$litType$:o,strings:s,values:e}),h=Qe(1),A=Qe(2),Ui=Qe(3),z=Symbol.for("lit-noChange"),p=Symbol.for("lit-nothing"),wt=new WeakMap,K=j.createTreeWalker(j,129);function At(o,s){if(!Je(o)||!o.hasOwnProperty("raw"))throw Error("invalid template strings array");return bt!==void 0?bt.createHTML(s):s}var Pt=(o,s)=>{let e=o.length-1,t=[],i,n=s===2?"<svg>":s===3?"<math>":"",r=ce;for(let l=0;l<e;l++){let a=o[l],d,u,c=-1,f=0;for(;f<a.length&&(r.lastIndex=f,u=r.exec(a),u!==null);)f=r.lastIndex,r===ce?u[1]==="!--"?r=_t:u[1]!==void 0?r=yt:u[2]!==void 0?(Et.test(u[2])&&(i=RegExp("</"+u[2],"g")),r=B):u[3]!==void 0&&(r=B):r===B?u[0]===">"?(r=i??ce,c=-1):u[1]===void 0?c=-2:(c=r.lastIndex-u[2].length,d=u[1],r=u[3]===void 0?B:u[3]==='"'?xt:$t):r===xt||r===$t?r=B:r===_t||r===yt?r=ce:(r=B,i=void 0);let m=r===B&&o[l+1].startsWith("/>")?" ":"";n+=r===ce?a+di:c>=0?(t.push(d),a.slice(0,c)+Ye+a.slice(c)+O+m):a+O+(c===-2?l:m)}return[At(o,n+(o[e]||"<?>")+(s===2?"</svg>":s===3?"</math>":"")),t]},ue=class o{constructor({strings:s,_$litType$:e},t){let i;this.parts=[];let n=0,r=0,l=s.length-1,a=this.parts,[d,u]=Pt(s,e);if(this.el=o.createElement(d,t),K.currentNode=this.el.content,e===2||e===3){let c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(i=K.nextNode())!==null&&a.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(let c of i.getAttributeNames())if(c.endsWith(Ye)){let f=u[r++],m=i.getAttribute(c).split(O),g=/([.?@])?(.*)/.exec(f);a.push({type:1,index:n,name:g[2],strings:m,ctor:g[1]==="."?Te:g[1]==="?"?Ce:g[1]==="@"?Me:q}),i.removeAttribute(c)}else c.startsWith(O)&&(a.push({type:6,index:n}),i.removeAttribute(c));if(Et.test(i.tagName)){let c=i.textContent.split(O),f=c.length-1;if(f>0){i.textContent=Pe?Pe.emptyScript:"";for(let m=0;m<f;m++)i.append(c[m],de()),K.nextNode(),a.push({type:2,index:++n});i.append(c[f],de())}}}else if(i.nodeType===8)if(i.data===Xe)a.push({type:2,index:n});else{let c=-1;for(;(c=i.data.indexOf(O,c+1))!==-1;)a.push({type:7,index:n}),c+=O.length-1}n++}}static createElement(s,e){let t=j.createElement("template");return t.innerHTML=s,t}};function G(o,s,e=o,t){if(s===z)return s;let i=t!==void 0?e._$Co?.[t]:e._$Cl,n=he(s)?void 0:s._$litDirective$;return i?.constructor!==n&&(i?._$AO?.(!1),n===void 0?i=void 0:(i=new n(o),i._$AT(o,e,t)),t!==void 0?(e._$Co??=[])[t]=i:e._$Cl=i),i!==void 0&&(s=G(o,i._$AS(o,s.values),i,t)),s}var Se=class{constructor(s,e){this._$AV=[],this._$AN=void 0,this._$AD=s,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(s){let{el:{content:e},parts:t}=this._$AD,i=(s?.creationScope??j).importNode(e,!0);K.currentNode=i;let n=K.nextNode(),r=0,l=0,a=t[0];for(;a!==void 0;){if(r===a.index){let d;a.type===2?d=new ee(n,n.nextSibling,this,s):a.type===1?d=new a.ctor(n,a.name,a.strings,this,s):a.type===6&&(d=new Ie(n,this,s)),this._$AV.push(d),a=t[++l]}r!==a?.index&&(n=K.nextNode(),r++)}return K.currentNode=j,i}p(s){let e=0;for(let t of this._$AV)t!==void 0&&(t.strings!==void 0?(t._$AI(s,t,e),e+=t.strings.length-2):t._$AI(s[e])),e++}},ee=class o{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(s,e,t,i){this.type=2,this._$AH=p,this._$AN=void 0,this._$AA=s,this._$AB=e,this._$AM=t,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let s=this._$AA.parentNode,e=this._$AM;return e!==void 0&&s?.nodeType===11&&(s=e.parentNode),s}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(s,e=this){s=G(this,s,e),he(s)?s===p||s==null||s===""?(this._$AH!==p&&this._$AR(),this._$AH=p):s!==this._$AH&&s!==z&&this._(s):s._$litType$!==void 0?this.$(s):s.nodeType!==void 0?this.T(s):kt(s)?this.k(s):this._(s)}O(s){return this._$AA.parentNode.insertBefore(s,this._$AB)}T(s){this._$AH!==s&&(this._$AR(),this._$AH=this.O(s))}_(s){this._$AH!==p&&he(this._$AH)?this._$AA.nextSibling.data=s:this.T(j.createTextNode(s)),this._$AH=s}$(s){let{values:e,_$litType$:t}=s,i=typeof t=="number"?this._$AC(s):(t.el===void 0&&(t.el=ue.createElement(At(t.h,t.h[0]),this.options)),t);if(this._$AH?._$AD===i)this._$AH.p(e);else{let n=new Se(i,this),r=n.u(this.options);n.p(e),this.T(r),this._$AH=n}}_$AC(s){let e=wt.get(s.strings);return e===void 0&&wt.set(s.strings,e=new ue(s)),e}k(s){Je(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,t,i=0;for(let n of s)i===e.length?e.push(t=new o(this.O(de()),this.O(de()),this,this.options)):t=e[i],t._$AI(n),i++;i<e.length&&(this._$AR(t&&t._$AB.nextSibling,i),e.length=i)}_$AR(s=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);s!==this._$AB;){let t=vt(s).nextSibling;vt(s).remove(),s=t}}setConnected(s){this._$AM===void 0&&(this._$Cv=s,this._$AP?.(s))}},q=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(s,e,t,i,n){this.type=1,this._$AH=p,this._$AN=void 0,this.element=s,this.name=e,this._$AM=i,this.options=n,t.length>2||t[0]!==""||t[1]!==""?(this._$AH=Array(t.length-1).fill(new String),this.strings=t):this._$AH=p}_$AI(s,e=this,t,i){let n=this.strings,r=!1;if(n===void 0)s=G(this,s,e,0),r=!he(s)||s!==this._$AH&&s!==z,r&&(this._$AH=s);else{let l=s,a,d;for(s=n[0],a=0;a<n.length-1;a++)d=G(this,l[t+a],e,a),d===z&&(d=this._$AH[a]),r||=!he(d)||d!==this._$AH[a],d===p?s=p:s!==p&&(s+=(d??"")+n[a+1]),this._$AH[a]=d}r&&!i&&this.j(s)}j(s){s===p?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,s??"")}},Te=class extends q{constructor(){super(...arguments),this.type=3}j(s){this.element[this.name]=s===p?void 0:s}},Ce=class extends q{constructor(){super(...arguments),this.type=4}j(s){this.element.toggleAttribute(this.name,!!s&&s!==p)}},Me=class extends q{constructor(s,e,t,i,n){super(s,e,t,i,n),this.type=5}_$AI(s,e=this){if((s=G(this,s,e,0)??p)===z)return;let t=this._$AH,i=s===p&&t!==p||s.capture!==t.capture||s.once!==t.once||s.passive!==t.passive,n=s!==p&&(t===p||i);i&&this.element.removeEventListener(this.name,this,t),n&&this.element.addEventListener(this.name,this,s),this._$AH=s}handleEvent(s){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,s):this._$AH.handleEvent(s)}},Ie=class{constructor(s,e,t){this.element=s,this.type=6,this._$AN=void 0,this._$AM=e,this.options=t}get _$AU(){return this._$AM._$AU}_$AI(s){G(this,s)}},St={M:Ye,P:O,A:Xe,C:1,L:Pt,R:Se,D:kt,V:G,I:ee,H:q,N:Ce,U:Me,B:Te,F:Ie},hi=Ze.litHtmlPolyfillSupport;hi?.(ue,ee),(Ze.litHtmlVersions??=[]).push("3.3.3");var Tt=(o,s,e)=>{let t=e?.renderBefore??s,i=t._$litPart$;if(i===void 0){let n=e?.renderBefore??null;t._$litPart$=i=new ee(s.insertBefore(de(),n),n,void 0,e??{})}return i._$AI(o),i};var et=globalThis,x=class extends L{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let s=super.createRenderRoot();return this.renderOptions.renderBefore??=s.firstChild,s}update(s){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(s),this._$Do=Tt(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return z}};x._$litElement$=!0,x.finalized=!0,et.litElementHydrateSupport?.({LitElement:x});var ui=et.litElementPolyfillSupport;ui?.({LitElement:x});(et.litElementVersions??=[]).push("4.2.2");var te=o=>o.callWS({type:"curve_scheduler/list"}),Ct=(o,s,e)=>o.callWS({type:"curve_scheduler/clone",entry_id:s,name:e});var De=(o,s,e,t)=>o.callWS({type:"curve_scheduler/save",entry_id:s,revision:e,schedule:t}),Mt=(o,s,e)=>o.connection.subscribeMessage(e,{type:"curve_scheduler/subscribe",entry_id:s}),It=(o,s,e,t,i)=>o.callWS({type:"curve_scheduler/holidays",entry_id:s,start:e,end:t,...i?{source:i}:{}}),Dt=(o,s,e)=>e===null?o.callService("curve_scheduler","clear_override",{config_entry_id:s}):o.callService("curve_scheduler","set_override",{config_entry_id:s,profile:e}),Nt=(o,s,e,t,i,n)=>o.callService("curve_scheduler","add_exception",{config_entry_id:s,from:e,to:t,profile:i,note:n});function pi(o){if(!Number.isFinite(o)||o<=0)return 1;let s=o.toFixed(6).replace(/0+$/,"").replace(/\.$/,""),e=s.indexOf(".");return e<0?0:s.length-e-1}function F(o,s,e){let t=pi(s);return new Intl.NumberFormat(e,{minimumFractionDigits:0,maximumFractionDigits:t}).format(o)}function V(o,s,e,t){let i=F(o,s,t);return e?`${i}\xA0${e}`:i}function tt(o){let s=o.trim().replace(/\s/g,"").replace(",",".");return s===""||!/^-?\d*(\.\d*)?$/.test(s)?Number.NaN:Number(s)}function it(o,s,e=5){let t=s-o;if(t<=0)return[o];let i=t/e,n=10**Math.floor(Math.log10(i)),r=[1,2,2.5,5,10].map(d=>d*n),l=r.find(d=>d>=i)??r[r.length-1],a=[];for(let d=Math.ceil(o/l)*l;d<=s+1e-9;d+=l)a.push(Math.round(d*1e6)/1e6);return a}function Ne(o,s,e=0){if(!Number.isFinite(o)||!Number.isFinite(s)||s<=o)return[];if(!(e>0)||!Number.isFinite(e))return it(o,s);let t=Math.min(101,Math.floor((s-o)/e+1e-9)+1);return Array.from({length:t},(i,n)=>Number((o+n*e).toPrecision(12)))}var Le={"panel.instance":"Curve","panel.refresh":"Refresh list","panel.add":"Add curve","panel.clone":"Clone curve","panel.copy_suffix":"copy","panel.clone_name":"Clone name","panel.clone_hint":"Copies saved configuration, plans, activations and exceptions. The target is retained; the clone starts disabled with no manual override.","panel.clone_cancel":"Cancel","panel.cloning":"Cloning\u2026","panel.clone_failed":"Could not clone curve: {message}","panel.settings":"Curve settings","panel.empty":"No curves are loaded. Add a Curve Scheduler instance to get started.","panel.not_found":"This curve is not loaded. Choose another curve or refresh the list.","card.name":"Curve Schedule","card.description":"Shows the active plan and lets everyone edit the curves.","card.loading":"Loading\u2026","card.no_instance":"No time profile has been set up yet.","card.not_found":"This time profile no longer exists. Please choose another one in the card settings.","card.connection_error":"Connection problem: {message}","today.title":"Active plan: {profile}","today.now":"now {value}","today.next":"from {time} \u2192 {value}","today.disabled":"Paused \u2013 nothing is sent to the device.","today.unavailable":"The device is not reachable right now.","today.reason.weekday":"weekly plan","today.reason.holiday":"holiday","today.reason.condition":"activation condition","today.reason.fallback":"No activation matched \u2014 using the configured fallback plan","today.reason.exception":"exception","today.reason.override":"chosen by hand","today.mode":"Mode","today.mode.auto":"Automatic","today.until":"until {time}","today.add_holiday":"Add exception","today.edit":"Edit","today.close_editor":"Close editor","holiday.title":"Add exception","holiday.from":"From","holiday.to":"To","holiday.profile":"Plan during this time","holiday.note":"Note","holiday.note_default":"Exception","holiday.save":"Add","holiday.cancel":"Cancel","holiday.added":"Exception added.","editor.tab.profiles":"Plans","editor.tab.week":"Activations","editor.tab.exceptions":"Exceptions","editor.save":"Save","editor.discard":"Discard","editor.undo":"Undo","editor.redo":"Redo","editor.saved":"Saved.","editor.saving":"Saving\u2026","editor.unsaved":"You have unsaved changes.","editor.confirm_leave":"You have unsaved changes. Discard them?","editor.confirm_discard":"Discard all changes?","editor.conflict":"Changed in the meantime \u2013 reload?","editor.reload":"Reload","editor.fix_errors":"Please fix the marked problems before saving.","profiles.add":"New plan","profiles.new_name":"New plan","profiles.name":"Name","profiles.color":"Color","profiles.duplicate":"Duplicate","profiles.delete":"Delete plan","profiles.copy_suffix":"(copy)","profiles.confirm_delete":'Delete the plan "{name}"?',"profiles.in_use":'"{name}" cannot be deleted because it is still used: {usages}. Choose another plan there first.',"profiles.last":"The last plan cannot be deleted.","profiles.copy_from":"Copy curve from","profiles.copy":"Copy","profiles.confirm_copy":'Replace all points of "{target}" with those of "{source}"?',"profiles.snap":"Snap to","profiles.snap_minutes":"{minutes} min","profiles.hint":"Tap the line to add a point. Drag points to move them.","profiles.continues":"continues into the next day","point.selected":"Selected point","point.time":"Time","point.value":"Temperature","point.value_generic":"Value","point.delete":"Delete point","point.add":"+ Point","point.minus":"Lower","point.plus":"Higher","point.table":"All points","point.full":"A plan can have at most {max} points.","point.min":"A plan needs at least one point.","point.taken":"There is already a point at {time}.","week.title":"Which plan applies on which day?","week.holiday":"On holidays:","week.no_holiday_source":"No holiday calendar is set up. An administrator can add one in the integration settings.","week.preview":"Month overview","week.prev_month":"Previous month","week.next_month":"Next month","week.legend_holiday":"holiday","week.legend_exception":"exception","week.day.mon":"Monday","week.day.tue":"Tuesday","week.day.wed":"Wednesday","week.day.thu":"Thursday","week.day.fri":"Friday","week.day.sat":"Saturday","week.day.sun":"Sunday","exceptions.title":"Exceptions","exceptions.empty":"No exceptions yet.","exceptions.add":"+ Exception","exceptions.from":"From","exceptions.to":"To","exceptions.profile":"Plan","exceptions.note":"Note","exceptions.delete":"Delete","exceptions.past":"over","exceptions.active":"today","exceptions.remove_past":"Remove past entries","exceptions.auto_cleanup":"Remove past entries automatically","error.too_few_points":"At least {min} point is needed.","error.too_many_points":"At most {max} points are allowed.","error.invalid_time":"The time {time} is not valid.","error.time_not_on_grid":"Times must be on a {grid} minute step ({time}).","error.duplicate_time":"There are two points at {time}.","error.times_not_sorted":"The points are not in time order ({time}).","error.invalid_value":"Please enter a number ({time}).","error.value_out_of_range":"{value} at {time} is outside {min} \u2026 {max}.","error.no_profiles":"At least one plan is needed.","error.too_many_profiles":"At most {max} plans are allowed.","error.invalid_profile_id":"Invalid plan.","error.empty_name":"Please enter a name.","error.name_too_long":"The name is too long (at most {max} characters).","error.reserved_name":'"{name}" cannot be used as a name.',"error.duplicate_name":'The name "{name}" is used twice.',"error.invalid_color":"Please choose a color.","error.unknown_profile":"The chosen plan does not exist.","error.invalid_date":"Please enter a valid date.","error.date_range_reversed":"The end is before the start.","error.note_too_long":"The note is too long (at most {max} characters).","error.too_many_exceptions":"At most {max} exceptions are allowed.","error.profile_in_use":'"{name}" is still used: {usages}.',"error.invalid_format":"Invalid data.","error.invalid_condition":"Check the condition: {detail}","error.invalid_anchor":"Choose a valid datetime source and one local anchor for each partner. Anchors cannot follow other anchors.","error.unknown":"Problem: {code}","usage.holiday_profile":"holidays","usage.fallback_profile":"fallback plan","usage.exception":"exception {number}","usage.activation":"activation {number}","error.invalid_curve":"Check plan points: use 1\u201348 points within the input and output limits.","error.invalid_x":"Use ascending, unique input values within the axis limits.","config.instance":"Time profile","config.view":"View","config.view.compact":"Compact (active plan, editor on demand)","config.editor_mode":"Editor","config.editor.hidden":"Hidden","config.editor.button":"Open with Edit button","config.editor.always":"Always open","config.show_title":"Show title","config.show_summary":"Show plan and current/next value","config.show_reason":"Show plan selection reason","config.show_input":"Show input and axis details","config.show_offset":"Show offset information","config.show_legend":"Show graph legend","config.show_clear_offset":"Show clear offset button at top","config.view.full":"Full (editor always open)","config.view.graph":"Graph only (no controls)","config.show_edit":"Show editor and Edit button","config.show_controls":"Show controls (mode and buttons)","config.allow_edit":"Allow editing for users without admin rights","config.title":"Title (optional)"},fi={"panel.instance":"Kurve","panel.refresh":"Liste aktualisieren","panel.add":"Kurve hinzuf\xFCgen","panel.clone":"Kurve klonen","panel.copy_suffix":"Kopie","panel.clone_name":"Name der Kopie","panel.clone_hint":"Kopiert gespeicherte Einstellungen, Pl\xE4ne, Aktivierungen und Ausnahmen. Das Ziel bleibt erhalten; die Kopie startet deaktiviert und ohne manuelle \xDCbersteuerung.","panel.clone_cancel":"Abbrechen","panel.cloning":"Wird geklont\u2026","panel.clone_failed":"Kurve konnte nicht geklont werden: {message}","panel.settings":"Kurveneinstellungen","panel.empty":"Keine Kurven geladen. Zuerst eine Curve-Scheduler-Instanz hinzuf\xFCgen.","panel.not_found":"Diese Kurve ist nicht geladen. Eine andere w\xE4hlen oder die Liste aktualisieren.","card.name":"Curve Schedule","card.description":"Zeigt den aktiven Plan und l\xE4sst alle die Kurven bearbeiten.","card.loading":"Wird geladen \u2026","card.no_instance":"Es wurde noch kein Zeitprofil eingerichtet.","card.not_found":"Dieses Zeitprofil gibt es nicht mehr. Bitte in den Karteneinstellungen ein anderes w\xE4hlen.","card.connection_error":"Verbindungsproblem: {message}","today.title":"Aktiver Plan: {profile}","today.now":"jetzt {value}","today.next":"ab {time} \u2192 {value}","today.disabled":"Pausiert \u2013 es wird nichts an das Ger\xE4t gesendet.","today.unavailable":"Das Ger\xE4t ist gerade nicht erreichbar.","today.reason.weekday":"Aktivierungen","today.reason.holiday":"Feiertag","today.reason.condition":"Aktivierungsbedingung","today.reason.fallback":"Keine Aktivierung passt \u2014 R\xFCckfallplan wird verwendet","today.reason.exception":"Ausnahme","today.reason.override":"von Hand gew\xE4hlt","today.mode":"Modus","today.mode.auto":"Automatik","today.until":"bis {time}","today.add_holiday":"Ausnahme hinzuf\xFCgen","today.edit":"Bearbeiten","today.close_editor":"Editor schlie\xDFen","holiday.title":"Ausnahme hinzuf\xFCgen","holiday.from":"Von","holiday.to":"Bis","holiday.profile":"Plan in dieser Zeit","holiday.note":"Notiz","holiday.note_default":"Ausnahme","holiday.save":"Eintragen","holiday.cancel":"Abbrechen","holiday.added":"Ausnahme hinzugef\xFCgt.","editor.tab.profiles":"Pl\xE4ne","editor.tab.week":"Aktivierungen","editor.tab.exceptions":"Ausnahmen","editor.save":"Speichern","editor.discard":"Verwerfen","editor.undo":"R\xFCckg\xE4ngig","editor.redo":"Wiederholen","editor.saved":"Gespeichert.","editor.saving":"Wird gespeichert \u2026","editor.unsaved":"Es gibt ungespeicherte \xC4nderungen.","editor.confirm_leave":"Es gibt ungespeicherte \xC4nderungen. Verwerfen?","editor.confirm_discard":"Alle \xC4nderungen verwerfen?","editor.conflict":"Wurde inzwischen ge\xE4ndert \u2013 neu laden?","editor.reload":"Neu laden","editor.fix_errors":"Bitte vor dem Speichern die markierten Probleme beheben.","profiles.add":"Neuer Plan","profiles.new_name":"Neuer Plan","profiles.name":"Name","profiles.color":"Farbe","profiles.duplicate":"Duplizieren","profiles.delete":"Plan l\xF6schen","profiles.copy_suffix":"(Kopie)","profiles.confirm_delete":"Den Plan \u201E{name}\u201C l\xF6schen?","profiles.in_use":"\u201E{name}\u201C kann nicht gel\xF6scht werden, weil er noch verwendet wird: {usages}. Bitte dort zuerst einen anderen Plan w\xE4hlen.","profiles.last":"Der letzte Plan kann nicht gel\xF6scht werden.","profiles.copy_from":"Kurve kopieren von","profiles.copy":"Kopieren","profiles.confirm_copy":"Alle Punkte von \u201E{target}\u201C durch die von \u201E{source}\u201C ersetzen?","profiles.snap":"Einrasten auf","profiles.snap_minutes":"{minutes} Min.","profiles.hint":"Auf die Linie tippen f\xFCgt einen Punkt hinzu. Punkte lassen sich verschieben.","profiles.continues":"geht in den n\xE4chsten Tag \xFCber","point.selected":"Ausgew\xE4hlter Punkt","point.time":"Uhrzeit","point.value":"Temperatur","point.value_generic":"Wert","point.delete":"Punkt l\xF6schen","point.add":"+ Punkt","point.minus":"Niedriger","point.plus":"H\xF6her","point.table":"Alle Punkte","point.full":"Ein Plan kann h\xF6chstens {max} Punkte haben.","point.min":"Ein Plan braucht mindestens einen Punkt.","point.taken":"Um {time} gibt es schon einen Punkt.","week.title":"Welcher Plan gilt an welchem Tag?","week.holiday":"An Feiertagen gilt:","week.no_holiday_source":"Es ist kein Feiertagskalender eingerichtet. Ein Administrator kann ihn in den Einstellungen der Integration hinzuf\xFCgen.","week.preview":"Monats\xFCbersicht","week.prev_month":"Vorheriger Monat","week.next_month":"N\xE4chster Monat","week.legend_holiday":"Feiertag","week.legend_exception":"Ausnahme","week.day.mon":"Montag","week.day.tue":"Dienstag","week.day.wed":"Mittwoch","week.day.thu":"Donnerstag","week.day.fri":"Freitag","week.day.sat":"Samstag","week.day.sun":"Sonntag","exceptions.title":"Ausnahmen","exceptions.empty":"Noch keine Ausnahmen.","exceptions.add":"+ Ausnahme","exceptions.from":"Von","exceptions.to":"Bis","exceptions.profile":"Plan","exceptions.note":"Notiz","exceptions.delete":"L\xF6schen","exceptions.past":"vorbei","exceptions.active":"heute","exceptions.remove_past":"Vergangene entfernen","exceptions.auto_cleanup":"Vergangene automatisch entfernen","error.too_few_points":"Es wird mindestens {min} Punkt ben\xF6tigt.","error.too_many_points":"H\xF6chstens {max} Punkte sind erlaubt.","error.invalid_time":"Die Uhrzeit {time} ist ung\xFCltig.","error.time_not_on_grid":"Uhrzeiten m\xFCssen auf {grid} Minuten genau sein ({time}).","error.duplicate_time":"Um {time} gibt es zwei Punkte.","error.times_not_sorted":"Die Punkte sind nicht nach Uhrzeit sortiert ({time}).","error.invalid_value":"Bitte eine Zahl eingeben ({time}).","error.value_out_of_range":"{value} um {time} liegt au\xDFerhalb von {min} \u2026 {max}.","error.no_profiles":"Mindestens ein Plan wird ben\xF6tigt.","error.too_many_profiles":"H\xF6chstens {max} Pl\xE4ne sind erlaubt.","error.invalid_profile_id":"Ung\xFCltiger Plan.","error.empty_name":"Bitte einen Namen eingeben.","error.name_too_long":"Der Name ist zu lang (h\xF6chstens {max} Zeichen).","error.reserved_name":"\u201E{name}\u201C kann nicht als Name verwendet werden.","error.duplicate_name":"Der Name \u201E{name}\u201C ist doppelt vergeben.","error.invalid_color":"Bitte eine Farbe w\xE4hlen.","error.unknown_profile":"Der gew\xE4hlte Plan existiert nicht.","error.invalid_date":"Bitte ein g\xFCltiges Datum eingeben.","error.date_range_reversed":"Das Ende liegt vor dem Anfang.","error.note_too_long":"Die Notiz ist zu lang (h\xF6chstens {max} Zeichen).","error.too_many_exceptions":"H\xF6chstens {max} Ausnahmen sind erlaubt.","error.profile_in_use":"\u201E{name}\u201C wird noch verwendet: {usages}.","error.invalid_format":"Ung\xFCltige Daten.","error.invalid_anchor":"G\xFCltige Datum-/Zeitquelle und einen lokalen Anker pro Partner w\xE4hlen. Anker d\xFCrfen anderen Ankern nicht folgen.","error.invalid_condition":"Bedingung pr\xFCfen: {detail}","error.unknown":"Problem: {code}","usage.holiday_profile":"Feiertage","usage.fallback_profile":"R\xFCckfallplan","usage.exception":"Ausnahme {number}","usage.activation":"Aktivierung {number}","error.invalid_curve":"Planpunkte pr\xFCfen: 1\u201348 Punkte innerhalb der Ein- und Ausgangsgrenzen verwenden.","error.invalid_x":"Aufsteigende, eindeutige Eingabewerte innerhalb der Achsengrenzen verwenden.","config.instance":"Zeitprofil","config.view":"Ansicht","config.view.compact":"Kompakt (aktiver Plan, Editor bei Bedarf)","config.editor_mode":"Editor","config.editor.hidden":"Ausgeblendet","config.editor.button":"Mit Bearbeiten-Schaltfl\xE4che \xF6ffnen","config.editor.always":"Immer ge\xF6ffnet","config.show_title":"Titel anzeigen","config.show_summary":"Plan und aktuellen/n\xE4chsten Wert anzeigen","config.show_reason":"Grund der Planauswahl anzeigen","config.show_input":"Eingangs- und Achsendetails anzeigen","config.show_offset":"Versatzinformationen anzeigen","config.show_legend":"Kurvenlegende anzeigen","config.show_clear_offset":"Versatz zur\xFCcksetzen oben anzeigen","config.view.full":"Voll (Editor immer offen)","config.view.graph":"Nur Diagramm (ohne Bedienelemente)","config.show_edit":"Editor und Bearbeiten-Schaltfl\xE4che anzeigen","config.show_controls":"Bedienelemente anzeigen (Modus und Schaltfl\xE4chen)","config.allow_edit":"Bearbeiten auch ohne Admin-Rechte erlauben","config.title":"Titel (optional)"},mi={en:Le,de:fi};function ie(o){return(o?.locale?.language??o?.language??"en").toLowerCase().startsWith("de")?"de":"en"}function P(o){let s=mi[o]??Le;return(e,t={})=>(s[e]??Le[e]??e).replace(/\{(\w+)\}/g,(n,r)=>r in t?String(t[r]):`{${r}}`)}function Lt(o){return o in Le}var gi=["step","linear","smooth","curve"];function S(o){let[s,e]=o.split(":");return Number(s)*60+Number(e)}function H(o){let s=Math.round(o),e=Math.floor(s/60),t=s%60;return`${String(e).padStart(2,"0")}:${String(t).padStart(2,"0")}`}function pe(o){if(o.length!==5)throw new Error(`expected 5 days, got ${o.length}`);let s=[];return o.forEach((e,t)=>{let i=(t-2)*1440;for(let[n,r]of e)s.push([n+i,r])}),s}function vi(o,s){let e=o.length;if(e<2)return new Array(e).fill(0);let t=[],i=[];for(let r=0;r<e-1;r++)t.push(o[r+1]-o[r]),i.push((s[r+1]-s[r])/t[r]);let n=new Array(e).fill(0);n[0]=i[0],n[e-1]=i[e-2];for(let r=1;r<e-1;r++){let l=i[r-1],a=i[r];if(l===0||a===0||l<0!=a<0){n[r]=0;continue}let d=2*t[r]+t[r-1],u=t[r]+2*t[r-1];n[r]=(d+u)/(d/l+u/a)}return n}function bi(o,s){let e=0,t=o.length-1;if(s<o[0])return-1;if(s>=o[t])return t;for(;t-e>1;){let i=Math.floor((e+t)/2);o[i]<=s?e=i:t=i}return e}var Z=class{constructor(s,e){this.mode=e;if(s.length===0)throw new Error("timeline is empty");if(!gi.includes(e))throw new Error(`unknown mode ${String(e)}`);this.xs=s.map(t=>t[0]),this.ys=s.map(t=>t[1]),this.tangents=e==="curve"?vi(this.xs,this.ys):[]}at(s){let{xs:e,ys:t}=this,i=bi(e,s);if(i<0)return t[0];if(i>=e.length-1)return t[t.length-1];let n=e[i],r=e[i+1],l=t[i],a=t[i+1];if(this.mode==="step")return l;let d=r-n,u=(s-n)/d;if(this.mode==="linear")return l+(a-l)*u;if(this.mode==="smooth")return l+(a-l)*(u*u*(3-2*u));let c=u*u,f=c*u,m=2*f-3*c+1,g=f-2*c+u,v=-2*f+3*c,b=f-c;return m*l+g*d*this.tangents[i]+v*a+b*d*this.tangents[i+1]}};function R(o,s){return s<=0?o:Math.round(Math.floor(o/s+.5)*s*1e6)/1e6}function y(o,s,e){return Math.max(s,Math.min(e,o))}var Ot=1,C=48,k=5,se=20,st=200,Y=40,fe=100,T=["mon","tue","wed","thu","fri","sat","sun"],Oe=["#e67e22","#27ae60","#2980b9","#8e44ad","#c0392b","#16a085","#f1c40f","#7f8c8d"],_i=/^([01]\d|2[0-3]):[0-5]\d$/,yi=/^\d{4}-\d{2}-\d{2}$/,$i=/^#[0-9a-fA-F]{6}$/,xi=/^[a-z0-9_]{1,40}$/;function w(o){return JSON.parse(JSON.stringify(o))}function nt(o){return o.points.map(s=>[S(s.t),s.v])}function zt(o){if(typeof o!="string"||!yi.test(o))return!1;let s=new Date(`${o}T00:00:00Z`);return!Number.isNaN(s.getTime())&&s.toISOString().startsWith(o)}function wi(o,s,e,t){let i=[],n=(a,d,u={})=>i.push({code:a,path:d,params:u});o.length<Ot&&n("too_few_points",s,{min:Ot}),o.length>C&&n("too_many_points",s,{max:C});let r,l=new Set;return o.forEach((a,d)=>{let u=`${s}.${d}`;if(typeof a.t!="string"||!_i.test(a.t)){n("invalid_time",u,{time:String(a.t)});return}let c=S(a.t);c%k&&n("time_not_on_grid",u,{time:a.t,grid:k}),l.has(c)?n("duplicate_time",u,{time:a.t}):r!==void 0&&c<r&&n("times_not_sorted",u,{time:a.t}),l.add(c),r=c,typeof a.v!="number"||Number.isNaN(a.v)?n("invalid_value",u,{time:a.t}):(a.v<e||a.v>t)&&n("value_out_of_range",u,{time:a.t,value:a.v,min:e,max:t})}),i}function Ht(o,s){let e=[],t=new Set,i=new Set(o.filter(n=>n.anchor&&n.id).map(n=>n.id));return o.forEach((n,r)=>{let l=n.id!==void 0&&(typeof n.id!="string"||!n.id||n.id.length>64||t.has(n.id));n.id&&t.add(n.id),(l||n.anchor&&(!n.id||n.partner_of!==void 0||!/^(input_datetime|datetime|sensor)\.[a-z0-9_]+$/.test(n.anchor.entity_id)||!["shortest","direct"].includes(n.anchor.shift_mode??"shortest"))||n.partner_of!==void 0&&!i.has(n.partner_of))&&e.push({code:"invalid_anchor",path:`${s}.${r}`,params:{}})}),e}function Ft(o,s,e,t){let i=[],n=(c,f,m={})=>i.push({code:c,path:f,params:m}),r=o.profiles??{},l=Object.keys(r);l.length===0&&n("no_profiles","profiles"),l.length>se&&n("too_many_profiles","profiles",{max:se});let a=new Set;for(let c of l){let f=r[c],m=`profiles.${c}`;i.push(...Ht(f.points??[],`${m}.points`),...Ht(f.curve??[],`${m}.curve`)),xi.test(c)||n("invalid_profile_id",m),f.apply_offset!==void 0&&typeof f.apply_offset!="boolean"&&n("invalid_format",`${m}.apply_offset`);let g=typeof f.name=="string"?f.name:"";if(!g.trim())n("empty_name",`${m}.name`);else if(g.length>Y)n("name_too_long",`${m}.name`,{max:Y});else{let v=g.trim().toLowerCase();v==="auto"?n("reserved_name",`${m}.name`,{name:g}):a.has(v)&&n("duplicate_name",`${m}.name`,{name:g}),a.add(v)}if((typeof f.color!="string"||!$i.test(f.color))&&n("invalid_color",`${m}.color`),t&&t.source!=="time_of_day"){let v=f.curve;(!v||v.length<1||v.length>C||v.some((b,$)=>!Number.isFinite(b.x)||!Number.isFinite(b.v)||b.x<t.min||b.x>t.max||t.wrap&&b.x===t.max||$>0&&b.x<=v[$-1].x||b.v<s||b.v>e))&&n("invalid_curve",`${m}.curve`)}else i.push(...wi(f.points??[],`${m}.points`,s,e))}let d=(c,f)=>{(typeof c!="string"||!(c in r))&&n("unknown_profile",f,{profile:String(c)})};if(o.fallback_profile!==void 0&&d(o.fallback_profile,"fallback_profile"),o.activations)o.activations.length>st&&n("invalid_format","activations"),o.activations.forEach((c,f)=>{d(c.profile,`activations.${f}.profile`);let m=c.days??[c.day];if(c.type==="condition"){(!c.condition||typeof c.condition!="object"||Array.isArray(c.condition))&&n("invalid_format",`activations.${f}.condition`);return}(c.type==="weekday"?!Array.isArray(m)||!m.length||m.some(g=>!T.includes(g))||new Set(m).size!==m.length:c.type!=="holiday"||!/^(calendar|binary_sensor)\.[a-z0-9_]+$/.test(c.source??""))&&n("invalid_format",`activations.${f}`)});else{for(let c of T)d(o.week?.[c],`week.${c}`);d(o.holiday_profile,"holiday_profile")}let u=o.exceptions??[];return u.length>st&&n("too_many_exceptions","exceptions",{max:st}),u.forEach((c,f)=>{let m=`exceptions.${f}`,g=zt(c.from),v=zt(c.to);g||n("invalid_date",`${m}.from`),v||n("invalid_date",`${m}.to`),g&&v&&c.to<c.from&&n("date_range_reversed",m),d(c.profile,`${m}.profile`),(c.note??"").length>fe&&n("note_too_long",`${m}.note`,{max:fe})}),i}function Vt(o,s){let e=o.activations?o.activations.flatMap((t,i)=>t.profile===s?[`activations.${i}`]:[]):T.filter(t=>o.week[t]===s).map(t=>`week.${t}`);return o.fallback_profile===s&&e.push("fallback_profile"),!o.activations&&o.holiday_profile===s&&e.push("holiday_profile"),o.exceptions.forEach((t,i)=>{t.profile===s&&e.push(`exceptions.${i}`)}),e}function X(o){let s=o.getFullYear(),e=String(o.getMonth()+1).padStart(2,"0"),t=String(o.getDate()).padStart(2,"0");return`${s}-${e}-${t}`}function J(o){let[s,e,t]=o.split("-").map(Number);return new Date(s,e-1,t,12)}function ze(o,s){let e=J(o);return e.setDate(e.getDate()+s),X(e)}function Rt(o){let s=J(o).getDay();return T[(s+6)%7]}function Ut(o,s,e){for(let t of o.exceptions)if(t.from<=s&&s<=t.to)return{profileId:t.profile,reason:"exception"};if(o.activations){for(let t of o.activations){if(t.type==="weekday"&&(t.days??[t.day]).includes(Rt(s)))return{profileId:t.profile,reason:"weekday"};if(t.type==="holiday"&&e(s,t.source))return{profileId:t.profile,reason:"holiday"}}return{profileId:o.fallback_profile??Object.keys(o.profiles)[0],reason:"fallback"}}return e(s)?{profileId:o.holiday_profile,reason:"holiday"}:{profileId:o.week[Rt(s)],reason:"weekday"}}function rt(o,s){let e=s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g,"").replace(/ß/g,"ss").replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"").slice(0,30)||"profile",t=e,i=2;for(;t in o.profiles;)t=`${e}_${i++}`;return t}function ot(o){let s=new Set(Object.values(o.profiles).map(e=>e.color.toLowerCase()));return Oe.find(e=>!s.has(e))??Oe[0]}function at(o,s){let e=S(s.t),t=o.findIndex(i=>S(i.t)>e);return t<0&&(t=o.length),o.splice(t,0,s),t}function Wt(o){let s=o.map(r=>S(r.t)).sort((r,l)=>r-l);if(s.length===0)return 720;let e,t=0;for(let r=0;r<s.length;r++){let l=s[r],d=(r+1<s.length?s[r+1]:s[0]+1440)-l;d>t&&(t=d,e=l+d/2)}if(e===void 0||t<2*k)return;let i=Math.round(e/15)*15;i>=1440&&(i-=1440);let n=new Set(s);for(let r=0;r<1440;r+=k)for(let l of[1,-1]){let a=((i+l*r)%1440+1440)%1440;if(!n.has(a))return a}}var M=E`
  :host {
    --zp-gap: 12px;
    --zp-radius: 10px;
    --zp-touch: 44px;
    color: var(--primary-text-color);
    font-family: var(--paper-font-body1_-_font-family, inherit);
  }
  button,
  .button {
    min-height: var(--zp-touch);
    min-width: var(--zp-touch);
    padding: 0 14px;
    border-radius: var(--zp-radius);
    border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.4));
    background: var(--card-background-color, #fff);
    color: var(--primary-text-color);
    font: inherit;
    font-size: 15px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    -webkit-tap-highlight-color: transparent;
  }
  button:disabled {
    opacity: 0.45;
    cursor: default;
  }
  button.primary {
    background: var(--primary-color, #03a9f4);
    border-color: var(--primary-color, #03a9f4);
    color: var(--text-primary-color, #fff);
    font-weight: 500;
  }
  button.danger {
    color: var(--error-color, #db4437);
    border-color: var(--error-color, #db4437);
  }
  button.icon {
    padding: 0;
    width: var(--zp-touch);
    font-size: 20px;
  }
  button.flat {
    border-color: transparent;
    background: transparent;
  }
  input,
  select {
    min-height: var(--zp-touch);
    box-sizing: border-box;
    border-radius: var(--zp-radius);
    border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.4));
    background: var(--card-background-color, #fff);
    color: var(--primary-text-color);
    font: inherit;
    font-size: 16px; /* prevents zooming on iOS */
    padding: 0 10px;
    max-width: 100%;
  }
  input[type="checkbox"] {
    min-height: 0;
    width: 24px;
    height: 24px;
    accent-color: var(--primary-color);
  }
  label.field {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 13px;
    color: var(--secondary-text-color);
  }
  label.check {
    display: flex;
    align-items: center;
    gap: 10px;
    min-height: var(--zp-touch);
    cursor: pointer;
  }
  .row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
  }
  .grow {
    flex: 1 1 auto;
  }
  .muted {
    color: var(--secondary-text-color);
    font-size: 13px;
  }
  .notice {
    padding: 10px 12px;
    border-radius: var(--zp-radius);
    background: rgba(127, 127, 127, 0.12);
    font-size: 14px;
  }
  .notice.error {
    background: rgba(219, 68, 55, 0.12);
    color: var(--error-color, #db4437);
  }
  .notice.warning {
    background: rgba(255, 152, 0, 0.15);
  }
  .notice.success {
    background: rgba(67, 160, 71, 0.15);
  }
  .swatch {
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    flex: none;
  }
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
  }
`;var re=44,ki=10,I=14,Ei=26,Ai=120,Pi=8,He=44,me=class extends x{constructor(){super();this.tapStart=null;this.points=[],this.numericPoints=[],this.axis=null,this.context=null,this.mode="curve",this.min=20,this.max=70,this.step=.5,this.unit=null,this.language="en",this.color="var(--primary-color, #03a9f4)",this.snapMinutes=15,this.xLabelStep=0,this.yLabelStep=0,this.editable=!1,this.nowMinute=null,this.offset=0,this.nowValue=null,this.selected=null,this.height=220,this.showContinuation=!0,this._width=320,this._drag=null}connectedCallback(){super.connectedCallback(),typeof ResizeObserver<"u"&&(this.resizeObserver=new ResizeObserver(e=>{let t=Math.round(e[0]?.contentRect.width??0);t>0&&t!==this._width&&(this._width=t)}),this.resizeObserver.observe(this))}disconnectedCallback(){super.disconnectedCallback(),this.resizeObserver?.disconnect()}willUpdate(e){(e.has("points")||e.has("numericPoints")||e.has("axis"))&&this._drag&&!this.editable&&(this._drag=null)}get domainStart(){return this.axis?.min??0}get cycleEnd(){return this.axis?.max??1440}get hasContinuation(){return this.showContinuation&&(!this.axis||this.axis.wrap)}get sourcePoints(){return this.axis?this.numericPoints:this.points}xOf(e){return"x"in e?e.x:S(e.t)}formatX(e){if(this.axis?.source==="day_of_week"){let t=Math.floor(e-1),i=new Intl.DateTimeFormat(this.language,{weekday:"short",timeZone:"UTC"}).format(new Date(Date.UTC(2024,0,1+(t%7+7)%7))),n=Math.round((e-Math.floor(e))*1440);return`${i}${t>=7?" +1":""}${n?` ${H(n)}`:""}`}return this.axis?F(e,this.xLabelStep||this.axis.step,this.language):H(e)}pointAt(e,t){return this.axis?{x:e,v:t}:{t:H(e),v:t}}get domainEnd(){let e=(this.cycleEnd-this.domainStart)*Ai/1440;return this.cycleEnd+(this.hasContinuation?e:0)}get plotWidth(){return Math.max(10,this._width-re-ki)}get plotHeight(){return Math.max(10,this.height-I-Ei)}xFor(e){return re+(e-this.domainStart)/(this.domainEnd-this.domainStart)*this.plotWidth}yFor(e){let t=this.max-this.min||1;return I+(1-(e-this.min)/t)*this.plotHeight}minuteAt(e){return this.domainStart+(e-re)/this.plotWidth*(this.domainEnd-this.domainStart)}valueAt(e){let t=this.max-this.min||1;return this.min+(1-(e-I)/this.plotHeight)*t}get shownPoints(){return this._drag?.points??(this.displayPoints?this.displayPoints.map(([e,t])=>({x:e,v:t})):this.sourcePoints)}timeline(e,t=this.context){if(e.length===0)return null;let i=e.map(l=>[this.xOf(l),l.v]);if(this.axis){if(!this.axis.wrap)return i;let l=this.axis.max-this.axis.min;return[-2,-1,0,1,2].flatMap(a=>i.map(([d,u])=>[d+a*l,u]))}let n=t,r=n?[n[0],n[1],i,n[2],n[3]]:[i,i,i,i,i];return pe(r)}curveValue(e){let t=this.timeline(this.shownPoints);return t?new Z(t,this.mode).at(e):null}snapTime(e){if(this.axis)return this.axis.min+R(e-this.axis.min,this.axis.step);let t=Math.max(k,this.snapMinutes||k);return Math.round(e/t)*t}snapValue(e){return y(R(y(e,this.min,this.max),this.step),this.min,this.max)}timeLimits(e,t){let i=this.axis?.step??k,n=t>0?this.xOf(e[t-1])+i:this.domainStart,r=t<e.length-1?this.xOf(e[t+1])-i:this.axis?this.axis.max-(this.axis.wrap?i:0):1440-k;return[n,r]}movePoint(e,t,i,n){let[r,l]=this.timeLimits(e,t);if(r>l)return e;let a=y(this.snapTime(i),r,l),d=y(Math.round(a/k)*k,r,l),u=e.map(c=>({...c}));return u[t]={...u[t],...this.pointAt(this.axis?a:d,this.snapValue(n))},u}emitChange(e,t){this.dispatchEvent(new CustomEvent(this.axis?"numeric-points-changed":"points-changed",{detail:{points:e,selected:t},bubbles:!0,composed:!0}))}emitSelect(e){this.dispatchEvent(new CustomEvent("point-selected",{detail:{index:e},bubbles:!0,composed:!0}))}emitNotice(e){this.dispatchEvent(new CustomEvent("curve-notice",{detail:e,bubbles:!0,composed:!0}))}localPosition(e){let t=this.renderRoot.querySelector(".chart")?.getBoundingClientRect();return{x:e.clientX-(t?.left??0),y:e.clientY-(t?.top??0)}}addPointAt(e){if(!this.editable)return;let t=this.snapTime(this.minuteAt(e));if(t<this.domainStart||(this.axis&&!this.axis.wrap?t>this.domainEnd:t>=(this.axis?.max??1440)))return;let i=this.sourcePoints.findIndex(d=>this.xOf(d)===t);if(i>=0){this.emitSelect(i),this.emitNotice({key:"point.taken",params:{time:this.formatX(t)}});return}if(this.sourcePoints.length>=C){this.emitNotice({key:"point.full",params:{max:C}});return}let n=this.curveValue(t),r=this.snapValue(n??(this.min+this.max)/2),l=this.sourcePoints.map(d=>({...d})),a=l.findIndex(d=>this.xOf(d)>t);a<0&&(a=l.length),l.splice(a,0,this.pointAt(t,r)),this.emitChange(l,a)}onChartPointerDown(e){if(!this.editable||e.button>0)return;let{x:t,y:i}=this.localPosition(e);this.tapStart={x:t,y:i,pointerId:e.pointerId}}onChartPointerUp(e){let t=this.tapStart;if(this.tapStart=null,!t||t.pointerId!==e.pointerId||this._drag)return;let{x:i,y:n}=this.localPosition(e);Math.hypot(i-t.x,n-t.y)>Pi||this.addPointAt(i)}onChartPointerCancel(){this.tapStart=null}onHandlePointerDown(e,t){if(!this.editable)return;e.stopPropagation(),e.preventDefault();let i=e.currentTarget;i.setPointerCapture?.(e.pointerId),i.focus?.({preventScroll:!0});let{x:n,y:r}=this.localPosition(e);this._drag={index:t,pointerId:e.pointerId,startX:n,startY:r,moved:!1,points:this.sourcePoints.map(l=>({...l}))},this.emitSelect(t)}onHandlePointerMove(e){let t=this._drag;if(!t||t.pointerId!==e.pointerId)return;e.preventDefault();let{x:i,y:n}=this.localPosition(e);if(!t.moved&&Math.hypot(i-t.startX,n-t.startY)<3)return;let r=this.movePoint(this.sourcePoints,t.index,this.minuteAt(i),this.valueAt(n));this._drag={...t,moved:!0,points:r}}onHandlePointerUp(e){let t=this._drag;if(!t||t.pointerId!==e.pointerId)return;this._drag=null;let i=t.points.some((n,r)=>this.xOf(n)!==this.xOf(this.sourcePoints[r])||n.v!==this.sourcePoints[r].v);t.moved&&i&&this.emitChange(t.points,t.index)}onHandlePointerCancel(){this._drag=null}onHandleKeyDown(e,t){if(!this.editable)return;let i=this.sourcePoints[t],n=this.xOf(i),r=i.v,l=this.axis?.step??Math.max(k,this.snapMinutes);switch(e.key){case"ArrowLeft":n-=l;break;case"ArrowRight":n+=l;break;case"ArrowUp":r+=this.step;break;case"ArrowDown":r-=this.step;break;default:return}e.preventDefault(),this.emitChange(this.movePoint(this.sourcePoints,t,n,r),t)}curvePath(e,t,i,n=!1,r=this.context){let l=this.timeline(e,r);if(!l)return"";let a=new Z(l,this.mode),d=Math.max(24,Math.round(this.plotWidth/2)),u=(i-t)/d,c=[],f=null,m=Array.from({length:d+1},(g,v)=>t+v*u);this.axis&&m.push(...l.flatMap(([g])=>[g-(i-t)*1e-9,g]).filter(g=>g>=t&&g<=i));for(let[g,v]of[...new Set(m)].sort((b,$)=>b-$).entries()){let b=y(a.at(v),this.min,this.max),$=n?y(b+this.offset,this.min,this.max):b,D=this.xFor(v).toFixed(1),N=this.yFor($).toFixed(1);this.mode==="step"&&f!==null&&$!==f&&c.push(`L${D},${this.yFor(f).toFixed(1)}`),c.push(`${g===0?"M":"L"}${D},${N}`),f=$}return c.join("")}renderGrid(){let e=this.yLabelStep>0?Ne(this.min,this.max,this.yLabelStep):it(this.min,this.max,this.height<180?3:5),t=this._width<420,i=this.axis?.source==="day_of_week"&&!this.xLabelStep&&this.axis.max-this.axis.min<=8?Array.from({length:Math.floor(this.axis.max)-Math.ceil(this.axis.min)+1},(r,l)=>Math.ceil(this.axis.min)+l):this.axis?Ne(this.axis.min,this.axis.max,this.xLabelStep):this.xLabelStep>0?Ne(0,1440,this.xLabelStep):(t?[0,6,12,18,24]:[0,3,6,9,12,15,18,21,24]).map(r=>r*60),n=I+this.plotHeight;return A`
      ${e.map(r=>A`
          <line class="grid" x1=${re} x2=${this.xFor(this.domainEnd)}
            y1=${this.yFor(r)} y2=${this.yFor(r)}></line>
          <text class="label y" x=${re-6} y=${this.yFor(r)+4}>${V(r,this.yLabelStep||.1,null,this.language)}</text>`)}
      ${i.map(r=>A`
          <line class="grid" x1=${this.xFor(r)} x2=${this.xFor(r)}
            y1=${I} y2=${n}></line>
          <text class="label x" style=${r===this.domainStart?"text-anchor:start":r===this.cycleEnd?"text-anchor:end":""} x=${this.xFor(r)} y=${n+17}>${this.axis?this.formatX(r):this.xLabelStep>0?H(r):r/60}</text>`)}
      ${this.hasContinuation?A`<rect class="next-day" x=${this.xFor(this.cycleEnd)} y=${I}
              width=${this.xFor(this.domainEnd)-this.xFor(this.cycleEnd)}
              height=${this.plotHeight}></rect>
              <text class="label" x=${this.xFor((this.cycleEnd+this.domainEnd)/2)}
                y=${I+12}>+1</text>`:p}
    `}renderNow(){if(this.nowMinute===null)return p;let e=this.xFor(this.nowMinute);return A`
      <line class="now" x1=${e} x2=${e} y1=${I} y2=${I+this.plotHeight}></line>
      ${this.nowValue!==null?A`<circle class="now-dot" cx=${e} cy=${this.yFor(this.offset!==0?y(R(y(R(y(this.nowValue,this.min,this.max),this.step)+this.offset,this.min,this.max),this.step),this.min,this.max):y(this.nowValue,this.min,this.max))} r="6"></circle>`:p}
    `}renderHandles(e){let t=this._drag;return e.map((i,n)=>{let r=this.xOf(i),l=this.xFor(r),a=this.yFor(y(i.v,this.min,this.max)),d=n===this.selected,u=`${this.formatX(this.xOf(i))} \xB7 ${V(i.v,this.step,this.unit,this.language)}`;return h`
        <div
          class="handle ${d?"selected":""} ${t?.index===n?"dragging":""}"
          style="transform: translate(${l-He/2}px, ${a-He/2}px)"
          role="slider"
          tabindex=${this.editable?0:-1}
          aria-label=${u}
          aria-valuemin=${this.min}
          aria-valuemax=${this.max}
          aria-valuenow=${i.v}
          aria-valuetext=${u}
          data-index=${n}
          @pointerdown=${c=>this.onHandlePointerDown(c,n)}
          @pointermove=${c=>this.onHandlePointerMove(c)}
          @pointerup=${c=>this.onHandlePointerUp(c)}
          @pointercancel=${()=>this.onHandlePointerCancel()}
          @lostpointercapture=${c=>this.onHandlePointerUp(c)}
          @keydown=${c=>this.onHandleKeyDown(c,n)}
          @click=${c=>{c.stopPropagation(),this.emitSelect(n)}}
        >
          <span class="dot" style="border-color: ${this.color}"></span>
        </div>
      `})}renderTooltip(){let e=this._drag;if(!e?.moved)return p;let t=e.points[e.index],i=y(this.xFor(this.xOf(t)),50,this._width-50),n=this.yFor(t.v),r=n>48;return h`<div
      class="tooltip"
      style="left: ${i}px; top: ${r?n-40:n+26}px"
      role="status"
    >
      ${this.formatX(this.xOf(t))} · ${V(t.v,this.step,this.unit,this.language)}
    </div>`}renderOriginalPoints(){if(!this.referencePoints||this.editable)return p;let e=this.referencePoints,t=this.cycleEnd-this.domainStart;return A`
      ${e.map(([i,n],r)=>{let l=this.pointPositions?.[r];if(!l||!this.displayPoints?.length||Math.abs(l[0]-i)<1e-9)return p;let a=this.sourcePoints[r],d=a?.anchor??this.sourcePoints.find(g=>g.id===a?.partner_of)?.anchor,u=l[0],f=d?.shift_mode!=="direct"&&Math.abs(u-i)>t/2?u>i?[[i,this.domainStart],[this.cycleEnd,u]]:[[i,this.cycleEnd],[this.domainStart,u]]:[[i,u]],m=this.yFor(y(n,this.min,this.max));return f.filter(([g,v])=>g!==v).map(([g,v])=>{let b=this.xFor(v),$=b-Math.sign(v-g)*4;return A`<line class="shift-connector" x1=${this.xFor(g)} x2=${b} y1=${m} y2=${m}></line>
            <path class="shift-arrow" d=${`M${$},${m-2.5} L${b},${m} L${$},${m+2.5}`}></path>`})})}
      ${e.map(([i,n])=>A`<circle class="original-marker" cx=${this.xFor(i)} cy=${this.yFor(y(n,this.min,this.max))} r="3"></circle>`)}
    `}render(){let e=this.shownPoints,t=this.curvePath(e,this.domainStart,this.cycleEnd),i=this.hasContinuation?this.curvePath(e,this.cycleEnd,this.domainEnd):"";return h`
      <div
        class="chart"
        style="height: ${this.height}px"
        @pointerdown=${this.onChartPointerDown}
        @pointerup=${this.onChartPointerUp}
        @pointercancel=${this.onChartPointerCancel}
      >
        <svg
          width=${this._width}
          height=${this.height}
          viewBox="0 0 ${this._width} ${this.height}"
          role="img"
          aria-hidden="true"
        >
          ${this.renderGrid()}
          ${this.referencePoints?A`<path class="curve original-curve" d=${this.curvePath(this.referencePoints.map(([n,r])=>({x:n,v:r})),this.domainStart,this.domainEnd,!1,this.referenceContext??null)} style="stroke: var(--secondary-text-color, #888); opacity: .65"><title>${this.language.startsWith("de")?"Gespeicherte Originalkurve":"Saved original curve"}</title></path>`:p}
          ${this.renderOriginalPoints()}
          <path class="curve" d=${t} style="stroke: ${this.color}"></path>
          ${i?A`<path class="curve continuation" d=${i} style="stroke: ${this.color}"></path>`:p}
          ${this.offset!==0?A`<path class="curve offset-curve" d=${this.curvePath(e,this.domainStart,this.axis?.max??1440,!0)} style=${`stroke: ${this.referencePoints?this.color:"var(--secondary-text-color, #888)"}; stroke-dasharray: 7 4`}><title>${this.language.startsWith("de")?"Kurvenwert mit Versatz":"Curve value with offset"}</title></path>`:p}
          ${this.renderNow()}
          ${this._drag?A`
            <line class="guide" x1=${re} x2=${this.xFor(this.xOf(e[this._drag.index]))} y1=${this.yFor(e[this._drag.index].v)} y2=${this.yFor(e[this._drag.index].v)}></line>
            <line class="guide" x1=${this.xFor(this.xOf(e[this._drag.index]))} x2=${this.xFor(this.xOf(e[this._drag.index]))} y1=${this.yFor(e[this._drag.index].v)} y2=${I+this.plotHeight}></line>
          `:p}
          ${this.editable?p:e.map(n=>A`<circle class="marker" cx=${this.xFor(this.xOf(n))}
                    cy=${this.yFor(y(n.v,this.min,this.max))} r="3"
                    style="fill: ${this.color}"></circle>`)}
        </svg>
        ${this.editable?this.renderHandles(e):p} ${this.renderTooltip()}
      </div>
      ${this.showLegend?h`<div class="legend" role="list" aria-label=${this.language.startsWith("de")?"Kurvenlegende":"Curve legend"}>
        ${this.referencePoints?.length?h`<span role="listitem"><i style="border-color:var(--secondary-text-color, #888);opacity:.65"></i>${this.language.startsWith("de")?"Original":"Raw"}</span>`:p}
        ${e.length?h`<span role="listitem"><i style=${`border-color:${this.color}`}></i>${this.referencePoints?this.language.startsWith("de")?"Verschoben":"Shifted":this.language.startsWith("de")?"Original":"Raw"}</span>`:p}
        ${e.length&&this.offset!==0?h`<span role="listitem"><i style=${`border-color:${this.referencePoints?this.color:"var(--secondary-text-color, #888)"};border-top-style:dashed`}></i>${this.referencePoints?this.language.startsWith("de")?"Verschoben + Versatz":"Shifted + offset":this.language.startsWith("de")?"Original + Versatz":"Raw + offset"}</span>`:p}
      </div>`:p}
    `}};me.properties={offset:{attribute:!1},showLegend:{type:Boolean},points:{attribute:!1},numericPoints:{attribute:!1},displayPoints:{attribute:!1},referencePoints:{attribute:!1},pointPositions:{attribute:!1},referenceContext:{attribute:!1},axis:{attribute:!1},context:{attribute:!1},mode:{},min:{type:Number},max:{type:Number},step:{type:Number},unit:{},language:{},color:{},snapMinutes:{type:Number,attribute:"snap-minutes"},xLabelStep:{type:Number},yLabelStep:{type:Number},editable:{type:Boolean,reflect:!0},nowMinute:{attribute:!1},nowValue:{attribute:!1},selected:{attribute:!1},height:{type:Number},showContinuation:{type:Boolean,attribute:"show-continuation"},_width:{state:!0},_drag:{state:!0}},me.styles=E`
    .original-marker { fill:var(--secondary-text-color, #888); opacity:.65; pointer-events:none; }
    .shift-arrow { fill:none; stroke:var(--secondary-text-color, #aaa); stroke-width:1; opacity:.5; pointer-events:none; }
    .shift-connector { stroke:var(--secondary-text-color, #aaa); stroke-width:1; stroke-dasharray:3 5; opacity:.5; pointer-events:none; }
    .legend { display:flex; flex-wrap:wrap; gap:6px 16px; margin:8px 0; font-size:12px; color:var(--secondary-text-color); }
    .legend span { display:inline-flex; align-items:center; gap:6px; }
    .legend i { display:inline-block; width:24px; border-top:2px solid; }
    .guide { stroke: var(--primary-color); stroke-dasharray: 4 3; stroke-width: 1; pointer-events: none; }
    :host {
      display: block;
      position: relative;
      user-select: none;
      -webkit-user-select: none;
    }
    .chart {
      position: relative;
      width: 100%;
      overflow: hidden;
      touch-action: pan-y;
    }
    svg {
      position: absolute;
      inset: 0;
      display: block;
    }
    .grid {
      stroke: var(--divider-color, rgba(127, 127, 127, 0.25));
      stroke-width: 1;
    }
    .label {
      fill: var(--secondary-text-color, #727272);
      font-size: 11px;
      font-family: inherit;
    }
    .label.y {
      text-anchor: end;
    }
    .label.x {
      text-anchor: middle;
    }
    .next-day {
      fill: var(--secondary-text-color, #727272);
      opacity: 0.08;
    }
    .curve {
      fill: none;
      stroke-width: 3;
      stroke-linejoin: round;
      stroke-linecap: round;
    }
    .curve.continuation {
      stroke-dasharray: 6 6;
      opacity: 0.6;
    }
    .now {
      stroke: var(--error-color, #db4437);
      stroke-width: 2;
      stroke-dasharray: 3 3;
    }
    .now-dot {
      fill: var(--error-color, #db4437);
      stroke: var(--card-background-color, #fff);
      stroke-width: 2;
    }
    .handle {
      position: absolute;
      left: 0;
      top: 0;
      width: ${He}px;
      height: ${He}px;
      display: flex;
      align-items: center;
      justify-content: center;
      touch-action: none;
      cursor: grab;
      border-radius: 50%;
      outline: none;
      -webkit-tap-highlight-color: transparent;
    }
    .handle.dragging {
      cursor: grabbing;
      z-index: 2;
    }
    .dot {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: var(--card-background-color, #fff);
      border: 3px solid;
      box-sizing: border-box;
      transition: transform 0.1s;
    }
    .handle.selected .dot,
    .handle:focus-visible .dot {
      transform: scale(1.5);
      box-shadow: 0 0 0 4px rgba(127, 127, 127, 0.3);
    }
    @media (prefers-reduced-motion: reduce) { .dot { transition: none; } }
    .handle.dragging .dot {
      transform: scale(1.7);
    }
    .tooltip {
      position: absolute;
      transform: translateX(-50%);
      background: var(--primary-text-color, #212121);
      color: var(--card-background-color, #fff);
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      white-space: nowrap;
      pointer-events: none;
      z-index: 3;
    }
  `;customElements.get("curve-scheduler-curve")||customElements.define("curve-scheduler-curve",me);function Re(o,s,e,t,i){if(s===null||!o[s])return p;let n=t.startsWith("de"),r=(c,f)=>n?f:c,l=o[s],a=o.flatMap((c,f)=>c.anchor&&c.id&&f!==s?[{id:c.id,index:f}]:[]),d=c=>{let f=o.map(m=>({...m,...m.anchor?{anchor:{...m.anchor}}:{}}));c(f[s],f),i(f)},u=l.anchor?"anchor":l.partner_of?"partner":"fixed";return h`<fieldset class="anchor-controls"><legend>${r("Point","Punkt")} ${s+1} · ${r("Anchor assignment","Ankerzuordnung")}</legend>
    <label>${r("Role","Rolle")} <select aria-label=${r("Point role","Punktrolle")} .value=${u}
      @change=${c=>d((f,m)=>{let g=c.target.value;f.anchor&&m.forEach(v=>{v.partner_of===f.id&&delete v.partner_of}),delete f.anchor,delete f.partner_of,g==="anchor"&&(f.id??=crypto.randomUUID?.()??`point_${Date.now()}_${Math.random().toString(36).slice(2)}`,f.anchor={entity_id:"",shift_mode:"shortest"}),g==="partner"&&a[0]&&(f.partner_of=a[0].id)})}>
      <option value="fixed">${r("Fixed","Fest")}</option><option value="anchor">${r("Anchor","Anker")}</option>
      <option value="partner" ?disabled=${!a.length}>${r("Partner","Partner")}</option>
    </select></label>
    ${l.anchor?h`<label>${r("Datetime source","Datum-/Zeitquelle")}
      <ha-entity-picker .hass=${e} .includeDomains=${["input_datetime","datetime","sensor"]} .value=${l.anchor.entity_id}
        allow-custom-entity @value-changed=${c=>d(f=>{f.anchor.entity_id=c.detail.value??""})}></ha-entity-picker></label>
      <label>${r("Movement","Verschiebung")} <select aria-label=${r("Anchor movement","Ankerverschiebung")} .value=${l.anchor.shift_mode??"shortest"}
        @change=${c=>d(f=>{f.anchor.shift_mode=c.target.value})}>
        <option value="shortest">${r("Shortest around cycle","K\xFCrzester Weg im Zyklus")}</option>
        <option value="direct">${r("Direct difference","Direkte Differenz")}</option></select></label>`:p}
    ${l.partner_of?h`<label>${r("Follow anchor","Anker folgen")} <select aria-label=${r("Partner anchor","Partneranker")} .value=${l.partner_of}
      @change=${c=>d(f=>{f.partner_of=c.target.value})}>
      ${a.map(c=>h`<option value=${c.id}>${r("Point","Punkt")} ${c.index+1}</option>`)}</select></label>`:p}
    <p>${r("Edit saved coordinates here. Source changes move only the main graph. Removing an anchor detaches its partners.","Hier werden gespeicherte Koordinaten bearbeitet. Quellen\xE4nderungen verschieben nur die Hauptgrafik. Beim Entfernen eines Ankers werden seine Partner gel\xF6st.")}</p>
  </fieldset>`}function ge(o){let s=new Set(o.filter(e=>e.anchor).map(e=>e.id));return o.map(e=>{if(!e.partner_of||s.has(e.partner_of))return e;let t={...e};return delete t.partner_of,t})}var Fe={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Q=o=>(...s)=>({_$litDirective$:o,values:s}),U=class{constructor(s){}get _$AU(){return this._$AM._$AU}_$AT(s,e,t){this._$Ct=s,this._$AM=e,this._$Ci=t}_$AS(s,e){return this.update(s,e)}update(s,e){return this.render(...e)}};var{I:Si}=St,Bt=o=>o;var jt=o=>o.strings===void 0,Kt=()=>document.createComment(""),oe=(o,s,e)=>{let t=o._$AA.parentNode,i=s===void 0?o._$AB:s._$AA;if(e===void 0){let n=t.insertBefore(Kt(),i),r=t.insertBefore(Kt(),i);e=new Si(n,r,o,o.options)}else{let n=e._$AB.nextSibling,r=e._$AM,l=r!==o;if(l){let a;e._$AQ?.(o),e._$AM=o,e._$AP!==void 0&&(a=o._$AU)!==r._$AU&&e._$AP(a)}if(n!==i||l){let a=e._$AA;for(;a!==n;){let d=Bt(a).nextSibling;Bt(t).insertBefore(a,i),a=d}}}return e},W=(o,s,e=o)=>(o._$AI(s,e),o),Ti={},Ve=(o,s=Ti)=>o._$AH=s,Gt=o=>o._$AH,Ue=o=>{o._$AR(),o._$AA.remove()};var qt=(o,s,e)=>{let t=new Map;for(let i=s;i<=e;i++)t.set(o[i],i);return t},Zt=Q(class extends U{constructor(o){if(super(o),o.type!==Fe.CHILD)throw Error("repeat() can only be used in text expressions")}dt(o,s,e){let t;e===void 0?e=s:s!==void 0&&(t=s);let i=[],n=[],r=0;for(let l of o)i[r]=t?t(l,r):r,n[r]=e(l,r),r++;return{values:n,keys:i}}render(o,s,e){return this.dt(o,s,e).values}update(o,[s,e,t]){let i=Gt(o),{values:n,keys:r}=this.dt(s,e,t);if(!Array.isArray(i))return this.ut=r,n;let l=this.ut??=[],a=[],d,u,c=0,f=i.length-1,m=0,g=n.length-1;for(;c<=f&&m<=g;)if(i[c]===null)c++;else if(i[f]===null)f--;else if(l[c]===r[m])a[m]=W(i[c],n[m]),c++,m++;else if(l[f]===r[g])a[g]=W(i[f],n[g]),f--,g--;else if(l[c]===r[g])a[g]=W(i[c],n[g]),oe(o,a[g+1],i[c]),c++,g--;else if(l[f]===r[m])a[m]=W(i[f],n[m]),oe(o,i[c],i[f]),f--,m++;else if(d===void 0&&(d=qt(r,m,g),u=qt(l,c,f)),d.has(l[c]))if(d.has(l[f])){let v=u.get(r[m]),b=v!==void 0?i[v]:null;if(b===null){let $=oe(o,i[c]);W($,n[m]),a[m]=$}else a[m]=W(b,n[m]),oe(o,i[c],b),i[v]=null;m++}else Ue(i[f]),f--;else Ue(i[c]),c++;for(;m<=g;){let v=oe(o,a[g+1]);W(v,n[m]),a[m++]=v}for(;c<=f;){let v=i[c++];v!==null&&Ue(v)}return this.ut=r,Ve(o,a),z}});var Ci={en:{x:"Input",y:"Output",add:"Add point",remove:"Delete",save:"Save",discard:"Discard",edit:"Edit curve",conflict:"Changed elsewhere. Discard to reload before saving.",invalid:"Check points: finite numbers, ascending unique inputs within axis limits and outputs within limits.",failed:"Could not save",unavailable:"Input unavailable",wrap:"Wrapping",clamp:"Clamped",dirty:"Unsaved changes",saved:"Saved"},de:{x:"Eingang",y:"Ausgang",add:"Punkt hinzuf\xFCgen",remove:"L\xF6schen",save:"Speichern",discard:"Verwerfen",edit:"Kurve bearbeiten",conflict:"Andernorts ge\xE4ndert. Vor dem Speichern verwerfen und neu laden.",invalid:"Punkte pr\xFCfen: endliche Zahlen, aufsteigende eindeutige Eing\xE4nge und Ausg\xE4nge innerhalb der Grenzen.",failed:"Speichern fehlgeschlagen",unavailable:"Eingang nicht verf\xFCgbar",wrap:"Umlaufend",clamp:"Begrenzt",dirty:"Ungespeicherte \xC4nderungen",saved:"Gespeichert"}},ve=class extends x{constructor(){super();this.selected=null;this.revision=0;this.base="";this.beforeUnload=e=>{this.dirty&&(e.preventDefault(),e.returnValue="")};this.onPointKeyDown=e=>{if(!this.editable||!this.editing||this.saving||e.defaultPrevented||e.ctrlKey||e.metaKey||e.altKey)return;let t=e.composedPath(),i=t.some(n=>n instanceof HTMLElement&&(n.matches("input, textarea, select")||n.isContentEditable));if(e.key==="Escape")this.selected=null;else if(!i&&(e.key==="Delete"||e.key==="Backspace")&&this.selected!==null)this.points.length>1&&(this.points=ge(this.points.filter((n,r)=>r!==this.selected))),this.selected=null,this.focus();else if(!i&&e.code==="Space"&&!e.repeat&&!t.some(n=>n instanceof Element&&n.matches("button, a")))this.points.length<48&&this.add();else return;e.preventDefault(),e.stopPropagation()};this.graphOnly=!1,this.offset=0,this.embedded=!1,this.editable=!1,this.language="en",this.points=[],this.editing=!1,this.message="",this.saving=!1}connectedCallback(){super.connectedCallback(),this.tabIndex=0,this.addEventListener("keydown",this.onPointKeyDown),window.addEventListener("beforeunload",this.beforeUnload)}disconnectedCallback(){this.removeEventListener("keydown",this.onPointKeyDown),window.removeEventListener("beforeunload",this.beforeUnload),super.disconnectedCallback()}get text(){return Ci[this.language.startsWith("de")?"de":"en"]}get dirty(){return!this.embedded&&JSON.stringify(this.points)!==this.base}willUpdate(e){this.embedded&&e.has("points")&&this.dispatchEvent(new CustomEvent("numeric-points-changed",{detail:w(this.points)})),!this.embedded&&e.has("data")&&this.data&&(!this.base||!this.dirty)&&!this.saving&&this.reset()}reset(){this.selected=null,this.points=w(this.data.schedule.curve??[]),this.revision=this.data.revision,this.base=JSON.stringify(this.points),this.message=""}confirmLeave(e){return this.dirty?window.confirm(e)?(this.reset(),!0):!1:!0}changed(e,t,i){this.points=this.points.map((n,r)=>r===e?{...n,[t]:i}:n)}get valid(){let e=this.data.config.axis;return this.points.length>=1&&this.points.length<=48&&this.points.every((t,i)=>Number.isFinite(t.x)&&Number.isFinite(t.v)&&t.x>=e.min&&t.x<=e.max&&(!e.wrap||t.x<e.max)&&(i===0||t.x>this.points[i-1].x)&&t.v>=this.data.config.min&&t.v<=this.data.config.max)}async save(){if(!this.valid){this.message=this.text.invalid;return}this.saving=!0;try{let e=await De(this.hass,this.data.entry_id,this.revision,{...this.data.schedule,curve:this.points});e.ok?(this.revision=e.revision,this.base=JSON.stringify(this.points),this.message=this.text.saved):this.message=e.conflict?this.text.conflict:this.text.invalid}catch{this.message=this.text.failed}finally{this.saving=!1}}add(){let e=this.data.config.axis,t=[e.min-e.step,...this.points.map(r=>r.x),e.max],i,n=0;for(let r=1;r<t.length;r++){let l=e.min+R((t[r-1]+t[r])/2-e.min,e.step);t[r]-t[r-1]>n&&l>=e.min&&l<=e.max&&(!e.wrap||l<e.max)&&!this.points.some(a=>a.x===l)&&(i=l,n=t[r]-t[r-1])}i!==void 0&&(this.points=[...this.points,{x:i,v:this.data.config.min}].sort((r,l)=>r.x-l.x),this.selected=this.points.findIndex(r=>r.x===i))}render(){if(!this.data?.config.axis)return p;let{config:e,state:t}=this.data,i=e.axis,n=!this.editable&&!this.embedded?t.resolved_profiles?.[t.profile_id]:void 0,r=this.points.some(l=>l.anchor||l.partner_of);return h`
      ${this.graphOnly?p:h`<p>${this.text.x}: ${t.input_value==null?"\u2014":F(t.input_value,10**-(e.input_decimals??2),this.language)} → ${this.text.y}: ${t.value??"\u2014"} ${e.unit??""}</p>
      <p class="muted">${i.source==="sensor"?i.input_entity:i.source==="day_of_week"?this.language.startsWith("de")?"Wochentag (1 = Mo, 7 = So; Bruchteile = Tageszeit)":"Day of week (1 = Mon, 7 = Sun; fractions = time of day)":i.source} · ${i.min}…${i.max} · ${i.wrap?this.text.wrap:this.text.clamp}</p>`}
      ${t.input_available===!1?h`<p role="status">${this.text.unavailable}</p>`:p}
      <curve-scheduler-curve
        .showLegend=${this.showLegend&&!this.editable&&!this.embedded}
        .offset=${this.offset}
        .axis=${i} .numericPoints=${this.valid?this.points:[]}
        .displayPoints=${n?n.points??[]:void 0}
        .pointPositions=${n?.point_positions}
        .referencePoints=${n&&(r||n.errors.length)?this.points.map(l=>[l.x,l.v]):void 0}
        .mode=${e.interpolation} .min=${e.min} .max=${e.max} .step=${e.step}
        .xLabelStep=${e.x_label_step??0} .yLabelStep=${e.y_label_step??0}
        .unit=${e.unit} .language=${this.language}
        .color=${"var(--plan-color, var(--primary-color))"}
        .editable=${this.editable&&this.editing&&!this.saving} .selected=${this.selected}
        .nowMinute=${t.input_value??null} .nowValue=${t.value}
        .showContinuation=${i.wrap}
        @point-selected=${l=>{this.selected=l.detail.index}}
        @numeric-points-changed=${l=>{l.stopPropagation(),this.points=l.detail.points,this.selected=l.detail.selected}}
      ></curve-scheduler-curve>
      ${this.editable&&!this.embedded?h`<button @click=${()=>{(!this.editing||!this.dirty||window.confirm(this.text.discard))&&(this.editing&&this.reset(),this.editing=!this.editing)}}>${this.text.edit}</button>`:p}
      ${this.editable&&this.editing?h`
        ${i.source==="day_of_week"?Re(this.points,this.selected,this.hass,this.language,l=>{this.points=l}):p}
        ${this.points.map((l,a)=>h`<div class="row" @focusin=${()=>{this.selected=a}}>
          <label>${this.text.x}<input type="number" step=${i.step} min=${i.min} max=${i.max} .value=${String(l.x)} ?disabled=${this.saving} @change=${d=>this.changed(a,"x",Number(d.target.value))}></label>
          <label>${this.text.y}<input type="number" step=${e.step} min=${e.min} max=${e.max} .value=${String(l.v)} ?disabled=${this.saving} @change=${d=>this.changed(a,"v",Number(d.target.value))}></label>
          <button aria-label=${`${this.text.remove} ${a+1}`} ?disabled=${this.saving||this.points.length<=1} @click=${()=>{this.points=ge(this.points.filter((d,u)=>a!==u))}}>${this.text.remove}</button>
        </div>`)}
        <button ?disabled=${this.saving||this.points.length>=48} @click=${this.add}>${this.text.add}</button>
        ${this.embedded?p:h`<button ?disabled=${this.saving} @click=${this.reset}>${this.text.discard}</button>
        <button ?disabled=${this.saving||!this.dirty||!this.valid} @click=${this.save}>${this.text.save}</button>`}
        ${this.dirty?h`<p>${this.text.dirty}</p>`:p}
      `:p}
      <p role="status">${this.message}</p>`}};ve.properties={showLegend:{type:Boolean},graphOnly:{attribute:!1},offset:{attribute:!1},embedded:{type:Boolean},selected:{state:!0},hass:{attribute:!1},data:{attribute:!1},editable:{type:Boolean},language:{},points:{state:!0},editing:{state:!0},message:{state:!0},saving:{state:!0}},ve.styles=[M,E` p { margin: 2px 0; }
    :host { display:block; }
    input { width:100%; box-sizing:border-box; }
    .row { display:flex; justify-content:space-between; gap:8px; align-items:end; margin:8px 0; } label { min-width:0; }
  `];customElements.define("curve-scheduler-numeric-editor",ve);var Mi=["\xB0C","\xB0F","K","C","F"],Ii=[5,15,30,60],Di=100,be=class extends x{constructor(){super();this._calendar=null;this.calendarRequest=0;this.t=P("en");this.onBeforeUnload=e=>{this.dirty&&(e.preventDefault(),e.returnValue="")};this.onPointKeyDown=e=>{if(this.config.axis&&this.config.axis.source!=="time_of_day"||e.defaultPrevented||e.ctrlKey||e.metaKey||e.altKey||this._saving||this._tab!=="profiles")return;let t=e.composedPath(),i=t.some(n=>n instanceof HTMLElement&&(n.matches("input, textarea, select")||n.isContentEditable));if(e.key==="Escape")this._selected=null;else if(!i&&(e.key==="Delete"||e.key==="Backspace")&&this._selected!==null)this.deletePoint(this._selected),this.focus();else if(!i&&e.code==="Space"&&!e.repeat&&!t.some(n=>n instanceof HTMLElement&&n.matches("button, a")))this.addPoint();else return;e.preventDefault(),e.stopPropagation()};this.dragActivation=null;this.dragTarget=null;this.reorderAnimation=0;this.language="en",this._undo=[],this._redo=[],this._tab="profiles",this._profileId="",this._selected=null,this._snap=15,this._issues=[],this._message=null,this._saving=!1,this._conflict=!1,this._month="",this._holidays={}}connectedCallback(){super.connectedCallback(),window.addEventListener("beforeunload",this.onBeforeUnload),this.tabIndex=0,this.addEventListener("keydown",this.onPointKeyDown)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("beforeunload",this.onBeforeUnload),this.removeEventListener("keydown",this.onPointKeyDown),clearTimeout(this.messageTimer),clearTimeout(this.dragStartTimer)}willUpdate(e){e.has("language")&&(this.t=P(this.language)),e.has("data")&&this.data&&!this._saving&&(this._draft?(this.data.revision!==this._baseRevision||JSON.stringify(e.get("data")?.config)!==JSON.stringify(this.data.config))&&(this.dirty?this._conflict=!0:this.resetTo(this.data)):this.resetTo(this.data)),(e.has("_draft")||e.has("_month")||e.has("data"))&&(this._calendar=null),this._month||(this._month=`${X(new Date).slice(0,8)}01`)}updated(e){(e.has("_tab")||e.has("_month")||e.has("_draft")||e.has("data"))&&this._tab==="week"&&(this.loadHolidays(this._month),this.loadCalendar()),(e.has("_draft")||e.has("_base"))&&this.dispatchEvent(new CustomEvent("dirty-changed",{detail:{dirty:this.dirty},bubbles:!0,composed:!0}))}resetTo(e){this._base=w(e.schedule),this._draft=w(e.schedule),this._baseRevision=e.revision,this._undo=[],this._redo=[],this._issues=[],this._conflict=!1,this._profileId in this._draft.profiles||(this._profileId=Object.keys(this._draft.profiles)[0]??"",this._selected=null);let t=this._draft.profiles[this._profileId]?.points??[];this._selected!==null&&this._selected>=t.length&&(this._selected=null)}get dirty(){return this._draft!==void 0&&JSON.stringify(this._draft)!==JSON.stringify(this._base)}change(e){let t=w(this._draft);e(t),JSON.stringify(t)!==JSON.stringify(this._draft)&&(this._undo=[...this._undo,this._draft].slice(-Di),this._redo=[],this._draft=t,this._issues=[])}undo(){let e=this._undo[this._undo.length-1];e&&(this._redo=[...this._redo,this._draft],this._undo=this._undo.slice(0,-1),this._draft=e,this.fixSelection())}redo(){let e=this._redo[this._redo.length-1];e&&(this._undo=[...this._undo,this._draft],this._redo=this._redo.slice(0,-1),this._draft=e,this.fixSelection())}discard(e=!0){e&&this.dirty&&!window.confirm(this.t("editor.confirm_discard"))||(this.resetTo(this.data),this._draft=w(this._base))}fixSelection(){this._profileId in this._draft.profiles||(this._profileId=Object.keys(this._draft.profiles)[0]??"",this._selected=null);let e=this._draft.profiles[this._profileId]?.points.length??0;this._selected!==null&&this._selected>=e&&(this._selected=null)}confirmLeave(){return this.dirty?window.confirm(this.t("editor.confirm_leave"))?(this.discard(!1),!0):!1:!0}showMessage(e,t=4e3){this._message=e,clearTimeout(this.messageTimer),t>0&&(this.messageTimer=setTimeout(()=>this._message=null,t))}async save(){let e=Ft(this._draft,this.data.config.min,this.data.config.max,this.config.axis);if(e.length){this._issues=e,this.showMessage({kind:"error",text:this.t("editor.fix_errors")},0);return}this._saving=!0;try{let t=await De(this.hass,this.data.entry_id,this._baseRevision,this._draft);t.ok?(this._base=w(this._draft),this._baseRevision=t.revision,this._undo=[],this._redo=[],this._issues=[],this._conflict=!1,this.showMessage({kind:"success",text:this.t("editor.saved")})):t.conflict?this._conflict=!0:(this._issues=t.errors,this.showMessage({kind:"error",text:this.t("editor.fix_errors")},0))}catch(t){this.showMessage({kind:"error",text:this.t("card.connection_error",{message:t.message??t})},0)}finally{this._saving=!1}}reloadAfterConflict(){this.resetTo(this.data),this._message=null}get config(){return this.data.config}get profile(){return this._draft.profiles[this._profileId]}valueLabel(){return Mi.includes(this.config.unit??"")?this.t("point.value"):this.t("point.value_generic")}fmt(e){return V(e,this.config.step,this.config.unit,this.language)}normalizeValue(e){let{min:t,max:i,step:n}=this.config;return y(R(y(e,t,i),n),t,i)}describeIssue(e){let t=`error.${e.code}`,i={...e.params};typeof i.value=="number"&&(i.value=this.fmt(i.value)),typeof i.min=="number"&&e.code==="value_out_of_range"&&(i.min=this.fmt(i.min),i.max=this.fmt(i.max)),Array.isArray(i.usages)&&(i.usages=this.describeUsages(i.usages));let n=Lt(t)?this.t(t,i):this.t("error.unknown",{code:e.code}),r=/^profiles\.([^.]+)/.exec(e.path),l=r?this._draft.profiles[r[1]]:void 0;return l&&e.code!=="profile_in_use"?`${l.name}: ${n}`:n}describeUsages(e){return e.map(t=>{if(t.startsWith("week."))return this.t(`week.day.${t.slice(5)}`);if(t==="fallback_profile")return this.t("usage.fallback_profile");if(t==="holiday_profile")return this.t("usage.holiday_profile");let i=Number(t.split(".")[1]);return t.startsWith("activations.")?this.t("usage.activation",{number:i+1}):this._draft.exceptions[i]?.note||this.t("usage.exception",{number:i+1})}).join(", ")}issuesFor(e){return this._issues.filter(t=>t.path===e||t.path.startsWith(`${e}.`))}selectProfile(e){this._profileId=e,this._selected=null}addProfile(){if(Object.keys(this._draft.profiles).length>=se)return;let e=this.t("profiles.new_name"),t=new Set(Object.values(this._draft.profiles).map(r=>r.name.toLowerCase()));for(let r=2;t.has(e.toLowerCase());r++)e=`${this.t("profiles.new_name")} ${r}`;let i=rt(this._draft,e),n=this.normalizeValue((this.config.min+this.config.max)/2);this.change(r=>{r.profiles[i]={name:e,color:ot(r),points:[{t:"06:00",v:n}],...this.config.axis&&this.config.axis.source!=="time_of_day"?{curve:[{x:this.config.axis.min,v:n}]}:{}}}),this.selectProfile(i)}duplicateProfile(){let e=this.profile;if(!e||Object.keys(this._draft.profiles).length>=se)return;let t=`${e.name} ${this.t("profiles.copy_suffix")}`.slice(0,Y),i=new Set(Object.values(this._draft.profiles).map(r=>r.name.toLowerCase()));for(let r=2;i.has(t.toLowerCase());r++)t=`${e.name} ${r}`.slice(0,Y);let n=rt(this._draft,t);this.change(r=>{r.profiles[n]={...w(e),name:t,color:ot(r)}}),this.selectProfile(n)}deleteProfile(){let e=this.profile;if(!e)return;if(Object.keys(this._draft.profiles).length<=1){this.showMessage({kind:"warning",text:this.t("profiles.last")});return}let t=Vt(this._draft,this._profileId);if(t.length){this.showMessage({kind:"warning",text:this.t("profiles.in_use",{name:e.name,usages:this.describeUsages(t)})},8e3);return}if(!window.confirm(this.t("profiles.confirm_delete",{name:e.name})))return;let i=this._profileId;this.change(n=>{delete n.profiles[i]}),this.selectProfile(Object.keys(this._draft.profiles)[0])}renameProfile(e){let t=this._profileId;this.change(i=>{i.profiles[t].name=e.slice(0,Y)})}recolorProfile(e){let t=this._profileId;this.change(i=>{i.profiles[t].color=e})}copyCurveFrom(e){let t=this._draft.profiles[e],i=this.profile;if(!t||!i||e===this._profileId||!window.confirm(this.t("profiles.confirm_copy",{target:i.name,source:t.name})))return;let n=this._profileId;this.change(r=>{this.config.axis&&this.config.axis.source!=="time_of_day"?r.profiles[n].curve=w(t.curve??[]):r.profiles[n].points=w(t.points)}),this._selected=null}setPoints(e,t){let i=this._profileId;this.change(n=>{n.profiles[i].points=ge(e)}),this._selected=t}addPoint(){let e=this.profile;if(!e)return;if(e.points.length>=C){this.showMessage({kind:"warning",text:this.t("point.full",{max:C})});return}let t=Wt(e.points);if(t===void 0)return;let i=this.renderRoot.querySelector("curve-scheduler-curve"),n=this.normalizeValue(i?.curveValue(t)??(this.config.min+this.config.max)/2),r=w(e.points),l=at(r,{t:H(t),v:n});this.setPoints(r,l)}deletePoint(e){let t=this.profile;if(!t)return;if(t.points.length<=1){this.showMessage({kind:"warning",text:this.t("point.min")});return}let i=w(t.points);i.splice(e,1),this.setPoints(i,null)}setPointTime(e,t){let i=this.profile;if(!i||!/^\d{1,2}:\d{2}/.test(t)){this.requestUpdate();return}let n=S(t.slice(0,5));n=Math.round(n/k)*k,n>=1440&&(n=1440-k);let r=H(n);if(i.points.some((u,c)=>c!==e&&u.t===r)){this.showMessage({kind:"warning",text:this.t("point.taken",{time:r})}),this.requestUpdate();return}let l=w(i.points),[a]=l.splice(e,1),d=at(l,{...a,t:r});this.setPoints(l,d)}setPointValue(e,t){let i=this.profile;if(!i||Number.isNaN(t)){this.requestUpdate();return}let n=w(i.points);n[e]={...n[e],v:this.normalizeValue(t)},this.setPoints(n,e)}nudgePoint(e,t){let i=this.profile?.points[e];i&&this.setPointValue(e,i.v+t*this.config.step)}activationRects(){return new Map([...this.renderRoot.querySelectorAll(".activation")].map(e=>[Number(e.dataset.index),e.getBoundingClientRect()]))}async animateActivations(e,t=i=>i){let i=++this.reorderAnimation;if(await this.updateComplete,!(i!==this.reorderAnimation||window.matchMedia("(prefers-reduced-motion: reduce)").matches))for(let[n,r]of e){let l=this.renderRoot.querySelector(`.activation[data-index="${t(n)}"]`);if(!l)continue;l.getAnimations?.().forEach(u=>u.cancel());let a=l.getBoundingClientRect(),d=r.top-a.top;d&&l.animate?.([{transform:`translateY(${d}px)`},{transform:"translateY(0)"}],{duration:220,easing:"cubic-bezier(.2,.8,.2,1)"})}}moveActivation(e,t){if(e===t||t<0||t>=(this._draft.activations?.length??0))return;let i=this.activationRects();this.change(n=>{let r=n.activations;r.splice(t,0,r.splice(e,1)[0])}),this.animateActivations(i,n=>n===e?t:e<t&&n>e&&n<=t?n-1:e>t&&n>=t&&n<e?n+1:n)}previewActivation(e,t){if(this.dragActivation===null||(e.preventDefault(),e.dataTransfer&&(e.dataTransfer.dropEffect="move"),t=Math.max(0,Math.min(t,this._draft.activations.length-1)),t===this.dragTarget))return;let i=this.activationRects();this.dragTarget=t,this.animateActivations(i)}finishActivationDrag(e){clearTimeout(this.dragStartTimer);let t=this.dragActivation,i=this.dragTarget;if(t===null)return;let n=this.activationRects();this.dragActivation=null,this.dragTarget=null,e&&i!==null&&t!==i?(this.change(r=>{r.activations.splice(i,0,r.activations.splice(t,1)[0])}),this.animateActivations(n,r=>r===t?i:t<i&&r>t&&r<=i?r-1:t>i&&r>=i&&r<t?r+1:r)):this.animateActivations(n)}updateActivation(e,t){this.change(i=>{Object.assign(i.activations[e],t)})}today(){return this.data.state.now.slice(0,10)}addException(){let e=this.today(),t=Object.keys(this._draft.profiles).find(i=>/urlaub|holiday|vacation|day_off/i.test(i))??Object.keys(this._draft.profiles)[0];this.change(i=>{i.exceptions.push({from:e,to:ze(e,6),profile:t,note:this.t("holiday.note_default")})})}updateException(e,t,i){this.change(n=>{let r=n.exceptions[e];r[t]=t==="note"?i.slice(0,fe):i,t==="from"&&r.to<i&&(r.to=i)})}deleteException(e){this.change(t=>{t.exceptions.splice(e,1)})}removePastExceptions(){let e=this.today();this.change(t=>{t.exceptions=t.exceptions.filter(i=>i.to>=e)})}async loadHolidays(e){if(!this.hass)return;let t=J(e),i=X(new Date(t.getFullYear(),t.getMonth()+1,0,12)),n=new Set((this._draft.activations??[]).filter(r=>r.type==="holiday").map(r=>r.source).filter(r=>!!r));for(let r of n){let l=`${e}/${r}`;if(!this._holidays[l])try{let a=await It(this.hass,this.data.entry_id,e,i,r);this._holidays={...this._holidays,[l]:new Set(a.holidays)}}catch{this._holidays={...this._holidays,[l]:new Set}}}}shiftMonth(e){let t=J(this._month);this._month=X(new Date(t.getFullYear(),t.getMonth()+e,1,12))}profileOptions(e){return Object.entries(this._draft.profiles).map(([t,i])=>h`<option value=${t} ?selected=${t===e}>${i.name}</option>`)}renderTabs(){return h`<div class="tabs" role="tablist">
      ${[["profiles","editor.tab.profiles"],["week","editor.tab.week"],["exceptions","editor.tab.exceptions"]].map(([t,i])=>h`<button
            role="tab"
            class="tab ${this._tab===t?"active":""}"
            aria-selected=${this._tab===t}
            @click=${()=>this._tab=t}
          >
            ${this.t(i)}
          </button>`)}
    </div>`}renderProfileChips(){return h`<div class="chips" role="tablist">
      ${Object.entries(this._draft.profiles).map(([e,t])=>h`<button
            class="chip ${e===this._profileId?"active":""}"
            role="tab"
            aria-selected=${e===this._profileId}
            style="--chip-color: ${t.color}"
            @click=${()=>this.selectProfile(e)}
          >
            <span class="swatch" style="background: ${t.color}"></span>${t.name||"\u2026"}
          </button>`)}
      <button
        class="chip add"
        ?disabled=${Object.keys(this._draft.profiles).length>=se}
        @click=${()=>this.addProfile()}
      >
        + ${this.t("profiles.add")}
      </button>
    </div>`}renderProfileSettings(e){return h`<div class="profile-settings">
      <label class="field grow">
        ${this.t("profiles.name")}
        <input
          type="text"
          .value=${e.name}
          maxlength=${Y}
          @change=${t=>this.renameProfile(t.target.value)}
        />
      </label>
      <div class="field">
        <span class="muted">${this.t("profiles.color")}</span>
        <div class="colors" role="radiogroup" aria-label=${this.t("profiles.color")}>
          ${Oe.map(t=>h`<button
                class="color ${e.color.toLowerCase()===t?"active":""}"
                role="radio"
                aria-checked=${e.color.toLowerCase()===t}
                aria-label=${t}
                style="background: ${t}"
                @click=${()=>this.recolorProfile(t)}
              ></button>`)}
        </div>
      </div>
      <div class="row">
        <label class="check"><input type="checkbox" class="apply-offset"
          .checked=${e.apply_offset!==!1}
          @change=${t=>{let i=t.target.checked;this.change(n=>{n.profiles[this._profileId].apply_offset=i})}}>${this.language.startsWith("de")?"Versatz anwenden":"Apply offset"}</label>
        <button @click=${()=>this.duplicateProfile()}>${this.t("profiles.duplicate")}</button>
        <button class="danger" @click=${()=>this.deleteProfile()}>
          ${this.t("profiles.delete")}
        </button>
      </div>
    </div>`}renderSelectedPoint(e){let t=this._selected;if(t===null||!e.points[t])return p;let i=e.points[t];return h`<div class="selected-point" aria-live="polite">
      <div class="muted">${this.t("point.selected")}</div>
      <div class="row">
        <label class="field">
          ${this.t("point.time")}
          <input
            type="time"
            step="300"
            .value=${i.t}
            @change=${n=>this.setPointTime(t,n.target.value)}
          />
        </label>
        ${this.renderValueInput(t,i)}
        <button class="danger" @click=${()=>this.deletePoint(t)}>
          ${this.t("point.delete")}
        </button>
      </div>
    </div>`}renderPlainValueInput(e,t){return h`<input
      class="value"
      type="text"
      inputmode="decimal"
      aria-label=${this.valueLabel()}
      .value=${F(t.v,this.config.step,this.language)}
      @change=${i=>this.setPointValue(e,tt(i.target.value))}
    />`}renderValueInput(e,t,i=!0){let n=h`<div class="stepper">
      <button
        class="icon"
        aria-label=${this.t("point.minus")}
        @click=${()=>this.nudgePoint(e,-1)}
      >
        −
      </button>
      <input
        class="value"
        type="text"
        inputmode="decimal"
        aria-label=${this.valueLabel()}
        .value=${F(t.v,this.config.step,this.language)}
        @change=${r=>this.setPointValue(e,tt(r.target.value))}
      />
      <button
        class="icon"
        aria-label=${this.t("point.plus")}
        @click=${()=>this.nudgePoint(e,1)}
      >
        +
      </button>
    </div>`;return i?h`<div class="field">
          <span class="muted">${this.valueLabel()}${this.config.unit?` (${this.config.unit})`:""}</span>
          ${n}
        </div>`:n}renderPointTable(e){return h`<table class="points">
        <caption class="muted">
          ${this.t("point.table")}
        </caption>
        <thead>
          <tr>
            <th>${this.t("point.time")}</th>
            <th>${this.valueLabel()}${this.config.unit?` (${this.config.unit})`:""}</th>
            <th><span class="sr-only">${this.t("point.delete")}</span></th>
          </tr>
        </thead>
        <tbody>
          ${e.points.map((t,i)=>h`<tr
                class=${i===this._selected?"selected":""}
                data-index=${i}
                @focusin=${()=>this._selected=i}
              >
                <td>
                  <input
                    type="time"
                    step="300"
                    aria-label=${this.t("point.time")}
                    .value=${t.t}
                    @change=${n=>this.setPointTime(i,n.target.value)}
                  />
                </td>
                <td>${this.renderPlainValueInput(i,t)}</td>
                <td>
                  <button
                    class="icon flat delete"
                    aria-label=${this.t("point.delete")}
                    title=${this.t("point.delete")}
                    ?disabled=${e.points.length<=1}
                    @click=${()=>this.deletePoint(i)}
                  >
                    🗑
                  </button>
                </td>
              </tr>`)}
        </tbody>
      </table>
      <button
        class="add-point"
        ?disabled=${e.points.length>=C}
        @click=${()=>this.addPoint()}
      >
        ${this.t("point.add")}
      </button>`}renderProfilesTab(){let e=this.profile;if(!e)return this.renderProfileChips();if(this.config.axis&&this.config.axis.source!=="time_of_day")return h`${this.renderProfileChips()} ${this.renderProfileSettings(e)}
        ${this.issuesFor(`profiles.${this._profileId}`).map(i=>h`<div class="notice error">${this.describeIssue(i)}</div>`)}
        <curve-scheduler-numeric-editor .hass=${this.hass} .data=${this.data} .language=${this.language}
          style=${`--plan-color: ${e.color}`} .saving=${this._saving} .embedded=${!0} .editable=${!0} .editing=${!0} .points=${e.curve??[]}
          @numeric-points-changed=${i=>this.change(n=>{n.profiles[this._profileId].curve=i.detail})}
        ></curve-scheduler-numeric-editor>${this.renderCopyCurve()}`;let t=this.issuesFor(`profiles.${this._profileId}`);return h`
      ${this.renderProfileChips()} ${this.renderProfileSettings(e)}
      ${t.length?h`<div class="notice error">
            ${t.map(i=>h`<div>${this.describeIssue(i)}</div>`)}
          </div>`:p}
      <div class="chart-wrapper">
        <curve-scheduler-curve
          editable
          .points=${e.points}
          .context=${null}
          .mode=${this.config.interpolation}
          .min=${this.config.min}
          .max=${this.config.max}
          .step=${this.config.step}
        .xLabelStep=${this.config.x_label_step??0}
        .yLabelStep=${this.config.y_label_step??0}
          .unit=${this.config.unit}
          .language=${this.language}
          .color=${e.color}
          .snapMinutes=${this._snap}
          .selected=${this._selected}
          @points-changed=${i=>this.setPoints(i.detail.points,i.detail.selected)}
          @point-selected=${i=>this._selected=i.detail.index}
          @curve-notice=${i=>this.showMessage({kind:"warning",text:this.t(i.detail.key,i.detail.params)})}
        ></curve-scheduler-curve>
      </div>
      <div class="row chart-footer">
        <span class="muted grow">${this.t("profiles.hint")}</span>
        <label class="field inline">
          ${this.t("profiles.snap")}
          <select
            @change=${i=>this._snap=Number(i.target.value)}
          >
            ${Ii.map(i=>h`<option value=${i} ?selected=${i===this._snap}>
                  ${this.t("profiles.snap_minutes",{minutes:i})}
                </option>`)}
          </select>
        </label>
      </div>
      ${this.renderSelectedPoint(e)}
      ${Re(e.points,this._selected,this.hass,this.language,i=>this.setPoints(i,this._selected))}
      ${this.renderPointTable(e)}
      ${this.renderCopyCurve()}
    `}renderCopyCurve(){let e=Object.entries(this._draft.profiles).filter(([t])=>t!==this._profileId);return h`      ${e.length?h`<div class="row copy">
            <label class="field grow">
              ${this.t("profiles.copy_from")}
              <select id="copy-source">
                ${e.map(([t,i])=>h`<option value=${t}>${i.name}</option>`)}
              </select>
            </label>
            <button
              class="copy-button"
              @click=${()=>this.copyCurveFrom(this.renderRoot.querySelector("#copy-source").value)}
            >
              ${this.t("profiles.copy")}
            </button>
          </div>`:p}`}renderWeekTab(){let e=this._draft.activations??[],t=e.map((n,r)=>({entry:n,index:r}));this.dragActivation!==null&&this.dragTarget!==null&&t.splice(this.dragTarget,0,t.splice(this.dragActivation,1)[0]);let i=(n,r)=>this.language.startsWith("de")?r:n;return h`<h3>${this.t("editor.tab.week")}</h3>
      ${(this._draft.activations??[]).some(n=>n.type==="condition")?h`<p class="muted">${i("Entity conditions use live states. Calendar predictions use current entity states; future entity states cannot be predicted.","Entit\xE4tsbedingungen verwenden aktuelle Zust\xE4nde. Die Kalendervorschau verwendet aktuelle Entit\xE4tszust\xE4nde; zuk\xFCnftige Zust\xE4nde sind nicht vorhersagbar.")}</p>`:p}
      <p class="muted">${i("Entries are alternatives: the first matching entry wins. To require an entity value AND weekdays, combine them inside one AND group. If no entry matches, the selected fallback plan is used. Exceptions override activations.","Eintr\xE4ge sind Alternativen: Der erste passende Eintrag gilt. Entit\xE4tswert UND Wochentage in einer UND-Gruppe kombinieren. Ohne Treffer gilt der ausgew\xE4hlte R\xFCckfallplan. Ausnahmen haben Vorrang.")}</p>
      <label class="field">${i("Fallback plan","R\xFCckfallplan")}
        <select class="fallback-plan" .value=${this._draft.fallback_profile??Object.keys(this._draft.profiles)[0]}
          @change=${n=>this.change(r=>{r.fallback_profile=n.target.value})}>
          ${this.profileOptions(this._draft.fallback_profile??Object.keys(this._draft.profiles)[0])}
        </select>
      </label>
      <div class="activation-list ${this.dragActivation!==null?"dragging":""}"
        @dragover=${n=>{this.dragActivation!==null&&n.preventDefault()}}
        @drop=${n=>{n.preventDefault(),this.finishActivationDrag(!0)}}>
      ${Zt(e.map((n,r)=>({entry:n,index:r})),n=>n.index,({entry:n,index:r})=>{let l=t.findIndex(a=>a.index===r);return h`
        ${this.renderActivationDropZone(l)}
        <div class="activation ${r===this.dragActivation?"drag-preview":""}" data-index=${r} style=${`order: ${l*2+1}`} draggable="true"
        @dragstart=${a=>{clearTimeout(this.dragStartTimer),this.dragStartTimer=setTimeout(()=>{this.dragActivation=r,this.dragTarget=r},0),a.dataTransfer&&(a.dataTransfer.effectAllowed="move",a.dataTransfer.setData("text/plain",String(r)))}}
        @dragover=${a=>{if(r===this.dragActivation){a.preventDefault();return}let d=a.currentTarget.getBoundingClientRect(),u=l-(this.dragTarget!==null&&this.dragTarget<l?1:0);this.previewActivation(a,u+(a.clientY>d.top+d.height/2?1:0))}}
        @dragend=${()=>this.finishActivationDrag(!1)}>
        <div class="row">
          <label class="field grow">${i("Condition","Bedingung")}
            <select .value=${n.type} @change=${a=>this.updateActivation(r,{type:a.target.value,days:["mon"],source:"",condition:{condition:"state",entity_id:"",state:""}})}>
              <option value="weekday">${i("Day of the week","Wochentag")}</option>
              <option value="holiday">${i("Holiday calendar","Feiertagskalender")}</option>
              <option value="condition">${i("Custom condition","Benutzerdefinierte Bedingung")}</option>
            </select>
          </label>
          <label class="field grow">${i("Target plan","Zielplan")}
            <select @change=${a=>this.updateActivation(r,{profile:a.target.value})}>${this.profileOptions(n.profile)}</select>
          </label>
        </div>
        ${n.type==="weekday"?h`<div class="field weekday-field">
          <span id=${`weekday-label-${r}`}>${i("Days of the week","Wochentage")}</span>
          <details class="weekday-select">
            <summary aria-labelledby=${`weekday-label-${r} weekday-summary-${r}`}>
              <span id=${`weekday-summary-${r}`}>${T.filter(a=>(n.days??[n.day]).includes(a)).map(a=>this.t(`week.day.${a}`)).join(", ")||i("Select weekdays","Wochentage ausw\xE4hlen")}</span>
            </summary>
            <div class="weekday-options" role="group" aria-labelledby=${`weekday-label-${r}`}>
              ${T.map(a=>h`<label class="check">
                <input type="checkbox" .checked=${(n.days??[n.day]).includes(a)}
                  @change=${d=>{let u=new Set(n.days??(n.day?[n.day]:[]));d.target.checked?u.add(a):u.delete(a),this.updateActivation(r,{days:T.filter(c=>u.has(c))})}}>${this.t(`week.day.${a}`)}
              </label>`)}
            </div>
          </details>
        </div>`:n.type==="condition"?this.renderEntityCondition(r,n):h`<label class="field">${i("Calendar or Workday binary sensor (off = day off)","Kalender oder Workday-Bin\xE4rsensor (aus = freier Tag)")}
            <ha-entity-picker .hass=${this.hass} .value=${n.source??""} .includeDomains=${["calendar","binary_sensor"]} allow-custom-entity
              @value-changed=${a=>this.updateActivation(r,{source:a.detail.value??""})}></ha-entity-picker>
          </label>`}
        <div class="row">
          <button aria-label=${i("Move activation up","Aktivierung nach oben")} ?disabled=${r===0} @click=${()=>this.moveActivation(r,r-1)}>↑</button>
          <button aria-label=${i("Move activation down","Aktivierung nach unten")} ?disabled=${r===e.length-1} @click=${()=>this.moveActivation(r,r+1)}>↓</button>
          <button @click=${()=>this.change(a=>{a.activations.splice(r,1)})}>${i("Delete","L\xF6schen")}</button>
        </div>
      </div>`})}
      ${this.renderActivationDropZone(e.length)}
      </div>
      <button ?disabled=${e.length>=200} @click=${()=>this.change(n=>{(n.activations??=[]).push({type:"weekday",days:["mon"],profile:Object.keys(n.profiles)[0]})})}>${i("Add activation","Aktivierung hinzuf\xFCgen")}</button>${this.renderMonth()}`}renderEntityCondition(e,t){return this.renderConditionNode(t.condition??{condition:"state",entity_id:"",state:""},i=>this.updateActivation(e,{condition:i}))}renderConditionNode(e,t){let i=(a,d)=>this.language.startsWith("de")?d:a,n=a=>t({...e,...a}),r=String(e.condition??"state"),l=h`<label class="field">${i("Condition type","Bedingungstyp")}
      <select aria-label=${i("Condition type","Bedingungstyp")} .value=${r} @change=${a=>{let d=a.target.value;t(d==="state"?{condition:d,entity_id:"",state:""}:d==="numeric_state"?{condition:d,entity_id:e.entity_id??"",above:0}:d==="curve_scheduler_month"?{condition:d,months:[1]}:d==="time"?{condition:d,after:"08:00:00",before:"18:00:00"}:d==="curve_scheduler_weekday"?{condition:d,days:["mon"]}:d==="curve_scheduler_holiday"?{condition:d,source:""}:{condition:d,conditions:["and","or","not"].includes(r)?e.conditions:[e]})}}>
        <option value="state">${i("Entity state (exact text)","Entit\xE4tszustand (exakter Text)")}</option>
        <option value="numeric_state">${i("Numeric value","Numerischer Wert")}</option>
        <option value="curve_scheduler_month">${i("Month of year","Monat im Jahr")}</option>
        <option value="time">${i("Time of day","Tageszeit")}</option>
        <option value="curve_scheduler_weekday">${i("Weekday","Wochentag")}</option>
        <option value="curve_scheduler_holiday">${i("Holiday","Feiertag")}</option>
        <option value="and">AND</option><option value="or">OR</option><option value="not">NOT</option>
      </select></label>`;if(["and","or","not"].includes(r)){let a=e.conditions??[];return h`<fieldset class="condition-group"><legend>${i(r==="and"?"All conditions must match":r==="or"?"At least one condition must match":"None of these conditions may match",r==="and"?"Alle Bedingungen m\xFCssen zutreffen":r==="or"?"Mindestens eine Bedingung muss zutreffen":"Keine dieser Bedingungen darf zutreffen")}</legend>${l}${a.map((d,u)=>h`<fieldset class="condition-child">
        ${this.renderConditionNode(d,c=>n({conditions:a.map((f,m)=>m===u?c:f)}))}
        <button @click=${()=>n({conditions:a.filter((c,f)=>f!==u)})}>${i("Remove condition","Bedingung entfernen")}</button>
      </fieldset>`)}<button @click=${()=>n({conditions:[...a,{condition:"state",entity_id:"",state:""}]})}>${i("Add condition","Bedingung hinzuf\xFCgen")}</button></fieldset>`}return r==="curve_scheduler_month"?h`<div class="condition-fields">${l}<div class="row">${Array.from({length:12},(a,d)=>d+1).map(a=>h`<label class="check"><input type="checkbox" .checked=${(e.months??[]).includes(a)} @change=${d=>{let u=new Set(e.months??[]);d.target.checked?u.add(a):u.delete(a),n({months:[...u].sort((c,f)=>c-f)})}}>${new Intl.DateTimeFormat(this.language,{month:"short",timeZone:"UTC"}).format(new Date(Date.UTC(2024,a-1,1)))}</label>`)}</div></div>`:r==="time"?h`<div class="condition-fields">${l}<div class="row">${["after","before"].map(a=>h`<label class="field grow">${i(a==="after"?"After (inclusive)":"Before (exclusive)",a==="after"?"Ab (einschlie\xDFlich)":"Bis (ausschlie\xDFlich)")}<input type="time" step="1" .value=${String(e[a]??"")} @change=${d=>{let u={...e},c=d.target.value;c?u[a]=c:delete u[a],t(u)}}></label>`)}</div><p class="muted">${i("Home Assistant local time. Overnight ranges are supported; evaluated at each output update.","Lokale Home-Assistant-Zeit. Zeitr\xE4ume \xFCber Mitternacht sind m\xF6glich; Auswertung bei jeder Ausgangsaktualisierung.")}</p></div>`:r==="curve_scheduler_weekday"?h`${l}<div class="row">${T.map(a=>h`<label class="check"><input type="checkbox" .checked=${(e.days??[]).includes(a)} @change=${d=>{let u=new Set(e.days??[]);d.target.checked?u.add(a):u.delete(a),n({days:T.filter(c=>u.has(c))})}}>${this.t(`week.day.${a}`)}</label>`)}</div>`:r==="curve_scheduler_holiday"?h`${l}<ha-entity-picker .hass=${this.hass} .value=${e.source??""} .includeDomains=${["calendar","binary_sensor"]} @value-changed=${a=>n({source:a.detail.value??""})}></ha-entity-picker>`:r==="numeric_state"?h`<div class="condition-fields">${l}
      <label class="field">${i("Entity","Entit\xE4t")}<ha-entity-picker .hass=${this.hass} .value=${e.entity_id??""} @value-changed=${a=>n({entity_id:a.detail.value??""})}></ha-entity-picker></label>
      <label class="field">${i("Attribute (optional)","Attribut (optional)")}<input .value=${String(e.attribute??"")} @change=${a=>{let d={...e},u=a.target.value.trim();u?d.attribute=u:delete d.attribute,t(d)}}></label>
      <div class="row">${["above","below"].map(a=>h`<label class="field grow">${i(a==="above"?"Above (exclusive)":"Below (exclusive)",a==="above"?"Gr\xF6\xDFer als (exklusiv)":"Kleiner als (exklusiv)")}
        <input type="number" step="any" .value=${String(e[a]??"")} @change=${d=>{let u={...e},c=d.target.value;c.trim()?u[a]=Number(c):delete u[a],t(u)}}></label>`)}</div>
      <p class="muted">${i("Set at least one bound. Equal values are excluded. Both bounds must match.","Mindestens eine Grenze angeben. Gleiche Werte sind ausgeschlossen. Beide Grenzen m\xFCssen zutreffen.")}</p>
    </div>`:h`<div class="condition-fields" @dragstart=${a=>a.stopPropagation()}>${l}
      <label class="field">${i("Entity","Entit\xE4t")}
        <ha-entity-picker .hass=${this.hass} .value=${e.entity_id??""} allow-custom-entity
          @value-changed=${a=>n({entity_id:a.detail.value??""})}></ha-entity-picker>
      </label>
      <label class="field">${i("Attribute (optional)","Attribut (optional)")}
        <input .value=${String(e.attribute??"")} @change=${a=>{let d={...e},u=a.target.value.trim();u?d.attribute=u:delete d.attribute,t(d)}}>
      </label>
      ${e.attribute?h`<label class="field">${i("Value type","Werttyp")}
        <select .value=${typeof e.state} @change=${a=>{let d=a.target.value;n({state:d==="number"?Number(e.state)||0:d==="boolean"?e.state===!0||e.state==="true":String(e.state??"")})}}><option value="string">${i("Text","Text")}</option><option value="number">${i("Number","Zahl")}</option><option value="boolean">${i("Boolean","Wahrheitswert")}</option></select>
      </label>`:p}
      <label class="field">${i("Expected value","Erwarteter Wert")}
        <input .value=${String(e.state??"")} @change=${a=>{let d=a.target.value;n({state:typeof e.state=="boolean"?d==="true":typeof e.state=="number"?Number(d):d})}}>
      </label>
    </div>`}renderActivationDropZone(e){let t=this.language.startsWith("de")?"Hier ablegen":"Drop here";return h`<div style=${`order: ${e*2}`} class="activation-drop-zone ${this.dragTarget===e?"active":""}"
      @dragenter=${i=>this.previewActivation(i,e)}
      @dragover=${i=>this.previewActivation(i,e)}>${t}</div>`}async loadCalendar(){let e=++this.calendarRequest,t=w(this._draft),i=this._month,n=J(i),r=X(new Date(n.getFullYear(),n.getMonth()+1,0,12));try{let l=await this.hass.callWS({type:"curve_scheduler/calendar",entry_id:this.data.entry_id,start:i,end:r,schedule:t});if(e!==this.calendarRequest||i!==this._month||JSON.stringify(t)!==JSON.stringify(this._draft))return;this._calendar=l?.ok?Object.fromEntries(l.days.map(a=>[a.date,a])):null}catch{e===this.calendarRequest&&(this._calendar=null)}}renderMonth(){let e=J(this._month),t=e.getFullYear(),i=e.getMonth(),n=new Date(t,i+1,0).getDate(),r=(e.getDay()+6)%7,l=this.today(),a=new Intl.DateTimeFormat(this.language,{month:"long",year:"numeric"}).format(e),d=T.map((c,f)=>new Intl.DateTimeFormat(this.language,{weekday:"short"}).format(new Date(2024,0,1+f,12))),u=[];for(let c=0;c<r;c++)u.push(h`<div class="cell empty"></div>`);for(let c=1;c<=n;c++){let f=X(new Date(t,i,c,12)),m=this._calendar?.[f],g=this._draft.activations?.some(D=>D.type==="condition"),v=m?{profileId:m.profile_id,reason:m.reason}:g?{profileId:"",reason:"pending"}:Ut(this._draft,f,(D,N)=>this._holidays[`${this._month}/${N}`]?.has(D)??!1),b=this._draft.profiles[v.profileId],$=v.reason==="holiday"?"\u2605":v.reason==="exception"?"\u2708":"";u.push(h`<div
          class="cell ${f===l?"today":""}"
          style="--cell-color: ${b?.color??"transparent"}"
          title="${f}: ${b?.name??(this.language.startsWith("de")?"Vorschau noch nicht verf\xFCgbar":"Preview not yet available")}"
        >
          <span class="num">${c}</span><span class="mark">${$}</span>
        </div>`)}return h`<div class="month">
      <div class="month-header">
        <button
          class="icon"
          aria-label=${this.t("week.prev_month")}
          @click=${()=>this.shiftMonth(-1)}
        >
          ‹
        </button>
        <strong>${this.t("week.preview")}: ${a}</strong>
        <button
          class="icon"
          aria-label=${this.t("week.next_month")}
          @click=${()=>this.shiftMonth(1)}
        >
          ›
        </button>
      </div>
      ${!this._calendar&&this._draft.activations?.some(c=>c.type==="condition")?h`<p class="muted" role="status">${this.language.startsWith("de")?"Kalendervorschau noch nicht verf\xFCgbar. Bedingungen m\xFCssen g\xFCltig sein.":"Calendar preview not yet available. Conditions must be valid."}</p>`:p}
      <div class="calendar">
        ${d.map(c=>h`<div class="cell head">${c}</div>`)} ${u}
      </div>
      <div class="legend">
        ${Object.values(this._draft.profiles).map(c=>h`<span class="row"
              ><span class="swatch" style="background: ${c.color}"></span>${c.name}</span
            >`)}
        <span>★ ${this.t("week.legend_holiday")}</span>
        <span>✈ ${this.t("week.legend_exception")}</span>
      </div>
    </div>`}renderExceptionsTab(){let e=this.today(),t=this._draft.exceptions,i=t.some(n=>n.to<e);return h`
      <h3>${this.t("exceptions.title")}</h3>
      ${t.length===0?h`<div class="muted">${this.t("exceptions.empty")}</div>`:p}
      <div class="exceptions">
        ${t.map((n,r)=>{let l=n.to<e,a=n.from<=e&&e<=n.to,d=this.issuesFor(`exceptions.${r}`),u=this._draft.profiles[n.profile]?.color??"transparent";return h`<div
            class="exception ${l?"past":""}"
            style="--row-color: ${u}"
            data-index=${r}
          >
            <div class="row">
              <label class="field">
                ${this.t("exceptions.from")}
                <input
                  type="date"
                  .value=${n.from}
                  @change=${c=>this.updateException(r,"from",c.target.value)}
                />
              </label>
              <label class="field">
                ${this.t("exceptions.to")}
                <input
                  type="date"
                  .value=${n.to}
                  min=${n.from}
                  @change=${c=>this.updateException(r,"to",c.target.value)}
                />
              </label>
              ${l?h`<span class="badge">${this.t("exceptions.past")}</span>`:p}
              ${a?h`<span class="badge active">${this.t("exceptions.active")}</span>`:p}
            </div>
            <div class="row">
              <label class="field grow">
                ${this.t("exceptions.profile")}
                <select
                  @change=${c=>this.updateException(r,"profile",c.target.value)}
                >
                  ${this.profileOptions(n.profile)}
                </select>
              </label>
              <label class="field grow">
                ${this.t("exceptions.note")}
                <input
                  type="text"
                  maxlength=${fe}
                  .value=${n.note??""}
                  @change=${c=>this.updateException(r,"note",c.target.value)}
                />
              </label>
              <button class="danger" @click=${()=>this.deleteException(r)}>
                ${this.t("exceptions.delete")}
              </button>
            </div>
            ${d.length?h`<div class="notice error">
                  ${d.map(c=>h`<div>${this.describeIssue(c)}</div>`)}
                </div>`:p}
          </div>`})}
      </div>
      <div class="row">
        <button class="primary-outline" @click=${()=>this.addException()}>
          ${this.t("exceptions.add")}
        </button>
        ${i?h`<button @click=${()=>this.removePastExceptions()}>
              ${this.t("exceptions.remove_past")}
            </button>`:p}
      </div>
      <label class="check">
        <input
          type="checkbox"
          .checked=${this._draft.auto_cleanup}
          @change=${n=>{let r=n.target.checked;this.change(l=>{l.auto_cleanup=r})}}
        />
        ${this.t("exceptions.auto_cleanup")}
      </label>
    `}renderFooter(){let e=this._issues.filter(t=>!(this._tab==="profiles"&&t.path.startsWith(`profiles.${this._profileId}`))&&!(this._tab==="exceptions"&&t.path.startsWith("exceptions.")));return h`
      ${this._conflict?h`<div class="notice warning row">
            <span class="grow">${this.t("editor.conflict")}</span>
            <button @click=${()=>this.reloadAfterConflict()}>${this.t("editor.reload")}</button>
          </div>`:p}
      ${e.length?h`<div class="notice error">
            ${e.map(t=>h`<div>${this.describeIssue(t)}</div>`)}
          </div>`:p}
      ${this._message?h`<div class="notice ${this._message.kind}" role="status">${this._message.text}</div>`:this.dirty?h`<div class="muted unsaved">${this.t("editor.unsaved")}</div>`:p}
      <div class="footer">
        <button
          class="icon"
          title=${this.t("editor.undo")}
          aria-label=${this.t("editor.undo")}
          ?disabled=${this._undo.length===0}
          @click=${()=>this.undo()}
        >
          ↶
        </button>
        <button
          class="icon"
          title=${this.t("editor.redo")}
          aria-label=${this.t("editor.redo")}
          ?disabled=${this._redo.length===0}
          @click=${()=>this.redo()}
        >
          ↷
        </button>
        <span class="grow"></span>
        <button ?disabled=${!this.dirty||this._saving} @click=${()=>this.discard()}>
          ${this.t("editor.discard")}
        </button>
        <button
          class="primary save"
          ?disabled=${!this.dirty||this._saving}
          @click=${()=>this.save()}
        >
          ${this._saving?this.t("editor.saving"):this.t("editor.save")}
        </button>
      </div>
    `}render(){if(!this._draft)return p;let e;switch(this._tab){case"week":e=this.renderWeekTab();break;case"exceptions":e=this.renderExceptionsTab();break;default:e=this.renderProfilesTab()}let t=(i,n)=>this.language.startsWith("de")?n:i;return h`<div class="row" aria-live="polite">
      <span>${t("Raw curve value","Unver\xE4nderter Kurvenwert")}: ${this.data.state.value??"\u2013"} ${this.config.unit}</span>
      <span>${t("Offset","Versatz")}: ${this.data.state.offset??0} ${this.config.unit}</span>
      <span>${t("Curve value","Kurvenwert")}: ${this.data.state.curve_value??this.data.state.value??"\u2013"} ${this.config.unit}</span>
      ${(this.data.state.offset??0)!==0?h`<button @click=${async()=>{try{await this.hass.callService("curve_scheduler","clear_offset",{config_entry_id:this.data.entry_id})}catch{this.showMessage({kind:"warning",text:t("Could not clear offset. Try again.","Versatz konnte nicht zur\xFCckgesetzt werden. Erneut versuchen.")})}}}>${t("Clear offset","Versatz zur\xFCcksetzen")}</button>`:p}
    </div>${this.renderTabs()}
      <div class="body" role="tabpanel">${e}</div>
      ${this.renderFooter()}`}};be.properties={hass:{attribute:!1},data:{attribute:!1},language:{},_draft:{state:!0},_base:{state:!0},_baseRevision:{state:!0},_undo:{state:!0},_redo:{state:!0},_tab:{state:!0},_profileId:{state:!0},_selected:{state:!0},_snap:{state:!0},_issues:{state:!0},_message:{state:!0},_saving:{state:!0},_conflict:{state:!0},_month:{state:!0},_calendar:{state:!0},_holidays:{state:!0},dragActivation:{state:!0},dragTarget:{state:!0}},be.styles=[M,E`
      :host {
        display: flex;
        flex-direction: column;
        gap: var(--zp-gap);
      }
      .condition-fields { display: grid; gap: 10px; min-width: 0; }
      .condition-group, .condition-child { min-width: 0; margin: 8px 0; padding: 12px; border: 1px solid var(--divider-color); border-radius: 10px; display: grid; gap: 10px; }
      .condition-group { border-left: 3px solid var(--primary-color); }
      .condition-group legend { padding: 0 6px; font-weight: 500; font-size: 14px; }
      .condition-fields ha-entity-picker { display: block; min-width: 0; width: 100%; }
      h3 {
        margin: 4px 0;
        font-size: 16px;
        font-weight: 500;
      }
      .tabs {
        display: flex;
        border-bottom: 1px solid var(--divider-color, rgba(127, 127, 127, 0.3));
        overflow-x: auto;
        scrollbar-width: none;
      }
      .tab {
        flex: 1 1 0;
        min-width: 0;
        padding: 4px 6px;
        line-height: 1.2;
        border: none;
        border-radius: 0;
        background: none;
        border-bottom: 3px solid transparent;
        color: var(--secondary-text-color);
        font-weight: 500;
      }
      .tab.active {
        color: var(--primary-color);
        border-bottom-color: var(--primary-color);
      }
      .body {
        display: flex;
        flex-direction: column;
        gap: var(--zp-gap);
        min-width: 0;
      }
      .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .chip {
        border-radius: 22px;
        border-width: 2px;
      }
      .chip.active {
        border-color: var(--chip-color);
        background: color-mix(in srgb, var(--chip-color) 18%, transparent);
        font-weight: 500;
      }
      .chip.add {
        border-style: dashed;
      }
      .profile-settings {
        display: flex;
        flex-wrap: wrap;
        gap: var(--zp-gap);
        align-items: flex-end;
      }
      .profile-settings .field.grow {
        min-width: 160px;
      }
      .colors {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
      }
      .color {
        width: var(--zp-touch);
        height: var(--zp-touch);
        min-width: 0;
        padding: 0;
        border-radius: 50%;
        border: 3px solid transparent;
      }
      .color.active {
        border-color: var(--primary-text-color);
        box-shadow: inset 0 0 0 3px var(--card-background-color, #fff);
      }
      .chart-wrapper {
        margin: 0 -4px;
      }
      .chart-footer select {
        min-width: 100px;
      }
      .field.inline {
        flex-direction: row;
        align-items: center;
        gap: 8px;
      }
      .selected-point {
        padding: 10px;
        border-radius: var(--zp-radius);
        background: rgba(127, 127, 127, 0.08);
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .selected-point .row {
        align-items: flex-end;
      }
      .stepper {
        display: flex;
        align-items: center;
        gap: 4px;
      }
      .stepper input.value {
        width: 5.5em;
        text-align: center;
      }
      table.points {
        width: 100%;
        border-collapse: collapse;
      }
      table.points caption {
        text-align: left;
        padding-bottom: 4px;
      }
      table.points th {
        text-align: left;
        font-size: 13px;
        font-weight: 500;
        color: var(--secondary-text-color);
        padding: 4px;
      }
      table.points td {
        padding: 4px;
        border-top: 1px solid var(--divider-color, rgba(127, 127, 127, 0.2));
      }
      table.points tr.selected td {
        background: rgba(127, 127, 127, 0.1);
      }
      table.points input[type="time"] {
        width: 100%;
        min-width: 6.5em;
      }
      table.points input.value {
        width: 100%;
        min-width: 4em;
        text-align: center;
      }
      table.points th:last-child,
      table.points td:last-child {
        width: var(--zp-touch);
      }
      .add-point {
        align-self: flex-start;
      }
      .copy {
        align-items: flex-end;
      }
      .week {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .week-row {
        display: flex;
        align-items: center;
        gap: 8px;
        padding-left: 10px;
        border-left: 6px solid var(--row-color);
        border-radius: 4px;
      }
      .week-row .day {
        flex: 0 0 8.5em;
      }
      .week-row select {
        flex: 1 1 auto;
        min-width: 0;
      }
      /* Keep native drag sources attached; CSS order provides the live preview. */
      .weekday-field { display: flex; flex-direction: column; gap: 4px; font-size: 13px; color: var(--secondary-text-color); }
      .weekday-select { border: 1px solid var(--divider-color); border-radius: var(--zp-radius); color: var(--primary-text-color); font-size: 16px; }
      .weekday-select summary { cursor: pointer; padding: 12px; min-height: var(--zp-touch); box-sizing: border-box; }
      .weekday-options { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 4px 12px; padding: 0 12px 12px; }
      .activation-list { display: flex; flex-direction: column; }
      .activation-drop-zone { display: none; }
      .dragging .activation-drop-zone {
        display: flex; align-items: center; justify-content: center; min-height: 30px;
        margin: 4px 0; border: 2px dashed var(--divider-color); border-radius: 8px;
        color: var(--secondary-text-color); font-size: 13px;
      }
      .dragging .activation-drop-zone.active {
        border-color: var(--primary-color); color: var(--primary-color);
        background: color-mix(in srgb, var(--primary-color) 10%, transparent);
      }
      .activation.drag-preview { opacity: .5; outline: 2px dashed var(--primary-color); }
      .activation { display: flex; flex-direction: column; gap: 12px; border: 1px solid var(--divider-color); border-left: 4px solid var(--primary-color); border-radius: 8px; padding: 12px; margin-bottom: 12px; }
      .week-row.holiday {
        margin-top: 8px;
      }
      .month-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        margin: 8px 0;
      }
      .calendar {
        display: grid;
        grid-template-columns: repeat(7, minmax(0, 1fr));
        gap: 3px;
      }
      .cell {
        min-height: 40px;
        border-radius: 6px;
        background: color-mix(in srgb, var(--cell-color) 35%, transparent);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 13px;
      }
      .cell.head {
        min-height: 24px;
        background: none;
        color: var(--secondary-text-color);
        font-size: 12px;
      }
      .cell.empty {
        background: none;
      }
      .cell.today {
        outline: 2px solid var(--primary-text-color);
      }
      .cell .mark {
        font-size: 11px;
        line-height: 1;
        min-height: 11px;
      }
      .legend {
        display: flex;
        flex-wrap: wrap;
        gap: 4px 14px;
        margin-top: 8px;
        font-size: 13px;
        color: var(--secondary-text-color);
      }
      .legend .row {
        gap: 4px;
      }
      .exceptions {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .exception {
        padding: 10px;
        border-radius: var(--zp-radius);
        border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.3));
        border-left: 6px solid var(--row-color);
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .exception .row {
        align-items: flex-end;
      }
      .exception.past {
        opacity: 0.55;
      }
      .exception input[type="date"] {
        min-width: 9.5em;
      }
      .badge {
        padding: 2px 8px;
        border-radius: 10px;
        font-size: 12px;
        background: rgba(127, 127, 127, 0.2);
        margin-bottom: 12px;
      }
      .badge.active {
        background: var(--primary-color);
        color: var(--text-primary-color, #fff);
      }
      .footer {
        position: sticky;
        bottom: 0;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px;
        padding: 8px 0 4px;
        background: var(--card-background-color, var(--ha-card-background, #fff));
        border-top: 1px solid var(--divider-color, rgba(127, 127, 127, 0.3));
        z-index: 1;
      }
      @media (max-width: 400px) {
        .week-row .day {
          flex-basis: 6.5em;
        }
        .footer {
          display: grid;
          grid-template-columns: var(--zp-touch) var(--zp-touch) 1fr 1fr;
          gap: 6px;
        }
        .footer .grow {
          display: none;
        }
        .footer button:not(.icon) {
          padding: 0 6px;
        }
      }
      @media (max-width: 340px) {
        .footer {
          grid-template-columns: var(--zp-touch) var(--zp-touch) 1fr;
        }
        .footer .save {
          grid-column: 1 / -1;
        }
      }
    `];customElements.get("curve-scheduler-editor")||customElements.define("curve-scheduler-editor",be);var _e=class extends x{constructor(){super();this.receivedAt=Date.now();this.t=P("en");this.language="en";this._data=null,this._error=null,this._editorOpen=!1,this._holidayForm=null,this._notice=null,this._tick=0}static getConfigElement(){return document.createElement("curve-scheduler-card-editor")}static getStubConfig(){return{view:"compact",allow_edit:!0}}setConfig(e){if(!e)throw new Error("Invalid configuration");let t=this._config?.entry_id!==e.entry_id;this._config={view:"compact",allow_edit:!0,...e},t&&this.resubscribe()}getCardSize(){return this._config?.view==="full"?14:5}getGridOptions(){return{columns:12,min_columns:6,rows:"auto"}}connectedCallback(){super.connectedCallback(),this.timer=setInterval(()=>this._tick+=1,3e4),this.hass&&this._config&&this.resubscribe()}disconnectedCallback(){super.disconnectedCallback(),clearInterval(this.timer),this.teardown()}willUpdate(e){if(e.has("hass")&&this.hass){let t=ie(this.hass);t!==this.language&&(this.language=t,this.t=P(t)),!this.unsubscribe&&this._config&&this.resubscribe()}}async teardown(){let e=this.unsubscribe;if(this.unsubscribe=void 0,this.subscribedEntry=void 0,e)try{await(await e)()}catch{}}async resubscribe(){if(!this.hass||!this._config||!this.isConnected)return;let e=this._config.entry_id;if(!e){try{e=(await te(this.hass))[0]?.entry_id}catch(i){this._error=this.t("card.connection_error",{message:i.message});return}if(!e){this._error=this.t("card.no_instance");return}}if(e===this.subscribedEntry&&this.unsubscribe)return;await this.teardown(),this.subscribedEntry=e,this._error=null;let t=Mt(this.hass,e,i=>{this._data=i,this.receivedAt=Date.now()});this.unsubscribe=t;try{await t}catch(i){this.unsubscribe=void 0,this.subscribedEntry=void 0;let n=i.code;this._error=n==="not_found"?this.t("card.not_found"):this.t("card.connection_error",{message:i.message??n})}}get editorMode(){return this._config.editor_mode??(this._config.show_edit===!1||this._config.view==="graph"?"hidden":this._config.view==="full"?"always":"button")}get canEdit(){return this.editorMode!=="hidden"&&(this._config.allow_edit!==!1||this.hass?.user?.is_admin===!0)}infoVisible(e){return this._config[e]??this._config.view!=="graph"}get editor(){return this.renderRoot.querySelector("curve-scheduler-editor")}confirmLeave(){return this.editor?this.editor.confirmLeave():this.renderRoot.querySelector("curve-scheduler-numeric-editor")?.confirmLeave(this.t("editor.confirm_leave"))??!0}toggleEditor(){if(this._editorOpen){if(this.editor&&!this.editor.confirmLeave())return;this._editorOpen=!1}else this._editorOpen=!0}nowMinute(e){let t=S(e.state.now.slice(11,16))+Number(e.state.now.slice(17,19))/60,i=(Date.now()-this.receivedAt)/6e4;return Math.min(1440,t+Math.max(0,i))}fmt(e){let t=this._data.config;return V(e,t.step,t.unit,this.language)}async changeMode(e){try{await Dt(this.hass,this._data.entry_id,e==="auto"?null:e)}catch(t){this._notice=t.message}}openHolidayForm(){let e=this._data,t=e.state.now.slice(0,10),i=Object.keys(e.schedule.profiles),n=i.find(r=>/urlaub|holiday|vacation|day_off/i.test(r))??i[0];this._holidayForm={from:t,to:ze(t,6),profile:n,note:this.t("holiday.note_default")}}async submitHoliday(){let e=this._holidayForm;if(!e||!e.from)return;let t=e.to&&e.to>=e.from?e.to:e.from;try{await Nt(this.hass,this._data.entry_id,e.from,t,e.profile,e.note),this._holidayForm=null,this._notice=this.t("holiday.added"),setTimeout(()=>this._notice=null,4e3)}catch(i){this._notice=i.message}}renderActivePlan(e){let{state:t,schedule:i,config:n}=e,r=i.profiles[t.profile_id],l=t.timeline.map(_=>_.profile_id),a=[l[0],l[1],l[3],l[4]].map(_=>i.profiles[_]?nt(i.profiles[_]):[]),d=this.nowMinute(e),u=r?nt(r):[],c=t.resolved_profiles,f=c?.[t.profile_id]?.points,m=c?[l[0],l[1],l[3],l[4]].map(_=>c[_]?.points??[]):a,g=n.axis?.source==="day_of_week"?r?.curve?.some(_=>_.anchor||_.partner_of):l.some(_=>i.profiles[_]?.points.some(we=>we.anchor||we.partner_of)),v=t.curve_available===!1&&!!t.curve_errors?.length,b=pe([m[0],m[1],f??u,m[2],m[3]]),$=!v&&b.length?new Z(b,n.interpolation).at(d):null,D=[this.t("today.title",{profile:r?.name??"?"}),this.t("today.now",{value:t.value===null?"\u2014":this.fmt(t.curve_value??t.value)})];t.next_point&&D.push(this.t("today.next",{time:t.next_point.hhmm,value:this.fmt(t.next_point.value)}));let N="";if(t.reason!=="weekday"&&(N=this.t(`today.reason.${t.reason}`),t.reason==="override"&&t.override?.until)){let _=new Date(t.override.until);N+=` \xB7 ${this.t("today.until",{time:new Intl.DateTimeFormat(this.language,{weekday:"short",hour:"2-digit",minute:"2-digit"}).format(_)})}`}let dt=t.override?t.override.profile:"auto",ti=h`${n.axis&&n.axis.source!=="time_of_day"?h`<curve-scheduler-numeric-editor .showLegend=${this._config.show_legend!==!1} .graphOnly=${!this.infoVisible("show_input")} .data=${{...e,schedule:{...i,curve:r?.curve??[]}}} .language=${this.language} .offset=${r?.apply_offset===!1?0:t.offset??0}></curve-scheduler-numeric-editor>`:h`<curve-scheduler-curve
        .offset=${r?.apply_offset===!1?0:t.offset??0}
        .showLegend=${this._config.show_legend!==!1}
        .pointPositions=${c?.[t.profile_id]?.point_positions}
        .points=${r?.points??[]}
        .displayPoints=${v?[]:f??void 0}
        .referencePoints=${g||v?u:void 0}
        .referenceContext=${a}
        .context=${m}
        .mode=${n.interpolation}
        .min=${n.min}
        .max=${n.max}
        .step=${n.step}
        .xLabelStep=${n.x_label_step??0}
        .yLabelStep=${n.y_label_step??0}
        .unit=${n.unit}
        .language=${this.language}
        .color=${r?.color??"var(--primary-color)"}
        .nowMinute=${d}
        .nowValue=${$}
        .height=${170}
        .showContinuation=${!1}
      ></curve-scheduler-curve>`}`;return h`
      ${this.infoVisible("show_summary")||N&&this.infoVisible("show_reason")?h`<div class="summary">
        ${this.infoVisible("show_summary")?h`<div class="headline">${D.join(" \xB7 ")}</div>`:p}
        ${N&&this.infoVisible("show_reason")?h`<div class="muted">${N}</div>`:p}
      </div>`:p}
      ${this.infoVisible("show_offset")&&(t.offset??0)!==0||this._config.show_clear_offset&&(t.offset??0)!==0?h`<div class="top-offset">
        ${this.infoVisible("show_offset")&&(t.offset??0)!==0?h`<span>${this.language.startsWith("de")?"Versatz":"Offset"}: ${this.fmt(t.offset)}</span>`:p}
        ${this._config.show_clear_offset&&(t.offset??0)!==0?h`<button class="clear-offset" ?disabled=${!(t.offset??0)} @click=${async()=>{try{await this.hass.callService("curve_scheduler","clear_offset",{config_entry_id:e.entry_id})}catch{this._error=this.language.startsWith("de")?"Versatz konnte nicht zur\xFCckgesetzt werden.":"Could not clear offset."}}}>${this.language.startsWith("de")?"Versatz zur\xFCcksetzen":"Clear offset"}</button>`:p}
      </div>`:p}
      ${ti}
      ${v?h`<div class="notice error" role="alert">${this.language.startsWith("de")?"Kurve nicht verf\xFCgbar: Ankerpunkte \xFCberschneiden sich. Ankerquellen oder Partnerzuordnung korrigieren.":"Curve unavailable: anchor points collide. Correct the source values or partner assignments."} ${t.curve_errors?.map(_=>`${i.profiles[String(_.params.profile)]?.name??""}: ${this.language.startsWith("de")?"Punkte":"points"} ${Number(_.params.point)+1} / ${Number(_.params.following)+1}`).join("; ")}</div>`:p}
      ${t.enabled?p:h`<div class="notice warning">${this.t("today.disabled")}</div>`}
      ${t.enabled&&n.target&&!t.target_available?h`<div class="notice warning">${this.t("today.unavailable")}</div>`:p}
      ${this._config.show_controls??this._config.view!=="graph"?h`<div class="actions">
        <label class="field mode">
          ${this.t("today.mode")}
          <select
            class="mode-select"
            @change=${_=>this.changeMode(_.target.value)}
          >
            <option value="auto" ?selected=${dt==="auto"}>
              ${this.t("today.mode.auto")}
            </option>
            ${Object.entries(i.profiles).map(([_,we])=>h`<option value=${_} ?selected=${dt===_}>${we.name}</option>`)}
          </select>
        </label>
        <button @click=${()=>this._holidayForm?this._holidayForm=null:this.openHolidayForm()}>
          ${this.t("today.add_holiday")}
        </button>
      </div>
      ${this._holidayForm?this.renderHolidayForm(e):p}`:p}
        ${this.editorMode==="button"&&this.canEdit?h`<button class="primary edit" @click=${()=>this.toggleEditor()}>
              ${this._editorOpen?this.t("today.close_editor"):this.t("today.edit")}
            </button>`:p}
      ${this._notice?h`<div class="notice success" role="status">${this._notice}</div>`:p}
    `}renderHolidayForm(e){let t=this._holidayForm,i=n=>r=>{this._holidayForm={...t,[n]:r.target.value}};return h`<div class="holiday-form">
      <strong>${this.t("holiday.title")}</strong>
      <div class="row">
        <label class="field">
          ${this.t("holiday.from")}
          <input type="date" .value=${t.from} @change=${i("from")} />
        </label>
        <label class="field">
          ${this.t("holiday.to")}
          <input type="date" .value=${t.to} min=${t.from} @change=${i("to")} />
        </label>
      </div>
      <div class="row">
        <label class="field grow">
          ${this.t("holiday.profile")}
          <select @change=${i("profile")}>
            ${Object.entries(e.schedule.profiles).map(([n,r])=>h`<option value=${n} ?selected=${n===t.profile}>${r.name}</option>`)}
          </select>
        </label>
        <label class="field grow">
          ${this.t("holiday.note")}
          <input type="text" maxlength="100" .value=${t.note} @change=${i("note")} />
        </label>
      </div>
      <div class="row end">
        <button @click=${()=>this._holidayForm=null}>${this.t("holiday.cancel")}</button>
        <button class="primary" @click=${()=>this.submitHoliday()}>${this.t("holiday.save")}</button>
      </div>
    </div>`}render(){if(!this._config)return p;let e=this.infoVisible("show_title")?this._config.title??this._data?.title:null,t;if(this._error)t=h`<div class="notice error">${this._error}</div>`;else if(!this._data)t=h`<div class="muted">${this.t("card.loading")}</div>`;else{let i=this.canEdit&&(this.editorMode==="always"||this._editorOpen);t=h`
        ${this.renderActivePlan(this._data)}
        ${i?h`<curve-scheduler-editor
              .hass=${this.hass}
              .data=${this._data}
              .language=${this.language}
            ></curve-scheduler-editor>`:p}
      `}return h`<ha-card>
      ${e?h`<h1 class="card-header">${e}</h1>`:p}
      <div class="content">${t}</div>
    </ha-card>`}};_e.properties={hass:{attribute:!1},_config:{state:!0},_data:{state:!0},_error:{state:!0},_editorOpen:{state:!0},_holidayForm:{state:!0},_notice:{state:!0},_tick:{state:!0}},_e.styles=[M,E`
      ha-card {
        overflow: visible;
      }
      .card-header {
        margin: 0;
        padding: 16px 16px 0;
        font-size: 20px;
        font-weight: 400;
        line-height: 1.3;
      }
      .content {
        padding: 12px 16px 16px;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .summary { margin: 0; }
      .top-offset { display: flex; align-items: center; gap: 8px; font-size: 14px; }
      .clear-offset { margin-left: auto; padding: 4px 10px; min-height: 32px; }
      .headline {
        font-size: 16px;
        font-weight: 500;
        line-height: 1.4;
      }
      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        align-items: flex-end;
      }
      .actions .mode {
        flex: 1 1 140px;
      }
      .actions .mode select {
        width: 100%;
      }
      .holiday-form {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 12px;
        border-radius: var(--zp-radius);
        background: rgba(127, 127, 127, 0.08);
      }
      .row.end {
        justify-content: flex-end;
      }
      curve-scheduler-editor {
        border-top: 1px solid var(--divider-color, rgba(127, 127, 127, 0.3));
        padding-top: 8px;
      }
    `];customElements.get("curve-scheduler-card")||customElements.define("curve-scheduler-card",_e);var ye=class extends x{constructor(){super(),this._instances=null}setConfig(s){this._config=s}willUpdate(s){s.has("hass")&&this.hass&&this._instances===null&&(this._instances=[],te(this.hass).then(e=>{this._instances=e,!this._config.entry_id&&e.length&&this.update_({entry_id:e[0].entry_id})}).catch(()=>this._instances=[]))}update_(s){let e={...this._config,...s};for(let t of Object.keys(e))(e[t]===""||e[t]===void 0)&&delete e[t];this._config=e,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0}))}render(){if(!this._config)return p;let s=P(ie(this.hass)),e=this._instances??[],t=this._config.editor_mode??(this._config.show_edit===!1||this._config.view==="graph"?"hidden":this._config.view==="full"?"always":"button");return h`
      <label class="field">
        ${s("config.instance")}
        <select
          @change=${i=>this.update_({entry_id:i.target.value})}
        >
          ${e.length===0?h`<option value="">${s("card.no_instance")}</option>`:p}
          ${e.map(i=>h`<option
                value=${i.entry_id}
                ?selected=${i.entry_id===this._config.entry_id}
              >
                ${i.title}
              </option>`)}
        </select>
      </label>
      <label class="field">
        ${s("config.title")}
        <input
          type="text"
          .value=${this._config.title??""}
          @change=${i=>this.update_({title:i.target.value})}
        />
      </label>
      <label class="field">${s("config.editor_mode")}
        <select name="editor_mode"
          @change=${i=>this.update_({editor_mode:i.target.value})}>
          <option value="hidden" ?selected=${t==="hidden"}>${s("config.editor.hidden")}</option>
          <option value="button" ?selected=${t==="button"}>${s("config.editor.button")}</option>
          <option value="always" ?selected=${t==="always"}>${s("config.editor.always")}</option>
        </select>
      </label>
      ${["show_controls","show_title","show_summary","show_reason","show_input","show_offset","show_legend","show_clear_offset"].map(i=>h`<label class="check">
        <input type="checkbox" .checked=${this._config[i]??(i==="show_clear_offset"?!1:i==="show_legend"?!0:this._config.view!=="graph")}
          @change=${n=>this.update_({[i]:n.target.checked})}>
        ${s(`config.${i}`)}
      </label>`)}
      <label class="check">
        <input
          type="checkbox"
          .checked=${this._config.allow_edit!==!1}
          @change=${i=>this.update_({allow_edit:i.target.checked})}
        />
        ${s("config.allow_edit")}
      </label>
    `}};ye.properties={hass:{attribute:!1},_config:{state:!0},_instances:{state:!0}},ye.styles=[M,E`
      :host {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
    `];customElements.get("curve-scheduler-card-editor")||customElements.define("curve-scheduler-card-editor",ye);var Yt=Q(class extends U{constructor(){super(...arguments),this.key=p}render(o,s){return this.key=o,s}update(o,[s,e]){return s!==this.key&&(Ve(o),this.key=s),e}});var $e=(o,s)=>{let e=o._$AN;if(e===void 0)return!1;for(let t of e)t._$AO?.(s,!1),$e(t,s);return!0},We=o=>{let s,e;do{if((s=o._$AM)===void 0)break;e=s._$AN,e.delete(o),o=s}while(e?.size===0)},Xt=o=>{for(let s;s=o._$AM;o=s){let e=s._$AN;if(e===void 0)s._$AN=e=new Set;else if(e.has(o))break;e.add(o),Oi(s)}};function Ni(o){this._$AN!==void 0?(We(this),this._$AM=o,Xt(this)):this._$AM=o}function Li(o,s=!1,e=0){let t=this._$AH,i=this._$AN;if(i!==void 0&&i.size!==0)if(s)if(Array.isArray(t))for(let n=e;n<t.length;n++)$e(t[n],!1),We(t[n]);else t!=null&&($e(t,!1),We(t));else $e(this,o)}var Oi=o=>{o.type==Fe.CHILD&&(o._$AP??=Li,o._$AQ??=Ni)},Be=class extends U{constructor(){super(...arguments),this._$AN=void 0}_$AT(s,e,t){super._$AT(s,e,t),Xt(this),this.isConnected=s._$AU}_$AO(s,e=!0){s!==this.isConnected&&(this.isConnected=s,s?this.reconnected?.():this.disconnected?.()),e&&($e(this,s),We(this))}setValue(s){if(jt(this._$Ct))this._$Ct._$AI(s,this);else{let e=[...this._$Ct._$AH];e[this._$Ci]=s,this._$Ct._$AI(e,this,0)}}disconnected(){}reconnected(){}};var Jt=()=>new ct,ct=class{},lt=new WeakMap,Qt=Q(class extends Be{render(o){return p}update(o,[s]){let e=s!==this.G;return e&&this.rt(void 0),(e||this.lt!==this.ct)&&(this.G=s,this.ht=o.options?.host,this.rt(this.ct=o.element)),p}rt(o){if(this.G!==void 0)if(this.isConnected||(o=void 0),typeof this.G=="function"){let s=this.ht??globalThis,e=lt.get(s);e===void 0&&(e=new WeakMap,lt.set(s,e)),e.get(this.G)!==void 0&&this.G.call(this.ht,void 0),e.set(this.G,o),o!==void 0&&this.G.call(this.ht,o)}else this.G.value=o}get lt(){return typeof this.G=="function"?lt.get(this.ht??globalThis)?.get(this.G):this.G?.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});var xe=class extends x{constructor(){super();this.card=Jt();this.request=0;this.cloneName=null;this.cloning=!1;this.cloneError="";this.narrow=!1,this.instances=null,this.selected="",this.loading=!1,this.error=""}connectedCallback(){super.connectedCallback(),this.hass&&this.load()}disconnectedCallback(){this.request+=1,this.loading=!1,super.disconnectedCallback()}willUpdate(e){e.has("hass")&&this.hass&&!this.instances&&!this.loading&&!this.error&&this.load()}updated(){this.card.value?.setConfig({type:"custom:curve-scheduler-card",entry_id:this.selected,view:"full",editor_mode:"always"})}async load(){let e=++this.request;this.loading=!0,this.error="";try{let t=await te(this.hass);if(!this.isConnected||e!==this.request)return;this.instances=t;let i=new URL(window.location.href).searchParams.get("entry_id");this.selected=i??t[0]?.entry_id??""}catch(t){this.isConnected&&e===this.request&&(this.error=String(t))}finally{e===this.request&&(this.loading=!1)}}select(e){let t=e.target;if(t.value===this.selected)return;if(this.card.value&&!this.card.value.confirmLeave()){t.value=this.selected;return}this.cloneName=null,this.cloneError="",this.selected=t.value;let i=new URL(window.location.href);i.searchParams.set("entry_id",this.selected),window.history.replaceState(window.history.state,"",i)}async clone(e){e.preventDefault();let t=this.cloneName?.trim();if(!(!t||this.cloning||!this.hass.user?.is_admin)&&!(this.card.value&&!this.card.value.confirmLeave())){this.cloning=!0,this.cloneError="";try{let i=await Ct(this.hass,this.selected,t);if(!this.isConnected)return;this.instances=[...this.instances??[],i],this.selected=i.entry_id,this.cloneName=null;let n=new URL(window.location.href);n.searchParams.set("entry_id",this.selected),window.history.replaceState(window.history.state,"",n)}catch(i){this.cloneError=i?.message??String(i)}finally{this.cloning=!1}}}confirmNavigation(e){this.card.value&&!this.card.value.confirmLeave()&&e.preventDefault()}render(){let e=P(ie(this.hass)),t=this.instances?.some(i=>i.entry_id===this.selected);return h`
      <header>
        <ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>
        <h1>Curve Scheduler</h1>
      </header>
      <main>
        <div class="toolbar">
          <label class="field grow">
            ${e("panel.instance")}
            <select .value=${this.selected} @change=${this.select} ?disabled=${this.loading||this.cloning||!this.instances?.length}>
              ${this.instances?.map(i=>h`<option value=${i.entry_id} ?selected=${i.entry_id===this.selected}>${i.title}</option>`)}
            </select>
          </label>
          <button ?disabled=${this.loading||this.cloning} @click=${()=>{(!this.card.value||this.card.value.confirmLeave())&&this.load()}}>${e("panel.refresh")}</button>
          ${this.hass?.user?.is_admin?h`
            ${t?h`<button data-action="clone" ?disabled=${this.cloning} @click=${()=>{this.cloneName=`${this.instances?.find(i=>i.entry_id===this.selected)?.title} ${e("panel.copy_suffix")}`.slice(0,100),this.cloneError=""}}>${e("panel.clone")}</button>`:p}
            ${t?h`<a data-action="settings" href="/config/integrations/integration/curve_scheduler" @click=${this.confirmNavigation}>${e("panel.settings")}</a>`:p}
            <a data-action="add" href="/config/integrations/dashboard/add?domain=curve_scheduler" @click=${this.confirmNavigation}>${e("panel.add")}</a>
          `:p}
        </div>
        ${this.cloneName!==null?h`<form class="clone-form" @submit=${this.clone}>
          <label class="field grow">${e("panel.clone_name")}
            <input name="clone-name" required maxlength="100" .value=${this.cloneName} ?disabled=${this.cloning}
              @input=${i=>{this.cloneName=i.target.value}}>
          </label>
          <p class="muted">${e("panel.clone_hint")}</p>
          ${this.cloneError?h`<p role="alert">${e("panel.clone_failed",{message:this.cloneError})}</p>`:p}
          <div class="row"><button type="button" ?disabled=${this.cloning} @click=${()=>{this.cloneName=null}}>${e("panel.clone_cancel")}</button>
          <button type="submit" class="primary" ?disabled=${this.cloning||!this.cloneName.trim()}>${e(this.cloning?"panel.cloning":"panel.clone")}</button></div>
        </form>`:p}
        ${this.error?h`<p role="alert">${e("card.connection_error",{message:this.error})}</p>`:p}
        ${this.loading&&!this.instances?h`<p role="status">${e("card.loading")}</p>`:p}
        ${this.instances?.length===0?h`<p role="status">${e("panel.empty")}</p>`:p}
        ${this.instances?.length&&!t?h`<p role="alert">${e("panel.not_found")}</p>`:p}
        ${t?Yt(this.selected,h`<curve-scheduler-card ${Qt(this.card)} .hass=${this.hass} ?inert=${this.cloning}></curve-scheduler-card>`):p}
      </main>
    `}};xe.properties={hass:{attribute:!1},narrow:{type:Boolean},instances:{state:!0},selected:{state:!0},loading:{state:!0},error:{state:!0},cloneName:{state:!0},cloning:{state:!0},cloneError:{state:!0}},xe.styles=[M,E`
    :host { display: block; height: 100%; overflow: auto; color: var(--primary-text-color); background: var(--primary-background-color); }
    header { display: flex; align-items: center; min-height: 56px; padding: 0 16px; background: var(--app-header-background-color, var(--primary-color)); color: var(--app-header-text-color, white); }
    h1 { font-size: 20px; font-weight: 400; margin: 12px 8px; }
    main { max-width: 960px; margin: 0 auto; padding: 16px; }
    .toolbar { display: flex; gap: 12px; align-items: end; flex-wrap: wrap; margin-bottom: 16px; }
    .grow { flex: 1; min-width: 180px; }
    .clone-form { padding: 16px; border: 1px solid var(--divider-color); border-radius: var(--zp-radius); margin-bottom: 16px; }
    a { color: var(--primary-color); padding: 12px 0; }
  `];customElements.define("curve-scheduler-panel",xe);var zi=(navigator.language??"en").toLowerCase().startsWith("de")?"de":"en",ei=P(zi);window.customCards=window.customCards??[];window.customCards.some(o=>o.type==="curve-scheduler-card")||window.customCards.push({type:"curve-scheduler-card",name:ei("card.name"),description:ei("card.description"),preview:!0});console.info("%c CURVE-SCHEDULER-CARD ","background:#e67e22;color:#fff;border-radius:3px");
