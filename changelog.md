# HOACodeLab Architecture Ledger // CHANGELOG

Systematic documentation of all protocol upgrades, module injections, and core optimisations for the HOACodeLab environment.

## [1.18.2] - VENDOR_THUMBNAIL_FIX - 2026-08-10

### 🎨 Explore Page — Vendor Project Thumbnail Rendering
- **Smart Fallback for GitHub Projects:** Updated `ProjectPreviewContent` to detect vendor/GitHub-linked projects (`github_repo_url`) and display a professional "Premium Module" placeholder instead of attempting to render broken `iframe` previews.
- **Resolves Blank Thumbnails:** Fixes the issue where complex marketplace projects (requiring build steps, npm deps, or external assets) appeared as blank/broken cards on the Explore page.
- **Performance Gain:** Skips heavy client-side Babel/Sass compilation for vendor projects, significantly speeding up Explore page load times.

## [1.18.1] - MIGRATION_IDEMPOTENCY_PATCH - 2026-08-03

### 🛠️ Migration Hardening
- **Idempotency Matrix:** Wrapped all recent database migrations (`reviews`, `newsletter_subscribers`, `social_media_logs`, `banned_ips`) with `Schema::hasTable` conditional guards.
- **Legacy Schema Safety:** Refactored foreign keys in the `reviews` table migration from strict `constrained()` methods to raw integer indices to prevent engine-mismatch crashes on legacy shared hosting.

## [1.18.0] - SECURITY_AND_FIREWALL - 2026-08-02

### 🛡️ Advanced Application Firewall
- **Global Rate Limiting:** Injected `AdvancedFirewall` middleware into the global execution matrix to autonomously block DDoS and brute-force bot attacks.
- **Dynamic Penalty Box:** IPs that exceed the threshold (default: 150 requests/min) are automatically placed in a 24-hour lockdown (`429` and `403` status).
- **Security Dashboard:** Added a highly professional UI in the Admin Control Center to configure firewall thresholds, view active network bans, and manually blacklist IPs.
- **Database Tracking:** Built a `BannedIp` ledger to permanently track malicious IPs and sync them seamlessly across the cache layer.

## [1.17.0] - SOCIAL_MEDIA_AUTOMATION - 2026-08-02

### 📱 Automated Social Media Broadcasting
- **Telegram & WhatsApp Integration:** Projects are now automatically broadcasted to configured Telegram channels and WhatsApp groups the moment they are successfully published by an admin or vendor.
- **Dynamic Post Templates:** Introduced three customizable broadcast templates (Professional Cinematic, Startup Launch, Minimal Text) with dynamic variable injection (`{title}`, `{description}`, `{price}`, `{link}`).
- **Advanced Proxy & Webhook Config:** Configured secure direct S2S transmission utilizing Cloudflare Worker proxies and Official Meta API Webhooks to bypass shared-hosting `pcntl` and latency limitations.
- **Activity Log Matrix:** Added a dedicated 'Social Media Activity Logs' dashboard in the Admin Control Center, equipped with real-time success/fail status pills, platform icons, and raw API error outputs.
- **Asynchronous Queue Observer:** Built a resilient `ProjectObserver` tied directly to an asynchronous Laravel Job Queue, ensuring that API rate limits or failures never block the core project saving process.

## [1.16.0] - THE FINAL GODMODE RELEASE - 2026-08-01

### 🚀 E2E Validated Architecture
- **Flawless E2E Certification**: Successfully audited and tested every ecosystem node via `test_e2e.php` ensuring absolute data cohesion between Database, Vendor KYC, Payment Gateways, License Server, and OTA streaming.
- **Level 4 Verification Matrix**: Enforced bulletproof security in `ProjectController`—only administrators or Level 4 vendors with `verified` identity status can now link external GitHub repositories for distribution.
- **Auto-Level Bumping on KYC**: Automated the vendor onboarding pipeline. Approving identity documents in the Admin Dashboard now instantly upgrades vendors to Level 4, locking their level against sales-based algorithmic downgrades.
- **Custom SDK/API Integrations**: Added a comprehensive `Raw REST API` tab in the SDK integration dashboard, exposing the underlying licensing and auto-update endpoints (complete with JSON schema) so enterprise clients can build their own custom native integrations in Python, Go, C#, or Ruby without relying strictly on the PHP/Node.js wrappers.

