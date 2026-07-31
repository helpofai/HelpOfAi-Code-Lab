# Digital Product Marketplace Architecture

This document outlines the architecture, tradeoffs, and implementation plan for building a professional digital product selling platform (source code, themes, plugins) with license management, backed by GitHub for storage.

## 1. System Architecture

Storing source code directly on your application server is anti-pattern. Using GitHub as your storage and version control layer ensures clean updates, versioning, and offloaded bandwidth.

*   **The Storefront (Laravel/React)**: The marketplace UI where users browse products. Built on your existing Laravel + React/Inertia stack.
*   **The Checkout Engine**: Handled via Laravel Cashier (Stripe) or Razorpay (which you already have).
*   **The License Generator**: Triggers upon a successful payment webhook to generate a unique, cryptographically signed License Key.
*   **The GitHub Broker**: Your Laravel backend uses the GitHub REST API (via a Personal Access Token or GitHub App) to either:
    *   **Method A (Download)**: Fetch the latest release `.zip` from a private repo and stream it to the user.
    *   **Method B (Access)**: Programmatically invite the buyer's GitHub username to the private repository.
*   **The Validation API**: The software the user bought periodically pings your Laravel API (`/api/v1/licenses/verify`) to verify license validity and domain bindings.

## 2. Tradeoffs & Key Decisions

### Delivery: Zip Downloads vs. Repo Access
*   **Zip Downloads (Recommended)**: The user buys a plugin, gets a license key, and clicks "Download" in your dashboard. Your server proxies the download from GitHub API. 
    *   *Tradeoff:* Higher server bandwidth, but a much easier UX for non-developers.
*   **Repo Access**: You invite the user to a private GitHub repo.
    *   *Tradeoff:* Zero bandwidth costs, but managing thousands of repository collaborators can hit GitHub API limits and becomes a moderation nightmare. Users also must have GitHub accounts.

### Licensing: Node-Locked vs. Floating vs. Open
*   **Node-Locked (Recommended)**: The license is tied to specific domains (e.g., `client-site.com`). If installed elsewhere, it fails.
    *   *Why:* Stops casual piracy where one buyer shares the file on a forum. Users manage their bound domains in your dashboard.

## 3. Failure Modes to Avoid (Where most fail)

1.  **Storing raw files locally**: Uploading source code to `storage/app/public` fills up the server and makes versioning impossible. Use GitHub.
2.  **Weak License Validation**: If your validation API just returns `{"status": "valid"}`, pirates will edit the client code to ignore the check.
    *   *Solution:* Use **Cryptographic License Keys** (RSA signing). The app signs the payload, and the distributed code verifies it locally using a public key.
3.  **API Rate Limiting on Updates**: If 50,000 WordPress sites check your API for updates exactly at midnight, your server will crash.
    *   *Solution:* Implement randomized jitter in the client software (e.g., check randomly between 12 AM and 4 AM) and cache API responses with Redis.
4.  **Handling Chargebacks poorly**: Your system must automatically catch the `chargeback.created` webhook, disable the License Key, and revoke GitHub access.

## 4. Implementation Plan

**Step 1: Database Schema**
You will need new Eloquent models and migrations:
*   `Product`: (id, title, sku, github_repo_url, price, current_version)
*   `License`: (id, user_id, product_id, license_key, expires_at, status)
*   `LicenseDomain`: (id, license_id, domain_url)

**Step 2: The GitHub Integration Service**
*   Install the GitHub PHP API client: `composer require knplabs/github-api`
*   Create an App service that takes a GitHub repo string (e.g., `helpofai/pro-theme`) and fetches the latest release asset link securely using a Personal Access Token.

**Step 3: The Validation API**
*   Create an API route: `POST /api/v1/license/validate`.
*   It accepts `license_key` and `domain`.
*   If valid, it returns the download URL for the latest update and a valid status.

**Step 4: The React Dashboard**
*   Update your existing Inertia frontend to include a "My Purchases" area.
*   Users can view keys, download files, and manage attached domains.

**Step 5: Start Small**
*   Do not build 10 products at once. Build **one** small premium plugin or theme.
*   Put it in a private GitHub repo, connect it to this system, and buy it yourself in Stripe/Razorpay test mode to verify the end-to-end flow.

## 5. Multi-Vendor Architecture (Selling Third-Party Projects)

