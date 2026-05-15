# HOACodeLab Architecture Ledger // CHANGELOG

Systematic documentation of all protocol upgrades, module injections, and core optimisations for the HOACodeLab environment.

---

## [1.7.0] - DEPLOYMENT_OS - 2026-04-18

### 🚀 Added: Production Setup Protocol (Installer)
- **Zero-Terminal Installation Matrix:** New web-based installer at `/setup` for environments without SSH/CLI access.
- **Live_Terminal.exe UI:** A high-fidelity, interactive terminal simulation for executing deployment commands.
  - **Real-time Streaming:** Utilizes Server-Sent Events (SSE) and `proc_open` to stream live Artisan output line-by-line.
  - **Animated Buffer:** Smooth line-in animations with smart auto-scrolling and timestamping for every log entry.
- **Production Command Suite:** Dedicated one-click protocols for:
  *   **Security:** `key:generate`
  *   **Schema:** `migrate`
  *   **Asset Pipeline:** `storage:link`
  *   **Data Injection:** `db:seed`
  *   **Global Cache Flush:** `optimize:clear`
- **Prod_Optimize Chain:** Integrated sequential optimization macro (`config:cache`, `route:cache`, `view:cache`) for maximum performance tuning.
- **System Diagnostics:** Real-time verification of PHP version and critical extensions (BCMath, GD, PDO, etc.) before execution.

### 🛡️ Changed: Deployment Architecture
- **Route Hardening:** Added specific setup routes to the `web.php` kernel.
- **Execution Lifecycle:** Increased execution timeouts to 600s to handle long-running migrations and seeding on slower hosting infrastructures.

---

## [1.6.0] - SYNERGY_DEPLOYMENT - 2026-04-17

### ✍️ Added: Tiptap WYSIWYG Core
- **Rich-Text Transmision Matrix:** Integrated **Tiptap Pro** as the primary CMS editor.
  - Replaced legacy textareas with a visual, pixel-perfect writing substrate.
  - Implemented **Bubble_Menu Protocol:** A floating, context-aware toolbar that materialize on text selection for instant formatting.
  - **Feature Set:** Bold, Italic, Strikethrough, Heading 1/2, Bullet/Ordered Lists, Blockquotes, and Code Blocks.
- **Media & Link Uplink:** Added dedicated modules for **Image Injection** and **Hyperlink Protocol** within the rich-text buffer.

### 📄 Added: Dynamic Page Matrix
- **Content Substrate Management:** New "Page Manager" module in the Admin Command Center.
- **Node Lifecycle Control:** Full CRUD operations for static nodes (About, Privacy, Terms, Contact).
- **SEO Intelligence:** Dedicated meta-field substrate for each node to ensure perfect search discovery.
- **Public Signal Viewer:** High-end `PageViewer` component that renders Tiptap HTML with unified `PublicLayout` consistency.

### ⚡ Changed: Performance & UI Optimization
- **Execution Latency Reduction:** Implemented code-splitting and lazy-loading for heavy editor kernels (Monaco/Tiptap), reducing initial load by ~35%.
- **Live Sandbox Demo:** Upgraded the Home Page hero with a **Neural_Matrix_v2** generative demonstration, allowing real-time code-to-visual handshaking.
- **Responsive Navigation V2:** Optimized the mobile header to collapse non-essential nodes, prioritizing critical "Dashboard" and "Get Started" links.
- **Refined Branding:** Synchronized the "Neural" aesthetic across all public and admin pages.

### 📧 Changed: Mail & Billing Intelligence
- **Transmission Ledger:** Upgraded the Mail System with a full **History/Log Matrix** and real-time statistics dashboard.
- **Protocol Re-initialization:** Added a "Resend" tool to the mail history to re-trigger failed transmissions instantly.
- **Gateway Manuals:** Injected detailed, beginner-friendly integration guides for all payment gateways (**Stripe, Razorpay, Paytm, PhonePe**) directly into their configuration tabs.
- **Handshake Verification:** New built-in diagnostic tool to test payment gateway API connections before commitment.

