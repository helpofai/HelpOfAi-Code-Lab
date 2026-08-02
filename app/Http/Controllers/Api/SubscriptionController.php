<?php

/*
|--------------------------------------------------------------------------
| HelpOfAi (HOA) Professional Software
|--------------------------------------------------------------------------
|
| Copyright (c) 2026 Rajib Adhikary. All Rights Reserved.
|
| This file is part of the HelpOfAi Professional Software Suite.
| Unauthorized copying, modification, redistribution, reverse engineering,
| decompilation, or commercial use of this source code, in whole or in part,
| is strictly prohibited without prior written permission from the copyright owner.
|
| Author      : Rajib Adhikary
| Organization: HelpOfAi (HOA)
| Website     : https://helpofai.com
| Location    : Basta Purba Para, Aranghata, Nadia, West Bengal, India
|
| This source code contains proprietary and confidential information.
| Any unauthorized access or distribution may violate applicable copyright laws.
|
|--------------------------------------------------------------------------
*/

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Razorpay\Api\Api as RazorpayApi;

class SubscriptionController extends Controller
{
    /**
     * Create a Checkout Session or Order for the selected gateway.
     */
    public function checkout(Request $request)
    {
        $request->validate([
            'gateway' => 'required|string|in:stripe,razorpay,paytm,phonepe',
        ]);

        $gateway = $request->gateway;
        $user = Auth::user();

        // 1. Stripe Checkout (Cashier)
        if ($gateway === 'stripe') {
            if ($user->subscribed('default')) {
                return response()->json(['url' => $user->billingPortalUrl(route('dashboard'))]);
            }

            $priceId = SiteSetting::where('key', 'stripe_pro_price_id')->first()?->value;
            if (!$priceId) return response()->json(['message' => 'Stripe node offline.'], 500);

            $checkout = $user->newSubscription('default', $priceId)
                ->checkout([
                    'success_url' => route('dashboard') . '?session_id={CHECKOUT_SESSION_ID}',
                    'cancel_url' => route('dashboard'),
                ]);

            return response()->json(['url' => $checkout->url]);
        }

        // 2. Razorpay Order Creation
        if ($gateway === 'razorpay') {
            $key = SiteSetting::where('key', 'razorpay_key')->first()?->value;
            $secret = SiteSetting::where('key', 'razorpay_secret')->first()?->value;
            $price = (float) SiteSetting::where('key', 'pro_monthly_price')->first()?->value ?: 9.99;

            if (!$key || !$secret) return response()->json(['message' => 'Razorpay node offline.'], 500);

            $api = new RazorpayApi($key, $secret);
            $order = $api->order->create([
                'receipt' => 'pro_' . $user->id . '_' . Str::random(5),
                'amount' => $price * 100, // Amount in paise
                'currency' => 'INR',
            ]);

            return response()->json([
                'gateway' => 'razorpay',
                'order_id' => $order['id'],
                'key' => $key,
                'amount' => $order['amount'],
                'user' => [
                    'name' => $user->name,
                    'email' => $user->email,
                ]
            ]);
        }

        // 3. PhonePe Secure Uplink
        if ($gateway === 'phonepe') {
            $mId = SiteSetting::where('key', 'phonepe_merchant_id')->first()?->value;
            $salt = SiteSetting::where('key', 'phonepe_salt_key')->first()?->value;
            $index = SiteSetting::where('key', 'phonepe_salt_index')->first()?->value ?: '1';
            $env = SiteSetting::where('key', 'phonepe_env')->first()?->value ?: 'UAT';
            $price = (float) SiteSetting::where('key', 'pro_monthly_price')->first()?->value ?: 9.99;

            if (!$mId || !$salt) return response()->json(['message' => 'PhonePe node offline.'], 500);

            $txnId = 'PRO_' . $user->id . '_' . time();
            $payload = [
                'merchantId' => $mId,
                'merchantTransactionId' => $txnId,
                'merchantUserId' => 'U' . $user->id,
                'amount' => $price * 100, // in paisa
                'redirectUrl' => route('dashboard'),
                'redirectMode' => 'POST',
                'callbackUrl' => route('api.phonepe.callback'),
                'paymentInstrument' => ['type' => 'PAY_PAGE'],
            ];

            $base64 = base64_encode(json_encode($payload));
            $checksum = hash('sha256', $base64 . '/pg/v1/pay' . $salt) . '###' . $index;

            $apiUrl = ($env === 'PRODUCTION') 
                ? 'https://api.phonepe.com/apis/hermes/pg/v1/pay' 
                : 'https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay';

            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'X-VERIFY' => $checksum,
                'accept' => 'application/json'
            ])->post($apiUrl, ['request' => $base64]);

            if ($response->successful()) {
                return response()->json(['url' => $response->json()['data']['instrumentResponse']['redirectInfo']['url']]);
            }

            return response()->json(['message' => 'PhonePe protocol failed.'], 500);
        }

        return response()->json(['message' => 'Gateway not supported.'], 400);
    }

    /**
     * Handle success callback for Razorpay and other non-Stripe gateways.
     */
    public function verify(Request $request)
    {
        $gateway = $request->gateway;
        $user = Auth::user();

        if ($gateway === 'razorpay') {
            $key = SiteSetting::where('key', 'razorpay_key')->first()?->value;
            $secret = SiteSetting::where('key', 'razorpay_secret')->first()?->value;
            $api = new RazorpayApi($key, $secret);

            try {
                $attributes = [
                    'razorpay_order_id' => $request->razorpay_order_id,
                    'razorpay_payment_id' => $request->razorpay_payment_id,
                    'razorpay_signature' => $request->razorpay_signature
                ];
                $api->utility->verifyPaymentSignature($attributes);

                // Verification Successful: Grant Pro Status
                $user->update([
                    'role' => 'paid-user',
                    'pro_expires_at' => now()->addMonth(),
                ]);

                return response()->json(['message' => 'Access Granted. Module Upgraded.']);
            } catch (\Exception $e) {
                return response()->json(['message' => 'Neural Signature Invalid.'], 400);
            }
        }

        return response()->json(['message' => 'Verification failed.'], 400);
    }

    /**
     * Stripe Billing Portal.
     */
    public function portal(Request $request)
    {
        $user = Auth::user();
        if (!$user->hasStripeId()) return response()->json(['message' => 'No billing history.'], 404);
        return response()->json(['url' => $user->billingPortalUrl(route('dashboard'))]);
    }

    /**
     * Subscription Status.
     */
    public function status(Request $request)
    {
        $user = Auth::user();
        return response()->json([
            'is_pro' => $user->isPro(),
            'subscribed' => $user->subscribed('default'),
            'role' => $user->role,
            'pro_expires_at' => $user->pro_expires_at,
        ]);
    }
}