---

## [1.15.0] - MULTI_VENDOR_MARKETPLACE - 2026-07-31

### 🛍️ Vendor & Marketplace Architecture
- **Multi-Gateway Checkout Engine**: Rebuilt the purchase controller to support advanced S2S (Server-to-Server) callbacks (e.g., PhonePe) neutralizing browser-redirect payment spoofing attacks.
- **Financial Ledger & ACID Transactions**: Implemented a double-entry `wallet_transactions` immutable ledger utilizing pessimistic row-locking (`lockForUpdate()`) to prevent race conditions during high-frequency payouts.
- **Auto & Manual Payout Routing**: Added a global `SiteSetting` to toggle payout models. In "Auto" mode, gateways route funds directly. In "Manual" mode, admins hold funds and approve vendor withdrawals.
- **Dynamic Currency Bridge**: Developed a dynamic USD to INR conversion layer (`usd_to_inr_rate`) specifically built for local-currency checkout constraints against global USD product pricing.
- **Automated License Generation**: Project purchases now auto-generate secure RSA-style license keys tied to the buyer's ID and the project ID, unlocking ZIP payload delivery.

### 🛡️ Marketplace Fraud & Bleed Protection
- **7-Day Escrow Shield**: Implemented a mandatory 7-day holding period (`escrow_balance`) for vendor earnings to buffer against hit-and-run fraud and chargebacks.
- **Escrow Sweeper Daemon**: Added `php artisan escrow:clear` command to automatically flush mature escrow funds into vendors' `available_balance`.
- **Minimum Payout Threshold**: Enforced a minimum withdrawal threshold (default $50) to block micro-transaction wire transfer bleed.
- **Database Safety Measures**: Hardened marketplace schema migrations with `Schema::hasColumn` conditional checks to enforce idempotency across environments.

### 📧 Notifications & Professional Invoicing
- **Enterprise PDF Invoices**: Integrated `dompdf`. The system now dynamically compiles and attaches a highly professional, tax-ready `.pdf` invoice to the buyer's receipt email instantly upon checkout.
- **Global Notification Engine**: Upgraded the `NotificationController` with API endpoints to support a universal React Bell-Icon dropdown for Vendors, Admins, and Buyers across the platform.

---

## [1.14.0] - ADS_AND_ACCESS_REQUESTS - 2026-06-29

### 📢 Monetization & Ad Network Integration
- **Global Ad System**: Added comprehensive Ad units management in the admin dashboard supporting Google AdSense, Facebook Audience Network, and custom scripts.
- **Global Network Config**: Added a dedicated "Networks" tab to the admin page to globally configure AdSense Publisher IDs, Auto Ads toggles, and Facebook App IDs.
- **Video Reward Ads**: Implemented mandatory video reward ads for users attempting to view the source code of public projects they don't own. 
- **Ad Bypass for Elite Users**: Verified users and high-ranking users (Level 5+) automatically bypass video reward ads when viewing public code.

### 🔒 Private Projects & Access Requests
- **Public Previews for Private Projects**: Private project thumbnails and live previews are now visible publicly to drive engagement, while the source code remains strictly protected.
- **Access Request Workflow**: Users can now request access to private projects from the author. To unlock the request button, users must first complete watching 2 reward video ads.
- **Author Approval UI**: Added a dedicated modal for project authors (in My Projects) to review, approve, or reject incoming access requests.

### 🛠 Database & Stability
- **Migration Safety**: Retrofitted recent database migrations with `Schema::hasTable` and `Schema::hasColumn` conditional logic to prevent "Table already exists" errors during complex deployments.

---

## [1.13.0] - UI_PROFESSIONALIZATION_&_MY_ACCOUNT - 2026-06-29

