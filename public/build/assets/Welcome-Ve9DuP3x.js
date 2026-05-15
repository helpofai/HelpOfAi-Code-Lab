import{c as P,r as l,j as e,A as S,m as v,b as g,H as _,L as w}from"./app-Bs31BIFC.js";import{P as E}from"./PublicLayout-DJmUb6UQ.js";import{M as L}from"./MonacoWrapper-CPPrfYdP.js";import{X as M}from"./x-DQQZYv9j.js";import{C as A}from"./credit-card-CAftZarp.js";import{Z as j}from"./zap-B4-u1FMZ.js";import{A as z}from"./activity-bC9MYZvM.js";import{A as T}from"./arrow-right-C_1zf6JA.js";import{S as I}from"./shield-check-CZudsZrH.js";import{S as N}from"./sparkles-C7HMCwwa.js";import{U as C}from"./user-DqJyb_5Y.js";import{D as $}from"./database-Bm7ziakS.js";import{S as U}from"./shield-FIGeVLZ6.js";import{G as R}from"./globe-B8HWZ34K.js";import{L as D}from"./lock-BC2Ya5D1.js";import{C as k}from"./circle-check-LRdMuaec.js";import{C as O}from"./code-xml-BsgfVYIG.js";import{C as H}from"./clock-CXex9cn9.js";import"./ThemeSwitcher-COXP5yBM.js";import"./ProBackground-zPe-uw6p.js";import"./NotificationDropdown-DVfvcTYy.js";import"./share-2-XyietOFp.js";const G=[["path",{d:"M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z",key:"m3kijz"}],["path",{d:"m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z",key:"1fmvmk"}],["path",{d:"M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0",key:"1f8sc4"}],["path",{d:"M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5",key:"qeys4"}]],B=P("rocket",G);function F({isOpen:a,onClose:m,user:c}){const[u,o]=l.useState(!1),[d,n]=l.useState("stripe"),x=async()=>{o(!0);try{const s=await g.post("/api/subscription/checkout",{gateway:d});if(s.data.url){window.location.href=s.data.url;return}if(s.data.gateway==="razorpay"){const t={key:s.data.key,amount:s.data.amount,currency:"INR",name:"HOACodeLab Pro",description:"Monthly Pro Subscription",order_id:s.data.order_id,handler:async function(h){try{await g.post("/api/subscription/verify",{gateway:"razorpay",razorpay_order_id:h.razorpay_order_id,razorpay_payment_id:h.razorpay_payment_id,razorpay_signature:h.razorpay_signature}),window.location.href="/dashboard?payment=success"}catch{alert("Payment verification failed.")}},prefill:{name:s.data.user.name,email:s.data.user.email},theme:{color:"#06b6d4"}};new window.Razorpay(t).open(),m()}}catch(s){alert(s.response?.data?.message||"Uplink failed.")}finally{o(!1)}},p=[{id:"stripe",name:"Global_Card",desc:"Credit / Debit Card",icon:A,color:"text-indigo-500"},{id:"razorpay",name:"Razorpay",desc:"UPI / Cards / Net",icon:j,color:"text-blue-500"},{id:"phonepe",name:"PhonePe",desc:"Direct UPI App",icon:z,color:"text-purple-500"}];return e.jsx(S,{children:a&&e.jsxs("div",{className:"fixed inset-0 z-[150] flex items-center justify-center p-6",children:[e.jsx(v.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},onClick:m,className:"absolute inset-0 bg-black/80 backdrop-blur-xl"}),e.jsx(v.div,{initial:{scale:.95,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.95,opacity:0},className:"relative bg-[var(--bg-surface)] border border-[var(--border)] w-full max-w-xl rounded-[2rem] overflow-hidden shadow-2xl flex flex-col transition-all duration-300",children:e.jsxs("div",{className:"p-8 lg:p-12 space-y-10",children:[e.jsxs("div",{className:"flex justify-between items-start",children:[e.jsxs("div",{className:"space-y-1",children:[e.jsx("h3",{className:"text-2xl font-black uppercase italic tracking-tighter text-[var(--text-main)] leading-none",children:"Initialize_Checkout"}),e.jsx("p",{className:"text-[10px] font-bold text-cyan-500 uppercase tracking-[0.4em]",children:"Secure Payment Gateway"})]}),e.jsx("button",{onClick:m,className:"p-2 hover:bg-white/5 rounded-full transition-colors",children:e.jsx(M,{size:20})})]}),e.jsx("div",{className:"space-y-4",children:p.map(s=>e.jsxs("button",{onClick:()=>n(s.id),className:`w-full p-6 rounded-2xl border transition-all flex items-center justify-between group ${d===s.id?"bg-cyan-500/5 border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.1)]":"bg-[var(--bg-elevated)] border-[var(--border)] hover:border-white/10"}`,children:[e.jsxs("div",{className:"flex items-center gap-6",children:[e.jsx("div",{className:`p-3 rounded-xl bg-black/20 ${d===s.id?s.color:"text-[var(--text-muted)]"}`,children:e.jsx(s.icon,{size:20})}),e.jsxs("div",{className:"text-left",children:[e.jsx("p",{className:`text-xs font-black uppercase tracking-widest ${d===s.id?"text-[var(--text-main)]":"text-[var(--text-muted)]"}`,children:s.name}),e.jsx("p",{className:"text-[9px] font-bold text-[var(--text-muted)] uppercase italic",children:s.desc})]})]}),d===s.id&&e.jsx("div",{className:"w-2 h-2 rounded-full bg-cyan-500 animate-pulse"})]},s.id))}),e.jsxs("div",{className:"pt-6 border-t border-[var(--border)]",children:[e.jsxs("button",{disabled:u,onClick:x,className:"w-full py-5 bg-cyan-500 text-black font-black uppercase text-xs tracking-[0.3em] rounded-2xl flex items-center justify-center gap-3 hover:bg-white transition-all shadow-xl shadow-cyan-500/10 active:scale-[0.98] disabled:opacity-50",children:[u?"Synchronizing...":"Authorize Transaction"," ",e.jsx(T,{size:16})]}),e.jsxs("div",{className:"mt-6 flex items-center justify-center gap-2 text-[8px] font-bold text-[var(--text-muted)] uppercase tracking-widest italic",children:[e.jsx(I,{size:12,className:"text-emerald-500"})," AES-256 Encrypted Neural Uplink"]})]})]})})]})})}const W=()=>{const[a,m]=l.useState(`<div class="neural-substrate">
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
</div>`),[c,u]=l.useState(`body {
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
}`),[o,d]=l.useState(`const canvas = document.getElementById('neural-canvas');
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
console.log("Handshake_Successful: Neural Matrix Active.");`),[n,x]=l.useState("html"),[p,s]=l.useState(""),[t,r]=l.useState([]),h=async()=>{let i=c,b=o;window.Sass&&(c.includes("$")||c.includes("{"))&&window.Sass.compile(c,y=>{y.text&&(i=y.text)});const f=`
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { background: #050505; color: white; margin: 0; padding: 0; min-height: 100vh; display: flex; flex-direction: column; }
                    ${i}
                </style>
                <script>
                    console.log = (...args) => {
                        window.parent.postMessage({ type: 'LOG', content: args.join(' ') }, '*');
                    };
                <\/script>
            </head>
            <body>${a}<script>${b}<\/script></body>
            </html>
        `;s(f)};return l.useEffect(()=>{const i=f=>{f.data.type==="LOG"&&r(y=>[...y,f.data.content].slice(-3))};window.addEventListener("message",i);const b=setTimeout(h,800);return()=>{window.removeEventListener("message",i),clearTimeout(b)}},[a,c,o]),e.jsxs("div",{className:"relative group max-w-6xl mx-auto text-left",children:[e.jsx("div",{className:"absolute -inset-2 bg-gradient-to-r from-cyan-500/20 to-purple-600/20 rounded-[2.5rem] blur-3xl opacity-50"}),e.jsxs("div",{className:"relative bg-[var(--bg-surface)] border border-[var(--border)] rounded-[2rem] overflow-hidden shadow-2xl backdrop-blur-md",children:[e.jsxs("div",{className:"h-14 bg-[var(--bg-main)] border-b border-[var(--border)] flex items-center justify-between px-6",children:[e.jsxs("div",{className:"flex items-center gap-6",children:[e.jsxs("div",{className:"flex gap-1.5 mr-4",children:[e.jsx("div",{className:"w-2.5 h-2.5 rounded-full bg-rose-500/40"}),e.jsx("div",{className:"w-2.5 h-2.5 rounded-full bg-amber-500/40"}),e.jsx("div",{className:"w-2.5 h-2.5 rounded-full bg-emerald-500/40"})]}),e.jsx("div",{className:"flex gap-2",children:["html","css","js"].map(i=>e.jsx("button",{onClick:()=>x(i),className:`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${n===i?"bg-cyan-500 text-black shadow-lg shadow-cyan-500/20":"text-[var(--text-muted)] hover:text-white hover:bg-white/5"}`,children:i},i))})]}),e.jsx("div",{className:"flex items-center gap-3",children:e.jsxs("div",{className:"flex items-center gap-2 px-3 py-1 bg-black/40 border border-white/5 rounded-full",children:[e.jsx("div",{className:"w-1 h-1 rounded-full bg-emerald-500 animate-pulse"}),e.jsx("span",{className:"text-[8px] font-black uppercase text-emerald-500/80 tracking-widest",children:"Live_Sandbox"})]})})]}),e.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-2 h-[500px]",children:[e.jsxs("div",{className:"relative border-r border-[var(--border)] bg-[#050505]",children:[e.jsx("div",{className:"h-full pt-2",children:e.jsx(L,{language:n,value:n==="html"?a:n==="css"?c:o,onChange:i=>{n==="html"?m(i):n==="css"?u(i):d(i)},fontSize:13})}),e.jsx("div",{className:"absolute bottom-4 left-4 right-4 z-20",children:e.jsx(S,{children:t.length>0&&e.jsx(v.div,{initial:{opacity:0,y:10},animate:{opacity:1,y:0},className:"bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl p-3 shadow-2xl space-y-1",children:t.map((i,b)=>e.jsxs("div",{className:"text-[9px] font-mono text-cyan-500 flex gap-2",children:[e.jsxs("span",{className:"opacity-30",children:["[",new Date().toLocaleTimeString([],{hour12:!1,minute:"2-digit",second:"2-digit"}),"]"]}),e.jsx("span",{className:"truncate",children:i})]},b))})})})]}),e.jsxs("div",{className:"bg-white relative overflow-hidden",children:[e.jsx("iframe",{srcDoc:p,className:"w-full h-full border-none",title:"sandbox-preview",sandbox:"allow-scripts"}),e.jsx("div",{className:"absolute top-4 right-4 pointer-events-none opacity-10",children:e.jsx(O,{size:100,className:"text-black"})})]})]})]})]})},q=({project:a})=>{const[m,c]=l.useState({css:"",js:""}),[u,o]=l.useState(!0);l.useEffect(()=>{(async()=>{let p=a.code?.css||"",s=a.code?.js||"";const t=a.settings?.preprocessors||{css:"css",js:"js"};try{if((t.css==="scss"||t.css==="sass")&&window.Sass?window.Sass.compile(p,r=>{c(h=>({...h,css:r.text||p}))}):c(r=>({...r,css:p})),(t.js==="babel"||t.js==="typescript")&&window.Babel){const r=window.Babel.transform(s,{presets:["env","react","typescript"]}).code;c(h=>({...h,js:r}))}else c(r=>({...r,js:s}))}catch{console.error("Preview_Sync_Error")}finally{o(!1)}})()},[a]);const d=(a.settings?.externalLibraries||[]).map(x=>x.endsWith(".css")?`<link rel="stylesheet" href="${x}">`:`<script src="${x}"><\/script>`).join(`
`),n=`<!DOCTYPE html><html><head><style>body { margin: 0; overflow: hidden; background: white; font-family: sans-serif; } ${m.css}</style>${d}</head><body>${a.code?.html||""}<script>${m.js}<\/script></body></html>`;return e.jsxs(w,{href:route("editor",{slug:a.slug}),className:"group relative bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl overflow-hidden hover:border-cyan-500/30 transition-all hover:-translate-y-1 block shadow-xl",children:[e.jsxs("div",{className:"aspect-video bg-white relative overflow-hidden",children:[u?e.jsx("div",{className:"w-full h-full bg-slate-100 animate-pulse flex items-center justify-center text-[10px] font-black uppercase text-slate-300",children:"Syncing_Node..."}):e.jsx("iframe",{srcDoc:n,className:"w-full h-full border-none pointer-events-none scale-75 origin-top-left",style:{width:"133.33%",height:"133.33%"},sandbox:"allow-scripts",title:`preview-${a.id}`}),e.jsx("div",{className:"absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]",children:e.jsx("div",{className:"p-3 bg-cyan-500 text-black rounded-full shadow-xl transform scale-90 group-hover:scale-100 transition-transform",children:e.jsx(j,{size:20,fill:"currentColor"})})}),e.jsx("div",{className:"absolute top-4 right-4",children:e.jsxs("div",{className:"flex items-center gap-1.5 px-2 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg",children:[e.jsx("div",{className:"w-1 h-1 rounded-full bg-emerald-500 animate-pulse"}),e.jsx("span",{className:"text-[8px] font-black text-white uppercase tracking-widest",children:"Live Preview"})]})})]}),e.jsxs("div",{className:"p-6 space-y-4 text-left",children:[e.jsxs("div",{className:"flex justify-between items-start",children:[e.jsx("h3",{className:"text-lg font-black text-[var(--text-main)] uppercase italic tracking-tighter truncate",children:a.title}),e.jsx("div",{className:"px-2 py-1 rounded bg-[var(--bg-main)] border border-[var(--border)] text-[8px] font-black uppercase tracking-widest text-cyan-500",children:a.settings?.preprocessors?.js||"js"})]}),e.jsxs("div",{className:"flex items-center gap-4 text-[10px] text-[var(--text-muted)] font-mono",children:[e.jsxs("span",{className:"flex items-center gap-1 uppercase font-bold",children:[e.jsx(C,{size:10,className:"text-cyan-500/40"})," ",a.user?.name||"Unknown"]}),e.jsxs("span",{className:"flex items-center gap-1 uppercase font-bold",children:[e.jsx(H,{size:10,className:"text-cyan-500/40"})," ",new Date(a.created_at).toLocaleDateString()]})]})]})]})};function ue({auth:a,siteSettings:m}){const[c,u]=l.useState([]),[o,d]=l.useState({projects:0,users:0,public_projects:0}),[n,x]=l.useState(!1);l.useEffect(()=>{if(!window.Babel){const t=document.createElement("script");t.src="https://unpkg.com/@babel/standalone/babel.min.js",document.head.appendChild(t)}if(!window.Sass){const t=document.createElement("script");t.src="https://cdn.jsdelivr.net/npm/sass.js@0.11.1/dist/sass.sync.js",document.head.appendChild(t)}g.get("/api/explore/featured").then(t=>u(t.data)),g.get("/api/explore/stats").then(t=>d(t.data))},[]);const p=(t,r)=>m?.[t]||r,s=async()=>{if(!a.user){window.location.href=route("login");return}if(a.user.role==="paid-user"||a.user.role==="admin")try{const t=await g.post("/api/subscription/portal");t.data.url&&(window.location.href=t.data.url)}catch{alert("Failed to communicate with billing node.")}else x(!0)};return e.jsxs(E,{children:[e.jsxs(_,{children:[e.jsx("title",{children:p("seo_meta_title","HOACodeLab // Technical Prototyping Node")}),e.jsx("meta",{name:"description",content:p("seo_meta_description","High-performance cloud editor for modern web developers.")}),e.jsx("script",{src:"https://checkout.razorpay.com/v1/checkout.js"})]}),e.jsx("section",{className:"pt-48 pb-32 px-6",children:e.jsxs("div",{className:"max-w-7xl mx-auto text-center",children:[e.jsxs(v.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.8},children:[e.jsxs("div",{className:"inline-flex items-center gap-3 px-4 py-1.5 bg-cyan-500/5 border border-cyan-500/10 rounded-full mb-10",children:[e.jsx(N,{size:12,className:"text-cyan-500"}),e.jsx("span",{className:"text-[10px] font-black uppercase tracking-[0.4em] text-cyan-500 italic",children:"v1.5.0 Stable Build"})]}),e.jsxs("h1",{className:"text-6xl md:text-9xl font-black text-[var(--text-main)] tracking-tighter uppercase italic leading-[0.8] mb-12",children:["Modern ",e.jsx("br",{})," ",e.jsx("span",{className:"text-[var(--text-muted)]",children:"Code Editor"})]}),e.jsx("p",{className:"text-[var(--text-muted)] text-sm md:text-lg max-w-2xl mx-auto font-bold uppercase tracking-[0.3em] leading-relaxed mb-20 opacity-80 italic",children:"High-performance development substrate for modern web creators."})]}),e.jsx(v.div,{initial:{opacity:0,scale:.95},animate:{opacity:1,scale:1},transition:{delay:.2,duration:1},children:e.jsx(W,{})})]})}),e.jsx("section",{className:"py-16 border-y border-[var(--border)] bg-[var(--bg-surface)]",children:e.jsx("div",{className:"max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-left",children:[{l:"Active Users",v:o.users,i:C},{l:"Projects Created",v:o.projects,i:$},{l:"Uptime",v:"99.9%",i:U},{l:"Performance",v:"0.04ms",i:j}].map((t,r)=>e.jsxs("div",{className:"flex flex-col gap-2 border-l border-[var(--border)] pl-8 first:border-0",children:[e.jsxs("div",{className:"text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.4em] flex items-center gap-3",children:[e.jsx(t.i,{size:14,className:"text-cyan-500/40"})," ",t.l]}),e.jsx("div",{className:"text-3xl font-black text-[var(--text-main)] tracking-tighter italic",children:t.v})]},r))})}),e.jsx("section",{className:"py-32 px-6 border-b border-[var(--border)]",children:e.jsxs("div",{className:"max-w-7xl mx-auto",children:[e.jsx("div",{className:"flex justify-between items-end mb-16",children:e.jsxs("div",{className:"space-y-2 text-left",children:[e.jsxs("div",{className:"flex items-center gap-2 text-cyan-500",children:[e.jsx(z,{size:16}),e.jsx("span",{className:"text-[10px] font-black uppercase tracking-[0.3em]",children:"Live Feed"})]}),e.jsx("h2",{className:"text-4xl md:text-5xl font-black text-[var(--text-main)] uppercase tracking-tighter italic",children:"Featured Projects"})]})}),e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-8",children:c.length>0?c.slice(0,3).map(t=>e.jsx(q,{project:t},t.id)):[1,2,3].map(t=>e.jsxs("div",{className:"group relative bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl overflow-hidden",children:[e.jsx("div",{className:"aspect-video bg-[var(--bg-elevated)]"}),e.jsxs("div",{className:"p-6 space-y-4",children:[e.jsx("div",{className:"h-4 w-2/3 bg-white/5 rounded animate-pulse"}),e.jsx("div",{className:"h-3 w-1/2 bg-white/5 rounded animate-pulse"})]})]},t))})]})}),e.jsx("section",{id:"features",className:"py-48 px-6 bg-[var(--bg-main)] text-left",children:e.jsx("div",{className:"max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16",children:[{t:"Cloud Based",d:"Every line of code executed securely in your neural browser instance.",i:R},{t:"Instant Sync",d:"Changes reflected instantly. Pixel-perfect rendering.",i:j},{t:"Secure Storage",d:"Encrypted storage for your modules.",i:D}].map((t,r)=>e.jsxs("div",{className:"space-y-8 group",children:[e.jsx("div",{className:"w-16 h-1 bg-[var(--border)] group-hover:w-24 group-hover:bg-cyan-500 transition-all duration-500"}),e.jsx("div",{className:"p-4 bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl w-fit",children:e.jsx(t.i,{className:"text-cyan-500",size:32})}),e.jsx("h3",{className:"text-2xl font-black text-[var(--text-main)] uppercase tracking-tighter italic",children:t.t}),e.jsx("p",{className:"text-[var(--text-muted)] text-xs font-bold uppercase tracking-widest leading-loose italic",children:t.d})]},r))})}),e.jsx("section",{id:"pricing",className:"py-32 px-6 border-y border-[var(--border)] bg-[var(--bg-surface)]",children:e.jsxs("div",{className:"max-w-7xl mx-auto",children:[e.jsxs("div",{className:"text-center mb-20 space-y-4",children:[e.jsx("h2",{className:"text-4xl md:text-5xl font-black text-[var(--text-main)] uppercase tracking-tighter italic",children:"Pricing Plans"}),e.jsx("p",{className:"text-[var(--text-muted)] text-xs font-bold uppercase tracking-[0.2em]",children:"Choose your plan"})]}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto",children:[e.jsxs("div",{className:"p-10 border border-[var(--border)] rounded-3xl bg-[var(--bg-main)] text-left",children:[e.jsx("div",{className:"text-xs font-black text-[var(--text-muted)] uppercase tracking-[0.3em] mb-2",children:"Starter"}),e.jsx("div",{className:"text-4xl font-black text-[var(--text-main)] italic mb-8",children:"Free"}),e.jsx("ul",{className:"space-y-4 mb-10 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]",children:["Unlimited Public Projects","Basic Asset Library","Community Support"].map((t,r)=>e.jsxs("li",{className:"flex items-center gap-3",children:[e.jsx(k,{size:14,className:"text-cyan-500"})," ",t]},r))}),e.jsx(w,{href:route("register"),className:"w-full py-4 flex items-center justify-center border border-[var(--border)] rounded-xl text-xs font-black uppercase tracking-[0.2em] hover:bg-[var(--text-main)] hover:text-[var(--bg-main)] transition-all",children:"Get Started"})]}),e.jsxs("div",{className:"p-10 border border-cyan-500/30 rounded-3xl bg-[var(--bg-elevated)] text-left shadow-2xl relative",children:[e.jsx(N,{className:"absolute top-6 right-6 text-cyan-500",size:24}),e.jsx("div",{className:"text-xs font-black text-cyan-500 uppercase tracking-[0.3em] mb-2",children:"Pro"}),e.jsx("div",{className:"text-4xl font-black text-[var(--text-main)] italic mb-8",children:"Pro"}),e.jsx("ul",{className:"space-y-4 mb-10 text-xs font-bold uppercase tracking-widest text-[var(--text-main)]",children:["Private Projects","Priority Rendering","Collaboration Tools"].map((t,r)=>e.jsxs("li",{className:"flex items-center gap-3",children:[e.jsx(k,{size:14,className:"text-cyan-500"})," ",t]},r))}),e.jsx("button",{onClick:s,className:"w-full py-4 bg-cyan-500 text-black font-black uppercase text-xs rounded-xl shadow-lg shadow-cyan-500/20 hover:scale-[1.02] transition-transform",children:a.user?.role==="paid-user"||a.user?.role==="admin"?"Manage Subscription":"Upgrade Now"})]})]})]})}),e.jsx("section",{className:"py-64 px-6 text-center",children:e.jsxs("div",{className:"max-w-4xl mx-auto space-y-16",children:[e.jsx(B,{className:"text-cyan-500 mx-auto animate-bounce",size:48}),e.jsx("h2",{className:"text-6xl md:text-9xl font-black text-[var(--text-main)] uppercase tracking-tighter italic",children:"Start Coding Today"}),e.jsx(w,{href:route("register"),className:"px-16 py-6 bg-[var(--text-main)] text-[var(--bg-main)] font-black uppercase text-xs tracking-[0.5em] rounded hover:bg-cyan-500 hover:text-white transition-all shadow-2xl active:scale-95 inline-block italic",children:"Sign Up Free"})]})}),e.jsx(F,{isOpen:n,onClose:()=>x(!1),user:a.user})]})}export{ue as default};
