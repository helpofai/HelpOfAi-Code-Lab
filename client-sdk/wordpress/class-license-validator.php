<?php
/**
 * Advanced License Protection for WordPress
 * Paste this in functions.php or your core plugin file.
 */

function check_theme_license_validity() {
    $license_key = get_option('theme_license_key');
    
    // 1. Check transient cache to avoid slowing down site (24 hr cache)
    $status = get_transient('theme_license_status');
    if ($status === 'valid') return true;

    // 2. Ping validation server
    $response = wp_remote_post('YOUR_MARKETPLACE_URL_HERE/api/licenses/validate', [
        'body' => [
            'license_key' => $license_key,
            'domain' => $_SERVER['HTTP_HOST']
        ]
    ]);

    if (is_wp_error($response)) return false;

    $body = json_decode(wp_remote_retrieve_body($response), true);

    if (isset($body['valid']) && $body['valid']) {
        set_transient('theme_license_status', 'valid', 24 * HOUR_IN_SECONDS);
        // Delete lock if exists
        delete_option('theme_locked_status');
        return true;
    } else {
        // 3. Mark theme as locked if bypassed or invalid
        update_option('theme_locked_status', true);
        return false;
    }
}

// 4. Auto-Lock execution hook
add_action('template_redirect', function() {
    if (get_option('theme_locked_status')) {
        wp_die(
            '<div style="text-align:center; padding:50px; font-family:sans-serif;">' .
            '<h2>🛑 Security Lock</h2>' .
            '<p>This product has been locked due to an invalid license or bypass attempt.</p>' .
            '<p>Please contact <a href="mailto:support@vendor.com">support@vendor.com</a></p>' .
            '</div>', 
            'License Locked', 
            ['response' => 403]
        );
    }
});
