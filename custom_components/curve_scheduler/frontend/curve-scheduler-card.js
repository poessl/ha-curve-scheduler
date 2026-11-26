/* curve-scheduler-card – built from frontend/src, do not edit */
var _e=globalThis,ye=_e.ShadowRoot&&(_e.ShadyCSS===void 0||_e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Le=Symbol(),Qe=new WeakMap,se=class{constructor(i,e,t){if(this._$cssResult$=!0,t!==Le)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=i,this.t=e}get styleSheet(){let i=this.o,e=this.t;if(ye&&i===void 0){let t=e!==void 0&&e.length===1;t&&(i=Qe.get(e)),i===void 0&&((this.o=i=new CSSStyleSheet).replaceSync(this.cssText),t&&Qe.set(e,i))}return i}toString(){return this.cssText}},et=r=>new se(typeof r=="string"?r:r+"",void 0,Le),E=(r,...i)=>{let e=r.length===1?r[0]:i.reduce((t,s,n)=>t+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+r[n+1],r[0]);return new se(e,r,Le)},tt=(r,i)=>{if(ye)r.adoptedStyleSheets=i.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of i){let t=document.createElement("style"),s=_e.litNonce;s!==void 0&&t.setAttribute("nonce",s),t.textContent=e.cssText,r.appendChild(t)}},He=ye?r=>r:r=>r instanceof CSSStyleSheet?(i=>{let e="";for(let t of i.cssRules)e+=t.cssText;return et(e)})(r):r;var{is:zt,defineProperty:Vt,getOwnPropertyDescriptor:Bt,getOwnPropertyNames:Wt,getOwnPropertySymbols:jt,getPrototypeOf:Gt}=Object,$e=globalThis,it=$e.trustedTypes,Kt=it?it.emptyScript:"",Yt=$e.reactiveElementPolyfillSupport,ne=(r,i)=>r,Oe={toAttribute(r,i){switch(i){case Boolean:r=r?Kt:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,i){let e=r;switch(i){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},nt=(r,i)=>!zt(r,i),st={attribute:!0,type:String,converter:Oe,reflect:!1,useDefault:!1,hasChanged:nt};Symbol.metadata??=Symbol("metadata"),$e.litPropertyMetadata??=new WeakMap;var M=class extends HTMLElement{static addInitializer(i){this._$Ei(),(this.l??=[]).push(i)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(i,e=st){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(i)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(i,e),!e.noAccessor){let t=Symbol(),s=this.getPropertyDescriptor(i,t,e);s!==void 0&&Vt(this.prototype,i,s)}}static getPropertyDescriptor(i,e,t){let{get:s,set:n}=Bt(this.prototype,i)??{get(){return this[e]},set(o){this[e]=o}};return{get:s,set(o){let a=s?.call(this);n?.call(this,o),this.requestUpdate(i,a,t)},configurable:!0,enumerable:!0}}static getPropertyOptions(i){return this.elementProperties.get(i)??st}static _$Ei(){if(this.hasOwnProperty(ne("elementProperties")))return;let i=Gt(this);i.finalize(),i.l!==void 0&&(this.l=[...i.l]),this.elementProperties=new Map(i.elementProperties)}static finalize(){if(this.hasOwnProperty(ne("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ne("properties"))){let e=this.properties,t=[...Wt(e),...jt(e)];for(let s of t)this.createProperty(s,e[s])}let i=this[Symbol.metadata];if(i!==null){let e=litPropertyMetadata.get(i);if(e!==void 0)for(let[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let s=this._$Eu(e,t);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(i){let e=[];if(Array.isArray(i)){let t=new Set(i.flat(1/0).reverse());for(let s of t)e.unshift(He(s))}else i!==void 0&&e.push(He(i));return e}static _$Eu(i,e){let t=e.attribute;return t===!1?void 0:typeof t=="string"?t:typeof i=="string"?i.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(i=>this.enableUpdating=i),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(i=>i(this))}addController(i){(this._$EO??=new Set).add(i),this.renderRoot!==void 0&&this.isConnected&&i.hostConnected?.()}removeController(i){this._$EO?.delete(i)}_$E_(){let i=new Map,e=this.constructor.elementProperties;for(let t of e.keys())this.hasOwnProperty(t)&&(i.set(t,this[t]),delete this[t]);i.size>0&&(this._$Ep=i)}createRenderRoot(){let i=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return tt(i,this.constructor.elementStyles),i}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(i=>i.hostConnected?.())}enableUpdating(i){}disconnectedCallback(){this._$EO?.forEach(i=>i.hostDisconnected?.())}attributeChangedCallback(i,e,t){this._$AK(i,t)}_$ET(i,e){let t=this.constructor.elementProperties.get(i),s=this.constructor._$Eu(i,t);if(s!==void 0&&t.reflect===!0){let n=(t.converter?.toAttribute!==void 0?t.converter:Oe).toAttribute(e,t.type);this._$Em=i,n==null?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(i,e){let t=this.constructor,s=t._$Eh.get(i);if(s!==void 0&&this._$Em!==s){let n=t.getPropertyOptions(s),o=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:Oe;this._$Em=s;let a=o.fromAttribute(e,n.type);this[s]=a??this._$Ej?.get(s)??a,this._$Em=null}}requestUpdate(i,e,t,s=!1,n){if(i!==void 0){let o=this.constructor;if(s===!1&&(n=this[i]),t??=o.getPropertyOptions(i),!((t.hasChanged??nt)(n,e)||t.useDefault&&t.reflect&&n===this._$Ej?.get(i)&&!this.hasAttribute(o._$Eu(i,t))))return;this.C(i,e,t)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(i,e,{useDefault:t,reflect:s,wrapped:n},o){t&&!(this._$Ej??=new Map).has(i)&&(this._$Ej.set(i,o??e??this[i]),n!==!0||o!==void 0)||(this._$AL.has(i)||(this.hasUpdated||t||(e=void 0),this._$AL.set(i,e)),s===!0&&this._$Em!==i&&(this._$Eq??=new Set).add(i))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let i=this.scheduleUpdate();return i!=null&&await i,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,n]of this._$Ep)this[s]=n;this._$Ep=void 0}let t=this.constructor.elementProperties;if(t.size>0)for(let[s,n]of t){let{wrapped:o}=n,a=this[s];o!==!0||this._$AL.has(s)||a===void 0||this.C(s,void 0,n,a)}}let i=!1,e=this._$AL;try{i=this.shouldUpdate(e),i?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(t){throw i=!1,this._$EM(),t}i&&this._$AE(e)}willUpdate(i){}_$AE(i){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(i)),this.updated(i)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(i){return!0}update(i){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(i){}firstUpdated(i){}};M.elementStyles=[],M.shadowRootOptions={mode:"open"},M[ne("elementProperties")]=new Map,M[ne("finalized")]=new Map,Yt?.({ReactiveElement:M}),($e.reactiveElementVersions??=[]).push("2.1.2");var Ue=globalThis,rt=r=>r,xe=Ue.trustedTypes,ot=xe?xe.createPolicy("lit-html",{createHTML:r=>r}):void 0,Fe="$lit$",I=`lit$${Math.random().toFixed(9).slice(2)}$`,ze="?"+I,qt=`<${ze}>`,z=document,oe=()=>z.createComment(""),ae=r=>r===null||typeof r!="object"&&typeof r!="function",Ve=Array.isArray,pt=r=>Ve(r)||typeof r?.[Symbol.iterator]=="function",Re=`[ 	
\f\r]`,re=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,at=/-->/g,lt=/>/g,U=RegExp(`>|${Re}(?:([^\\s"'>=/]+)(${Re}*=${Re}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),dt=/'/g,ct=/"/g,ut=/^(?:script|style|textarea|title)$/i,Be=r=>(i,...e)=>({_$litType$:r,strings:i,values:e}),c=Be(1),k=Be(2),Pi=Be(3),V=Symbol.for("lit-noChange"),p=Symbol.for("lit-nothing"),ht=new WeakMap,F=z.createTreeWalker(z,129);function mt(r,i){if(!Ve(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return ot!==void 0?ot.createHTML(i):i}var ft=(r,i)=>{let e=r.length-1,t=[],s,n=i===2?"<svg>":i===3?"<math>":"",o=re;for(let a=0;a<e;a++){let l=r[a],u,h,d=-1,f=0;for(;f<l.length&&(o.lastIndex=f,h=o.exec(l),h!==null);)f=o.lastIndex,o===re?h[1]==="!--"?o=at:h[1]!==void 0?o=lt:h[2]!==void 0?(ut.test(h[2])&&(s=RegExp("</"+h[2],"g")),o=U):h[3]!==void 0&&(o=U):o===U?h[0]===">"?(o=s??re,d=-1):h[1]===void 0?d=-2:(d=o.lastIndex-h[2].length,u=h[1],o=h[3]===void 0?U:h[3]==='"'?ct:dt):o===ct||o===dt?o=U:o===at||o===lt?o=re:(o=U,s=void 0);let m=o===U&&r[a+1].startsWith("/>")?" ":"";n+=o===re?l+qt:d>=0?(t.push(u),l.slice(0,d)+Fe+l.slice(d)+I+m):l+I+(d===-2?a:m)}return[mt(r,n+(r[e]||"<?>")+(i===2?"</svg>":i===3?"</math>":"")),t]},le=class r{constructor({strings:i,_$litType$:e},t){let s;this.parts=[];let n=0,o=0,a=i.length-1,l=this.parts,[u,h]=ft(i,e);if(this.el=r.createElement(u,t),F.currentNode=this.el.content,e===2||e===3){let d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(s=F.nextNode())!==null&&l.length<a;){if(s.nodeType===1){if(s.hasAttributes())for(let d of s.getAttributeNames())if(d.endsWith(Fe)){let f=h[o++],m=s.getAttribute(d).split(I),g=/([.?@])?(.*)/.exec(f);l.push({type:1,index:n,name:g[2],strings:m,ctor:g[1]==="."?ke:g[1]==="?"?Ee:g[1]==="@"?Pe:W}),s.removeAttribute(d)}else d.startsWith(I)&&(l.push({type:6,index:n}),s.removeAttribute(d));if(ut.test(s.tagName)){let d=s.textContent.split(I),f=d.length-1;if(f>0){s.textContent=xe?xe.emptyScript:"";for(let m=0;m<f;m++)s.append(d[m],oe()),F.nextNode(),l.push({type:2,index:++n});s.append(d[f],oe())}}}else if(s.nodeType===8)if(s.data===ze)l.push({type:2,index:n});else{let d=-1;for(;(d=s.data.indexOf(I,d+1))!==-1;)l.push({type:7,index:n}),d+=I.length-1}n++}}static createElement(i,e){let t=z.createElement("template");return t.innerHTML=i,t}};function B(r,i,e=r,t){if(i===V)return i;let s=t!==void 0?e._$Co?.[t]:e._$Cl,n=ae(i)?void 0:i._$litDirective$;return s?.constructor!==n&&(s?._$AO?.(!1),n===void 0?s=void 0:(s=new n(r),s._$AT(r,e,t)),t!==void 0?(e._$Co??=[])[t]=s:e._$Cl=s),s!==void 0&&(i=B(r,s._$AS(r,i.values),s,t)),i}var we=class{constructor(i,e){this._$AV=[],this._$AN=void 0,this._$AD=i,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(i){let{el:{content:e},parts:t}=this._$AD,s=(i?.creationScope??z).importNode(e,!0);F.currentNode=s;let n=F.nextNode(),o=0,a=0,l=t[0];for(;l!==void 0;){if(o===l.index){let u;l.type===2?u=new K(n,n.nextSibling,this,i):l.type===1?u=new l.ctor(n,l.name,l.strings,this,i):l.type===6&&(u=new Se(n,this,i)),this._$AV.push(u),l=t[++a]}o!==l?.index&&(n=F.nextNode(),o++)}return F.currentNode=z,s}p(i){let e=0;for(let t of this._$AV)t!==void 0&&(t.strings!==void 0?(t._$AI(i,t,e),e+=t.strings.length-2):t._$AI(i[e])),e++}},K=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(i,e,t,s){this.type=2,this._$AH=p,this._$AN=void 0,this._$AA=i,this._$AB=e,this._$AM=t,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let i=this._$AA.parentNode,e=this._$AM;return e!==void 0&&i?.nodeType===11&&(i=e.parentNode),i}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(i,e=this){i=B(this,i,e),ae(i)?i===p||i==null||i===""?(this._$AH!==p&&this._$AR(),this._$AH=p):i!==this._$AH&&i!==V&&this._(i):i._$litType$!==void 0?this.$(i):i.nodeType!==void 0?this.T(i):pt(i)?this.k(i):this._(i)}O(i){return this._$AA.parentNode.insertBefore(i,this._$AB)}T(i){this._$AH!==i&&(this._$AR(),this._$AH=this.O(i))}_(i){this._$AH!==p&&ae(this._$AH)?this._$AA.nextSibling.data=i:this.T(z.createTextNode(i)),this._$AH=i}$(i){let{values:e,_$litType$:t}=i,s=typeof t=="number"?this._$AC(i):(t.el===void 0&&(t.el=le.createElement(mt(t.h,t.h[0]),this.options)),t);if(this._$AH?._$AD===s)this._$AH.p(e);else{let n=new we(s,this),o=n.u(this.options);n.p(e),this.T(o),this._$AH=n}}_$AC(i){let e=ht.get(i.strings);return e===void 0&&ht.set(i.strings,e=new le(i)),e}k(i){Ve(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,t,s=0;for(let n of i)s===e.length?e.push(t=new r(this.O(oe()),this.O(oe()),this,this.options)):t=e[s],t._$AI(n),s++;s<e.length&&(this._$AR(t&&t._$AB.nextSibling,s),e.length=s)}_$AR(i=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);i!==this._$AB;){let t=rt(i).nextSibling;rt(i).remove(),i=t}}setConnected(i){this._$AM===void 0&&(this._$Cv=i,this._$AP?.(i))}},W=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(i,e,t,s,n){this.type=1,this._$AH=p,this._$AN=void 0,this.element=i,this.name=e,this._$AM=s,this.options=n,t.length>2||t[0]!==""||t[1]!==""?(this._$AH=Array(t.length-1).fill(new String),this.strings=t):this._$AH=p}_$AI(i,e=this,t,s){let n=this.strings,o=!1;if(n===void 0)i=B(this,i,e,0),o=!ae(i)||i!==this._$AH&&i!==V,o&&(this._$AH=i);else{let a=i,l,u;for(i=n[0],l=0;l<n.length-1;l++)u=B(this,a[t+l],e,l),u===V&&(u=this._$AH[l]),o||=!ae(u)||u!==this._$AH[l],u===p?i=p:i!==p&&(i+=(u??"")+n[l+1]),this._$AH[l]=u}o&&!s&&this.j(i)}j(i){i===p?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,i??"")}},ke=class extends W{constructor(){super(...arguments),this.type=3}j(i){this.element[this.name]=i===p?void 0:i}},Ee=class extends W{constructor(){super(...arguments),this.type=4}j(i){this.element.toggleAttribute(this.name,!!i&&i!==p)}},Pe=class extends W{constructor(i,e,t,s,n){super(i,e,t,s,n),this.type=5}_$AI(i,e=this){if((i=B(this,i,e,0)??p)===V)return;let t=this._$AH,s=i===p&&t!==p||i.capture!==t.capture||i.once!==t.once||i.passive!==t.passive,n=i!==p&&(t===p||s);s&&this.element.removeEventListener(this.name,this,t),n&&this.element.addEventListener(this.name,this,i),this._$AH=i}handleEvent(i){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,i):this._$AH.handleEvent(i)}},Se=class{constructor(i,e,t){this.element=i,this.type=6,this._$AN=void 0,this._$AM=e,this.options=t}get _$AU(){return this._$AM._$AU}_$AI(i){B(this,i)}},gt={M:Fe,P:I,A:ze,C:1,L:ft,R:we,D:pt,V:B,I:K,H:W,N:Ee,U:Pe,B:ke,F:Se},Xt=Ue.litHtmlPolyfillSupport;Xt?.(le,K),(Ue.litHtmlVersions??=[]).push("3.3.3");var vt=(r,i,e)=>{let t=e?.renderBefore??i,s=t._$litPart$;if(s===void 0){let n=e?.renderBefore??null;t._$litPart$=s=new K(i.insertBefore(oe(),n),n,void 0,e??{})}return s._$AI(r),s};var We=globalThis,y=class extends M{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let i=super.createRenderRoot();return this.renderOptions.renderBefore??=i.firstChild,i}update(i){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(i),this._$Do=vt(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return V}};y._$litElement$=!0,y.finalized=!0,We.litElementHydrateSupport?.({LitElement:y});var Zt=We.litElementPolyfillSupport;Zt?.({LitElement:y});(We.litElementVersions??=[]).push("4.2.2");var Y=r=>r.callWS({type:"curve_scheduler/list"});var Ae=(r,i,e,t)=>r.callWS({type:"curve_scheduler/save",entry_id:i,revision:e,schedule:t}),bt=(r,i,e)=>r.connection.subscribeMessage(e,{type:"curve_scheduler/subscribe",entry_id:i}),_t=(r,i,e,t)=>r.callWS({type:"curve_scheduler/holidays",entry_id:i,start:e,end:t}),yt=(r,i,e)=>e===null?r.callService("curve_scheduler","clear_override",{config_entry_id:i}):r.callService("curve_scheduler","set_override",{config_entry_id:i,profile:e}),$t=(r,i,e,t,s,n)=>r.callService("curve_scheduler","add_exception",{config_entry_id:i,from:e,to:t,profile:s,note:n});function Jt(r){if(!Number.isFinite(r)||r<=0)return 1;let i=r.toFixed(6).replace(/0+$/,"").replace(/\.$/,""),e=i.indexOf(".");return e<0?0:i.length-e-1}function j(r,i,e){let t=Jt(i);return new Intl.NumberFormat(e,{minimumFractionDigits:0,maximumFractionDigits:t}).format(r)}function H(r,i,e,t){let s=j(r,i,t);return e?`${s}\xA0${e}`:s}function je(r){let i=r.trim().replace(/\s/g,"").replace(",",".");return i===""||!/^-?\d*(\.\d*)?$/.test(i)?Number.NaN:Number(i)}function Ge(r,i,e=5){let t=i-r;if(t<=0)return[r];let s=t/e,n=10**Math.floor(Math.log10(s)),o=[1,2,2.5,5,10].map(u=>u*n),a=o.find(u=>u>=s)??o[o.length-1],l=[];for(let u=Math.ceil(r/a)*a;u<=i+1e-9;u+=a)l.push(Math.round(u*1e6)/1e6);return l}function q(r,i,e=0){if(!Number.isFinite(r)||!Number.isFinite(i)||i<=r)return[];if(!(e>0)||!Number.isFinite(e))return Ge(r,i);let t=Math.min(101,Math.floor((i-r)/e+1e-9)+1);return Array.from({length:t},(s,n)=>Number((r+n*e).toPrecision(12)))}var Te={"panel.instance":"Curve","panel.refresh":"Refresh list","panel.add":"Add curve","panel.settings":"Curve settings","panel.empty":"No curves are loaded. Add a Curve Scheduler instance to get started.","panel.not_found":"This curve is not loaded. Choose another curve or refresh the list.","card.name":"Time profile","card.description":"Shows today's plan and lets everyone edit the daily plans.","card.loading":"Loading\u2026","card.no_instance":"No time profile has been set up yet.","card.not_found":"This time profile no longer exists. Please choose another one in the card settings.","card.connection_error":"Connection problem: {message}","today.title":"Today: {profile}","today.now":"now {value}","today.next":"from {time} \u2192 {value}","today.disabled":"Paused \u2013 nothing is sent to the device.","today.unavailable":"The device is not reachable right now.","today.reason.weekday":"weekly plan","today.reason.holiday":"holiday","today.reason.exception":"exception","today.reason.override":"chosen by hand","today.mode":"Mode","today.mode.auto":"Automatic","today.until":"until {time}","today.add_holiday":"Add holiday","today.edit":"Edit","today.close_editor":"Close editor","holiday.title":"Add holiday","holiday.from":"From","holiday.to":"To","holiday.profile":"Plan during this time","holiday.note":"Note","holiday.note_default":"Holiday","holiday.save":"Add","holiday.cancel":"Cancel","holiday.added":"Holiday added.","editor.tab.profiles":"Daily plans","editor.tab.week":"Weekly plan","editor.tab.exceptions":"Holidays & exceptions","editor.save":"Save","editor.discard":"Discard","editor.undo":"Undo","editor.redo":"Redo","editor.saved":"Saved.","editor.saving":"Saving\u2026","editor.unsaved":"You have unsaved changes.","editor.confirm_leave":"You have unsaved changes. Discard them?","editor.confirm_discard":"Discard all changes?","editor.conflict":"Changed in the meantime \u2013 reload?","editor.reload":"Reload","editor.fix_errors":"Please fix the marked problems before saving.","profiles.add":"New plan","profiles.new_name":"New plan","profiles.name":"Name","profiles.color":"Color","profiles.duplicate":"Duplicate","profiles.delete":"Delete plan","profiles.copy_suffix":"(copy)","profiles.confirm_delete":'Delete the plan "{name}"?',"profiles.in_use":'"{name}" cannot be deleted because it is still used: {usages}. Choose another plan there first.',"profiles.last":"The last plan cannot be deleted.","profiles.copy_from":"Copy curve from","profiles.copy":"Copy","profiles.confirm_copy":'Replace all points of "{target}" with those of "{source}"?',"profiles.snap":"Snap to","profiles.snap_minutes":"{minutes} min","profiles.hint":"Tap the line to add a point. Drag points to move them.","profiles.continues":"continues into the next day","point.selected":"Selected point","point.time":"Time","point.value":"Temperature","point.value_generic":"Value","point.delete":"Delete point","point.add":"+ Point","point.minus":"Lower","point.plus":"Higher","point.table":"All points","point.full":"A plan can have at most {max} points.","point.min":"A plan needs at least one point.","point.taken":"There is already a point at {time}.","week.title":"Which plan applies on which day?","week.holiday":"On holidays:","week.no_holiday_source":"No holiday calendar is set up. An administrator can add one in the integration settings.","week.preview":"Month overview","week.prev_month":"Previous month","week.next_month":"Next month","week.legend_holiday":"holiday","week.legend_exception":"exception","week.day.mon":"Monday","week.day.tue":"Tuesday","week.day.wed":"Wednesday","week.day.thu":"Thursday","week.day.fri":"Friday","week.day.sat":"Saturday","week.day.sun":"Sunday","exceptions.title":"Holidays and other exceptions","exceptions.empty":"No exceptions yet.","exceptions.add":"+ Exception","exceptions.from":"From","exceptions.to":"To","exceptions.profile":"Plan","exceptions.note":"Note","exceptions.delete":"Delete","exceptions.past":"over","exceptions.active":"today","exceptions.remove_past":"Remove past entries","exceptions.auto_cleanup":"Remove past entries automatically","error.too_few_points":"At least {min} point is needed.","error.too_many_points":"At most {max} points are allowed.","error.invalid_time":"The time {time} is not valid.","error.time_not_on_grid":"Times must be on a {grid} minute step ({time}).","error.duplicate_time":"There are two points at {time}.","error.times_not_sorted":"The points are not in time order ({time}).","error.invalid_value":"Please enter a number ({time}).","error.value_out_of_range":"{value} at {time} is outside {min} \u2026 {max}.","error.no_profiles":"At least one plan is needed.","error.too_many_profiles":"At most {max} plans are allowed.","error.invalid_profile_id":"Invalid plan.","error.empty_name":"Please enter a name.","error.name_too_long":"The name is too long (at most {max} characters).","error.reserved_name":'"{name}" cannot be used as a name.',"error.duplicate_name":'The name "{name}" is used twice.',"error.invalid_color":"Please choose a color.","error.unknown_profile":"The chosen plan does not exist.","error.invalid_date":"Please enter a valid date.","error.date_range_reversed":"The end is before the start.","error.note_too_long":"The note is too long (at most {max} characters).","error.too_many_exceptions":"At most {max} exceptions are allowed.","error.profile_in_use":'"{name}" is still used: {usages}.',"error.invalid_format":"Invalid data.","error.unknown":"Problem: {code}","usage.holiday_profile":"holidays","usage.exception":"exception {number}","config.instance":"Time profile","config.view":"View","config.view.compact":"Compact (today, editor on demand)","config.view.full":"Full (editor always open)","config.allow_edit":"Allow editing for users without admin rights","config.title":"Title (optional)"},Qt={"panel.instance":"Kurve","panel.refresh":"Liste aktualisieren","panel.add":"Kurve hinzuf\xFCgen","panel.settings":"Kurveneinstellungen","panel.empty":"Keine Kurven geladen. Zuerst eine Curve-Scheduler-Instanz hinzuf\xFCgen.","panel.not_found":"Diese Kurve ist nicht geladen. Eine andere w\xE4hlen oder die Liste aktualisieren.","card.name":"Zeitprofil","card.description":"Zeigt den heutigen Plan und l\xE4sst alle die Tagespl\xE4ne bearbeiten.","card.loading":"Wird geladen \u2026","card.no_instance":"Es wurde noch kein Zeitprofil eingerichtet.","card.not_found":"Dieses Zeitprofil gibt es nicht mehr. Bitte in den Karteneinstellungen ein anderes w\xE4hlen.","card.connection_error":"Verbindungsproblem: {message}","today.title":"Heute: {profile}","today.now":"jetzt {value}","today.next":"ab {time} \u2192 {value}","today.disabled":"Pausiert \u2013 es wird nichts an das Ger\xE4t gesendet.","today.unavailable":"Das Ger\xE4t ist gerade nicht erreichbar.","today.reason.weekday":"Wochenplan","today.reason.holiday":"Feiertag","today.reason.exception":"Ausnahme","today.reason.override":"von Hand gew\xE4hlt","today.mode":"Modus","today.mode.auto":"Automatik","today.until":"bis {time}","today.add_holiday":"Urlaub eintragen","today.edit":"Bearbeiten","today.close_editor":"Editor schlie\xDFen","holiday.title":"Urlaub eintragen","holiday.from":"Von","holiday.to":"Bis","holiday.profile":"Plan in dieser Zeit","holiday.note":"Notiz","holiday.note_default":"Urlaub","holiday.save":"Eintragen","holiday.cancel":"Abbrechen","holiday.added":"Urlaub eingetragen.","editor.tab.profiles":"Tagespl\xE4ne","editor.tab.week":"Wochenplan","editor.tab.exceptions":"Urlaub & Ausnahmen","editor.save":"Speichern","editor.discard":"Verwerfen","editor.undo":"R\xFCckg\xE4ngig","editor.redo":"Wiederholen","editor.saved":"Gespeichert.","editor.saving":"Wird gespeichert \u2026","editor.unsaved":"Es gibt ungespeicherte \xC4nderungen.","editor.confirm_leave":"Es gibt ungespeicherte \xC4nderungen. Verwerfen?","editor.confirm_discard":"Alle \xC4nderungen verwerfen?","editor.conflict":"Wurde inzwischen ge\xE4ndert \u2013 neu laden?","editor.reload":"Neu laden","editor.fix_errors":"Bitte vor dem Speichern die markierten Probleme beheben.","profiles.add":"Neuer Plan","profiles.new_name":"Neuer Plan","profiles.name":"Name","profiles.color":"Farbe","profiles.duplicate":"Duplizieren","profiles.delete":"Plan l\xF6schen","profiles.copy_suffix":"(Kopie)","profiles.confirm_delete":"Den Plan \u201E{name}\u201C l\xF6schen?","profiles.in_use":"\u201E{name}\u201C kann nicht gel\xF6scht werden, weil er noch verwendet wird: {usages}. Bitte dort zuerst einen anderen Plan w\xE4hlen.","profiles.last":"Der letzte Plan kann nicht gel\xF6scht werden.","profiles.copy_from":"Kurve kopieren von","profiles.copy":"Kopieren","profiles.confirm_copy":"Alle Punkte von \u201E{target}\u201C durch die von \u201E{source}\u201C ersetzen?","profiles.snap":"Einrasten auf","profiles.snap_minutes":"{minutes} Min.","profiles.hint":"Auf die Linie tippen f\xFCgt einen Punkt hinzu. Punkte lassen sich verschieben.","profiles.continues":"geht in den n\xE4chsten Tag \xFCber","point.selected":"Ausgew\xE4hlter Punkt","point.time":"Uhrzeit","point.value":"Temperatur","point.value_generic":"Wert","point.delete":"Punkt l\xF6schen","point.add":"+ Punkt","point.minus":"Niedriger","point.plus":"H\xF6her","point.table":"Alle Punkte","point.full":"Ein Plan kann h\xF6chstens {max} Punkte haben.","point.min":"Ein Plan braucht mindestens einen Punkt.","point.taken":"Um {time} gibt es schon einen Punkt.","week.title":"Welcher Plan gilt an welchem Tag?","week.holiday":"An Feiertagen gilt:","week.no_holiday_source":"Es ist kein Feiertagskalender eingerichtet. Ein Administrator kann ihn in den Einstellungen der Integration hinzuf\xFCgen.","week.preview":"Monats\xFCbersicht","week.prev_month":"Vorheriger Monat","week.next_month":"N\xE4chster Monat","week.legend_holiday":"Feiertag","week.legend_exception":"Ausnahme","week.day.mon":"Montag","week.day.tue":"Dienstag","week.day.wed":"Mittwoch","week.day.thu":"Donnerstag","week.day.fri":"Freitag","week.day.sat":"Samstag","week.day.sun":"Sonntag","exceptions.title":"Urlaub und andere Ausnahmen","exceptions.empty":"Noch keine Ausnahmen.","exceptions.add":"+ Ausnahme","exceptions.from":"Von","exceptions.to":"Bis","exceptions.profile":"Plan","exceptions.note":"Notiz","exceptions.delete":"L\xF6schen","exceptions.past":"vorbei","exceptions.active":"heute","exceptions.remove_past":"Vergangene entfernen","exceptions.auto_cleanup":"Vergangene automatisch entfernen","error.too_few_points":"Es wird mindestens {min} Punkt ben\xF6tigt.","error.too_many_points":"H\xF6chstens {max} Punkte sind erlaubt.","error.invalid_time":"Die Uhrzeit {time} ist ung\xFCltig.","error.time_not_on_grid":"Uhrzeiten m\xFCssen auf {grid} Minuten genau sein ({time}).","error.duplicate_time":"Um {time} gibt es zwei Punkte.","error.times_not_sorted":"Die Punkte sind nicht nach Uhrzeit sortiert ({time}).","error.invalid_value":"Bitte eine Zahl eingeben ({time}).","error.value_out_of_range":"{value} um {time} liegt au\xDFerhalb von {min} \u2026 {max}.","error.no_profiles":"Mindestens ein Plan wird ben\xF6tigt.","error.too_many_profiles":"H\xF6chstens {max} Pl\xE4ne sind erlaubt.","error.invalid_profile_id":"Ung\xFCltiger Plan.","error.empty_name":"Bitte einen Namen eingeben.","error.name_too_long":"Der Name ist zu lang (h\xF6chstens {max} Zeichen).","error.reserved_name":"\u201E{name}\u201C kann nicht als Name verwendet werden.","error.duplicate_name":"Der Name \u201E{name}\u201C ist doppelt vergeben.","error.invalid_color":"Bitte eine Farbe w\xE4hlen.","error.unknown_profile":"Der gew\xE4hlte Plan existiert nicht.","error.invalid_date":"Bitte ein g\xFCltiges Datum eingeben.","error.date_range_reversed":"Das Ende liegt vor dem Anfang.","error.note_too_long":"Die Notiz ist zu lang (h\xF6chstens {max} Zeichen).","error.too_many_exceptions":"H\xF6chstens {max} Ausnahmen sind erlaubt.","error.profile_in_use":"\u201E{name}\u201C wird noch verwendet: {usages}.","error.invalid_format":"Ung\xFCltige Daten.","error.unknown":"Problem: {code}","usage.holiday_profile":"Feiertage","usage.exception":"Ausnahme {number}","config.instance":"Zeitprofil","config.view":"Ansicht","config.view.compact":"Kompakt (Heute, Editor bei Bedarf)","config.view.full":"Voll (Editor immer offen)","config.allow_edit":"Bearbeiten auch ohne Admin-Rechte erlauben","config.title":"Titel (optional)"},ei={en:Te,de:Qt};function X(r){return(r?.locale?.language??r?.language??"en").toLowerCase().startsWith("de")?"de":"en"}function S(r){let i=ei[r]??Te;return(e,t={})=>(i[e]??Te[e]??e).replace(/\{(\w+)\}/g,(n,o)=>o in t?String(t[o]):`{${o}}`)}function xt(r){return r in Te}var ti=["step","linear","smooth","curve"];function v(r){let[i,e]=r.split(":");return Number(i)*60+Number(e)}function D(r){let i=Math.round(r),e=Math.floor(i/60),t=i%60;return`${String(e).padStart(2,"0")}:${String(t).padStart(2,"0")}`}function de(r){if(r.length!==5)throw new Error(`expected 5 days, got ${r.length}`);let i=[];return r.forEach((e,t)=>{let s=(t-2)*1440;for(let[n,o]of e)i.push([n+s,o])}),i}function ii(r,i){let e=r.length;if(e<2)return new Array(e).fill(0);let t=[],s=[];for(let o=0;o<e-1;o++)t.push(r[o+1]-r[o]),s.push((i[o+1]-i[o])/t[o]);let n=new Array(e).fill(0);n[0]=s[0],n[e-1]=s[e-2];for(let o=1;o<e-1;o++){let a=s[o-1],l=s[o];if(a===0||l===0||a<0!=l<0){n[o]=0;continue}let u=2*t[o]+t[o-1],h=t[o]+2*t[o-1];n[o]=(u+h)/(u/a+h/l)}return n}function si(r,i){let e=0,t=r.length-1;if(i<r[0])return-1;if(i>=r[t])return t;for(;t-e>1;){let s=Math.floor((e+t)/2);r[s]<=i?e=s:t=s}return e}var N=class{constructor(i,e){this.mode=e;if(i.length===0)throw new Error("timeline is empty");if(!ti.includes(e))throw new Error(`unknown mode ${String(e)}`);this.xs=i.map(t=>t[0]),this.ys=i.map(t=>t[1]),this.tangents=e==="curve"?ii(this.xs,this.ys):[]}at(i){let{xs:e,ys:t}=this,s=si(e,i);if(s<0)return t[0];if(s>=e.length-1)return t[t.length-1];let n=e[s],o=e[s+1],a=t[s],l=t[s+1];if(this.mode==="step")return a;let u=o-n,h=(i-n)/u;if(this.mode==="linear")return a+(l-a)*h;if(this.mode==="smooth")return a+(l-a)*(h*h*(3-2*h));let d=h*h,f=d*h,m=2*f-3*d+1,g=f-2*d+h,b=-2*f+3*d,_=f-d;return m*a+g*u*this.tangents[s]+b*l+_*u*this.tangents[s+1]}};function O(r,i){return i<=0?r:Math.round(Math.floor(r/i+.5)*i*1e6)/1e6}function $(r,i,e){return Math.max(i,Math.min(e,r))}var wt=1,L=48,w=5,Z=20,kt=200,G=40,ce=100,J=["mon","tue","wed","thu","fri","sat","sun"],Ce=["#e67e22","#27ae60","#2980b9","#8e44ad","#c0392b","#16a085","#f1c40f","#7f8c8d"],ni=/^([01]\d|2[0-3]):[0-5]\d$/,ri=/^\d{4}-\d{2}-\d{2}$/,oi=/^#[0-9a-fA-F]{6}$/,ai=/^[a-z0-9_]{1,40}$/;function P(r){return JSON.parse(JSON.stringify(r))}function Ke(r){return r.points.map(i=>[v(i.t),i.v])}function Et(r){if(typeof r!="string"||!ri.test(r))return!1;let i=new Date(`${r}T00:00:00Z`);return!Number.isNaN(i.getTime())&&i.toISOString().startsWith(r)}function li(r,i,e,t){let s=[],n=(l,u,h={})=>s.push({code:l,path:u,params:h});r.length<wt&&n("too_few_points",i,{min:wt}),r.length>L&&n("too_many_points",i,{max:L});let o,a=new Set;return r.forEach((l,u)=>{let h=`${i}.${u}`;if(typeof l.t!="string"||!ni.test(l.t)){n("invalid_time",h,{time:String(l.t)});return}let d=v(l.t);d%w&&n("time_not_on_grid",h,{time:l.t,grid:w}),a.has(d)?n("duplicate_time",h,{time:l.t}):o!==void 0&&d<o&&n("times_not_sorted",h,{time:l.t}),a.add(d),o=d,typeof l.v!="number"||Number.isNaN(l.v)?n("invalid_value",h,{time:l.t}):(l.v<e||l.v>t)&&n("value_out_of_range",h,{time:l.t,value:l.v,min:e,max:t})}),s}function Pt(r,i,e){let t=[],s=(h,d,f={})=>t.push({code:h,path:d,params:f}),n=r.profiles??{},o=Object.keys(n);o.length===0&&s("no_profiles","profiles"),o.length>Z&&s("too_many_profiles","profiles",{max:Z});let a=new Set;for(let h of o){let d=n[h],f=`profiles.${h}`;ai.test(h)||s("invalid_profile_id",f);let m=typeof d.name=="string"?d.name:"";if(!m.trim())s("empty_name",`${f}.name`);else if(m.length>G)s("name_too_long",`${f}.name`,{max:G});else{let g=m.trim().toLowerCase();g==="auto"?s("reserved_name",`${f}.name`,{name:m}):a.has(g)&&s("duplicate_name",`${f}.name`,{name:m}),a.add(g)}(typeof d.color!="string"||!oi.test(d.color))&&s("invalid_color",`${f}.color`),t.push(...li(d.points??[],`${f}.points`,i,e))}let l=(h,d)=>{(typeof h!="string"||!(h in n))&&s("unknown_profile",d,{profile:String(h)})};for(let h of J)l(r.week?.[h],`week.${h}`);l(r.holiday_profile,"holiday_profile");let u=r.exceptions??[];return u.length>kt&&s("too_many_exceptions","exceptions",{max:kt}),u.forEach((h,d)=>{let f=`exceptions.${d}`,m=Et(h.from),g=Et(h.to);m||s("invalid_date",`${f}.from`),g||s("invalid_date",`${f}.to`),m&&g&&h.to<h.from&&s("date_range_reversed",f),l(h.profile,`${f}.profile`),(h.note??"").length>ce&&s("note_too_long",`${f}.note`,{max:ce})}),t}function St(r,i){let e=J.filter(t=>r.week[t]===i).map(t=>`week.${t}`);return r.holiday_profile===i&&e.push("holiday_profile"),r.exceptions.forEach((t,s)=>{t.profile===i&&e.push(`exceptions.${s}`)}),e}function Q(r){let i=r.getFullYear(),e=String(r.getMonth()+1).padStart(2,"0"),t=String(r.getDate()).padStart(2,"0");return`${i}-${e}-${t}`}function ee(r){let[i,e,t]=r.split("-").map(Number);return new Date(i,e-1,t,12)}function Me(r,i){let e=ee(r);return e.setDate(e.getDate()+i),Q(e)}function di(r){let i=ee(r).getDay();return J[(i+6)%7]}function At(r,i,e){for(let t of r.exceptions)if(t.from<=i&&i<=t.to)return{profileId:t.profile,reason:"exception"};return e(i)?{profileId:r.holiday_profile,reason:"holiday"}:{profileId:r.week[di(i)],reason:"weekday"}}function Ye(r,i){let e=i.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g,"").replace(/ß/g,"ss").replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"").slice(0,30)||"profile",t=e,s=2;for(;t in r.profiles;)t=`${e}_${s++}`;return t}function qe(r){let i=new Set(Object.values(r.profiles).map(e=>e.color.toLowerCase()));return Ce.find(e=>!i.has(e))??Ce[0]}function Xe(r,i){let e=v(i.t),t=r.findIndex(s=>v(s.t)>e);return t<0&&(t=r.length),r.splice(t,0,i),t}function Tt(r){let i=r.map(o=>v(o.t)).sort((o,a)=>o-a);if(i.length===0)return 720;let e,t=0;for(let o=0;o<i.length;o++){let a=i[o],u=(o+1<i.length?i[o+1]:i[0]+1440)-a;u>t&&(t=u,e=a+u/2)}if(e===void 0||t<2*w)return;let s=Math.round(e/15)*15;s>=1440&&(s-=1440);let n=new Set(i);for(let o=0;o<1440;o+=w)for(let a of[1,-1]){let l=((s+a*o)%1440+1440)%1440;if(!n.has(l))return l}}var A=E`
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
`;var te=44,ci=10,C=14,hi=26,Ct=120,pi=8,Ie=44,he=class extends y{constructor(){super();this.tapStart=null;this.points=[],this.context=null,this.mode="curve",this.min=20,this.max=70,this.step=.5,this.unit=null,this.language="en",this.color="var(--primary-color, #03a9f4)",this.snapMinutes=15,this.xLabelStep=0,this.yLabelStep=0,this.editable=!1,this.nowMinute=null,this.nowValue=null,this.selected=null,this.height=220,this.showContinuation=!0,this._width=320,this._drag=null}connectedCallback(){super.connectedCallback(),typeof ResizeObserver<"u"&&(this.resizeObserver=new ResizeObserver(e=>{let t=Math.round(e[0]?.contentRect.width??0);t>0&&t!==this._width&&(this._width=t)}),this.resizeObserver.observe(this))}disconnectedCallback(){super.disconnectedCallback(),this.resizeObserver?.disconnect()}willUpdate(e){e.has("points")&&this._drag&&!this.editable&&(this._drag=null)}get domainEnd(){return this.showContinuation?1440+Ct:1440}get plotWidth(){return Math.max(10,this._width-te-ci)}get plotHeight(){return Math.max(10,this.height-C-hi)}xFor(e){return te+e/this.domainEnd*this.plotWidth}yFor(e){let t=this.max-this.min||1;return C+(1-(e-this.min)/t)*this.plotHeight}minuteAt(e){return(e-te)/this.plotWidth*this.domainEnd}valueAt(e){let t=this.max-this.min||1;return this.min+(1-(e-C)/this.plotHeight)*t}get shownPoints(){return this._drag?.points??this.points}timeline(e){if(e.length===0)return null;let t=e.map(o=>[v(o.t),o.v]),s=this.context,n=s?[s[0],s[1],t,s[2],s[3]]:[t,t,t,t,t];return de(n)}curveValue(e){let t=this.timeline(this.shownPoints);return t?new N(t,this.mode).at(e):null}snapTime(e){let t=Math.max(w,this.snapMinutes||w);return Math.round(e/t)*t}snapValue(e){return $(O($(e,this.min,this.max),this.step),this.min,this.max)}timeLimits(e,t){let s=t>0?v(e[t-1].t)+w:0,n=t<e.length-1?v(e[t+1].t)-w:1440-w;return[s,n]}movePoint(e,t,s,n){let[o,a]=this.timeLimits(e,t),l=$(this.snapTime(s),o,a),u=$(Math.round(l/w)*w,o,a),h=e.map(d=>({...d}));return h[t]={t:D(u),v:this.snapValue(n)},h}emitChange(e,t){this.dispatchEvent(new CustomEvent("points-changed",{detail:{points:e,selected:t},bubbles:!0,composed:!0}))}emitSelect(e){this.dispatchEvent(new CustomEvent("point-selected",{detail:{index:e},bubbles:!0,composed:!0}))}emitNotice(e){this.dispatchEvent(new CustomEvent("curve-notice",{detail:e,bubbles:!0,composed:!0}))}localPosition(e){let t=this.renderRoot.querySelector(".chart")?.getBoundingClientRect();return{x:e.clientX-(t?.left??0),y:e.clientY-(t?.top??0)}}addPointAt(e){if(!this.editable)return;let t=this.snapTime(this.minuteAt(e));if(t<0||t>=1440)return;let s=this.points.findIndex(u=>v(u.t)===t);if(s>=0){this.emitSelect(s),this.emitNotice({key:"point.taken",params:{time:D(t)}});return}if(this.points.length>=L){this.emitNotice({key:"point.full",params:{max:L}});return}let n=this.curveValue(t),o=this.snapValue(n??(this.min+this.max)/2),a=this.points.map(u=>({...u})),l=a.findIndex(u=>v(u.t)>t);l<0&&(l=a.length),a.splice(l,0,{t:D(t),v:o}),this.emitChange(a,l)}onChartPointerDown(e){if(!this.editable||e.button>0)return;let{x:t,y:s}=this.localPosition(e);this.tapStart={x:t,y:s,pointerId:e.pointerId}}onChartPointerUp(e){let t=this.tapStart;if(this.tapStart=null,!t||t.pointerId!==e.pointerId||this._drag)return;let{x:s,y:n}=this.localPosition(e);Math.hypot(s-t.x,n-t.y)>pi||this.addPointAt(s)}onChartPointerCancel(){this.tapStart=null}onHandlePointerDown(e,t){if(!this.editable)return;e.stopPropagation(),e.preventDefault();let s=e.currentTarget;s.setPointerCapture?.(e.pointerId),s.focus?.({preventScroll:!0});let{x:n,y:o}=this.localPosition(e);this._drag={index:t,pointerId:e.pointerId,startX:n,startY:o,moved:!1,points:this.points.map(a=>({...a}))},this.emitSelect(t)}onHandlePointerMove(e){let t=this._drag;if(!t||t.pointerId!==e.pointerId)return;e.preventDefault();let{x:s,y:n}=this.localPosition(e);if(!t.moved&&Math.hypot(s-t.startX,n-t.startY)<3)return;let o=this.movePoint(this.points,t.index,this.minuteAt(s),this.valueAt(n));this._drag={...t,moved:!0,points:o}}onHandlePointerUp(e){let t=this._drag;if(!t||t.pointerId!==e.pointerId)return;this._drag=null;let s=t.points.some((n,o)=>n.t!==this.points[o].t||n.v!==this.points[o].v);t.moved&&s&&this.emitChange(t.points,t.index)}onHandlePointerCancel(){this._drag=null}onHandleKeyDown(e,t){if(!this.editable)return;let s=this.points[t],n=v(s.t),o=s.v,a=Math.max(w,this.snapMinutes);switch(e.key){case"ArrowLeft":n-=a;break;case"ArrowRight":n+=a;break;case"ArrowUp":o+=this.step;break;case"ArrowDown":o-=this.step;break;default:return}e.preventDefault(),this.emitChange(this.movePoint(this.points,t,n,o),t)}curvePath(e,t,s){let n=this.timeline(e);if(!n)return"";let o=new N(n,this.mode),a=Math.max(24,Math.round(this.plotWidth/2)),l=(s-t)/a,u=[],h=null;for(let d=0;d<=a;d++){let f=t+d*l,m=$(o.at(f),this.min,this.max),g=this.xFor(f).toFixed(1),b=this.yFor(m).toFixed(1);this.mode==="step"&&h!==null&&m!==h&&u.push(`L${g},${this.yFor(h).toFixed(1)}`),u.push(`${d===0?"M":"L"}${g},${b}`),h=m}return u.join("")}renderGrid(){let e=this.yLabelStep>0?q(this.min,this.max,this.yLabelStep):Ge(this.min,this.max,this.height<180?3:5),t=this._width<420,s=this.xLabelStep>0?q(0,1440,this.xLabelStep):(t?[0,6,12,18,24]:[0,3,6,9,12,15,18,21,24]).map(o=>o*60),n=C+this.plotHeight;return k`
      ${e.map(o=>k`
          <line class="grid" x1=${te} x2=${this.xFor(this.domainEnd)}
            y1=${this.yFor(o)} y2=${this.yFor(o)}></line>
          <text class="label y" x=${te-6} y=${this.yFor(o)+4}>${H(o,this.yLabelStep||.1,null,this.language)}</text>`)}
      ${s.map(o=>k`
          <line class="grid" x1=${this.xFor(o)} x2=${this.xFor(o)}
            y1=${C} y2=${n}></line>
          <text class="label x" x=${this.xFor(o)} y=${n+17}>${this.xLabelStep>0?D(o):o/60}</text>`)}
      ${this.showContinuation?k`<rect class="next-day" x=${this.xFor(1440)} y=${C}
              width=${this.xFor(this.domainEnd)-this.xFor(1440)}
              height=${this.plotHeight}></rect>
              <text class="label x" x=${this.xFor(1440+Ct/2)}
                y=${C+12}>+1</text>`:p}
    `}renderNow(){if(this.nowMinute===null)return p;let e=this.xFor(this.nowMinute);return k`
      <line class="now" x1=${e} x2=${e} y1=${C} y2=${C+this.plotHeight}></line>
      ${this.nowValue!==null?k`<circle class="now-dot" cx=${e} cy=${this.yFor($(this.nowValue,this.min,this.max))} r="6"></circle>`:p}
    `}renderHandles(e){let t=this._drag;return e.map((s,n)=>{let o=v(s.t),a=this.xFor(o),l=this.yFor($(s.v,this.min,this.max)),u=n===this.selected,h=`${s.t} \xB7 ${H(s.v,this.step,this.unit,this.language)}`;return c`
        <div
          class="handle ${u?"selected":""} ${t?.index===n?"dragging":""}"
          style="transform: translate(${a-Ie/2}px, ${l-Ie/2}px)"
          role="slider"
          tabindex=${this.editable?0:-1}
          aria-label=${h}
          aria-valuemin=${this.min}
          aria-valuemax=${this.max}
          aria-valuenow=${s.v}
          aria-valuetext=${h}
          data-index=${n}
          @pointerdown=${d=>this.onHandlePointerDown(d,n)}
          @pointermove=${d=>this.onHandlePointerMove(d)}
          @pointerup=${d=>this.onHandlePointerUp(d)}
          @pointercancel=${()=>this.onHandlePointerCancel()}
          @lostpointercapture=${d=>this.onHandlePointerUp(d)}
          @keydown=${d=>this.onHandleKeyDown(d,n)}
          @click=${d=>{d.stopPropagation(),this.emitSelect(n)}}
        >
          <span class="dot" style="border-color: ${this.color}"></span>
        </div>
      `})}renderTooltip(){let e=this._drag;if(!e?.moved)return p;let t=e.points[e.index],s=$(this.xFor(v(t.t)),50,this._width-50),n=this.yFor(t.v),o=n>48;return c`<div
      class="tooltip"
      style="left: ${s}px; top: ${o?n-40:n+26}px"
      role="status"
    >
      ${t.t} · ${H(t.v,this.step,this.unit,this.language)}
    </div>`}render(){let e=this.shownPoints,t=this.curvePath(e,0,1440),s=this.showContinuation?this.curvePath(e,1440,this.domainEnd):"";return c`
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
          <path class="curve" d=${t} style="stroke: ${this.color}"></path>
          ${s?k`<path class="curve continuation" d=${s} style="stroke: ${this.color}"></path>`:p}
          ${this.renderNow()}
          ${this._drag?k`
            <line class="guide" x1=${te} x2=${this.xFor(v(e[this._drag.index].t))} y1=${this.yFor(e[this._drag.index].v)} y2=${this.yFor(e[this._drag.index].v)}></line>
            <line class="guide" x1=${this.xFor(v(e[this._drag.index].t))} x2=${this.xFor(v(e[this._drag.index].t))} y1=${this.yFor(e[this._drag.index].v)} y2=${C+this.plotHeight}></line>
          `:p}
          ${this.editable?p:e.map(n=>k`<circle class="marker" cx=${this.xFor(v(n.t))}
                    cy=${this.yFor($(n.v,this.min,this.max))} r="3"
                    style="fill: ${this.color}"></circle>`)}
        </svg>
        ${this.editable?this.renderHandles(e):p} ${this.renderTooltip()}
      </div>
    `}};he.properties={points:{attribute:!1},context:{attribute:!1},mode:{},min:{type:Number},max:{type:Number},step:{type:Number},unit:{},language:{},color:{},snapMinutes:{type:Number,attribute:"snap-minutes"},xLabelStep:{type:Number},yLabelStep:{type:Number},editable:{type:Boolean,reflect:!0},nowMinute:{attribute:!1},nowValue:{attribute:!1},selected:{attribute:!1},height:{type:Number},showContinuation:{type:Boolean,attribute:"show-continuation"},_width:{state:!0},_drag:{state:!0}},he.styles=E`
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
      width: ${Ie}px;
      height: ${Ie}px;
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
  `;customElements.get("curve-scheduler-curve")||customElements.define("curve-scheduler-curve",he);var ui=["\xB0C","\xB0F","K","C","F"],mi=[5,15,30,60],fi=100,pe=class extends y{constructor(){super();this.t=S("en");this.onBeforeUnload=e=>{this.dirty&&(e.preventDefault(),e.returnValue="")};this.language="en",this._undo=[],this._redo=[],this._tab="profiles",this._profileId="",this._selected=null,this._snap=15,this._issues=[],this._message=null,this._saving=!1,this._conflict=!1,this._month="",this._holidays={}}connectedCallback(){super.connectedCallback(),window.addEventListener("beforeunload",this.onBeforeUnload)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("beforeunload",this.onBeforeUnload),clearTimeout(this.messageTimer)}willUpdate(e){e.has("language")&&(this.t=S(this.language)),e.has("data")&&this.data&&!this._saving&&(this._draft?this.data.revision!==this._baseRevision&&(this.dirty?this._conflict=!0:this.resetTo(this.data)):this.resetTo(this.data)),this._month||(this._month=`${Q(new Date).slice(0,8)}01`)}updated(e){(e.has("_tab")||e.has("_month"))&&this._tab==="week"&&this.loadHolidays(this._month),(e.has("_draft")||e.has("_base"))&&this.dispatchEvent(new CustomEvent("dirty-changed",{detail:{dirty:this.dirty},bubbles:!0,composed:!0}))}resetTo(e){this._base=P(e.schedule),this._draft=P(e.schedule),this._baseRevision=e.revision,this._undo=[],this._redo=[],this._issues=[],this._conflict=!1,this._profileId in this._draft.profiles||(this._profileId=Object.keys(this._draft.profiles)[0]??"",this._selected=null);let t=this._draft.profiles[this._profileId]?.points??[];this._selected!==null&&this._selected>=t.length&&(this._selected=null)}get dirty(){return this._draft!==void 0&&JSON.stringify(this._draft)!==JSON.stringify(this._base)}change(e){let t=P(this._draft);e(t),JSON.stringify(t)!==JSON.stringify(this._draft)&&(this._undo=[...this._undo,this._draft].slice(-fi),this._redo=[],this._draft=t,this._issues=[])}undo(){let e=this._undo[this._undo.length-1];e&&(this._redo=[...this._redo,this._draft],this._undo=this._undo.slice(0,-1),this._draft=e,this.fixSelection())}redo(){let e=this._redo[this._redo.length-1];e&&(this._undo=[...this._undo,this._draft],this._redo=this._redo.slice(0,-1),this._draft=e,this.fixSelection())}discard(e=!0){e&&this.dirty&&!window.confirm(this.t("editor.confirm_discard"))||(this.resetTo(this.data),this._draft=P(this._base))}fixSelection(){this._profileId in this._draft.profiles||(this._profileId=Object.keys(this._draft.profiles)[0]??"",this._selected=null);let e=this._draft.profiles[this._profileId]?.points.length??0;this._selected!==null&&this._selected>=e&&(this._selected=null)}confirmLeave(){return this.dirty?window.confirm(this.t("editor.confirm_leave"))?(this.discard(!1),!0):!1:!0}showMessage(e,t=4e3){this._message=e,clearTimeout(this.messageTimer),t>0&&(this.messageTimer=setTimeout(()=>this._message=null,t))}async save(){let e=Pt(this._draft,this.data.config.min,this.data.config.max);if(e.length){this._issues=e,this.showMessage({kind:"error",text:this.t("editor.fix_errors")},0);return}this._saving=!0;try{let t=await Ae(this.hass,this.data.entry_id,this._baseRevision,this._draft);t.ok?(this._base=P(this._draft),this._baseRevision=t.revision,this._undo=[],this._redo=[],this._issues=[],this._conflict=!1,this.showMessage({kind:"success",text:this.t("editor.saved")})):t.conflict?this._conflict=!0:(this._issues=t.errors,this.showMessage({kind:"error",text:this.t("editor.fix_errors")},0))}catch(t){this.showMessage({kind:"error",text:this.t("card.connection_error",{message:t.message??t})},0)}finally{this._saving=!1}}reloadAfterConflict(){this.resetTo(this.data),this._message=null}get config(){return this.data.config}get profile(){return this._draft.profiles[this._profileId]}valueLabel(){return ui.includes(this.config.unit??"")?this.t("point.value"):this.t("point.value_generic")}fmt(e){return H(e,this.config.step,this.config.unit,this.language)}normalizeValue(e){let{min:t,max:s,step:n}=this.config;return $(O($(e,t,s),n),t,s)}describeIssue(e){let t=`error.${e.code}`,s={...e.params};typeof s.value=="number"&&(s.value=this.fmt(s.value)),typeof s.min=="number"&&e.code==="value_out_of_range"&&(s.min=this.fmt(s.min),s.max=this.fmt(s.max)),Array.isArray(s.usages)&&(s.usages=this.describeUsages(s.usages));let n=xt(t)?this.t(t,s):this.t("error.unknown",{code:e.code}),o=/^profiles\.([^.]+)/.exec(e.path),a=o?this._draft.profiles[o[1]]:void 0;return a&&e.code!=="profile_in_use"?`${a.name}: ${n}`:n}describeUsages(e){return e.map(t=>{if(t.startsWith("week."))return this.t(`week.day.${t.slice(5)}`);if(t==="holiday_profile")return this.t("usage.holiday_profile");let s=Number(t.split(".")[1]);return this._draft.exceptions[s]?.note||this.t("usage.exception",{number:s+1})}).join(", ")}issuesFor(e){return this._issues.filter(t=>t.path===e||t.path.startsWith(`${e}.`))}selectProfile(e){this._profileId=e,this._selected=null}addProfile(){if(Object.keys(this._draft.profiles).length>=Z)return;let e=this.t("profiles.new_name"),t=new Set(Object.values(this._draft.profiles).map(o=>o.name.toLowerCase()));for(let o=2;t.has(e.toLowerCase());o++)e=`${this.t("profiles.new_name")} ${o}`;let s=Ye(this._draft,e),n=this.normalizeValue((this.config.min+this.config.max)/2);this.change(o=>{o.profiles[s]={name:e,color:qe(o),points:[{t:"06:00",v:n}]}}),this.selectProfile(s)}duplicateProfile(){let e=this.profile;if(!e||Object.keys(this._draft.profiles).length>=Z)return;let t=`${e.name} ${this.t("profiles.copy_suffix")}`.slice(0,G),s=new Set(Object.values(this._draft.profiles).map(o=>o.name.toLowerCase()));for(let o=2;s.has(t.toLowerCase());o++)t=`${e.name} ${o}`.slice(0,G);let n=Ye(this._draft,t);this.change(o=>{o.profiles[n]={...P(e),name:t,color:qe(o)}}),this.selectProfile(n)}deleteProfile(){let e=this.profile;if(!e)return;if(Object.keys(this._draft.profiles).length<=1){this.showMessage({kind:"warning",text:this.t("profiles.last")});return}let t=St(this._draft,this._profileId);if(t.length){this.showMessage({kind:"warning",text:this.t("profiles.in_use",{name:e.name,usages:this.describeUsages(t)})},8e3);return}if(!window.confirm(this.t("profiles.confirm_delete",{name:e.name})))return;let s=this._profileId;this.change(n=>{delete n.profiles[s]}),this.selectProfile(Object.keys(this._draft.profiles)[0])}renameProfile(e){let t=this._profileId;this.change(s=>{s.profiles[t].name=e.slice(0,G)})}recolorProfile(e){let t=this._profileId;this.change(s=>{s.profiles[t].color=e})}copyCurveFrom(e){let t=this._draft.profiles[e],s=this.profile;if(!t||!s||e===this._profileId||!window.confirm(this.t("profiles.confirm_copy",{target:s.name,source:t.name})))return;let n=this._profileId;this.change(o=>{o.profiles[n].points=P(t.points)}),this._selected=null}setPoints(e,t){let s=this._profileId;this.change(n=>{n.profiles[s].points=e}),this._selected=t}addPoint(){let e=this.profile;if(!e)return;if(e.points.length>=L){this.showMessage({kind:"warning",text:this.t("point.full",{max:L})});return}let t=Tt(e.points);if(t===void 0)return;let s=this.renderRoot.querySelector("curve-scheduler-curve"),n=this.normalizeValue(s?.curveValue(t)??(this.config.min+this.config.max)/2),o=P(e.points),a=Xe(o,{t:D(t),v:n});this.setPoints(o,a)}deletePoint(e){let t=this.profile;if(!t)return;if(t.points.length<=1){this.showMessage({kind:"warning",text:this.t("point.min")});return}let s=P(t.points);s.splice(e,1),this.setPoints(s,null)}setPointTime(e,t){let s=this.profile;if(!s||!/^\d{1,2}:\d{2}/.test(t)){this.requestUpdate();return}let n=v(t.slice(0,5));n=Math.round(n/w)*w,n>=1440&&(n=1440-w);let o=D(n);if(s.points.some((h,d)=>d!==e&&h.t===o)){this.showMessage({kind:"warning",text:this.t("point.taken",{time:o})}),this.requestUpdate();return}let a=P(s.points),[l]=a.splice(e,1),u=Xe(a,{...l,t:o});this.setPoints(a,u)}setPointValue(e,t){let s=this.profile;if(!s||Number.isNaN(t)){this.requestUpdate();return}let n=P(s.points);n[e]={...n[e],v:this.normalizeValue(t)},this.setPoints(n,e)}nudgePoint(e,t){let s=this.profile?.points[e];s&&this.setPointValue(e,s.v+t*this.config.step)}setWeekday(e,t){this.change(s=>{s.week[e]=t})}setHolidayProfile(e){this.change(t=>{t.holiday_profile=e})}today(){return this.data.state.now.slice(0,10)}addException(){let e=this.today(),t=Object.keys(this._draft.profiles).find(s=>/urlaub|holiday|vacation/i.test(s))??this._draft.holiday_profile;this.change(s=>{s.exceptions.push({from:e,to:Me(e,6),profile:t,note:this.t("holiday.note_default")})})}updateException(e,t,s){this.change(n=>{let o=n.exceptions[e];o[t]=t==="note"?s.slice(0,ce):s,t==="from"&&o.to<s&&(o.to=s)})}deleteException(e){this.change(t=>{t.exceptions.splice(e,1)})}removePastExceptions(){let e=this.today();this.change(t=>{t.exceptions=t.exceptions.filter(s=>s.to>=e)})}async loadHolidays(e){if(!this.config.holiday_source||this._holidays[e]||!this.hass)return;let t=e,s=ee(e),n=Q(new Date(s.getFullYear(),s.getMonth()+1,0,12));try{let o=await _t(this.hass,this.data.entry_id,t,n);this._holidays={...this._holidays,[e]:new Set(o.holidays)}}catch{this._holidays={...this._holidays,[e]:new Set}}}shiftMonth(e){let t=ee(this._month);this._month=Q(new Date(t.getFullYear(),t.getMonth()+e,1,12))}profileOptions(e){return Object.entries(this._draft.profiles).map(([t,s])=>c`<option value=${t} ?selected=${t===e}>${s.name}</option>`)}renderTabs(){return c`<div class="tabs" role="tablist">
      ${[["profiles","editor.tab.profiles"],["week","editor.tab.week"],["exceptions","editor.tab.exceptions"]].map(([t,s])=>c`<button
            role="tab"
            class="tab ${this._tab===t?"active":""}"
            aria-selected=${this._tab===t}
            @click=${()=>this._tab=t}
          >
            ${this.t(s)}
          </button>`)}
    </div>`}renderProfileChips(){return c`<div class="chips" role="tablist">
      ${Object.entries(this._draft.profiles).map(([e,t])=>c`<button
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
        ?disabled=${Object.keys(this._draft.profiles).length>=Z}
        @click=${()=>this.addProfile()}
      >
        + ${this.t("profiles.add")}
      </button>
    </div>`}renderProfileSettings(e){return c`<div class="profile-settings">
      <label class="field grow">
        ${this.t("profiles.name")}
        <input
          type="text"
          .value=${e.name}
          maxlength=${G}
          @change=${t=>this.renameProfile(t.target.value)}
        />
      </label>
      <div class="field">
        <span class="muted">${this.t("profiles.color")}</span>
        <div class="colors" role="radiogroup" aria-label=${this.t("profiles.color")}>
          ${Ce.map(t=>c`<button
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
        <button @click=${()=>this.duplicateProfile()}>${this.t("profiles.duplicate")}</button>
        <button class="danger" @click=${()=>this.deleteProfile()}>
          ${this.t("profiles.delete")}
        </button>
      </div>
    </div>`}renderSelectedPoint(e){let t=this._selected;if(t===null||!e.points[t])return p;let s=e.points[t];return c`<div class="selected-point" aria-live="polite">
      <div class="muted">${this.t("point.selected")}</div>
      <div class="row">
        <label class="field">
          ${this.t("point.time")}
          <input
            type="time"
            step="300"
            .value=${s.t}
            @change=${n=>this.setPointTime(t,n.target.value)}
          />
        </label>
        ${this.renderValueInput(t,s)}
        <button class="danger" @click=${()=>this.deletePoint(t)}>
          ${this.t("point.delete")}
        </button>
      </div>
    </div>`}renderPlainValueInput(e,t){return c`<input
      class="value"
      type="text"
      inputmode="decimal"
      aria-label=${this.valueLabel()}
      .value=${j(t.v,this.config.step,this.language)}
      @change=${s=>this.setPointValue(e,je(s.target.value))}
    />`}renderValueInput(e,t,s=!0){let n=c`<div class="stepper">
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
        .value=${j(t.v,this.config.step,this.language)}
        @change=${o=>this.setPointValue(e,je(o.target.value))}
      />
      <button
        class="icon"
        aria-label=${this.t("point.plus")}
        @click=${()=>this.nudgePoint(e,1)}
      >
        +
      </button>
    </div>`;return s?c`<div class="field">
          <span class="muted">${this.valueLabel()}${this.config.unit?` (${this.config.unit})`:""}</span>
          ${n}
        </div>`:n}renderPointTable(e){return c`<table class="points">
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
          ${e.points.map((t,s)=>c`<tr
                class=${s===this._selected?"selected":""}
                data-index=${s}
                @focusin=${()=>this._selected=s}
              >
                <td>
                  <input
                    type="time"
                    step="300"
                    aria-label=${this.t("point.time")}
                    .value=${t.t}
                    @change=${n=>this.setPointTime(s,n.target.value)}
                  />
                </td>
                <td>${this.renderPlainValueInput(s,t)}</td>
                <td>
                  <button
                    class="icon flat delete"
                    aria-label=${this.t("point.delete")}
                    title=${this.t("point.delete")}
                    ?disabled=${e.points.length<=1}
                    @click=${()=>this.deletePoint(s)}
                  >
                    🗑
                  </button>
                </td>
              </tr>`)}
        </tbody>
      </table>
      <button
        class="add-point"
        ?disabled=${e.points.length>=L}
        @click=${()=>this.addPoint()}
      >
        ${this.t("point.add")}
      </button>`}renderProfilesTab(){let e=this.profile;if(!e)return this.renderProfileChips();let t=Object.entries(this._draft.profiles).filter(([n])=>n!==this._profileId),s=this.issuesFor(`profiles.${this._profileId}`);return c`
      ${this.renderProfileChips()} ${this.renderProfileSettings(e)}
      ${s.length?c`<div class="notice error">
            ${s.map(n=>c`<div>${this.describeIssue(n)}</div>`)}
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
          @points-changed=${n=>this.setPoints(n.detail.points,n.detail.selected)}
          @point-selected=${n=>this._selected=n.detail.index}
          @curve-notice=${n=>this.showMessage({kind:"warning",text:this.t(n.detail.key,n.detail.params)})}
        ></curve-scheduler-curve>
      </div>
      <div class="row chart-footer">
        <span class="muted grow">${this.t("profiles.hint")}</span>
        <label class="field inline">
          ${this.t("profiles.snap")}
          <select
            @change=${n=>this._snap=Number(n.target.value)}
          >
            ${mi.map(n=>c`<option value=${n} ?selected=${n===this._snap}>
                  ${this.t("profiles.snap_minutes",{minutes:n})}
                </option>`)}
          </select>
        </label>
      </div>
      ${this.renderSelectedPoint(e)} ${this.renderPointTable(e)}
      ${t.length?c`<div class="row copy">
            <label class="field grow">
              ${this.t("profiles.copy_from")}
              <select id="copy-source">
                ${t.map(([n,o])=>c`<option value=${n}>${o.name}</option>`)}
              </select>
            </label>
            <button
              class="copy-button"
              @click=${()=>this.copyCurveFrom(this.renderRoot.querySelector("#copy-source").value)}
            >
              ${this.t("profiles.copy")}
            </button>
          </div>`:p}
    `}renderWeekTab(){let e=this._draft;return c`
      <h3>${this.t("week.title")}</h3>
      <div class="week">
        ${J.map(t=>{let s=e.profiles[e.week[t]]?.color??"transparent";return c`<label class="week-row" style="--row-color: ${s}">
            <span class="day">${this.t(`week.day.${t}`)}</span>
            <select
              data-day=${t}
              @change=${n=>this.setWeekday(t,n.target.value)}
            >
              ${this.profileOptions(e.week[t])}
            </select>
          </label>`})}
        <label
          class="week-row holiday"
          style="--row-color: ${e.profiles[e.holiday_profile]?.color??"transparent"}"
        >
          <span class="day">${this.t("week.holiday")}</span>
          <select
            @change=${t=>this.setHolidayProfile(t.target.value)}
          >
            ${this.profileOptions(e.holiday_profile)}
          </select>
        </label>
        ${this.config.holiday_source?p:c`<div class="muted">${this.t("week.no_holiday_source")}</div>`}
      </div>
      ${this.renderMonth()}
    `}renderMonth(){let e=ee(this._month),t=e.getFullYear(),s=e.getMonth(),n=new Date(t,s+1,0).getDate(),o=(e.getDay()+6)%7,a=this._holidays[this._month]??new Set,l=this.today(),u=new Intl.DateTimeFormat(this.language,{month:"long",year:"numeric"}).format(e),h=J.map((f,m)=>new Intl.DateTimeFormat(this.language,{weekday:"short"}).format(new Date(2024,0,1+m,12))),d=[];for(let f=0;f<o;f++)d.push(c`<div class="cell empty"></div>`);for(let f=1;f<=n;f++){let m=Q(new Date(t,s,f,12)),g=At(this._draft,m,x=>a.has(x)),b=this._draft.profiles[g.profileId],_=g.reason==="holiday"?"\u2605":g.reason==="exception"?"\u2708":"";d.push(c`<div
          class="cell ${m===l?"today":""}"
          style="--cell-color: ${b?.color??"transparent"}"
          title="${m}: ${b?.name??""}"
        >
          <span class="num">${f}</span><span class="mark">${_}</span>
        </div>`)}return c`<div class="month">
      <div class="month-header">
        <button
          class="icon"
          aria-label=${this.t("week.prev_month")}
          @click=${()=>this.shiftMonth(-1)}
        >
          ‹
        </button>
        <strong>${this.t("week.preview")}: ${u}</strong>
        <button
          class="icon"
          aria-label=${this.t("week.next_month")}
          @click=${()=>this.shiftMonth(1)}
        >
          ›
        </button>
      </div>
      <div class="calendar">
        ${h.map(f=>c`<div class="cell head">${f}</div>`)} ${d}
      </div>
      <div class="legend">
        ${Object.values(this._draft.profiles).map(f=>c`<span class="row"
              ><span class="swatch" style="background: ${f.color}"></span>${f.name}</span
            >`)}
        <span>★ ${this.t("week.legend_holiday")}</span>
        <span>✈ ${this.t("week.legend_exception")}</span>
      </div>
    </div>`}renderExceptionsTab(){let e=this.today(),t=this._draft.exceptions,s=t.some(n=>n.to<e);return c`
      <h3>${this.t("exceptions.title")}</h3>
      ${t.length===0?c`<div class="muted">${this.t("exceptions.empty")}</div>`:p}
      <div class="exceptions">
        ${t.map((n,o)=>{let a=n.to<e,l=n.from<=e&&e<=n.to,u=this.issuesFor(`exceptions.${o}`),h=this._draft.profiles[n.profile]?.color??"transparent";return c`<div
            class="exception ${a?"past":""}"
            style="--row-color: ${h}"
            data-index=${o}
          >
            <div class="row">
              <label class="field">
                ${this.t("exceptions.from")}
                <input
                  type="date"
                  .value=${n.from}
                  @change=${d=>this.updateException(o,"from",d.target.value)}
                />
              </label>
              <label class="field">
                ${this.t("exceptions.to")}
                <input
                  type="date"
                  .value=${n.to}
                  min=${n.from}
                  @change=${d=>this.updateException(o,"to",d.target.value)}
                />
              </label>
              ${a?c`<span class="badge">${this.t("exceptions.past")}</span>`:p}
              ${l?c`<span class="badge active">${this.t("exceptions.active")}</span>`:p}
            </div>
            <div class="row">
              <label class="field grow">
                ${this.t("exceptions.profile")}
                <select
                  @change=${d=>this.updateException(o,"profile",d.target.value)}
                >
                  ${this.profileOptions(n.profile)}
                </select>
              </label>
              <label class="field grow">
                ${this.t("exceptions.note")}
                <input
                  type="text"
                  maxlength=${ce}
                  .value=${n.note??""}
                  @change=${d=>this.updateException(o,"note",d.target.value)}
                />
              </label>
              <button class="danger" @click=${()=>this.deleteException(o)}>
                ${this.t("exceptions.delete")}
              </button>
            </div>
            ${u.length?c`<div class="notice error">
                  ${u.map(d=>c`<div>${this.describeIssue(d)}</div>`)}
                </div>`:p}
          </div>`})}
      </div>
      <div class="row">
        <button class="primary-outline" @click=${()=>this.addException()}>
          ${this.t("exceptions.add")}
        </button>
        ${s?c`<button @click=${()=>this.removePastExceptions()}>
              ${this.t("exceptions.remove_past")}
            </button>`:p}
      </div>
      <label class="check">
        <input
          type="checkbox"
          .checked=${this._draft.auto_cleanup}
          @change=${n=>{let o=n.target.checked;this.change(a=>{a.auto_cleanup=o})}}
        />
        ${this.t("exceptions.auto_cleanup")}
      </label>
    `}renderFooter(){let e=this._issues.filter(t=>!(this._tab==="profiles"&&t.path.startsWith(`profiles.${this._profileId}`))&&!(this._tab==="exceptions"&&t.path.startsWith("exceptions.")));return c`
      ${this._conflict?c`<div class="notice warning row">
            <span class="grow">${this.t("editor.conflict")}</span>
            <button @click=${()=>this.reloadAfterConflict()}>${this.t("editor.reload")}</button>
          </div>`:p}
      ${e.length?c`<div class="notice error">
            ${e.map(t=>c`<div>${this.describeIssue(t)}</div>`)}
          </div>`:p}
      ${this._message?c`<div class="notice ${this._message.kind}" role="status">${this._message.text}</div>`:this.dirty?c`<div class="muted unsaved">${this.t("editor.unsaved")}</div>`:p}
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
    `}render(){if(!this._draft)return p;let e;switch(this._tab){case"week":e=this.renderWeekTab();break;case"exceptions":e=this.renderExceptionsTab();break;default:e=this.renderProfilesTab()}return c`${this.renderTabs()}
      <div class="body" role="tabpanel">${e}</div>
      ${this.renderFooter()}`}};pe.properties={hass:{attribute:!1},data:{attribute:!1},language:{},_draft:{state:!0},_base:{state:!0},_baseRevision:{state:!0},_undo:{state:!0},_redo:{state:!0},_tab:{state:!0},_profileId:{state:!0},_selected:{state:!0},_snap:{state:!0},_issues:{state:!0},_message:{state:!0},_saving:{state:!0},_conflict:{state:!0},_month:{state:!0},_holidays:{state:!0}},pe.styles=[A,E`
      :host {
        display: flex;
        flex-direction: column;
        gap: var(--zp-gap);
      }
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
    `];customElements.get("curve-scheduler-editor")||customElements.define("curve-scheduler-editor",pe);var gi={en:{x:"Input",y:"Output",add:"Add point",remove:"Delete",save:"Save",discard:"Discard",edit:"Edit curve",conflict:"Changed elsewhere. Discard to reload before saving.",invalid:"Check points: finite numbers, ascending unique inputs within axis limits and outputs within limits.",failed:"Could not save",unavailable:"Input unavailable",wrap:"Wrapping",clamp:"Clamped",dirty:"Unsaved changes",saved:"Saved"},de:{x:"Eingang",y:"Ausgang",add:"Punkt hinzuf\xFCgen",remove:"L\xF6schen",save:"Speichern",discard:"Verwerfen",edit:"Kurve bearbeiten",conflict:"Andernorts ge\xE4ndert. Vor dem Speichern verwerfen und neu laden.",invalid:"Punkte pr\xFCfen: endliche Zahlen, aufsteigende eindeutige Eing\xE4nge und Ausg\xE4nge innerhalb der Grenzen.",failed:"Speichern fehlgeschlagen",unavailable:"Eingang nicht verf\xFCgbar",wrap:"Umlaufend",clamp:"Begrenzt",dirty:"Ungespeicherte \xC4nderungen",saved:"Gespeichert"}},ue=class extends y{constructor(){super();this.revision=0;this.base="";this.drag=null;this.beforeUnload=e=>{this.dirty&&(e.preventDefault(),e.returnValue="")};this.editable=!1,this.language="en",this.points=[],this.editing=!1,this.message="",this.saving=!1}connectedCallback(){super.connectedCallback(),window.addEventListener("beforeunload",this.beforeUnload)}disconnectedCallback(){window.removeEventListener("beforeunload",this.beforeUnload),super.disconnectedCallback()}get text(){return gi[this.language.startsWith("de")?"de":"en"]}get dirty(){return JSON.stringify(this.points)!==this.base}willUpdate(e){e.has("data")&&this.data&&(!this.base||!this.dirty)&&!this.saving&&this.reset()}reset(){this.points=P(this.data.schedule.curve??[]),this.revision=this.data.revision,this.base=JSON.stringify(this.points),this.message=""}confirmLeave(e){return this.dirty?window.confirm(e)?(this.reset(),!0):!1:!0}changed(e,t,s){this.points=this.points.map((n,o)=>o===e?{...n,[t]:s}:n)}get valid(){let e=this.data.config.axis;return this.points.length>=1&&this.points.length<=48&&this.points.every((t,s)=>Number.isFinite(t.x)&&Number.isFinite(t.v)&&t.x>=e.min&&t.x<=e.max&&(!e.wrap||t.x<e.max)&&(s===0||t.x>this.points[s-1].x)&&t.v>=this.data.config.min&&t.v<=this.data.config.max)}async save(){if(!this.valid){this.message=this.text.invalid;return}this.saving=!0;try{let e=await Ae(this.hass,this.data.entry_id,this.revision,{...this.data.schedule,curve:this.points});e.ok?(this.revision=e.revision,this.base=JSON.stringify(this.points),this.message=this.text.saved):this.message=e.conflict?this.text.conflict:this.text.invalid}catch{this.message=this.text.failed}finally{this.saving=!1}}add(){let e=this.data.config.axis,t=[e.min-e.step,...this.points.map(o=>o.x),e.max],s,n=0;for(let o=1;o<t.length;o++){let a=e.min+O((t[o-1]+t[o])/2-e.min,e.step);t[o]-t[o-1]>n&&a>=e.min&&a<=e.max&&(!e.wrap||a<e.max)&&!this.points.some(l=>l.x===a)&&(s=a,n=t[o]-t[o-1])}s!==void 0&&(this.points=[...this.points,{x:s,v:this.data.config.min}].sort((o,a)=>o.x-a.x))}move(e){if(this.drag===null||this.saving)return;let t=e.currentTarget.getBoundingClientRect(),s=this.data.config.axis,n=s.min+O($((e.clientX-t.left)/t.width,0,1)*(s.max-s.min),s.step),o=this.drag?this.points[this.drag-1].x+s.step:s.min,a=this.drag+1<this.points.length?this.points[this.drag+1].x-s.step:s.max-(s.wrap?s.step:0);if(o>a)return;let l=this.data.config.max-$((e.clientY-t.top)/t.height,0,1)*(this.data.config.max-this.data.config.min);this.points=this.points.map((u,h)=>h===this.drag?{x:$(n,o,a),v:$(O(l,this.data.config.step),this.data.config.min,this.data.config.max)}:u)}endDrag(e){this.drag=null,e.currentTarget.releasePointerCapture?.(e.pointerId)}render(){if(!this.data?.config.axis)return p;let{config:e,state:t}=this.data,s=e.axis,n=m=>100*(m-s.min)/(s.max-s.min),o=m=>100*(e.max-m)/(e.max-e.min),a=q(s.min,s.max,e.x_label_step),l=q(e.min,e.max,e.y_label_step),u=m=>j(m,e.x_label_step||s.step,this.language),h=m=>j(m,e.y_label_step||e.step,this.language),d=this.drag===null?null:this.points[this.drag],f="";if(this.valid){let m=this.points.map(x=>[x.x,x.v]);if(s.wrap){let x=s.max-s.min;m=[-2,-1,0,1,2].flatMap(R=>m.map(([Ut,Ft])=>[Ut+R*x,Ft]))}let g=new N(m,e.interpolation),b=Array.from({length:289},(x,R)=>s.min+(s.max-s.min)*R/288);f=[...new Set([...b,...this.points.flatMap(x=>[Math.max(s.min,x.x-(s.max-s.min)*1e-9),x.x])])].sort((x,R)=>x-R).map((x,R)=>`${R?"L":"M"}${n(x)},${o(g.at(x))}`).join(" ")}return c`
      <p>${this.text.x}: ${t.input_value??"\u2014"} → ${this.text.y}: ${t.value??"\u2014"} ${e.unit??""}</p>
      <p class="muted">${s.source==="sensor"?s.input_entity:s.source} · ${s.min}…${s.max} · ${s.wrap?this.text.wrap:this.text.clamp}</p>
      ${t.input_available===!1?c`<p role="status">${this.text.unavailable}</p>`:p}
      <div class="graph"><div class="plot">
      <div class="y-axis">${l.map(m=>c`<span class="tick-y" style="top:${o(m)}%">${h(m)}</span>`)}</div>
      <div class="x-axis">${a.map(m=>c`<span class="tick-x" style="left:${n(m)}%">${u(m)}</span>`)}</div>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-label=${this.text.edit} role="img"
        @pointermove=${this.move} @pointerup=${this.endDrag} @pointercancel=${this.endDrag} @lostpointercapture=${()=>{this.drag=null}}>
        ${a.map(m=>k`<line class="grid" x1=${n(m)} x2=${n(m)} y1="0" y2="100"></line>`)}
        ${l.map(m=>k`<line class="grid" x1="0" x2="100" y1=${o(m)} y2=${o(m)}></line>`)}
        <path d=${f}></path>
        ${d?k`<line class="guide" x1="0" x2=${n(d.x)} y1=${o(d.v)} y2=${o(d.v)}></line><line class="guide" x1=${n(d.x)} x2=${n(d.x)} y1=${o(d.v)} y2="100"></line>`:p}
        ${t.input_value!=null?k`<line x1=${n(t.input_value)} x2=${n(t.input_value)} y1="0" y2="100"></line>`:p}
        ${this.editing&&this.editable?this.points.map((m,g)=>k`<ellipse cx=${n(m.x)} cy=${o(m.v)} rx="1.5" ry="3" @pointerdown=${b=>{this.saving||(this.drag=g,b.currentTarget.closest("svg")?.setPointerCapture(b.pointerId))}}></ellipse>`):p}
      </svg>
      ${d?c`<span class="axis-hit hit-x" style="left:${n(d.x)}%">${u(d.x)}</span><span class="axis-hit hit-y" style="top:${o(d.v)}%">${h(d.v)}</span>`:p}
      </div></div>
      ${this.editable?c`<button @click=${()=>{(!this.editing||!this.dirty||window.confirm(this.text.discard))&&(this.editing&&this.reset(),this.editing=!this.editing)}}>${this.text.edit}</button>`:p}
      ${this.editable&&this.editing?c`
        ${this.points.map((m,g)=>c`<div class="row">
          <label>${this.text.x}<input type="number" step=${s.step} min=${s.min} max=${s.max} .value=${String(m.x)} ?disabled=${this.saving} @change=${b=>this.changed(g,"x",Number(b.target.value))}></label>
          <label>${this.text.y}<input type="number" step=${e.step} min=${e.min} max=${e.max} .value=${String(m.v)} ?disabled=${this.saving} @change=${b=>this.changed(g,"v",Number(b.target.value))}></label>
          <button aria-label=${`${this.text.remove} ${g+1}`} ?disabled=${this.saving||this.points.length<=1} @click=${()=>{this.points=this.points.filter((b,_)=>g!==_)}}>${this.text.remove}</button>
        </div>`)}
        <button ?disabled=${this.saving||this.points.length>=48} @click=${this.add}>${this.text.add}</button>
        <button ?disabled=${this.saving} @click=${this.reset}>${this.text.discard}</button>
        <button ?disabled=${this.saving||!this.dirty||!this.valid} @click=${this.save}>${this.text.save}</button>
        ${this.dirty?c`<p>${this.text.dirty}</p>`:p}
      `:p}
      <p role="status">${this.message}</p>`}};ue.properties={drag:{state:!0},hass:{attribute:!1},data:{attribute:!1},editable:{type:Boolean},language:{},points:{state:!0},editing:{state:!0},message:{state:!0},saving:{state:!0}},ue.styles=[A,E`
    :host { display:block; } svg { width:100%; height:220px; overflow:visible; border:1px solid var(--divider-color); touch-action:pan-y; }
    :host:has(ellipse) svg { touch-action:none; }
    path { fill:none; stroke:var(--primary-color); stroke-width:2; vector-effect:non-scaling-stroke; }
    line { stroke:var(--error-color); stroke-width:1; vector-effect:non-scaling-stroke; }
    .graph { position:relative; padding:10px 28px 34px 70px; }
    .plot { position:relative; } svg { display:block; }
    .y-axis { position:absolute; top:0; right:calc(100% + 8px); height:100%; width:62px; }
    .x-axis { position:absolute; top:calc(100% + 8px); left:0; width:100%; }
    .tick-y { position:absolute; right:0; transform:translateY(-50%); }
    .tick-x { position:absolute; transform:translateX(-50%); white-space:nowrap; }
    .x-axis, .y-axis, .axis-hit { font-size:12px; color:var(--secondary-text-color); pointer-events:none; }
    .axis-hit { position:absolute; padding:2px; background:var(--card-background-color); color:var(--primary-color); font-weight:bold; white-space:nowrap; }
    .hit-x { top:calc(100% + 8px); transform:translateX(-50%); } .hit-y { right:calc(100% + 8px); transform:translateY(-50%); }
    line.grid { stroke:var(--divider-color); } line.guide { stroke:var(--primary-color); stroke-dasharray:4 3; pointer-events:none; }
    ellipse { fill:var(--primary-color); cursor:grab; stroke:transparent; stroke-width:44; vector-effect:non-scaling-stroke; pointer-events:all; } input { width:100%; box-sizing:border-box; }
    .row { display:flex; justify-content:space-between; gap:8px; align-items:end; margin:8px 0; } label { min-width:0; }
  `];customElements.define("curve-scheduler-numeric-editor",ue);var me=class extends y{constructor(){super();this.receivedAt=Date.now();this.t=S("en");this.language="en";this._data=null,this._error=null,this._editorOpen=!1,this._holidayForm=null,this._notice=null,this._tick=0}static getConfigElement(){return document.createElement("curve-scheduler-card-editor")}static getStubConfig(){return{view:"compact",allow_edit:!0}}setConfig(e){if(!e)throw new Error("Invalid configuration");let t=this._config?.entry_id!==e.entry_id;this._config={view:"compact",allow_edit:!0,...e},t&&this.resubscribe()}getCardSize(){return this._config?.view==="full"?14:5}getGridOptions(){return{columns:12,min_columns:6,rows:"auto"}}connectedCallback(){super.connectedCallback(),this.timer=setInterval(()=>this._tick+=1,3e4),this.hass&&this._config&&this.resubscribe()}disconnectedCallback(){super.disconnectedCallback(),clearInterval(this.timer),this.teardown()}willUpdate(e){if(e.has("hass")&&this.hass){let t=X(this.hass);t!==this.language&&(this.language=t,this.t=S(t)),!this.unsubscribe&&this._config&&this.resubscribe()}}async teardown(){let e=this.unsubscribe;if(this.unsubscribe=void 0,this.subscribedEntry=void 0,e)try{await(await e)()}catch{}}async resubscribe(){if(!this.hass||!this._config||!this.isConnected)return;let e=this._config.entry_id;if(!e){try{e=(await Y(this.hass))[0]?.entry_id}catch(s){this._error=this.t("card.connection_error",{message:s.message});return}if(!e){this._error=this.t("card.no_instance");return}}if(e===this.subscribedEntry&&this.unsubscribe)return;await this.teardown(),this.subscribedEntry=e,this._error=null;let t=bt(this.hass,e,s=>{this._data=s,this.receivedAt=Date.now()});this.unsubscribe=t;try{await t}catch(s){this.unsubscribe=void 0,this.subscribedEntry=void 0;let n=s.code;this._error=n==="not_found"?this.t("card.not_found"):this.t("card.connection_error",{message:s.message??n})}}get canEdit(){return this._config.allow_edit!==!1||this.hass?.user?.is_admin===!0}get editor(){return this.renderRoot.querySelector("curve-scheduler-editor")}confirmLeave(){return this.editor?this.editor.confirmLeave():this.renderRoot.querySelector("curve-scheduler-numeric-editor")?.confirmLeave(this.t("editor.confirm_leave"))??!0}toggleEditor(){if(this._editorOpen){if(this.editor&&!this.editor.confirmLeave())return;this._editorOpen=!1}else this._editorOpen=!0}nowMinute(e){let t=v(e.state.now.slice(11,16))+Number(e.state.now.slice(17,19))/60,s=(Date.now()-this.receivedAt)/6e4;return Math.min(1440,t+Math.max(0,s))}fmt(e){let t=this._data.config;return H(e,t.step,t.unit,this.language)}async changeMode(e){try{await yt(this.hass,this._data.entry_id,e==="auto"?null:e)}catch(t){this._notice=t.message}}openHolidayForm(){let e=this._data,t=e.state.now.slice(0,10),n=Object.keys(e.schedule.profiles).find(o=>/urlaub|holiday|vacation/i.test(o))??e.schedule.holiday_profile;this._holidayForm={from:t,to:Me(t,6),profile:n,note:this.t("holiday.note_default")}}async submitHoliday(){let e=this._holidayForm;if(!e||!e.from)return;let t=e.to&&e.to>=e.from?e.to:e.from;try{await $t(this.hass,this._data.entry_id,e.from,t,e.profile,e.note),this._holidayForm=null,this._notice=this.t("holiday.added"),setTimeout(()=>this._notice=null,4e3)}catch(s){this._notice=s.message}}renderToday(e){let{state:t,schedule:s,config:n}=e,o=s.profiles[t.profile_id],a=t.timeline.map(_=>_.profile_id),l=[a[0],a[1],a[3],a[4]].map(_=>s.profiles[_]?Ke(s.profiles[_]):[]),u=this.nowMinute(e),h=o?Ke(o):[],d=de([l[0],l[1],h,l[2],l[3]]),f=d.length?new N(d,n.interpolation).at(u):null,m=[this.t("today.title",{profile:o?.name??"?"}),this.t("today.now",{value:t.value===null?"\u2014":this.fmt(t.value)})];t.next_point&&m.push(this.t("today.next",{time:t.next_point.hhmm,value:this.fmt(t.next_point.value)}));let g="";if(t.reason!=="weekday"&&(g=this.t(`today.reason.${t.reason}`),t.reason==="override"&&t.override?.until)){let _=new Date(t.override.until);g+=` \xB7 ${this.t("today.until",{time:new Intl.DateTimeFormat(this.language,{weekday:"short",hour:"2-digit",minute:"2-digit"}).format(_)})}`}let b=t.override?t.override.profile:"auto";return c`
      <div class="summary">
        <div class="headline">${m.join(" \xB7 ")}</div>
        ${g?c`<div class="muted">${g}</div>`:p}
      </div>
      <curve-scheduler-curve
        .points=${o?.points??[]}
        .context=${l}
        .mode=${n.interpolation}
        .min=${n.min}
        .max=${n.max}
        .step=${n.step}
        .xLabelStep=${n.x_label_step??0}
        .yLabelStep=${n.y_label_step??0}
        .unit=${n.unit}
        .language=${this.language}
        .color=${o?.color??"var(--primary-color)"}
        .nowMinute=${u}
        .nowValue=${f}
        .height=${170}
        .showContinuation=${!1}
      ></curve-scheduler-curve>
      ${t.enabled?p:c`<div class="notice warning">${this.t("today.disabled")}</div>`}
      ${t.enabled&&n.target&&!t.target_available?c`<div class="notice warning">${this.t("today.unavailable")}</div>`:p}
      <div class="actions">
        <label class="field mode">
          ${this.t("today.mode")}
          <select
            class="mode-select"
            @change=${_=>this.changeMode(_.target.value)}
          >
            <option value="auto" ?selected=${b==="auto"}>
              ${this.t("today.mode.auto")}
            </option>
            ${Object.entries(s.profiles).map(([_,x])=>c`<option value=${_} ?selected=${b===_}>${x.name}</option>`)}
          </select>
        </label>
        <button @click=${()=>this._holidayForm?this._holidayForm=null:this.openHolidayForm()}>
          ${this.t("today.add_holiday")}
        </button>
        ${this._config.view!=="full"&&this.canEdit?c`<button class="primary edit" @click=${()=>this.toggleEditor()}>
              ${this._editorOpen?this.t("today.close_editor"):this.t("today.edit")}
            </button>`:p}
      </div>
      ${this._holidayForm?this.renderHolidayForm(e):p}
      ${this._notice?c`<div class="notice success" role="status">${this._notice}</div>`:p}
    `}renderHolidayForm(e){let t=this._holidayForm,s=n=>o=>{this._holidayForm={...t,[n]:o.target.value}};return c`<div class="holiday-form">
      <strong>${this.t("holiday.title")}</strong>
      <div class="row">
        <label class="field">
          ${this.t("holiday.from")}
          <input type="date" .value=${t.from} @change=${s("from")} />
        </label>
        <label class="field">
          ${this.t("holiday.to")}
          <input type="date" .value=${t.to} min=${t.from} @change=${s("to")} />
        </label>
      </div>
      <div class="row">
        <label class="field grow">
          ${this.t("holiday.profile")}
          <select @change=${s("profile")}>
            ${Object.entries(e.schedule.profiles).map(([n,o])=>c`<option value=${n} ?selected=${n===t.profile}>${o.name}</option>`)}
          </select>
        </label>
        <label class="field grow">
          ${this.t("holiday.note")}
          <input type="text" maxlength="100" .value=${t.note} @change=${s("note")} />
        </label>
      </div>
      <div class="row end">
        <button @click=${()=>this._holidayForm=null}>${this.t("holiday.cancel")}</button>
        <button class="primary" @click=${()=>this.submitHoliday()}>${this.t("holiday.save")}</button>
      </div>
    </div>`}render(){if(!this._config)return p;let e=this._config.title??this._data?.title,t;if(this._error)t=c`<div class="notice error">${this._error}</div>`;else if(!this._data)t=c`<div class="muted">${this.t("card.loading")}</div>`;else{let s=this.canEdit&&(this._config.view==="full"||this._editorOpen);t=this._data.config.axis&&this._data.config.axis.source!=="time_of_day"?c`
        <curve-scheduler-numeric-editor .hass=${this.hass} .data=${this._data} .editable=${this.canEdit} .language=${this.language} .editing=${this._config.view==="full"}></curve-scheduler-numeric-editor>
      `:c`
        ${this.renderToday(this._data)}
        ${s?c`<curve-scheduler-editor
              .hass=${this.hass}
              .data=${this._data}
              .language=${this.language}
            ></curve-scheduler-editor>`:p}
      `}return c`<ha-card>
      ${e?c`<h1 class="card-header">${e}</h1>`:p}
      <div class="content">${t}</div>
    </ha-card>`}};me.properties={hass:{attribute:!1},_config:{state:!0},_data:{state:!0},_error:{state:!0},_editorOpen:{state:!0},_holidayForm:{state:!0},_notice:{state:!0},_tick:{state:!0}},me.styles=[A,E`
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
        gap: var(--zp-gap);
      }
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
    `];customElements.get("curve-scheduler-card")||customElements.define("curve-scheduler-card",me);var fe=class extends y{constructor(){super(),this._instances=null}setConfig(i){this._config=i}willUpdate(i){i.has("hass")&&this.hass&&this._instances===null&&(this._instances=[],Y(this.hass).then(e=>{this._instances=e,!this._config.entry_id&&e.length&&this.update_({entry_id:e[0].entry_id})}).catch(()=>this._instances=[]))}update_(i){let e={...this._config,...i};for(let t of Object.keys(e))(e[t]===""||e[t]===void 0)&&delete e[t];this._config=e,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0}))}render(){if(!this._config)return p;let i=S(X(this.hass)),e=this._instances??[];return c`
      <label class="field">
        ${i("config.instance")}
        <select
          @change=${t=>this.update_({entry_id:t.target.value})}
        >
          ${e.length===0?c`<option value="">${i("card.no_instance")}</option>`:p}
          ${e.map(t=>c`<option
                value=${t.entry_id}
                ?selected=${t.entry_id===this._config.entry_id}
              >
                ${t.title}
              </option>`)}
        </select>
      </label>
      <label class="field">
        ${i("config.view")}
        <select
          @change=${t=>this.update_({view:t.target.value})}
        >
          <option value="compact" ?selected=${this._config.view!=="full"}>
            ${i("config.view.compact")}
          </option>
          <option value="full" ?selected=${this._config.view==="full"}>
            ${i("config.view.full")}
          </option>
        </select>
      </label>
      <label class="field">
        ${i("config.title")}
        <input
          type="text"
          .value=${this._config.title??""}
          @change=${t=>this.update_({title:t.target.value})}
        />
      </label>
      <label class="check">
        <input
          type="checkbox"
          .checked=${this._config.allow_edit!==!1}
          @change=${t=>this.update_({allow_edit:t.target.checked})}
        />
        ${i("config.allow_edit")}
      </label>
    `}};fe.properties={hass:{attribute:!1},_config:{state:!0},_instances:{state:!0}},fe.styles=[A,E`
      :host {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
    `];customElements.get("curve-scheduler-card-editor")||customElements.define("curve-scheduler-card-editor",fe);var Mt={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},ge=r=>(...i)=>({_$litDirective$:r,values:i}),ie=class{constructor(i){}get _$AU(){return this._$AM._$AU}_$AT(i,e,t){this._$Ct=i,this._$AM=e,this._$Ci=t}_$AS(i,e){return this.update(i,e)}update(i,e){return this.render(...e)}};var{I:Is}=gt;var It=r=>r.strings===void 0;var vi={},Nt=(r,i=vi)=>r._$AH=i;var Dt=ge(class extends ie{constructor(){super(...arguments),this.key=p}render(r,i){return this.key=r,i}update(r,[i,e]){return i!==this.key&&(Nt(r),this.key=i),e}});var ve=(r,i)=>{let e=r._$AN;if(e===void 0)return!1;for(let t of e)t._$AO?.(i,!1),ve(t,i);return!0},Ne=r=>{let i,e;do{if((i=r._$AM)===void 0)break;e=i._$AN,e.delete(r),r=i}while(e?.size===0)},Lt=r=>{for(let i;i=r._$AM;r=i){let e=i._$AN;if(e===void 0)i._$AN=e=new Set;else if(e.has(r))break;e.add(r),yi(i)}};function bi(r){this._$AN!==void 0?(Ne(this),this._$AM=r,Lt(this)):this._$AM=r}function _i(r,i=!1,e=0){let t=this._$AH,s=this._$AN;if(s!==void 0&&s.size!==0)if(i)if(Array.isArray(t))for(let n=e;n<t.length;n++)ve(t[n],!1),Ne(t[n]);else t!=null&&(ve(t,!1),Ne(t));else ve(this,r)}var yi=r=>{r.type==Mt.CHILD&&(r._$AP??=_i,r._$AQ??=bi)},De=class extends ie{constructor(){super(...arguments),this._$AN=void 0}_$AT(i,e,t){super._$AT(i,e,t),Lt(this),this.isConnected=i._$AU}_$AO(i,e=!0){i!==this.isConnected&&(this.isConnected=i,i?this.reconnected?.():this.disconnected?.()),e&&(ve(this,i),Ne(this))}setValue(i){if(It(this._$Ct))this._$Ct._$AI(i,this);else{let e=[...this._$Ct._$AH];e[this._$Ci]=i,this._$Ct._$AI(e,this,0)}}disconnected(){}reconnected(){}};var Ht=()=>new Je,Je=class{},Ze=new WeakMap,Ot=ge(class extends De{render(r){return p}update(r,[i]){let e=i!==this.G;return e&&this.rt(void 0),(e||this.lt!==this.ct)&&(this.G=i,this.ht=r.options?.host,this.rt(this.ct=r.element)),p}rt(r){if(this.G!==void 0)if(this.isConnected||(r=void 0),typeof this.G=="function"){let i=this.ht??globalThis,e=Ze.get(i);e===void 0&&(e=new WeakMap,Ze.set(i,e)),e.get(this.G)!==void 0&&this.G.call(this.ht,void 0),e.set(this.G,r),r!==void 0&&this.G.call(this.ht,r)}else this.G.value=r}get lt(){return typeof this.G=="function"?Ze.get(this.ht??globalThis)?.get(this.G):this.G?.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});var be=class extends y{constructor(){super();this.card=Ht();this.request=0;this.narrow=!1,this.instances=null,this.selected="",this.loading=!1,this.error=""}connectedCallback(){super.connectedCallback(),this.hass&&this.load()}disconnectedCallback(){this.request+=1,this.loading=!1,super.disconnectedCallback()}willUpdate(e){e.has("hass")&&this.hass&&!this.instances&&!this.loading&&!this.error&&this.load()}updated(){this.card.value?.setConfig({type:"custom:curve-scheduler-card",entry_id:this.selected,view:"full"})}async load(){let e=++this.request;this.loading=!0,this.error="";try{let t=await Y(this.hass);if(!this.isConnected||e!==this.request)return;this.instances=t;let s=new URL(window.location.href).searchParams.get("entry_id");this.selected=s??t[0]?.entry_id??""}catch(t){this.isConnected&&e===this.request&&(this.error=String(t))}finally{e===this.request&&(this.loading=!1)}}select(e){let t=e.target;if(t.value===this.selected)return;if(this.card.value&&!this.card.value.confirmLeave()){t.value=this.selected;return}this.selected=t.value;let s=new URL(window.location.href);s.searchParams.set("entry_id",this.selected),window.history.replaceState(window.history.state,"",s)}confirmNavigation(e){this.card.value&&!this.card.value.confirmLeave()&&e.preventDefault()}render(){let e=S(X(this.hass)),t=this.instances?.some(s=>s.entry_id===this.selected);return c`
      <header>
        <ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>
        <h1>Curve Scheduler</h1>
      </header>
      <main>
        <div class="toolbar">
          <label class="field grow">
            ${e("panel.instance")}
            <select .value=${this.selected} @change=${this.select} ?disabled=${this.loading||!this.instances?.length}>
              ${this.instances?.map(s=>c`<option value=${s.entry_id} ?selected=${s.entry_id===this.selected}>${s.title}</option>`)}
            </select>
          </label>
          <button ?disabled=${this.loading} @click=${()=>{(!this.card.value||this.card.value.confirmLeave())&&this.load()}}>${e("panel.refresh")}</button>
          ${this.hass?.user?.is_admin?c`
            ${t?c`<a data-action="settings" href="/config/integrations/integration/curve_scheduler" @click=${this.confirmNavigation}>${e("panel.settings")}</a>`:p}
            <a data-action="add" href="/config/integrations/dashboard/add?domain=curve_scheduler" @click=${this.confirmNavigation}>${e("panel.add")}</a>
          `:p}
        </div>
        ${this.error?c`<p role="alert">${e("card.connection_error",{message:this.error})}</p>`:p}
        ${this.loading&&!this.instances?c`<p role="status">${e("card.loading")}</p>`:p}
        ${this.instances?.length===0?c`<p role="status">${e("panel.empty")}</p>`:p}
        ${this.instances?.length&&!t?c`<p role="alert">${e("panel.not_found")}</p>`:p}
        ${t?Dt(this.selected,c`<curve-scheduler-card ${Ot(this.card)} .hass=${this.hass}></curve-scheduler-card>`):p}
      </main>
    `}};be.properties={hass:{attribute:!1},narrow:{type:Boolean},instances:{state:!0},selected:{state:!0},loading:{state:!0},error:{state:!0}},be.styles=[A,E`
    :host { display: block; height: 100%; overflow: auto; color: var(--primary-text-color); background: var(--primary-background-color); }
    header { display: flex; align-items: center; min-height: 56px; padding: 0 16px; background: var(--app-header-background-color, var(--primary-color)); color: var(--app-header-text-color, white); }
    h1 { font-size: 20px; font-weight: 400; margin: 12px 8px; }
    main { max-width: 960px; margin: 0 auto; padding: 16px; }
    .toolbar { display: flex; gap: 12px; align-items: end; flex-wrap: wrap; margin-bottom: 16px; }
    .grow { flex: 1; min-width: 180px; }
    a { color: var(--primary-color); padding: 12px 0; }
  `];customElements.define("curve-scheduler-panel",be);var $i=(navigator.language??"en").toLowerCase().startsWith("de")?"de":"en",Rt=S($i);window.customCards=window.customCards??[];window.customCards.some(r=>r.type==="curve-scheduler-card")||window.customCards.push({type:"curve-scheduler-card",name:Rt("card.name"),description:Rt("card.description"),preview:!0});console.info("%c CURVE-SCHEDULER-CARD ","background:#e67e22;color:#fff;border-radius:3px");