### 💼 My Account & User Dashboard
- **Dedicated My Account Page**: Created a highly professional, tabbed `My Account` interface consolidating User Profile, My Projects, Purchase History, and Security settings into one clean sidebar-based view.
- **Enhanced Verification UI**: Added immediate visual indicators (green verified badges and dynamic User Level badges) directly into the user's profile mini-card in the sidebar.
- **Navigation Integrations**: Added `My Account` link into the main authenticated dropdown menu for seamless user access.
- **Purchase History Fixes**: Corrected display issues when rendering integer transaction IDs in the purchase history table.

### 🎨 Clean UI & Terminology Standardisation
- **Jargon Removal**: Conducted a platform-wide code sweep (across all 23 React components) to strip all "sci-fi" / "neural" terminology (e.g., "Neural Uplink", "Admin Command Center", "Node"), replacing it with clean, standardized, and professional language (e.g., "Secure Connection", "Admin Dashboard", "Project").

---

## [1.12.0] - IDENTITY_AND_LEVELS - 2026-06-29

### 🛡️ Identity & Verification
- **Advanced Identity Verification Protocol**: Users can now upload a selfie and a national ID document to verify their identity. 
- **Admin Verification Portal**: Administrators can review uploaded identity documents through a secure modal in the User Matrix and approve or reject identities with custom rejection reasons.
- **Neural Verification Email**: Overhauled the email verification layout. Uses a custom cyberpunk aesthetic `VerifyEmailNotification` and a dark-theme email template for maximum professionalism.

### 🌟 Leveling System
- **Dynamic User Levels**: Automated level progression (Levels 1-10) based on project activity and view counts.
- **Professional Badge UI**: Added a beautiful 10-level color-coded badge system with gradients and unique icons (Novice, Apprentice, Adept, Veteran, Elite, Master, Grandmaster, Legend, Mythic, Cosmic).
- **Admin Level Control**: Admins can manually override a user's level via the User Matrix, automatically locking the level from daily recalculations.

---

## [1.11.0] - SECURITY_HARDENED_&_UI_PROFESSIONAL - 2026-06-04

### 🔐 Security & Payment Hardening

- **Stripe Purchase Verification (Critical Fix):** Replaced blind-trust `firstOrCreate` with real Stripe API session verification. The `verify` method now calls `StripeClient->checkout->sessions->retrieve()` to validate `payment_status === 'paid'` and confirm `metadata.project_id` matches before recording a purchase. Previously, any fabricated `session_id` could unlock paid projects for free.
- **Pending Purchase Records:** Stripe checkout now creates a `Purchase` record with `status: pending` immediately at session creation — prevents lost purchases if the user closes the browser before the redirect completes.
- **PhonePe Purchase Checkout:** Implemented the previously-stubbed PhonePe gateway for project purchases, ported from the subscription controller. Supports UAT/PRODUCTION environment switching, SHA256 checksum validation, and pending purchase tracking.
- **Encrypted OAuth Secrets:** Google Drive `personal_google_client_id` and `personal_google_client_secret` now use Laravel's `encrypted` cast — OAuth secrets are encrypted at rest in the database instead of stored as plaintext.
- **Rate Limiting:** Added `throttle:10,1` to checkout routes and `throttle:30,1` to purchase verify endpoints. Prevents brute-force attacks on payment endpoints.
- **.env Protection:** Uncommented `.env` entries in `.gitignore` — the live environment file is now properly excluded from version control, preventing accidental exposure of production secrets.

### 🔄 Update System Resilience

- **Pre-Reset Safety Gate:** The one-click updater now runs `git status --porcelain` before `git reset --hard`. If tracked files have local modifications, the update aborts and lists the changed files — preventing silent data loss from uncommitted hotfixes.
- **Database Snapshot Before Migration:** `mysqldump` is now executed before `migrate --force`, saving a timestamped backup to `storage/app/backups/pre_update_YYYY-MM-DD_HH-II-SS.sql`. Gracefully falls back if `mysqldump` is unavailable.
- **Migration Failure Abort:** The updater previously continued to cache operations and reported "completed successfully" even when migrations failed. Now returns immediately on failure, leaving the system in its pre-migration state for recovery.

