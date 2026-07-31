<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payout;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PayoutController extends Controller
{
    public function index()
    {
        $payouts = Payout::with('user')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        $routingMode = \App\Models\SiteSetting::where('key', 'payout_routing_mode')->first()?->value ?: 'auto';

        return Inertia::render('Admin/Payouts/Index', [
            'payouts' => $payouts,
            'routingMode' => $routingMode
        ]);
    }

    public function updateSettings(Request $request)
    {
        $request->validate(['payout_routing_mode' => 'required|in:auto,manual']);
        \App\Models\SiteSetting::updateOrCreate(
            ['key' => 'payout_routing_mode', 'group' => 'payouts'],
            ['value' => $request->payout_routing_mode]
        );
        return back()->with('success', 'Payout routing mode updated successfully.');
    }

    public function markAsPaid(Request $request, Payout $payout)
    {
        if ($payout->status !== 'pending') {
            return back()->with('error', 'Only pending payouts can be marked as paid.');
        }

        $payout->update([
            'status' => 'completed',
            'reference_id' => $request->reference_id,
            'admin_notes' => $request->admin_notes
        ]);

        if ($payout->user) {
            $payout->user->notify(new \App\Notifications\PayoutProcessedNotification($payout));
        }

        return back()->with('success', 'Payout marked as completed.');
    }
}
