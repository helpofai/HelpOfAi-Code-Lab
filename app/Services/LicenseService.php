<?php

namespace App\Services;

use App\Models\License;
use App\Models\Project;
use Illuminate\Support\Str;

class LicenseService
{
    /**
     * Generate a new cryptographically secure License Key
     */
    public function generateLicenseKey(): string
    {
        return 'HOA-' . strtoupper(Str::random(4)) . '-' . strtoupper(Str::random(4)) . '-' . strtoupper(Str::random(4));
    }

    /**
     * Create a signed payload for the client SDK to verify.
     * Uses OpenSSL RSA with the private key configured in the .env or storage.
     */
    public function generateSignedPayload(License $license, string $domain): array
    {
        $payload = [
            'license_key' => $license->license_key,
            'product_sku' => $license->project->slug,
            'domain' => $domain,
            'expires_at' => $license->expires_at ? $license->expires_at->toIso8601String() : null,
            'status' => $license->status,
            'timestamp' => now()->timestamp,
        ];

        $payloadJson = json_encode($payload);
        
        // In production, load this from storage/app/keys/private.pem or .env
        // We will mock this here for the prototype phase so it doesn't crash if keys aren't set yet.
        $privateKey = config('app.rsa_private_key');
        
        $signature = '';
        if ($privateKey) {
            openssl_sign($payloadJson, $signature, $privateKey, OPENSSL_ALGO_SHA256);
            $signature = base64_encode($signature);
        } else {
            // Fallback for development if no RSA key is configured yet
            $signature = base64_encode('DEV_SIGNATURE_MOCK');
        }

        return [
            'payload' => $payload,
            'signature' => $signature,
        ];
    }
}
