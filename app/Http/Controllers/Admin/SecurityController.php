<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SiteSetting;
use App\Models\BannedIp;
use Inertia\Inertia;
use Illuminate\Support\Facades\Cache;

class SecurityController extends Controller
{
    public function index()
    {
        $settings = SiteSetting::where('group', 'security')->pluck('value', 'key');
        
        $bannedIps = BannedIp::orderBy('created_at', 'desc')->paginate(15);

        return Inertia::render('Admin/Security/Index', [
            'settings' => $settings,
            'bannedIps' => $bannedIps
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'firewall_enabled' => 'boolean',
            'firewall_max_attempts' => 'numeric|min:10',
            'firewall_penalty_hours' => 'numeric|min:1',
        ]);

        foreach ($validated as $key => $value) {
            SiteSetting::updateOrCreate(
                ['key' => $key, 'group' => 'security'],
                ['value' => is_bool($value) ? ($value ? '1' : '0') : $value]
            );
        }

        return back()->with('success', 'Security settings updated.');
    }

    public function unban(Request $request, BannedIp $bannedIp)
    {
        // Remove from cache
        Cache::forget('banned_ip:' . $bannedIp->ip_address);
        Cache::forget('firewall:' . $bannedIp->ip_address);
        
        // Remove from DB
        $bannedIp->delete();

        return back()->with('success', 'IP Address unbanned successfully.');
    }

    public function ban(Request $request)
    {
        $request->validate([
            'ip_address' => 'required|ip',
            'reason' => 'nullable|string|max:255'
        ]);

        $ip = $request->ip_address;
        $hours = SiteSetting::where('key', 'firewall_penalty_hours')->value('value') ?? 24;

        Cache::put('banned_ip:' . $ip, true, now()->addHours($hours));
        
        BannedIp::updateOrCreate(
            ['ip_address' => $ip],
            [
                'reason' => $request->reason ?? 'Manually banned by Administrator',
                'expires_at' => now()->addHours($hours)
            ]
        );

        return back()->with('success', 'IP Address banned successfully.');
    }
}
