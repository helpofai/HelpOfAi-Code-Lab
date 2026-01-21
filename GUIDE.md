# 🧠 HOACodeLab // Core Protocol Guide
**Version:** 1.4.4  
**Classification:** Technical Architecture & Operational Manual

---

## 🛰️ 01. System Architecture
HOACodeLab is an industrial-grade cloud prototyping substrate. It operates on a **Pure-Client Execution** model to ensure maximum security and zero server-side latency.

### **The Stack**
- **Kernel:** Laravel 12.x (REST API Node)
- **Neural Interface:** React 19 + Inertia.js
- **Synthesis Engine:** Monaco Editor (VS Code Engine)
- **Live Preview:** Sandboxed Iframe Array
- **State Management:** Zustand (Cross-Component Sync)

---

## 🔐 02. Security & Execution Model
All user-generated code is executed **strictly within the browser**. The server never parses or runs JavaScript/PHP from users.

### **The Sandbox Protocol**
- **Iframe Isolation:** User code is injected via `srcdoc`.
- **Sandbox Attributes:** `allow-scripts` is active, but `allow-same-origin` and `allow-top-navigation` are permanently disabled.
- **CSRF Protection:** All cloud-sync operations are protected by state-verified tokens.

---

## ☁️ 03. Cloud Synchronization (Google Drive)
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

---

**End of Transmission.**  
*Systems Operational // Sector_7G_Uplink*
