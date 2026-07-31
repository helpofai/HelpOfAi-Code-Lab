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

        $license = License::with(['project.user', 'domains'])
            ->where('license_key', $request->license_key)
            ->first();

        if (!$license || !$license->is_valid) {
            return response()->json([
                'success' => false,
                'valid' => false,
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
                    'valid' => false,
                    'message' => 'License is registered to another domain.'
                ], 403);
            }
        }

        // Generate the RSA signed payload for the client SDK
        $signedData = $licenseService->generateSignedPayload($license, $request->domain);

        return response()->json([
            'success' => true,
            'valid' => true,
            'data' => $signedData,
            'product_name' => $license->project->title ?? 'Premium Product',
            'author_name' => $license->project->user->name ?? 'HelpOfAI Vendor',
            'version' => $license->project->version ?? '1.0.0',
            'latest_version' => $license->project->version ?? '1.0.0', // Could be checked against a versions table
            'support_expires_at' => $license->created_at->addMonths(6)->format('M d, Y'),
            'last_sync' => now()->format('M d, Y H:i:s'),
            'build_hash' => substr(md5($license->id . now()), 0, 8)
        ]);
    }
}
