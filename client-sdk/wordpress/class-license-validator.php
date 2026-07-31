<?php
/**
 * Advanced License Protection for WordPress (With Built-in UI)
 * Paste this in functions.php or your core plugin file.
 */

class HelpOFAILicenseManager {
    
    private $api_url = 'YOUR_MARKETPLACE_URL_HERE/api/licenses/validate';
    
    // For Themes: use the folder name (e.g., 'my-theme')
    // For Plugins: use the plugin basename (e.g., 'my-plugin/my-plugin.php')
    private $product_id = 'your-product-slug';
    private $is_plugin = true; // Set to false if this is a theme
    
    public function __construct() {
        add_action('admin_menu', [$this, 'add_license_menu']);
        add_action('wp_ajax_verify_helpofai_license', [$this, 'verify_license_ajax']);
        add_action('template_redirect', [$this, 'enforce_license_lock']);
        
        // Native WordPress Auto-Updater Hooks
        if ($this->is_plugin) {
            add_filter('pre_set_site_transient_update_plugins', [$this, 'check_for_updates']);
            add_filter('plugins_api', [$this, 'plugin_details_popup'], 10, 3);
        } else {
            add_filter('pre_set_site_transient_update_themes', [$this, 'check_for_updates']);
        }
    }

    // NATIVE OTA UPDATER: Hooks into WordPress Core Updater
    public function check_for_updates($transient) {
        if (empty($transient->checked)) return $transient;

        $data = get_option('helpofai_license_data', []);
        
        if (isset($data['latest_version'], $data['version'], $data['download_url']) 
            && version_compare($data['version'], $data['latest_version'], '<')) {
            
            $response = new stdClass();
            $response->slug = dirname($this->product_id); // e.g. 'my-plugin'
            $response->plugin = $this->product_id; // e.g. 'my-plugin/my-plugin.php'
            $response->new_version = $data['latest_version'];
            $response->package = $data['download_url']; 
            $response->url = 'https://your-marketplace.com';
            
            if ($this->is_plugin) {
                $transient->response[$this->product_id] = $response;
            } else {
                $transient->response[$this->product_id] = (array) $response;
            }
        }
        
        return $transient;
    }

    // Handles the "View version x.x details" popup for plugins
    public function plugin_details_popup($false, $action, $args) {
        if ($action !== 'plugin_information' || $args->slug !== dirname($this->product_id)) {
            return $false;
        }

        $data = get_option('helpofai_license_data', []);
        
        $response = new stdClass();
        $response->name = $data['product_name'] ?? 'Premium Plugin';
        $response->slug = $args->slug;
        $response->version = $data['latest_version'] ?? '1.0.0';
        $response->author = $data['author_name'] ?? 'HelpOfAI Vendor';
        $response->homepage = 'https://your-marketplace.com';
        $response->download_link = $data['download_url'] ?? '';
        $response->sections = [
            'description' => 'This is a premium plugin verified by HelpOfAI Licensing.',
            'changelog' => 'Automatic OTA update from HelpOfAI Marketplace.'
        ];

        return $response;
    }

    // 1. Add WordPress Admin Menu
    public function add_license_menu() {
        add_menu_page(
            'Product License',
            'License',
            'manage_options',
            'helpofai-license',
            [$this, 'render_license_ui'],
            'dashicons-shield',
            99
        );
    }

