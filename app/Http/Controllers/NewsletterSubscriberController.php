<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\NewsletterSubscriber;

class NewsletterSubscriberController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $existing = NewsletterSubscriber::where('email', $request->email)->first();
        if ($existing) {
            if ($existing->status !== 'active') {
                $existing->update(['status' => 'active']);
                return redirect()->back()->with('success', 'Welcome back! You have been resubscribed.');
            }
            return redirect()->back()->withErrors(['email' => 'You are already subscribed.']);
        }

        NewsletterSubscriber::create([
            'email' => $request->email,
        ]);

        return redirect()->back()->with('success', 'Subscribed successfully!');
    }

    public function unsubscribe($token)
    {
        $subscriber = NewsletterSubscriber::where('token', $token)->first();
        
        if (!$subscriber) {
            return redirect('/')->with('error', 'Invalid unsubscribe link.');
        }

        $subscriber->update(['status' => 'unsubscribed']);

        return redirect('/')->with('success', 'You have been successfully unsubscribed from our marketing emails.');
    }
}