### 🖥️ Production .htaccess

- **Sensitive File Blocking:** 403 Forbidden on `.env`, `composer.json`, `composer.lock`, `package.json`, `package-lock.json`, `artisan`, `phpunit.xml`, `.git`, `storage/`, `vendor/`.
- **Security Headers:** `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN` (allows editor iframe previews), `X-XSS-Protection`, `Referrer-Policy`, `Permissions-Policy`. Server signature headers (`X-Powered-By`, `Server`) are unset.
- **Gzip Compression:** HTML, CSS, JS, JSON, XML, SVG, and font files compressed on-the-fly.
- **Browser Caching:** Images and fonts cached for 1 year. CSS/JS cached for 1 year with `immutable` directive on Vite-hashed build assets. HTML/JSON set to 0 seconds (Inertia SPA responses must stay fresh).
- **HTTPS redirect + HSTS:** Commented-out ready — uncomment when SSL certificate is deployed.

### ✨ Professional UI System (5 New Components)

- **Toast Notification System:** Replaced 34 of 36 raw `alert()` calls across the entire application with a proper toast system. Components call `toast.success()`, `toast.error()`, `toast.info()`, or `toast.warning()`. Toasts stack with spring animations, auto-dismiss, and support click-to-close. Wired globally via `ToastProvider` in `GlobalBootWrapper`.
- **Command Palette (Ctrl+K):** Spotlight-style overlay with fuzzy search across 12 editor commands (Save, Format, New Project, Fork, Toggle Console, Layout switch, Share, Export, Sidebar, Settings). Full keyboard navigation: arrows + enter + esc.
- **Keyboard Shortcuts:** `useHotkeys` hook registers global shortcuts — `Ctrl+S` (save), `Ctrl+Shift+F` (format), `Ctrl+K` (command palette), `Ctrl+J` (toggle console), `Ctrl+B` (toggle sidebar). Mac `Cmd` key supported.
- **Tooltip Component:** Delayed hover tooltip with 4-position placement and optional keyboard shortcut badge display. Zero dependencies.
- **EmptyState Component:** Consistent empty-state UI with configurable icon (Lucide), title, description, and CTA button. Three sizes: `sm`, `md`, `lg`.
- **Skeleton Loaders:** `ProjectCardSkeleton`, `EditorSkeleton`, `StatCardSkeleton`, `ListRowSkeleton` — content-shaped pulse animations matching real component layouts.

### 🧹 Code Quality

- **Default Template DRY:** Extracted the "Neural Core" default HTML/CSS/JS template from both `useProjectStore.js` and `Welcome.jsx` into a single shared `DEFAULT_TEMPLATE` export.
- **Dependency Cleanup:** Removed unused `@tailwindcss/vite` (v4) from `package.json`. The project uses Tailwind v3 via PostCSS — the v4 Vite plugin was never configured.

---

## [1.10.0] - INFRASTRUCTURE_HARDENED - 2026-05-16

### 🛠️ Added: Resilience Protocol & Execution Matrix
- **Autonomous Binary Resolution:** Implemented a tiered discovery system for Composer, Node.js, and NPM. The system now autonomously scans common hosting paths and detects local binaries.
- **Composer_Uplink Fallback:** The installer now autonomously downloads `composer.phar` from *getcomposer.org* if a global installation is missing.
- **SSL Resilience Protocol:** Integrated `withoutVerifying()` fallbacks for environment-restricted cURL/SSL certificate handshakes.
- **Manual Path-Override UI:** Injected a specialized override panel into the `/setup` terminal for manual binary path registration.
- **Autonomous Path-Persistence:** Discovered binary paths are now automatically injected and saved into the `.env` matrix for zero-latency execution in future cycles.

### 🛡️ Hardened: Deployment & Migration Integrity
- **Idempotent Migration Matrix:** Refactored marketplace migrations with `Schema::hasTable` and `Schema::hasColumn` guards to prevent update crashes during partial state recovery.
- **Memory_Limit Escalation:** Prefix all Composer commands with `-d memory_limit=-1` to bypass shared hosting resource caps.
- **High-Verbosity Diagnostics:** Enabled `-vvv` logging for Composer to unmask silent environment failures in the Live Terminal.

