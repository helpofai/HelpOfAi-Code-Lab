# HOACodeLab

<div align="center">
  <img src="https://via.placeholder.com/1200x600/010101/06b6d4?text=HOACodeLab+Editor" alt="HOACodeLab Banner" width="100%" />
</div>

<div align="center">
  <br />
  
  [![Laravel](https://img.shields.io/badge/Laravel-12.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com)
  [![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
  [![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
  [![Inertia](https://img.shields.io/badge/Inertia.js-2.0-9553E9?style=for-the-badge&logo=inertia&logoColor=white)](https://inertiajs.com)
  
  <br />

  **A Professional, Production-Ready Online Code Editor & Prototyping Platform**
  
  <p>
    HOACodeLab is a sophisticated, CodePen-inspired development environment designed for modern web creators. Built with a robust Laravel 12 backend and a reactive React 19 frontend, it offers a seamless "code-and-preview" workflow with enterprise-grade features.
  </p>
</div>

---

## 🚀 Key Features

### 💻 Advanced Code Editor
*   **Powered by Monaco Editor:** The same engine that powers VS Code.
*   **Multi-Language Support:** Dedicated tabs for HTML, CSS, and JavaScript.
*   **Intelligent Features:** Syntax highlighting, basic IntelliSense, and automatic formatting via **Prettier**.
*   **Responsive Design:** Fully optimized for desktop and mobile devices with a custom tabbed interface for smaller screens.
*   **Customization:** Adjust font sizes, toggle word wrap, and manage editor layouts.

### ⚡ Live Preview Engine
*   **Secure Sandboxing:** Utilizes iframe `srcdoc` with strict `sandbox` attributes to ensure security.
*   **Real-time Compilation:** Instant preview updates as you type (debounced).
*   **Console Logging:** Integrated browser console that captures logs and errors from the preview iframe and displays them in the editor interface.

### 🛠️ Project Management
*   **Create & Fork:** Start from scratch or fork existing projects to build upon others' work.
*   **Collections:** Organize your projects into logical collections/folders.
*   **External Libraries:** Easily inject CDN libraries (React, Vue, Tailwind, GSAP, etc.) directly into your project.
*   **Export:** Download your project as a single `.html` file.
*   **Sharing:** Generate public links or embed codes to share your work with the world.

### 🛡️ Admin & System
*   **User Authentication:** Secure login and registration system powered by Laravel Breeze/Sanctum.
*   **Admin Dashboard:** Manage users, projects, and system settings.
*   **One-Click Updates:** Integrated system update utility that pulls changes from the repository, runs migrations, and clears caches automatically without data loss.

---

## 🏗️ Tech Stack

### Backend
*   **Framework:** Laravel 12.x (PHP 8.2+)
*   **Authentication:** Laravel Sanctum
*   **Database:** MySQL
*   **Templating:** Inertia.js (Server-side routing for SPA)

### Frontend
*   **Library:** React 19 + ReactDOM
*   **Build Tool:** Vite 7
*   **Styling:** Tailwind CSS 4 + Lucide React Icons
*   **State Management:** Zustand
*   **Animation:** Framer Motion
*   **Editor:** @monaco-editor/react

---

## ⚙️ Installation & Setup

### Prerequisites
*   PHP >= 8.2
*   Composer >= 2.x
*   Node.js >= 18.x
*   MySQL >= 8.0

### Local Development

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/helpofai/HelpOfAi-Code-Lab.git
    cd HelpOfAi-Code-Lab
    ```

2.  **Install Dependencies**
    ```bash
    composer install
    npm install
    ```

3.  **Environment Setup**
    ```bash
    cp .env.example .env
    php artisan key:generate
    ```
    *Configure your database credentials in `.env`.*

4.  **Database Migration**
    ```bash
    php artisan migrate
    ```

5.  **Start Development Server**
    ```bash
    npm run dev
    # In a separate terminal
    php artisan serve
    ```

### Production Deployment

#### 🌐 Web-based Production Installer (Recommended for Beginners)
This is the easiest way to deploy HOACodeLab on shared hosting (cPanel, Hostinger, Bluehost, etc.) without using a terminal or SSH.

**Step 1: Prepare your Server**
*   **PHP Version:** Log into your hosting panel (cPanel) and ensure your PHP version is set to **8.2 or 8.3**.
*   **Extensions:** Ensure `bcmath`, `ctype`, `fileinfo`, `mbstring`, `openssl`, `pdo_mysql`, `tokenizer`, and `xml` are enabled in your PHP settings.

**Step 2: Create a Database**
1.  Go to **MySQL® Database Wizard** in your cPanel.
2.  Create a new database (e.g., `hoa_codelab`).
3.  Create a new user and a strong password. **Save these details.**
4.  Add the user to the database with **ALL PRIVILEGES**.

**Step 3: Upload Files**
1.  Download the project source code.
2.  Compress all files into a `.zip` archive (ensure the `app`, `public`, `vendor`, etc., are in the root of the zip).
3.  Use cPanel **File Manager** to upload the zip to your `public_html` (or your subdomain folder).
4.  **Extract** the zip file.

**Step 4: Configure Environment**
1.  Rename `.env.example` to `.env`.
2.  Edit the `.env` file and update these lines with your Step 2 details:
    ```ini
    DB_DATABASE=your_database_name
    DB_USERNAME=your_database_user
    DB_PASSWORD=your_database_password
    ```

**Step 5: Run the Installer**
1.  Visit `https://your-domain.com/setup` in your browser.
2.  The **Live Terminal UI** will appear. Click the buttons in order (01 to 06):
    *   **01 Security:** Generates your unique `APP_KEY`.
    *   **02 Database:** Sets up your tables automatically.
    *   **03 Storage:** Enables image and file uploads.
    *   **04 Optimization:** Clears temporary system data.
    *   **05 Seed:** Loads default settings and admin placeholders.
    *   **06 Optimize:** Tuned the app for maximum speed.
3.  Once finished, click **Launch App**.

**⚠️ Security:** After a successful setup, delete `app/Http/Controllers/SetupController.php` for security.

---

#### 🛠️ cPanel Specific Configuration (The "Public" Folder)
Laravel applications serve files from the `/public` folder. On cPanel, you may need to point your domain to that subfolder:

1.  **If using a Subdomain:** Set the **Document Root** to `public_html/your-folder/public`.
2.  **If using Main Domain:** If you cannot change the document root, move the `.htaccess` from the `public/` folder to the root directory and update its paths, OR use the cPanel "Domains" section to update the document root to `/public`.

---

#### 💻 Manual CLI Deployment
For developers with SSH access:
1.  **Setup Server:** Ensure your server meets Laravel 12 requirements.
2.  **Deploy Code:** Clone repo and setup `.env`.
3.  **Optimize:**
    ```bash
    composer install --optimize-autoloader --no-dev
    npm run build
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
    ```

---

## 🔧 Configuration

The `.env` file handles core configurations. Key custom variables:

```ini
APP_NAME=HOACodeLab
APP_URL=https://your-domain.com
APP_VERSION=1.7.0

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_DATABASE=your_db_name
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
```

---

## 🔄 System Updates

HOACodeLab comes with a built-in update manager located at `/admin/update`.

*   **Smart Updates:** It fetches the latest code from GitHub.
*   **Safe Config:** It intelligently merges new `.env.example` keys into your local `.env` without overwriting your credentials.
*   **Auto-Migration:** Automatically runs `php artisan migrate --force`.
*   **Cache Clearing:** Handles optimization commands post-update.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a feature branch: `git checkout -b feature/amazing-feature`.
3.  Commit your changes: `git commit -m 'Add amazing feature'`.
4.  Push to the branch: `git push origin feature/amazing-feature`.
5.  Open a Pull Request.

---

## 📄 License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

---

<div align="center">
  <p>Built with ❤️ by HelpOfAi</p>
</div>
