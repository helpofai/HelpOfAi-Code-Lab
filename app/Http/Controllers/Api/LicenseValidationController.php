<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\License;
use App\Models\LicenseDomain;
use App\Services\LicenseService;
use Illuminate\Http\Request;

class LicenseValidationController extends Controller
{
    public function verify(Request $request, LicenseService $licenseService)
    {
        $request->validate([
            'license_key' => 'required|string',
            'domain' => 'required|string'
        ]);

        $license = License::with('project', 'domains')
            ->where('license_key', $request->license_key)
            ->first();

        if (!$license || !$license->is_valid) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired license.'
            ], 403);
        }

        // Domain Validation (Node-locking)
        $domainExists = $license->domains()->where('domain_url', $request->domain)->exists();
        
        // Auto-register domain if they have 0 registered and limit isn't reached (Logic can be expanded)
        if (!$domainExists) {
            if ($license->domains()->count() === 0) {
                $license->domains()->create(['domain_url' => $request->domain]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'License is registered to another domain.'
                ], 403);
            }
        }

        // Generate the RSA signed payload for the client SDK
        $signedData = $licenseService->generateSignedPayload($license, $request->domain);

        return response()->json([
            'success' => true,
            'data' => $signedData
        ]);
    }
}
