<?php

namespace HOA\Licensing;

use Exception;

/**
 * PRODUCTION-GRADE LICENSE MANAGER
 * This script is bundled inside the themes, plugins, or software sold on your marketplace.
 * It strictly validates RSA-signed payloads to prevent piracy and bypasses.
 */
class LicenseManager
{
    private string $licenseKey;
    private string $marketplaceUrl;
    private string $cacheFile;

    // The PUBLIC key associated with your Marketplace.
    // The marketplace uses its PRIVATE key to sign the license. 
    // The client uses this PUBLIC key to prove the license actually came from you.
    private const MARKETPLACE_PUBLIC_KEY = <<<EOD
-----BEGIN PUBLIC KEY-----
YOUR_MARKETPLACE_PUBLIC_KEY_HERE_REPLACE_BEFORE_DEPLOY
-----END PUBLIC KEY-----
EOD;

    public function __construct(string $licenseKey, string $marketplaceUrl = 'https://yourmarketplace.com')
    {
        $this->licenseKey = trim($licenseKey);
        $this->marketplaceUrl = rtrim($marketplaceUrl, '/');
        // Cache file to prevent pinging the marketplace on every single page load
        $this->cacheFile = sys_get_temp_dir() . '/hoa_license_cache_' . md5($this->licenseKey) . '.json';
    }

    /**
     * Check if the license is valid. Uses local cache if available and not expired.
     */
    public function isValid(): bool
    {
        try {
            $cached = $this->getLocalCache();

            if ($cached && $this->verifySignature($cached['payload'], $cached['signature'])) {
                // Check if the cache itself is still fresh (e.g., check server every 24 hours)
                if (time() - $cached['last_checked'] < 86400) {
                    return $this->validatePayloadConstraints($cached['payload']);
                }
            }

            // Cache is missing, expired, or invalid. Ping the marketplace.
            return $this->pingMarketplace();

        } catch (Exception $e) {
            // In production, log this silently. If the marketplace is down, you might want to 
            // allow a grace period based on local cache.
            error_log("HOA License Error: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Connects to the marketplace API to verify the license key.
     */
    private function pingMarketplace(): bool
    {
        $domain = $_SERVER['HTTP_HOST'] ?? 'unknown.local';

        $data = json_encode([
            'license_key' => $this->licenseKey,
            'domain' => $domain
        ]);

        $ch = curl_init($this->marketplaceUrl . '/api/license/verify');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Accept: application/json',
            'User-Agent: HOA-Client-SDK/1.0'
        ]);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode !== 200 || !$response) {
            throw new Exception("Marketplace rejected the request or is unreachable. HTTP Code: " . $httpCode);
        }

        $result = json_decode($response, true);

        if (!isset($result['success']) || !$result['success'] || !isset($result['data'])) {
            throw new Exception("Invalid response format from marketplace.");
        }

        $payload = $result['data']['payload'];
        $signature = $result['data']['signature'];

        // VERY IMPORTANT: Verify the RSA signature before trusting the payload!
        // This prevents hackers from spoofing the API response via DNS hijacking.
        if (!$this->verifySignature($payload, $signature)) {
            throw new Exception("CRITICAL SECURITY ALERT: License signature mismatch. The API response was tampered with.");
        }

        // Validate domain and expiry
        if (!$this->validatePayloadConstraints($payload)) {
            return false;
        }

        // Validation passed! Save to local cache.
        $this->saveLocalCache($payload, $signature);

        return true;
    }

    /**
     * Cryptographically verifies that the payload was signed by the Marketplace's private key.
     */
    private function verifySignature(array $payload, string $signatureBase64): bool
    {
        $payloadJson = json_encode($payload);
        $signatureRaw = base64_decode($signatureBase64);

        $publicKeyId = openssl_pkey_get_public(self::MARKETPLACE_PUBLIC_KEY);
        
        if (!$publicKeyId) {
            throw new Exception("Failed to load Marketplace Public Key.");
        }

        $isValid = openssl_verify($payloadJson, $signatureRaw, $publicKeyId, OPENSSL_ALGO_SHA256);
        openssl_free_key($publicKeyId);

        // openssl_verify returns 1 if signature is correct, 0 if incorrect, and -1 on error.
        return $isValid === 1;
    }

    /**
     * Ensures the payload belongs to this domain and isn't expired.
     */
    private function validatePayloadConstraints(array $payload): bool
    {
        // 1. Check Status
        if (($payload['status'] ?? 'inactive') !== 'active') {
            throw new Exception("License is not active.");
        }

        // 2. Node-Locking (Domain Check)
        $currentDomain = $_SERVER['HTTP_HOST'] ?? 'unknown.local';
        if (($payload['domain'] ?? '') !== $currentDomain && $currentDomain !== 'localhost' && $currentDomain !== '127.0.0.1') {
            throw new Exception("License is locked to a different domain: " . ($payload['domain'] ?? 'Unknown'));
        }

        // 3. Expiry Check
        if (!empty($payload['expires_at'])) {
            $expires = strtotime($payload['expires_at']);
            if (time() > $expires) {
                throw new Exception("License expired on " . date('Y-m-d', $expires));
            }
        }

        return true;
    }

    private function getLocalCache(): ?array
    {
        if (file_exists($this->cacheFile)) {
            $data = file_get_contents($this->cacheFile);
            $decoded = json_decode($data, true);
            if (is_array($decoded) && isset($decoded['payload']) && isset($decoded['signature'])) {
                return $decoded;
            }
        }
        return null;
    }

    private function saveLocalCache(array $payload, string $signature): void
    {
        $data = json_encode([
            'payload' => $payload,
            'signature' => $signature,
            'last_checked' => time()
        ]);
        
        // Suppress warning if directory isn't writable
        @file_put_contents($this->cacheFile, $data);
    }
}