### 🔧 Fixed: Syntax & Integrity
- **Vite Dependency Scan:** Resolved `ERR_CONNECTION_RESET` and `EPIPE` errors by cleaning up syntax placeholders and broken imports.
- **Icon Matrix:** Fixed `Users`, `Layers`, and `Activity` reference errors in the editor sidebar and footer.
- **Markdown Rendering:** Resolved HTML rendering bugs in documentation nodes using `rehype-raw`.

---

## [1.5.0] - NEURAL_CORE_UPGRADE - 2026-04-17

### 🌌 Added: Prototypes & Preprocessors
- **Client-Side Transpilation Matrix:** Injected `babel-standalone` and `sass.js` into the execution core.
  - Users can now write **React (JSX)**, **TypeScript**, and **SCSS/Sass** directly in the browser.
  - Real-time compilation handles nested styles and ESNext syntax without server overhead.
- **Interactive Neural REPL:** Upgraded the system console to a bidirectional communication hub.
  - Implemented `postMessage` protocol for real-time command execution within the sandboxed preview.
  - Results are instantly reflected in the console with rich object inspection support.
- **Deep IntelliSense Engine:** Implemented Automatic Type Acquisition (ATA).
  - The Monaco kernel now autonomously fetches `.d.ts` definitions from UNPKG for any CDN library added to the project.
- **Pro Editor Visuals:** Integrated professional-grade theme nodes.
  - **Themes:** Added `Dracula Pro`, `High Contrast Light`, and `Standard Dark`.
  - **Telemetry:** Enabled `Neural Minimap` for deep-code navigation.

### 👥 Added: Collaborative Units (Teams)
- **Shared Module Architecture:** Updated the SQL schema to support `team_id` on project nodes.
- **Role-Based Clearance (RBAC):** Implemented backend logic for `Admin`, `Editor`, and `Member` permissions.
- **Unit Dashboard:** Added team-based filtering and assignment logic to the Project Archives.
- **Personnel Sidebar:** New "Unit Personnel" panel in the editor to track active agents on shared modules.

### 🛠️ Added: Admin Intelligence Hub
- **System_Info Hub:** A centralized documentation and telemetry center for Level 0 Admins.
- **Real-time Telemetry:** Dynamic markdown node that pulls PHP, Laravel, and Infrastructure stats directly from the server.
- **Enhanced MD Engine:** Integrated `react-markdown` with `rehype-raw` and `remark-gfm` to support complex GitHub-style layouts and raw HTML styling.

### 📱 Changed: Responsive Protocol
- **Mobile Tab Matrix:** Replaced the desktop 3-pane layout with a responsive horizontal-scrolling tab system for editor panes on mobile devices.
- **Adaptive Header/Footer:** Action bars now support smooth swipe-scrolling to ensure 100% tool accessibility on small screens.
- **Collapsible Title Protocol:** Project titles now minimize to a "Node" icon on mobile to prioritize space for development tools.

### 📦 Changed: Data & Storage
- **Pro Asset Pipeline:** Implemented drag-and-drop URL injection. Assets from the sidebar can now be dragged directly into the Monaco editor buffer.
- **Cloud environment Sync:** Updated Google Drive protocol to sync environment settings (themes, preprocessors) alongside raw code buffers.

### 🔧 Fixed: Core Stability
- **Dependency Optimisation:** Resolved `react-is` resolution errors within the `recharts` module for React 19 compatibility.
- **Syntax Integrity:** Audited and repaired JSX structure mismatches in `MonacoWrapper` and `EditorSidebar`.
- **Zustand State Mapping:** Fixed prop-drilling mismatches between the primary Editor component and its action hooks.

---

### Node Status: **STABLE**
### Core Clearance: **LEVEL_0**
### Build Signature: **HOA-PRO-1.6.0-FINAL**
