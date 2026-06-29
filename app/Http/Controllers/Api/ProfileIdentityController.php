<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProfileIdentityController extends Controller
{
    public function uploadIdentity(Request $request)
    {
        $request->validate([
            'selfie' => 'required|file|mimes:jpg,jpeg,png|max:5120',
            'document' => 'required|file|mimes:jpg,jpeg,png,pdf|max:10240',
        ]);

        $user = auth()->user();

        if ($user->identity_status === 'verified') {
            return response()->json(['message' => 'Identity already verified.'], 400);
        }

        // Delete old files if they exist
        if ($user->identity_selfie_path) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $user->identity_selfie_path));
        }
        if ($user->identity_document_path) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $user->identity_document_path));
        }

        $selfiePath = $request->file('selfie')->store('identities', 'public');
        $documentPath = $request->file('document')->store('identities', 'public');

        $user->update([
            'identity_selfie_path' => '/storage/' . $selfiePath,
            'identity_document_path' => '/storage/' . $documentPath,
            'identity_status' => 'pending',
            'identity_rejected_reason' => null,
        ]);

        // Notify admins
        $admins = \App\Models\User::where('role', 'admin')->get();
        \Illuminate\Support\Facades\Notification::send($admins, new \App\Notifications\IdentityVerificationSubmitted($user));

        return response()->json([
            'message' => 'Identity documents uploaded successfully. Awaiting admin verification.',
            'status' => 'pending'
        ]);
    }
}
