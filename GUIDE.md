# 🧠 HOACodeLab // Core Protocol Guide

**Version:** 1.10.0  
**Classification:** Technical Architecture & Operational Manual

---

## 🛰️ 01. System Architecture

HOACodeLab is an industrial-grade cloud prototyping substrate. It operates on a **Pure-Client Execution** model to ensure maximum security and zero server-side latency.

### **The Stack**

- **Kernel:** Laravel 12.x (REST API Node)
- **Neural Interface:** React 19 + Inertia.js
- **Synthesis Engine:** Monaco Editor (VS Code Engine)
- **Live Preview:** Sandboxed Iframe Array
- **Marketplace:** Internal Checkout Lifecycle
- **State Management:** Zustand (Cross-Component Sync)

---

## 🔐 02. Security & Execution Model

All user-generated code is executed **strictly within the browser**. The server never parses or runs JavaScript/PHP from users.

### **The Sandbox Protocol**

- **Iframe Isolation:** User code is injected via `srcdoc`.
- **Sandbox Attributes:** `allow-scripts` is active, but `allow-same-origin` and `allow-top-navigation` are permanently disabled.
- **Neural Lock:** Paid modules utilize a blur/grayscale overlay on the source code until ownership is verified via the Purchase Ledger.

---

## 💎 03. Neural Marketplace

The Marketplace allows for the monetization of high-end code modules.

### **Marketplace Logic**

1. **Premium Flag:** Projects can be toggled to `is_for_sale` via the Editor Sidebar.
2. **Checkout Terminal:** Users are routed through an internal `Checkout.jsx` terminal for gateway selection.
3. **Instant Unlock:** Upon successful handshake, the project is assigned to the user's account and the Neural Lock is neutralized.
4. **Resale Prevention:** Forking a purchased project resets its status to "Free" for the new owner.

---

## 🛠️ 04. Infrastructure Resilience Protocol

Designed for stability across restricted hosting environments (Shared Hosting, cPanel).

### **Autonomous Discovery**

- **Binary Locate:** The system scans common paths (`/usr/local/bin`, `/opt/node/bin`) to find Node and NPM.
- **Composer Fallback:** If global `composer` is missing, the installer autonomously downloads `composer.phar` from getcomposer.org.
- **Path Persistence:** Discovered paths are injected into the `.env` matrix for zero-latency execution.

### **Manual_Override**

Admins can manually register binary paths via the `/setup` terminal if autonomous discovery is blocked by server permissions.

---

## ☁️ 05. Cloud Synchronization (Google Drive)

The platform features a decentralized storage architecture, allowing users to bridge their personal Google Cloud infrastructure.

### **Setup Protocol**

1. **Acquire Credentials:**
    - Create a project at [Google Cloud Console](https://console.cloud.google.com).
    - Enable **Google Drive API**.
    - Configure OAuth Consent (Scope: `.../auth/drive.file`).
    - Generate **OAuth 2.0 Client ID** (Web App).

2. **Environment Injection:**
   Add these keys to your `.env` instance:

    ```env
    GOOGLE_CLIENT_ID="your_id"
    GOOGLE_CLIENT_SECRET="your_secret"
    GOOGLE_REDIRECT_URI="https://yourdomain.com/api/google-drive/callback"
    ```

3. **Operations:**
    - **Commit:** Transmits the current editor state to a `.hoa.json` buffer on Drive.
    - **Fetch:** Polls the remote array to restore projects into the local workspace.

---

## 👑 04. SaaS & Access Control

The platform utilizes a tiered role system to gate high-performance features.

### **Clearance Tiers**

- **Admin:** Full system command + unlimited resources.
- **Paid-User (Pro):** Access to **Private Projects** and advanced cloud sync protocols.
- **Default User:** Access to Public Grid and standard Editor tools.

### **Manual Override**

Admins can grant **Pro Status** via the User Management panel (`/admin/users`) by clicking the **Crown** icon on any node.

---

## 🛠️ 05. Administrative Command

The **Global_Command** dashboard (`/admin/subscriptions`) allows real-time tuning of platform parameters:

- **Monetization:** Update monthly/yearly uplink prices.
- **Resource Quotas:** Set max project counts and upload limits.
- **Security:** Toggle public registrations and identity verification.
- **Maintenance:** Generate bypass ciphers for system updates.

---

## 📡 06. Deployment Protocols

To sync local changes to a production environment:

1. **Compile Assets:**
    ```bash
    npm run build
    ```
2. **Commit Changes:**
    ```bash
    git add .
    git commit -m "update: [protocol_name]"
    git push origin main
    ```
3. **Initialize Production:**
    ```bash
    php artisan migrate --force
    php artisan config:cache
    ```

4. **Initialize Cron Scheduler (Escrow Protocol):**
    The marketplace Escrow system requires a continuous 1-minute cron heartbeat:
    ```bash
    * * * * * cd /home/helpofai/code.helpofai.com && php artisan schedule:run >> /dev/null 2>&1
    ```

---

The hosting has old locally-installed node_modules files that conflict with the
▏ repo-tracked ones. Since you rely on repo-tracked deps (no npm/composer on hosting),
▏ just remove them and pull clean:  
▏  
 rm -rf node_modules vendor  
 git pull origin main  
▏  
▏ This nukes the locally-installed copies and lets git bring in the repo-tracked  
▏ versions. If you also have a stale composer.lock or package-lock.json conflict, add:
▏  
 rm -rf node_modules vendor  
 git checkout -- composer.lock package-lock.json  
 git pull origin main  
▏  
▏ After the pull, run:  
▏  
 php artisan migrate --force  
 php artisan optimize:clear

    The pull succeeded but node_modules and vendor are now missing from disk — you rm

▏ -rf'd them and the second pull didn't restore them because it was already  
▏ up-to-date. Restore them from the repo:  
▏  
 git checkout HEAD -- node_modules vendor  
▏  
▏ Or simpler:  
▏  
 git reset --hard HEAD  
▏  
▏ Then verify your site loads:  
▏  
 php artisan --version

    The pull updated the git index but the files are gone from disk. Run:

▏  
 git reset --hard HEAD  
▏  
▏ This restores every tracked file — including node_modules/ and vendor/. Your .env is
▏ safe (it's gitignored now). This will take a minute or two on shared hosting — let  
▏ it finish.  
▏  
▏ After it completes:  
▏  
 php artisan migrate --force  
 php artisan optimize:clear

---

**End of Transmission.**  
_Systems Operational // Sector_7G_Uplink_

### Automated Queue Setup (Shared Hosting/cPanel)

1. Go to your cPanel.
2. Search for "Cron Jobs".
3. Create a new Cron Job and set it to run Every Minute (* * * * *).
4. In the Command field, enter your server's path to run the scheduler:
   ```bash
   /usr/local/bin/php /home/yourusername/public_html/artisan schedule:run >> /dev/null 2>&1
   ```
   *(Note: Adjust /usr/local/bin/php to your server's actual PHP 8 path, and /home/yourusername/... to the path of your project).*

