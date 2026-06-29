# Production Deployment Guide: Domain & Subdomain Setup

This guide details how to configure **HOACodeLab** for a production environment, specifically focusing on handling main domains (e.g., `hoacodelab.com`) and subdomains (e.g., `admin.hoacodelab.com` or `project.hoacodelab.com`).

**repository Strategy: "Easy Mode"**

- **Tracked:** `/vendor` (PHP Dependencies), `/node_modules` (JS Dependencies), `/public/build` (Compiled Assets).
- **Ignored:** `.env` (Secrets/Configuration).
- **Benefit:** You do _not_ need to run `composer install` or `npm run build` on your production server.

## 1. Environment Configuration (.env)

**CRITICAL:** The `.env` file is **NOT** in Git. You must manually create this file on your production server.

### Base Configuration

```ini
APP_ENV=production
APP_DEBUG=false
APP_URL=https://hoacodelab.com
```

### Session Sharing (Critical for Subdomains)

To allow users to stay logged in across `hoacodelab.com` and `sub.hoacodelab.com`, you must set the `SESSION_DOMAIN` to the root domain with a leading dot.

```ini
SESSION_DOMAIN=.hoacodelab.com
```

### Sanctum (Authentication)

If you are using API-based authentication (SPA mode) across subdomains, list them here.

```ini
SANCTUM_STATEFUL_DOMAINS=hoacodelab.com,admin.hoacodelab.com,www.hoacodelab.com
```

### Secure Cookies

Ensure cookies are only sent over HTTPS.

```ini
SESSION_SECURE_COOKIE=true
```

## 2. Infrastructure Resilience (Binary Paths)

If you are on shared hosting or a restricted server where `node`, `npm`, or `composer` are not in the global system path, you must specify their absolute paths in your `.env`.

### Common Hosting Path Examples

```ini
# For cPanel / Node.js Selector
NODE_BINARY=/opt/alt/node20/usr/bin/node
NPM_BINARY=/opt/alt/node20/usr/bin/npm

# For local Composer
COMPOSER_BINARY="php /home/user/public_html/composer.phar"
```

_Note: You can use the **Manual_Override** terminal at `/setup` to save these paths directly._

## 3. Web Server Configuration (Nginx)

Below is a robust Nginx configuration that handles the main domain and wildcards.

**File:** `/etc/nginx/sites-available/hoacodelab.com`

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name hoacodelab.com *.hoacodelab.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;

    # Handle main domain and all subdomains
    server_name hoacodelab.com *.hoacodelab.com;

    root /var/www/hoacodelab/public;
    index index.php;

    # SSL Configuration (Use Certbot to generate these)
    ssl_certificate /etc/letsencrypt/live/hoacodelab.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/hoacodelab.com/privkey.pem;
    include /etc/nginx/snippets/ssl-params.conf; # Recommended security settings

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Content-Type-Options "nosniff";

    # Charset
    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    # PHP-FPM Configuration
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.3-fpm.sock; # Adjust PHP version
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

## 3. Trusted Proxies (Load Balancers / Cloudflare)

If you are using a load balancer (AWS ALB, DigitalOcean LB) or Cloudflare, you must configure Laravel to trust the proxy headers.

In `bootstrap/app.php`:

```php
->withMiddleware(function (Middleware $middleware): void {
    // ... other middleware

    // Trust all proxies (standard for AWS/Cloudflare)
    $middleware->trustProxies(at: '*');
})
```

## 4. CORS Configuration

If your frontend and backend reside on different subdomains (e.g., `app.hoacodelab.com` vs `api.hoacodelab.com`), ensure your CORS configuration allows credentials.

Since Laravel 11/12 handles CORS in `config/cors.php` (if published) or defaults, you may need to publish it:

```bash
php artisan config:publish cors
```

Then edit `config/cors.php`:

```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_methods' => ['*'],
'allowed_origins' => ['https://hoacodelab.com', 'https://*.hoacodelab.com'],
'allowed_origins_patterns' => [],
'allowed_headers' => ['*'],
'exposed_headers' => [],
'max_age' => 0,
'supports_credentials' => true, // CRITICAL for auth
```

## 5. Deployment Steps (Simplified)

Since you are committing `vendor` and `node_modules` to Git, your deployment on the server is much faster.

1.  **Pull Latest Code**:

    ```bash
    cd /var/www/hoacodelab
    git pull origin main
    ```

    _Note: If you get "local changes" errors, you can run `git reset --hard origin/main` (WARNING: This deletes any changes you made directly on the server)._

2.  **Verify .env**:
    Ensure your `.env` file exists and has the correct database credentials. It is NOT updated by git pull.

3.  **Optimize & Cache**:

    ```bash
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
    php artisan event:cache
    ```

4.  **Run Migrations**:

    ```bash
    php artisan migrate --force
    ```

5.  **Restart Queue (if applicable)**:
    ```bash
    php artisan queue:restart
    ```

## 6. Subdomain Routing (Optional)

If you want specific logic for subdomains (e.g., `admin.hoacodelab.com`), you can use domain grouping in `routes/web.php`:

```php
Route::domain('admin.hoacodelab.com')->group(function () {
    // Admin routes here
});

Route::domain('{user}.hoacodelab.com')->group(function ($user) {
    // User specific project routes
});
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

---

**Note:** For the iframe `srcdoc` preview feature to work securely, ensure your `Content-Security-Policy` headers allow the iframe to load resources as needed, but restrict it from executing malicious actions on the parent window.