    // 2. The Built-in UI Engine
    public function render_license_ui() {
        $status = get_option('helpofai_license_status', 'unverified');
        $data = get_option('helpofai_license_data', []);
        
        ?>
        <div class="wrap">
            <script src="https://cdn.tailwindcss.com"></script>
            <script src="https://unpkg.com/lucide@latest"></script>
            <style>
                .glass-panel { background: #fff; border: 1px solid #e2e8f0; border-radius: 1rem; padding: 2rem; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
                #wpcontent { background: #f3f4f6; }
            </style>
            
            <div class="max-w-4xl mx-auto mt-8">
                <div class="glass-panel">
                    <div class="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
                        <i data-lucide="shield-check" class="w-10 h-10 text-blue-600"></i>
                        <div>
                            <h1 class="text-2xl font-black text-gray-800 m-0">License Management</h1>
                            <p class="text-gray-500 m-0 mt-1">Activate your premium product</p>
                        </div>
                    </div>

                    <?php if ($status !== 'valid'): ?>
                        <!-- Activation Form -->
                        <div id="activation-box">
                            <h2 class="text-lg font-bold text-gray-800 mb-2">Enter License Key</h2>
                            <p class="text-gray-500 mb-6 text-sm">Paste the key you received after purchase.</p>
                            
                            <div class="flex gap-4">
                                <input type="text" id="license_key" class="flex-1 border-gray-300 rounded-lg shadow-sm" placeholder="XXXX-XXXX-XXXX-XXXX">
                                <button id="verify-btn" onclick="verifyLicense()" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors flex items-center gap-2">
                                    <i data-lucide="key" class="w-4 h-4"></i> Activate
                                </button>
                            </div>
                            <p id="error-msg" class="text-red-500 mt-4 text-sm font-bold hidden"></p>
                        </div>
                    <?php else: ?>
                        <!-- Verified Dashboard -->
                        <div class="bg-gradient-to-r from-emerald-500 to-teal-400 rounded-xl p-6 text-white mb-6 flex justify-between items-center shadow-lg">
                            <div class="flex items-center gap-4">
                                <i data-lucide="check-circle" class="w-8 h-8"></i>
                                <div>
                                    <h3 class="font-black text-xl m-0">Product Activated</h3>
                                    <p class="text-emerald-50 text-sm m-0"><?php echo esc_html($data['product_name'] ?? 'Premium Product'); ?></p>
                                </div>
                            </div>
                            <span class="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Valid License</span>
                        </div>

                        <div class="grid grid-cols-2 gap-4">
                            <div class="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                <p class="text-xs font-bold text-gray-400 uppercase">Licensed To</p>
                                <p class="font-bold text-gray-800"><?php echo esc_html($_SERVER['HTTP_HOST']); ?></p>
                                <p class="text-xs text-gray-500 mt-1">Author: <?php echo esc_html($data['author_name'] ?? 'Unknown'); ?></p>
                            </div>
                            <div class="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                <p class="text-xs font-bold text-gray-400 uppercase">Version</p>
                                <p class="font-bold text-gray-800">Current: v<?php echo esc_html($data['version'] ?? '1.0'); ?></p>
                                <?php if(isset($data['latest_version']) && $data['latest_version'] !== $data['version']): ?>
                                    <p class="text-xs text-purple-600 font-bold mt-1">Update Available: v<?php echo esc_html($data['latest_version']); ?></p>
                                <?php endif; ?>
                            </div>
                            <div class="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                <p class="text-xs font-bold text-gray-400 uppercase">Support Expiry</p>
                                <p class="font-bold text-gray-800"><?php echo esc_html($data['support_expires_at'] ?? 'Lifetime'); ?></p>
                            </div>
                            <div class="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                <p class="text-xs font-bold text-gray-400 uppercase">Last Sync</p>
                                <p class="font-bold text-gray-800"><?php echo esc_html($data['last_sync'] ?? 'Just now'); ?></p>
                                <p class="text-xs text-gray-500 font-mono mt-1">Build: <?php echo esc_html($data['build_hash'] ?? 'N/A'); ?></p>
                            </div>
                        </div>
                    <?php endif; ?>
                </div>
            </div>

            <script>
                lucide.createIcons();
                
                function verifyLicense() {
                    const key = document.getElementById('license_key').value;
                    const btn = document.getElementById('verify-btn');
                    const err = document.getElementById('error-msg');
                    
                    btn.innerHTML = 'Validating...';
                    err.classList.add('hidden');
                    
                    fetch(ajaxurl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: 'action=verify_helpofai_license&key=' + encodeURIComponent(key)
                    })
                    .then(r => r.json())
                    .then(res => {
                        if (res.success) {
                            window.location.reload();
                        } else {
                            err.innerText = res.data.message || 'Invalid License Key';
                            err.classList.remove('hidden');
                            btn.innerHTML = '<i data-lucide="key" class="w-4 h-4"></i> Activate';
                            lucide.createIcons();
                        }
                    })
                    .catch(() => {
                        err.innerText = 'Network error during validation.';
                        err.classList.remove('hidden');
                        btn.innerHTML = '<i data-lucide="key" class="w-4 h-4"></i> Activate';
                        lucide.createIcons();
                    });
                }
            </script>
        </div>
        <?php
    }

    // 3. AJAX Handler
    public function verify_license_ajax() {
        if (!current_user_can('manage_options')) wp_die();
        
        $key = sanitize_text_field($_POST['key']);
        $domain = $_SERVER['HTTP_HOST'];
        
        $response = wp_remote_post($this->api_url, [
            'body' => [ 'license_key' => $key, 'domain' => $domain ]
        ]);
        
        if (is_wp_error($response)) {
            wp_send_json_error(['message' => 'API Connection Failed']);
        }
        
        $body = json_decode(wp_remote_retrieve_body($response), true);
        
        if (isset($body['valid']) && $body['valid']) {
            update_option('helpofai_license_status', 'valid');
            update_option('helpofai_license_data', $body);
            delete_option('theme_locked_status');
            wp_send_json_success();
        } else {
            update_option('helpofai_license_status', 'invalid');
            update_option('theme_locked_status', true);
            wp_send_json_error(['message' => 'Invalid or expired license.']);
        }
    }

    // 4. Frontend Lock
    public function enforce_license_lock() {
        if (get_option('theme_locked_status')) {
            wp_die('<h1 style="color:red;">Site Locked</h1><p>Invalid product license.</p>', 'License Lock', ['response' => 403]);
        }
    }
}

new HelpOFAILicenseManager();
