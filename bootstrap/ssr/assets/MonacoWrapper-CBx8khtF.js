import { jsx } from "react/jsx-runtime";
import { useRef, useEffect, useMemo } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";
import { create } from "zustand";
const DEFAULT_HTML = `<div class="neural-substrate">
  <canvas id="neural-canvas"></canvas>
  <div class="ui-overlay">
    <div class="status-bar">
      <span class="pulse"></span>
      <span>STATUS: OPTIMIZED</span>
    </div>
    <div class="telemetry">
      <h1>SYSTEM CORE</h1>
      <p>INTERACTIVE MATRIX</p>
    </div>
    <div class="footer-stats">
      <div class="stat">CORES: 128</div>
      <div class="stat">LATENCY: 0.02ms</div>
    </div>
  </div>
</div>`;
const DEFAULT_CSS = `body {
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
}`;
const DEFAULT_JS = `const canvas = document.getElementById('neural-canvas');
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
console.log("Success: Neural Matrix Active.");`;
const DEFAULT_TEMPLATE = { html: DEFAULT_HTML, css: DEFAULT_CSS, js: DEFAULT_JS };
const useProjectStore = create((set) => ({
  html: DEFAULT_HTML,
  css: DEFAULT_CSS,
  js: DEFAULT_JS,
  id: null,
  title: "Untitled Project",
  isPrivate: false,
  isForSale: false,
  price: 0,
  layout: "bottom",
  // 'bottom', 'right', 'top'
  google_drive_file_id: null,
  externalLibraries: [],
  fontSize: 14,
  wordWrap: "on",
  // Advanced Settings
  theme: "vs-dark",
  minimap: false,
  formatOnSave: true,
  preprocessors: {
    html: "html",
    // 'html'
    css: "css",
    // 'css', 'scss', 'less'
    js: "js"
    // 'js', 'babel', 'typescript'
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
    html: project.code?.html || "",
    css: project.code?.css || "",
    js: project.code?.js || "",
    title: project.title || "Untitled Project",
    isPrivate: project.is_private || false,
    isForSale: project.is_for_sale || false,
    price: project.price || 0,
    externalLibraries: project.settings?.externalLibraries || [],
    theme: project.settings?.theme || "vs-dark",
    preprocessors: project.settings?.preprocessors || { html: "html", css: "css", js: "js" }
  })
}));
const EditorLoader = () => /* @__PURE__ */ jsx("div", { className: "h-full w-full bg-[#050505] flex items-center justify-center font-mono text-[10px] text-cyan-500 uppercase tracking-[0.3em]", children: "Loading..." });
function MonacoWrapper({ language, value, onChange, fontSize, wordWrap, externalLibraries = [] }) {
  const { theme, minimap } = useProjectStore();
  const monaco = useMonaco();
  const editorRef = useRef(null);
  useEffect(() => {
    if (!monaco) return;
    monaco.editor.defineTheme("dracula", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "6272a4" },
        { token: "keyword", foreground: "ff79c6" },
        { token: "identifier", foreground: "50fa7b" },
        { token: "string", foreground: "f1fa8c" },
        { token: "type", foreground: "8be9fd" }
      ],
      colors: {
        "editor.background": "#282a36",
        "editor.foreground": "#f8f8f2",
        "editor.lineHighlightBackground": "#44475a",
        "editorCursor.foreground": "#f8f8f0",
        "editorWhitespace.foreground": "#3b3a32",
        "editorIndentGuide.activeBackground": "#939393",
        "editor.selectionBackground": "#44475a"
      }
    });
  }, [monaco]);
  useEffect(() => {
    if (!monaco) return;
    if (!window.emmetMonaco) {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/emmet-monaco-es/dist/emmet-monaco.min.js";
      script.onload = () => {
        if (window.emmetMonaco) {
          window.emmetMonaco.emmetHTML(monaco);
          window.emmetMonaco.emmetCSS(monaco);
        }
      };
      script.onerror = () => {
        console.warn("Error: Emmet Module Offline.");
      };
      document.head.appendChild(script);
    } else {
      window.emmetMonaco.emmetHTML(monaco);
      window.emmetMonaco.emmetCSS(monaco);
    }
    const loadTypings = async (libUrl) => {
      try {
        const match = libUrl.match(/npm\/([^@/]+)/) || libUrl.match(/unpkg\.com\/([^@/]+)/);
        if (!match) return;
        const pkgName = match[1];
        const typeUrl = `https://unpkg.com/@types/${pkgName}/index.d.ts`;
        const res = await fetch(typeUrl);
        if (res.ok) {
          const content = await res.text();
          monaco.languages.typescript.javascriptDefaults.addExtraLib(
            content,
            `file:///node_modules/@types/${pkgName}/index.d.ts`
          );
        }
      } catch (e) {
      }
    };
    if (language === "js") {
      externalLibraries.forEach(loadTypings);
    }
  }, [monaco, language, externalLibraries]);
  const handleEditorDidMount = (editor, monaco2) => {
    editorRef.current = editor;
    const domNode = editor.getDomNode();
    if (domNode) {
      domNode.addEventListener("drop", (e) => {
        e.preventDefault();
        const url = e.dataTransfer.getData("text/plain");
        if (url && (url.startsWith("http") || url.startsWith("/storage"))) {
          const selection = editor.getSelection();
          const range = new monaco2.Range(selection.startLineNumber, selection.startColumn, selection.endLineNumber, selection.endColumn);
          const op = { range, text: url, forceMoveMarkers: true };
          editor.executeEdits("my-source", [op]);
        }
      });
    }
    monaco2.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false
    });
    monaco2.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: monaco2.languages.typescript.ScriptTarget.ESNext,
      allowNonTsExtensions: true,
      checkJs: true,
      jsx: monaco2.languages.typescript.JsxEmit.React
    });
  };
  const options = useMemo(() => ({
    minimap: { enabled: minimap },
    fontSize: fontSize || 14,
    wordWrap: wordWrap || "on",
    automaticLayout: true,
    padding: { top: 10 },
    scrollBeyondLastLine: false,
    fixedOverflowWidgets: true,
    fontFamily: 'JetBrains Mono, Menlo, Monaco, Consolas, "Courier New", monospace',
    renderLineHighlight: "all",
    lineNumbers: "on",
    roundedSelection: true,
    scrollbar: {
      vertical: "visible",
      horizontal: "visible",
      useShadows: false,
      verticalScrollbarSize: 10,
      horizontalScrollbarSize: 10
    },
    cursorBlinking: "smooth",
    cursorSmoothCaretAnimation: "on",
    mouseWheelZoom: true,
    smoothScrolling: true,
    contextmenu: true
  }), [fontSize, wordWrap, minimap]);
  return /* @__PURE__ */ jsx(
    Editor,
    {
      height: "100%",
      theme,
      path: language === "js" ? "main.js" : `index.${language}`,
      defaultLanguage: language === "js" ? "javascript" : language,
      value,
      onChange,
      onMount: handleEditorDidMount,
      options,
      loading: /* @__PURE__ */ jsx(EditorLoader, {}),
      keepCurrentModel: true
    }
  );
}
export {
  DEFAULT_TEMPLATE as D,
  MonacoWrapper as M,
  useProjectStore as u
};
