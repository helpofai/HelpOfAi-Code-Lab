import { create } from 'zustand';

const DEFAULT_HTML = `<div class="neural-substrate">\n  <canvas id="neural-canvas"></canvas>\n  <div class="ui-overlay">\n    <div class="status-bar">\n      <span class="pulse"></span>\n      <span>NODE_STATUS: OPTIMIZED</span>\n    </div>\n    <div class="telemetry">\n      <h1>NEURAL_CORE_v2</h1>\n      <p>INTERACTIVE_PARTICLE_MATRIX</p>\n    </div>\n    <div class="footer-stats">\n      <div class="stat">CORES: 128</div>\n      <div class="stat">LATENCY: 0.02ms</div>\n    </div>\n  </div>\n</div>`;

const DEFAULT_CSS = `body {\n  background: #050505 !important;\n  margin: 0; overflow: hidden;\n  font-family: 'Inter', sans-serif;\n}\n\n.neural-substrate {\n  position: relative;\n  width: 100vw; height: 100vh;\n}\n\n#neural-canvas {\n  position: absolute;\n  inset: 0; z-index: 1;\n}\n\n.ui-overlay {\n  position: relative;\n  z-index: 2; height: 100%;\n  display: flex; flex-direction: column;\n  justify-content: space-between;\n  padding: 40px; pointer-events: none;\n}\n\n.status-bar {\n  display: flex; items-center: center; gap: 10px;\n  color: #06b6d4; font-size: 10px; font-weight: 900;\n  letter-spacing: 2px;\n}\n\n.pulse {\n  width: 8px; height: 8px; background: #06b6d4;\n  border-radius: 50%; animation: glow 2s infinite;\n}\n\nh1 {\n  color: white; font-size: 4rem; font-weight: 900;\n  margin: 0; letter-spacing: -2px; font-style: italic;\n  text-shadow: 0 0 30px rgba(6,182,212,0.3);\n}\n\np {\n  color: #475569; font-size: 12px; font-weight: 800;\n  letter-spacing: 5px; margin-top: 5px;\n}\n\n.footer-stats {\n  display: flex; gap: 40px;\n  color: #1e293b; font-size: 9px; font-weight: 900;\n  letter-spacing: 2px; border-top: 1px solid #1e293b;\n  padding-top: 20px;\n}\n\n@keyframes glow {\n  0%, 100% { opacity: 1; transform: scale(1); }\n  50% { opacity: 0.3; transform: scale(1.5); }\n}`;

const DEFAULT_JS = `const canvas = document.getElementById('neural-canvas');\nconst ctx = canvas.getContext('2d');\nlet particles = [];\nconst mouse = { x: null, y: null, radius: 150 };\n\nwindow.addEventListener('resize', resize);\nwindow.addEventListener('mousemove', (e) => { mouse.x = e.x; mouse.y = e.y; });\n\nfunction resize() {\n  canvas.width = window.innerWidth;\n  canvas.height = window.innerHeight;\n}\n\nclass Particle {\n  constructor() {\n    this.x = Math.random() * canvas.width;\n    this.y = Math.random() * canvas.height;\n    this.size = Math.random() * 2 + 1;\n    this.vx = (Math.random() - 0.5) * 2;\n    this.vy = (Math.random() - 0.5) * 2;\n  }\n  update() {\n    this.x += this.vx; this.y += this.vy;\n    if (this.x > canvas.width || this.x < 0) this.vx *= -1;\n    if (this.y > canvas.height || this.y < 0) this.vy *= -1;\n    \n    let dx = mouse.x - this.x; let dy = mouse.y - this.y;\n    let dist = Math.sqrt(dx*dx + dy*dy);\n    if (dist < mouse.radius) {\n      this.x -= dx/20; this.y -= dy/20;\n    }\n  }\n  draw() {\n    ctx.fillStyle = 'rgba(6,182,212,0.8)';\n    ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);\n    ctx.fill();\n  }\n}\n\nfunction init() {\n  particles = [];\n  for (let i=0; i<100; i++) particles.push(new Particle());\n}\n\nfunction animate() {\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\n  particles.forEach(p => {\n    p.update(); p.draw();\n    particles.forEach(other => {\n      let dx = p.x - other.x; let dy = p.y - other.y;\n      let dist = Math.sqrt(dx*dx + dy*dy);\n      if (dist < 100) {\n        ctx.strokeStyle = \`rgba(6, 182, 212, \${1 - dist/100})\`;\n        ctx.lineWidth = 0.5;\n        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(other.x, other.y);\n        ctx.stroke();\n      }\n    });\n  });\n  requestAnimationFrame(animate);\n}\n\nresize(); init(); animate();\nconsole.log("Handshake_Successful: Neural Matrix Active.");`;

export const DEFAULT_TEMPLATE = { html: DEFAULT_HTML, css: DEFAULT_CSS, js: DEFAULT_JS };

const useProjectStore = create((set) => ({
    html: DEFAULT_HTML,
    
    css: DEFAULT_CSS,

    js: DEFAULT_JS,

    id: null,
    title: 'Untitled Project',
    isPrivate: false,
    isForSale: false,
    price: 0,
    layout: 'bottom', // 'bottom', 'right', 'top'
    google_drive_file_id: null,
    externalLibraries: [],
    fontSize: 14,
    wordWrap: 'on',
    
    // Advanced Settings
    theme: 'vs-dark',
    minimap: false,
    formatOnSave: true,
    preprocessors: {
        html: 'html', // 'html'
        css: 'css',   // 'css', 'scss', 'less'
        js: 'js'      // 'js', 'babel', 'typescript'
    },
    
    setHtml: (html) => set({ html }),
    setCss: (css) => set({ css }),
    setJs: (js) => set({ js }),
    setTitle: (title) => set({ title }),
    setIsPrivate: (isPrivate) => set({ isPrivate }),
    setIsForSale: (isForSale) => set({ isForSale }),
    setPrice: (price) => set({ price }),
    setLayout: (layout) => set({ layout }),
    setGoogleDriveFileId: (id) => set({ google_drive_file_id: id }),
    setExternalLibraries: (libs) => set({ externalLibraries: libs }),
    setFontSize: (size) => set({ fontSize: size }),
    setWordWrap: (wrap) => set({ wordWrap: wrap }),
    setTheme: (theme) => set({ theme }),
    setMinimap: (minimap) => set({ minimap }),
    setFormatOnSave: (formatOnSave) => set({ formatOnSave }),
    setPreprocessors: (preprocessors) => set({ preprocessors }),
    setPreprocessor: (lang, type) => set((state) => ({ 
        preprocessors: { ...state.preprocessors, [lang]: type } 
    })),
    
    setProject: (project) => set({
        id: project.id || null,
        html: project.code?.html || '',
        css: project.code?.css || '',
        js: project.code?.js || '',
        title: project.title || 'Untitled Project',
        isPrivate: project.is_private || false,
        isForSale: project.is_for_sale || false,
        price: project.price || 0,
        externalLibraries: project.settings?.externalLibraries || [],
        theme: project.settings?.theme || 'vs-dark',
        preprocessors: project.settings?.preprocessors || { html: 'html', css: 'css', js: 'js' },
    }),
}));

export default useProjectStore;
