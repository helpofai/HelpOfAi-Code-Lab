import{o as xe,r as a,h as D,j as te}from"./app-D7DpGyLP.js";const de=`<div class="neural-substrate">
  <canvas id="neural-canvas"></canvas>
  <div class="ui-overlay">
    <div class="status-bar">
      <span class="pulse"></span>
      <span>NODE_STATUS: OPTIMIZED</span>
    </div>
    <div class="telemetry">
      <h1>NEURAL_CORE_v2</h1>
      <p>INTERACTIVE_PARTICLE_MATRIX</p>
    </div>
    <div class="footer-stats">
      <div class="stat">CORES: 128</div>
      <div class="stat">LATENCY: 0.02ms</div>
    </div>
  </div>
</div>`,fe=`body {
  background: #050505 !important;
  margin: 0; overflow: hidden;
  font-family: 'Inter', sans-serif;
}

.neural-substrate {
  position: relative;
  width: 100vw; height: 100vh;
}

#neural-canvas {
  position: absolute;
  inset: 0; z-index: 1;
}

.ui-overlay {
  position: relative;
  z-index: 2; height: 100%;
  display: flex; flex-direction: column;
  justify-content: space-between;
  padding: 40px; pointer-events: none;
}

.status-bar {
  display: flex; items-center: center; gap: 10px;
  color: #06b6d4; font-size: 10px; font-weight: 900;
  letter-spacing: 2px;
}

.pulse {
  width: 8px; height: 8px; background: #06b6d4;
  border-radius: 50%; animation: glow 2s infinite;
}

h1 {
  color: white; font-size: 4rem; font-weight: 900;
  margin: 0; letter-spacing: -2px; font-style: italic;
  text-shadow: 0 0 30px rgba(6,182,212,0.3);
}

p {
  color: #475569; font-size: 12px; font-weight: 800;
  letter-spacing: 5px; margin-top: 5px;
}

.footer-stats {
  display: flex; gap: 40px;
  color: #1e293b; font-size: 9px; font-weight: 900;
  letter-spacing: 2px; border-top: 1px solid #1e293b;
  padding-top: 20px;
}

@keyframes glow {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.3; transform: scale(1.5); }
}`,pe=`const canvas = document.getElementById('neural-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
const mouse = { x: null, y: null, radius: 150 };

window.addEventListener('resize', resize);
window.addEventListener('mousemove', (e) => { mouse.x = e.x; mouse.y = e.y; });

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 1;
    this.vx = (Math.random() - 0.5) * 2;
    this.vy = (Math.random() - 0.5) * 2;
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    if (this.x > canvas.width || this.x < 0) this.vx *= -1;
    if (this.y > canvas.height || this.y < 0) this.vy *= -1;
    
    let dx = mouse.x - this.x; let dy = mouse.y - this.y;
    let dist = Math.sqrt(dx*dx + dy*dy);
    if (dist < mouse.radius) {
      this.x -= dx/20; this.y -= dy/20;
    }
  }
  draw() {
    ctx.fillStyle = 'rgba(6,182,212,0.8)';
    ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
    ctx.fill();
  }
}

function init() {
  particles = [];
  for (let i=0; i<100; i++) particles.push(new Particle());
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.update(); p.draw();
    particles.forEach(other => {
      let dx = p.x - other.x; let dy = p.y - other.y;
      let dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 100) {
        ctx.strokeStyle = \`rgba(6, 182, 212, \${1 - dist/100})\`;
        ctx.lineWidth = 0.5;
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(other.x, other.y);
        ctx.stroke();
      }
    });
  });
  requestAnimationFrame(animate);
}

resize(); init(); animate();
console.log("Handshake_Successful: Neural Matrix Active.");`,zt={html:de,css:fe,js:pe},Me=xe(e=>({html:de,css:fe,js:pe,id:null,title:"Untitled Project",isPrivate:!1,isForSale:!1,price:0,layout:"bottom",google_drive_file_id:null,externalLibraries:[],fontSize:14,wordWrap:"on",theme:"vs-dark",minimap:!1,formatOnSave:!0,preprocessors:{html:"html",css:"css",js:"js"},setHtml:t=>e({html:t}),setCss:t=>e({css:t}),setJs:t=>e({js:t}),setTitle:t=>e({title:t}),setIsPrivate:t=>e({isPrivate:t}),setIsForSale:t=>e({isForSale:t}),setPrice:t=>e({price:t}),setLayout:t=>e({layout:t}),setGoogleDriveFileId:t=>e({google_drive_file_id:t}),setExternalLibraries:t=>e({externalLibraries:t}),setFontSize:t=>e({fontSize:t}),setWordWrap:t=>e({wordWrap:t}),setTheme:t=>e({theme:t}),setMinimap:t=>e({minimap:t}),setFormatOnSave:t=>e({formatOnSave:t}),setPreprocessors:t=>e({preprocessors:t}),setPreprocessor:(t,n)=>e(r=>({preprocessors:{...r.preprocessors,[t]:n}})),setProject:t=>e({id:t.id||null,html:t.code?.html||"",css:t.code?.css||"",js:t.code?.js||"",title:t.title||"Untitled Project",isPrivate:t.is_private||!1,isForSale:t.is_for_sale||!1,price:t.price||0,externalLibraries:t.settings?.externalLibraries||[],theme:t.settings?.theme||"vs-dark",preprocessors:t.settings?.preprocessors||{html:"html",css:"css",js:"js"}})}));function oe(e,t){(t==null||t>e.length)&&(t=e.length);for(var n=0,r=Array(t);n<t;n++)r[n]=e[n];return r}function je(e){if(Array.isArray(e))return e}function Oe(e,t,n){return(t=Ce(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function Se(e,t){var n=e==null?null:typeof Symbol<"u"&&e[Symbol.iterator]||e["@@iterator"];if(n!=null){var r,i,o,s,d=[],c=!0,f=!1;try{if(o=(n=n.call(e)).next,t!==0)for(;!(c=(r=o.call(n)).done)&&(d.push(r.value),d.length!==t);c=!0);}catch(O){f=!0,i=O}finally{try{if(!c&&n.return!=null&&(s=n.return(),Object(s)!==s))return}finally{if(f)throw i}}return d}}function Ee(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function ae(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(i){return Object.getOwnPropertyDescriptor(e,i).enumerable})),n.push.apply(n,r)}return n}function ce(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]!=null?arguments[t]:{};t%2?ae(Object(n),!0).forEach(function(r){Oe(e,r,n[r])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):ae(Object(n)).forEach(function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(n,r))})}return e}function Pe(e,t){if(e==null)return{};var n,r,i=Le(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)===-1&&{}.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}function Le(e,t){if(e==null)return{};var n={};for(var r in e)if({}.hasOwnProperty.call(e,r)){if(t.indexOf(r)!==-1)continue;n[r]=e[r]}return n}function Te(e,t){return je(e)||Se(e,t)||Ie(e,t)||Ee()}function Re(e,t){if(typeof e!="object"||!e)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var r=n.call(e,t);if(typeof r!="object")return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(e)}function Ce(e){var t=Re(e,"string");return typeof t=="symbol"?t:t+""}function Ie(e,t){if(e){if(typeof e=="string")return oe(e,t);var n={}.toString.call(e).slice(8,-1);return n==="Object"&&e.constructor&&(n=e.constructor.name),n==="Map"||n==="Set"?Array.from(e):n==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?oe(e,t):void 0}}function Ae(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function se(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(i){return Object.getOwnPropertyDescriptor(e,i).enumerable})),n.push.apply(n,r)}return n}function ue(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]!=null?arguments[t]:{};t%2?se(Object(n),!0).forEach(function(r){Ae(e,r,n[r])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):se(Object(n)).forEach(function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(n,r))})}return e}function De(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return function(r){return t.reduceRight(function(i,o){return o(i)},r)}}function N(e){return function t(){for(var n=this,r=arguments.length,i=new Array(r),o=0;o<r;o++)i[o]=arguments[o];return i.length>=e.length?e.apply(this,i):function(){for(var s=arguments.length,d=new Array(s),c=0;c<s;c++)d[c]=arguments[c];return t.apply(n,[].concat(i,d))}}}function B(e){return{}.toString.call(e).includes("Object")}function ke(e){return!Object.keys(e).length}function F(e){return typeof e=="function"}function ze(e,t){return Object.prototype.hasOwnProperty.call(e,t)}function _e(e,t){return B(t)||R("changeType"),Object.keys(t).some(function(n){return!ze(e,n)})&&R("changeField"),t}function Ne(e){F(e)||R("selectorType")}function $e(e){F(e)||B(e)||R("handlerType"),B(e)&&Object.values(e).some(function(t){return!F(t)})&&R("handlersType")}function Fe(e){e||R("initialIsRequired"),B(e)||R("initialType"),ke(e)&&R("initialContent")}function Ue(e,t){throw new Error(e[t]||e.default)}var Ve={initialIsRequired:"initial state is required",initialType:"initial state should be an object",initialContent:"initial state shouldn't be an empty object",handlerType:"handler should be an object or a function",handlersType:"all handlers should be a functions",selectorType:"selector should be a function",changeType:"provided value of changes should be an object",changeField:'it seams you want to change a field in the state which is not specified in the "initial" state',default:"an unknown error accured in `state-local` package"},R=N(Ue)(Ve),H={changes:_e,selector:Ne,handler:$e,initial:Fe};function We(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};H.initial(e),H.handler(t);var n={current:e},r=N(Be)(n,t),i=N(qe)(n),o=N(H.changes)(e),s=N(He)(n);function d(){var f=arguments.length>0&&arguments[0]!==void 0?arguments[0]:function(O){return O};return H.selector(f),f(n.current)}function c(f){De(r,i,o,s)(f)}return[d,c]}function He(e,t){return F(t)?t(e.current):t}function qe(e,t){return e.current=ue(ue({},e.current),t),t}function Be(e,t,n){return F(t)?t(e.current):Object.keys(n).forEach(function(r){var i;return(i=t[r])===null||i===void 0?void 0:i.call(t,e.current[r])}),n}var Je={create:We},Ge={paths:{vs:"https://cdn.jsdelivr.net/npm/monaco-editor@0.55.1/min/vs"}};function Ke(e){return function t(){for(var n=this,r=arguments.length,i=new Array(r),o=0;o<r;o++)i[o]=arguments[o];return i.length>=e.length?e.apply(this,i):function(){for(var s=arguments.length,d=new Array(s),c=0;c<s;c++)d[c]=arguments[c];return t.apply(n,[].concat(i,d))}}}function Ye(e){return{}.toString.call(e).includes("Object")}function Ze(e){return e||le("configIsRequired"),Ye(e)||le("configType"),e.urls?(Xe(),{paths:{vs:e.urls.monacoBase}}):e}function Xe(){console.warn(he.deprecation)}function Qe(e,t){throw new Error(e[t]||e.default)}var he={configIsRequired:"the configuration object is required",configType:"the configuration object should be an object",default:"an unknown error accured in `@monaco-editor/loader` package",deprecation:`Deprecation warning!
    You are using deprecated way of configuration.

    Instead of using
      monaco.config({ urls: { monacoBase: '...' } })
    use
      monaco.config({ paths: { vs: '...' } })

    For more please check the link https://github.com/suren-atoyan/monaco-loader#config
  `},le=Ke(Qe)(he),et={config:Ze},tt=function(){for(var t=arguments.length,n=new Array(t),r=0;r<t;r++)n[r]=arguments[r];return function(i){return n.reduceRight(function(o,s){return s(o)},i)}};function ge(e,t){return Object.keys(t).forEach(function(n){t[n]instanceof Object&&e[n]&&Object.assign(t[n],ge(e[n],t[n]))}),ce(ce({},e),t)}var nt={type:"cancelation",msg:"operation is manually canceled"};function X(e){var t=!1,n=new Promise(function(r,i){e.then(function(o){return t?i(nt):r(o)}),e.catch(i)});return n.cancel=function(){return t=!0},n}var rt=["monaco"],it=Je.create({config:Ge,isInitialized:!1,resolve:null,reject:null,monaco:null}),me=Te(it,2),U=me[0],G=me[1];function ot(e){var t=et.config(e),n=t.monaco,r=Pe(t,rt);G(function(i){return{config:ge(i.config,r),monaco:n}})}function at(){var e=U(function(t){var n=t.monaco,r=t.isInitialized,i=t.resolve;return{monaco:n,isInitialized:r,resolve:i}});if(!e.isInitialized){if(G({isInitialized:!0}),e.monaco)return e.resolve(e.monaco),X(Q);if(window.monaco&&window.monaco.editor)return ve(window.monaco),e.resolve(window.monaco),X(Q);tt(ct,ut)(lt)}return X(Q)}function ct(e){return document.body.appendChild(e)}function st(e){var t=document.createElement("script");return e&&(t.src=e),t}function ut(e){var t=U(function(r){var i=r.config,o=r.reject;return{config:i,reject:o}}),n=st("".concat(t.config.paths.vs,"/loader.js"));return n.onload=function(){return e()},n.onerror=t.reject,n}function lt(){var e=U(function(n){var r=n.config,i=n.resolve,o=n.reject;return{config:r,resolve:i,reject:o}}),t=window.require;t.config(e.config),t(["vs/editor/editor.main"],function(n){var r=n.m||n;ve(r),e.resolve(r)},function(n){e.reject(n)})}function ve(e){U().monaco||G({monaco:e})}function dt(){return U(function(e){var t=e.monaco;return t})}var Q=new Promise(function(e,t){return G({resolve:e,reject:t})}),J={config:ot,init:at,__getMonacoInstance:dt},ft={wrapper:{display:"flex",position:"relative",textAlign:"initial"},fullWidth:{width:"100%"},hide:{display:"none"}},ee=ft,pt={container:{display:"flex",height:"100%",width:"100%",justifyContent:"center",alignItems:"center"}},ht=pt;function gt({children:e}){return D.createElement("div",{style:ht.container},e)}var mt=gt,vt=mt;function yt({width:e,height:t,isEditorReady:n,loading:r,_ref:i,className:o,wrapperProps:s}){return D.createElement("section",{style:{...ee.wrapper,width:e,height:t},...s},!n&&D.createElement(vt,null,r),D.createElement("div",{ref:i,style:{...ee.fullWidth,...!n&&ee.hide},className:o}))}var wt=yt,ye=a.memo(wt);function bt(e){a.useEffect(e,[])}var ne=bt;function xt(e,t,n=!0){let r=a.useRef(!0);a.useEffect(r.current||!n?()=>{r.current=!1}:e,t)}var x=xt;function $(){}function A(e,t,n,r){return Mt(e,r)||jt(e,t,n,r)}function Mt(e,t){return e.editor.getModel(we(e,t))}function jt(e,t,n,r){return e.editor.createModel(t,n,r?we(e,r):void 0)}function we(e,t){return e.Uri.parse(t)}function Ot({original:e,modified:t,language:n,originalLanguage:r,modifiedLanguage:i,originalModelPath:o,modifiedModelPath:s,keepCurrentOriginalModel:d=!1,keepCurrentModifiedModel:c=!1,theme:f="light",loading:O="Loading...",options:M={},height:S="100%",width:h="100%",className:E,wrapperProps:L={},beforeMount:P=$,onMount:j=$}){let[g,C]=a.useState(!1),[k,m]=a.useState(!0),v=a.useRef(null),p=a.useRef(null),z=a.useRef(null),w=a.useRef(j),u=a.useRef(P),I=a.useRef(!1);ne(()=>{let l=J.init();return l.then(y=>(p.current=y)&&m(!1)).catch(y=>y?.type!=="cancelation"&&console.error("Monaco initialization: error:",y)),()=>v.current?_():l.cancel()}),x(()=>{if(v.current&&p.current){let l=v.current.getOriginalEditor(),y=A(p.current,e||"",r||n||"text",o||"");y!==l.getModel()&&l.setModel(y)}},[o],g),x(()=>{if(v.current&&p.current){let l=v.current.getModifiedEditor(),y=A(p.current,t||"",i||n||"text",s||"");y!==l.getModel()&&l.setModel(y)}},[s],g),x(()=>{let l=v.current.getModifiedEditor();l.getOption(p.current.editor.EditorOption.readOnly)?l.setValue(t||""):t!==l.getValue()&&(l.executeEdits("",[{range:l.getModel().getFullModelRange(),text:t||"",forceMoveMarkers:!0}]),l.pushUndoStop())},[t],g),x(()=>{v.current?.getModel()?.original.setValue(e||"")},[e],g),x(()=>{let{original:l,modified:y}=v.current.getModel();p.current.editor.setModelLanguage(l,r||n||"text"),p.current.editor.setModelLanguage(y,i||n||"text")},[n,r,i],g),x(()=>{p.current?.editor.setTheme(f)},[f],g),x(()=>{v.current?.updateOptions(M)},[M],g);let V=a.useCallback(()=>{if(!p.current)return;u.current(p.current);let l=A(p.current,e||"",r||n||"text",o||""),y=A(p.current,t||"",i||n||"text",s||"");v.current?.setModel({original:l,modified:y})},[n,t,i,e,r,o,s]),W=a.useCallback(()=>{!I.current&&z.current&&(v.current=p.current.editor.createDiffEditor(z.current,{automaticLayout:!0,...M}),V(),p.current?.editor.setTheme(f),C(!0),I.current=!0)},[M,f,V]);a.useEffect(()=>{g&&w.current(v.current,p.current)},[g]),a.useEffect(()=>{!k&&!g&&W()},[k,g,W]);function _(){let l=v.current?.getModel();d||l?.original?.dispose(),c||l?.modified?.dispose(),v.current?.dispose()}return D.createElement(ye,{width:h,height:S,isEditorReady:g,loading:O,_ref:z,className:E,wrapperProps:L})}var St=Ot,_t=a.memo(St);function Et(){let[e,t]=a.useState(J.__getMonacoInstance());return ne(()=>{let n;return e||(n=J.init(),n.then(r=>{t(r)})),()=>n?.cancel()}),e}var Pt=Et;function Lt(e){let t=a.useRef();return a.useEffect(()=>{t.current=e},[e]),t.current}var Tt=Lt,q=new Map;function Rt({defaultValue:e,defaultLanguage:t,defaultPath:n,value:r,language:i,path:o,theme:s="light",line:d,loading:c="Loading...",options:f={},overrideServices:O={},saveViewState:M=!0,keepCurrentModel:S=!1,width:h="100%",height:E="100%",className:L,wrapperProps:P={},beforeMount:j=$,onMount:g=$,onChange:C,onValidate:k=$}){let[m,v]=a.useState(!1),[p,z]=a.useState(!0),w=a.useRef(null),u=a.useRef(null),I=a.useRef(null),V=a.useRef(g),W=a.useRef(j),_=a.useRef(),l=a.useRef(r),y=Tt(o),re=a.useRef(!1),K=a.useRef(!1);ne(()=>{let b=J.init();return b.then(T=>(w.current=T)&&z(!1)).catch(T=>T?.type!=="cancelation"&&console.error("Monaco initialization: error:",T)),()=>u.current?be():b.cancel()}),x(()=>{let b=A(w.current,e||r||"",t||i||"",o||n||"");b!==u.current?.getModel()&&(M&&q.set(y,u.current?.saveViewState()),u.current?.setModel(b),M&&u.current?.restoreViewState(q.get(o)))},[o],m),x(()=>{u.current?.updateOptions(f)},[f],m),x(()=>{!u.current||r===void 0||(u.current.getOption(w.current.editor.EditorOption.readOnly)?u.current.setValue(r):r!==u.current.getValue()&&(K.current=!0,u.current.executeEdits("",[{range:u.current.getModel().getFullModelRange(),text:r,forceMoveMarkers:!0}]),u.current.pushUndoStop(),K.current=!1))},[r],m),x(()=>{let b=u.current?.getModel();b&&i&&w.current?.editor.setModelLanguage(b,i)},[i],m),x(()=>{d!==void 0&&u.current?.revealLine(d)},[d],m),x(()=>{w.current?.editor.setTheme(s)},[s],m);let ie=a.useCallback(()=>{if(!(!I.current||!w.current)&&!re.current){W.current(w.current);let b=o||n,T=A(w.current,r||e||"",t||i||"",b||"");u.current=w.current?.editor.create(I.current,{model:T,automaticLayout:!0,...f},O),M&&u.current.restoreViewState(q.get(b)),w.current.editor.setTheme(s),d!==void 0&&u.current.revealLine(d),v(!0),re.current=!0}},[e,t,n,r,i,o,f,O,M,s,d]);a.useEffect(()=>{m&&V.current(u.current,w.current)},[m]),a.useEffect(()=>{!p&&!m&&ie()},[p,m,ie]),l.current=r,a.useEffect(()=>{m&&C&&(_.current?.dispose(),_.current=u.current?.onDidChangeModelContent(b=>{K.current||C(u.current.getValue(),b)}))},[m,C]),a.useEffect(()=>{if(m){let b=w.current.editor.onDidChangeMarkers(T=>{let Y=u.current.getModel()?.uri;if(Y&&T.find(Z=>Z.path===Y.path)){let Z=w.current.editor.getModelMarkers({resource:Y});k?.(Z)}});return()=>{b?.dispose()}}return()=>{}},[m,k]);function be(){_.current?.dispose(),S?M&&q.set(o,u.current.saveViewState()):u.current.getModel()?.dispose(),u.current.dispose()}return D.createElement(ye,{width:h,height:E,isEditorReady:m,loading:c,_ref:I,className:L,wrapperProps:P})}var Ct=Rt,It=a.memo(Ct),At=It;const Dt=()=>te.jsx("div",{className:"h-full w-full bg-[#050505] flex items-center justify-center font-mono text-[10px] text-cyan-500 uppercase tracking-[0.3em]",children:"Neural_Loading..."});function Nt({language:e,value:t,onChange:n,fontSize:r,wordWrap:i,externalLibraries:o=[]}){const{theme:s,minimap:d}=Me(),c=Pt(),f=a.useRef(null);a.useEffect(()=>{c&&c.editor.defineTheme("dracula",{base:"vs-dark",inherit:!0,rules:[{token:"comment",foreground:"6272a4"},{token:"keyword",foreground:"ff79c6"},{token:"identifier",foreground:"50fa7b"},{token:"string",foreground:"f1fa8c"},{token:"type",foreground:"8be9fd"}],colors:{"editor.background":"#282a36","editor.foreground":"#f8f8f2","editor.lineHighlightBackground":"#44475a","editorCursor.foreground":"#f8f8f0","editorWhitespace.foreground":"#3b3a32","editorIndentGuide.activeBackground":"#939393","editor.selectionBackground":"#44475a"}})},[c]),a.useEffect(()=>{if(!c)return;if(window.emmetMonaco)window.emmetMonaco.emmetHTML(c),window.emmetMonaco.emmetCSS(c);else{const h=document.createElement("script");h.src="https://unpkg.com/emmet-monaco-es/dist/emmet-monaco.min.js",h.onload=()=>{window.emmetMonaco&&(window.emmetMonaco.emmetHTML(c),window.emmetMonaco.emmetCSS(c))},h.onerror=()=>{console.warn("Uplink_Failed: Emmet Module Offline.")},document.head.appendChild(h)}const S=async h=>{try{const E=h.match(/npm\/([^@/]+)/)||h.match(/unpkg\.com\/([^@/]+)/);if(!E)return;const L=E[1],P=`https://unpkg.com/@types/${L}/index.d.ts`,j=await fetch(P);if(j.ok){const g=await j.text();c.languages.typescript.javascriptDefaults.addExtraLib(g,`file:///node_modules/@types/${L}/index.d.ts`)}}catch{}};e==="js"&&o.forEach(S)},[c,e,o]);const O=(S,h)=>{f.current=S;const E=S.getDomNode();E&&E.addEventListener("drop",L=>{L.preventDefault();const P=L.dataTransfer.getData("text/plain");if(P&&(P.startsWith("http")||P.startsWith("/storage"))){const j=S.getSelection(),C={range:new h.Range(j.startLineNumber,j.startColumn,j.endLineNumber,j.endColumn),text:P,forceMoveMarkers:!0};S.executeEdits("my-source",[C])}}),h.languages.typescript.javascriptDefaults.setDiagnosticsOptions({noSemanticValidation:!1,noSyntaxValidation:!1}),h.languages.typescript.javascriptDefaults.setCompilerOptions({target:h.languages.typescript.ScriptTarget.ESNext,allowNonTsExtensions:!0,checkJs:!0,jsx:h.languages.typescript.JsxEmit.React})},M=a.useMemo(()=>({minimap:{enabled:d},fontSize:r||14,wordWrap:i||"on",automaticLayout:!0,padding:{top:10},scrollBeyondLastLine:!1,fixedOverflowWidgets:!0,fontFamily:'JetBrains Mono, Menlo, Monaco, Consolas, "Courier New", monospace',renderLineHighlight:"all",lineNumbers:"on",roundedSelection:!0,scrollbar:{vertical:"visible",horizontal:"visible",useShadows:!1,verticalScrollbarSize:10,horizontalScrollbarSize:10},cursorBlinking:"smooth",cursorSmoothCaretAnimation:"on",mouseWheelZoom:!0,smoothScrolling:!0,contextmenu:!0}),[r,i,d]);return te.jsx(At,{height:"100%",theme:s,path:e==="js"?"main.js":`index.${e}`,defaultLanguage:e==="js"?"javascript":e,value:t,onChange:n,onMount:O,options:M,loading:te.jsx(Dt,{}),keepCurrentModel:!0})}export{zt as D,Nt as M,Me as u,_t as w};
