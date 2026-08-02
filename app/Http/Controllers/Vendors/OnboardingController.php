<?php

namespace App\Http\Controllers\Vendors;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OnboardingController extends Controller
{
    public function index(Request $request)
    {
        // If they already have bio and github, they shouldn't be here (middleware will catch, but just in case)
        if ($request->user()->bio && $request->user()->github_url) {
            return redirect()->route('dashboard');
        }

        return Inertia::render('Vendors/Onboarding');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'bio' => 'required|string|min:10|max:1000',
            'github_url' => 'required|url|max:255',
            'agreed_to_terms' => 'required|accepted',
        ]);

        $user = $request->user();
        $user->update([
            'bio' => $validated['bio'],
            'github_url' => $validated['github_url'],
        ]);

        return redirect()->route('dashboard')->with('success', 'Onboarding complete! Welcome to the marketplace.');
    }

    public function skip(Request $request)
    {
        // If a user doesn't want to be a vendor right now, drop them to user role
        // so the middleware stops trapping them.
        if ($request->user()->role === 'vendor') {
            $request->user()->update(['role' => 'user']);
        }
        
        return redirect()->route('dashboard');
    }
}