To allow users to sell their own projects, you transition from a single-seller store to a multi-vendor platform (like Envato or CodeCanyon).

### The Vendor Workflow
1.  **Onboarding & KYC**: Users apply to become vendors. They must connect their Stripe Connect or Razorpay Route account to allow for automated split payments.
2.  **Product Submission**: The vendor submits their project via your dashboard. They provide their private GitHub repo URL and grant your platform access (via a GitHub App installation or a read-only Personal Access Token).
3.  **Review Process**: An admin reviews the code for security and quality before approving the listing.
4.  **Split Payments (The Checkout)**: When a buyer purchases a vendor's product:
    *   The Payment Gateway automatically splits the funds (e.g., 70% to the Vendor, 30% Platform Commission).
    *   Your platform generates the license key.
    *   Your platform proxies the download from the vendor's GitHub repository to the buyer.

### Key Additions to Database
*   `users` table needs an `is_vendor` boolean or a roles table update.
*   `products` table gets a `vendor_id` (foreign key to `users`).
*   `payouts` table to track earnings, pending balances, and successful transfers if you do manual payouts instead of automated split payments.

### New Failure Modes (Vendor Specific)
*   **Malicious Code in Updates**: A vendor pushes a minor update containing a backdoor.
    *   *Solution*: Implement a CI/CD pipeline that auto-scans release zips before they are made available to buyers, or require admin approval for every version bump.
*   **Vendor Deletes Repo**: A vendor leaves the platform and deletes their GitHub repo, breaking all downloads for past buyers.
    *   *Solution*: Your system should download the `.zip` file on every new vendor release and archive a backup on AWS S3 / Cloudflare R2. If the GitHub API returns a 404, fallback to your S3 backup so buyers never lose access to what they paid for.

## 6. Technical Deep Dive (Implementation Details)

### 6.1 Payment Splitting Logic (The Financial Engine)
When a buyer buys a $100 plugin from a vendor, your platform takes a 30% cut. You cannot legally hold the $100 in your bank account and manually wire $70 later (this makes you a payment transmitter, requiring massive compliance).

*   **Vendor Onboarding**: The vendor connects their bank account via Stripe Connect Express or Razorpay Route. They get a `connected_account_id`.
*   **The Checkout Flow**: 
    1. Buyer initiates checkout.
    2. In the API call to Stripe/Razorpay, you specify `transfer_data[destination] = vendor_connected_account_id` and the `application_fee_amount = 3000` (which is $30.00).
*   **The Result**: The gateway automatically drops $70 into the vendor's account and $30 into your platform account. You never legally hold the vendor's money.

### 6.2 License Management (The Cryptographic Core)
Simple database checks (`is_valid = true`) are easily bypassed. You need Asymmetric Cryptography (RSA).

1. You generate an RSA Key Pair (Private & Public) for your whole platform.
2. Upon purchase, your server generates a JSON payload (license key, SKU, expiry date, allowed domains).
3. Your server signs this JSON using your **Private Key**, generating a cryptographic signature.
4. You store the key in the database and give it to the user.

### 6.3 Client-Side Advanced SDK (The Guardian)
When the buyer installs the script/plugin on their server, how does it enforce the license? You build a small SDK bundled with every product.

1. The SDK contains your platform's **Public Key** hardcoded into it.
2. The user enters their license key. The SDK pings your server (`/api/v1/license/verify`) with the key and their domain.
3. Your server responds with the signed JSON payload.
4. The SDK uses the Public Key to verify the signature. 
5. If a pirate intercepts the API request and returns fake JSON, the verification will **FAIL** because they don't have your Private Key to forge the signature.
*   **Protection**: Obfuscate only this SDK file (using ionCube or javascript-obfuscator) so pirates can't simply delete the `if(!isValid)` logic.

### 6.4 Project Update Server (The Delivery Network)
*   **The Cron Job**: Your Laravel server listens to GitHub Webhooks. When a vendor publishes a new release, GitHub pings your server.
*   **The Archiver**: Your server downloads the `.zip` and uploads it to AWS S3 (for backup).
*   **The Client Check**: The Client SDK runs a cron job on the buyer's server daily, hitting your API to check for updates.
*   **The Delivery**: If an update exists and the license is active, your API generates an **AWS S3 Pre-signed URL** that expires in 5 minutes. The Client SDK downloads it, extracts it, and overwrites the old files.