### 🔧 Fixed: Environment Compatibility
- **Resilient PHP Kernel:** Unified all Artisan calls to use the absolute `PHP_BINARY` path, neutralizing "Command not found" errors on restricted hosts.
- **Node_Locate Logic:** Added specialized detection for cPanel/Alt-Node and other common shared hosting directory structures.

---

## [1.9.0] - NEURAL_MARKETPLACE_HARDENED - 2026-05-16

### 💎 Added: Neural_Marketplace & Checkout Protocol
- **Internal Checkout Lifecycle:** Replaced direct gateway redirects with a unified, high-fidelity `Checkout.jsx` terminal.
- **Dynamic Gateway Matrix:** The checkout system now autonomously detects and presents only the "Active" payment bridges (Stripe, Razorpay, etc.) configured in the Admin Command Center.
- **Neural_Test_Bridge:** Injected a specialized mock gateway for development environments, allowing end-to-end verification of the purchase-to-unlock lifecycle without real currency.
- **Unified Handshake Status:** New `PaymentStatus.jsx` terminal for real-time success/failure feedback and transaction telemetry.
- **Neural Lock V2:** Hardened the source code obfuscation protocol. Paid projects now redirect directly to the Internal Checkout for instant unlocking.

### 🛡️ Hardened: Admin Billing Infrastructure
- **Dynamic Gateway Protocols:** Refactored the Subscription Matrix to support "One-Click" activation/deactivation of regional payment bridges (Stripe, Razorpay, Paytm, PhonePe).
- **Protocol Key Sync:** Synchronized the backend kernel to use unified database keys for all gateway statuses, preventing cache desync issues.
- **Test Matrix Intelligence:** Added a dedicated "TEST" protocol tab in the Admin UI for safe sandbox management.

### 🔧 Fixed: Execution & Handshake Integrity
- **Stale Route Neutralization:** Implemented `php artisan optimize:clear` during updates to ensure new payment routes are instantly registered.
- **State Integrity:** Resolved prop-drilling errors in the `EditorPanels` where project slugs were not being correctly passed to the Neural Lock overlays.

---

## [1.8.0] - ADVANCED_INSTALLER_REFINED - 2026-05-15

### 🛡️ Added: Enterprise Deployment Suite V2
- **Advanced 6-Phase Wizard:** Replaced the single-page installer with a professional, multi-step deployment matrix.
  - **Phase 01: Systems_Check:** Real-time environment diagnostic verification.
  - **Phase 02: Kernel_Config:** Integrated .env editor with built-in **DB Connection Tester**.
  - **Phase 03: Execution_Matrix:** Restored full 6-command Artisan grid (Key Gen, Migrate, Storage Link, Cache Flush, Seed, Prod Optimize) with live terminal feedback.
  - **Phase 04: Admin_Provisioning:** Direct UI for creating the master administrative identity.
  - **Phase 05: Website_Meta:** Configuration of global site branding and metadata constants.
  - **Phase 06: Handshake_Finalized:** Success state with direct launch protocol.
- **Cache-Proof Communication:** Refactored all installer handshakes to use relative URLs, bypassing stale route caches during initial deployment.
- **Enforced JSON Handshaking:** Improved error diagnostics by forcing JSON responses and adding verbose console logging for failed server handshakes.

### 🔧 Fixed: Core Integrity & API Handshakes
- **Reflection Error Neutralization:** Fixed `ReflectionException` in API routes by properly importing `AssetController` and `CollectionController`.
- **Bootloader Hardening:** Added `try-catch` guards in `AppServiceProvider` to prevent boot crashes when the database is not yet initialized (first-run safety).
- **Silent Failure Diagnostics:** Implemented improved JavaScript error handling to capture and report raw PHP failures in the developer console.

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
### Build Signature: **HOA-PRO-1.12.0-FINAL**