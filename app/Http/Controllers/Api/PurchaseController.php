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
use App\Models\Project;
use App\Models\Purchase;
use App\Models\SiteSetting;
use App\Models\License;
use App\Services\LicenseService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Razorpay\Api\Api as RazorpayApi;
use Stripe\StripeClient;

class PurchaseController extends Controller
{
    /**
     * Create a checkout session/order for project purchase.
     */
    public function checkout(Request $request)
    {
        $request->validate([
            'project_id' => 'required|exists:projects,id',
            'gateway' => 'required|string|in:test,stripe,razorpay,paytm,phonepe',
        ]);

        $project = Project::with('user')->findOrFail($request->project_id);
        $user = Auth::user();

        if ($project->user_id === $user->id) {
            return response()->json(['message' => 'You already own this project.'], 400);
        }

        if ($project->purchases()->where('user_id', $user->id)->exists()) {
            return response()->json(['message' => 'You have already purchased this project.'], 400);
        }

        if ($request->domain || $request->license_type || $request->metadata) {
            \Illuminate\Support\Facades\Cache::put("checkout_domain_{$user->id}_{$project->id}", $request->domain, now()->addHours(2));
            \Illuminate\Support\Facades\Cache::put("checkout_license_type_{$user->id}_{$project->id}", $request->license_type ?: 'Standard', now()->addHours(2));
            \Illuminate\Support\Facades\Cache::put("checkout_metadata_{$user->id}_{$project->id}", json_encode($request->metadata ?: []), now()->addHours(2));
        }

        $gateway = $request->gateway;
        $price = (float) $project->price;
        if ($request->license_type === 'Extended') {
            $price = $price * 2.5;
        }

        // 0. Test Gateway (Neural Test Bridge)
        if ($gateway === 'test') {
            $testEnabled = SiteSetting::where('key', 'test_enabled')->first()?->value;
            if ($testEnabled !== '1') return response()->json(['message' => 'Test Gateway disabled.'], 403);

            Purchase::firstOrCreate([
                'user_id' => $user->id,
                'project_id' => $project->id,
                'payment_method' => 'test_gateway',
            ], [
                'amount' => $price,
                'currency' => 'USD',
                'payment_id' => 'TEST-' . strtoupper(Str::random(10)),
                'status' => 'completed'
            ]);

            return response()->json([
                'url' => route('purchase.status') . '?status=success&project_id=' . $project->id . '&gateway=test'
            ]);
        }

        // 1. Stripe Checkout
        if ($gateway === 'stripe') {
            $stripeSecret = SiteSetting::where('key', 'stripe_secret')->first()?->value;
            if (!$stripeSecret) return response()->json(['message' => 'Stripe offline.'], 500);

            config(['cashier.secret' => $stripeSecret]);

            $checkoutOptions = [
                'success_url' => route('purchase.status') . '?status=success&project_id=' . $project->id . '&session_id={CHECKOUT_SESSION_ID}',
                'cancel_url' => route('purchase.status') . '?status=failed&project_id=' . $project->id,
                'metadata' => [
                    'project_id' => $project->id,
                    'user_id' => $user->id,
                    'type' => 'project_purchase'
                ]
            ];

            // Split Payment Logic for Stripe Connect
            $routingMode = SiteSetting::where('key', 'payout_routing_mode')->first()?->value ?: 'auto';
            $vendor = $project->user;
            if ($routingMode === 'auto' && $vendor && $vendor->is_vendor && $vendor->stripe_account_id) {
                $platformFee = (int) ($price * 0.30 * 100); // 30% platform fee in cents
                $checkoutOptions['payment_intent_data'] = [
                    'application_fee_amount' => $platformFee,
                    'transfer_data' => [
                        'destination' => $vendor->stripe_account_id,
                    ],
                ];
            }

            $checkout = $user->checkoutCharge($price * 100, $project->title, 1, $checkoutOptions);

            Purchase::create([
                'user_id' => $user->id,
                'project_id' => $project->id,
                'amount' => $project->price,
                'currency' => 'USD',
                'payment_id' => $checkout->id,
                'payment_method' => 'stripe',
                'status' => 'pending'
            ]);

            return response()->json(['url' => $checkout->url]);
        }

        // 2. Razorpay Order
        if ($gateway === 'razorpay') {
            $key = SiteSetting::where('key', 'razorpay_key')->first()?->value;
            $secret = SiteSetting::where('key', 'razorpay_secret')->first()?->value;

            if (!$key || !$secret) return response()->json(['message' => 'Razorpay offline.'], 500);

            $api = new RazorpayApi($key, $secret);
            
            // CURRENCY CONVERSION: USD to INR
            $exchangeRate = (float) (SiteSetting::where('key', 'usd_to_inr_rate')->first()?->value ?: 84.00);
            $amountInINR = $price * $exchangeRate;
            
            $orderData = [
                'receipt' => 'project_' . $project->id . '_' . $user->id,
                'amount' => (int) ($amountInINR * 100), // in paise
                'currency' => 'INR',
                'notes' => [
                    'project_id' => $project->id,
                    'type' => 'project_purchase'
                ]
            ];

            // Split Payment Logic for Razorpay Route
            $routingMode = SiteSetting::where('key', 'payout_routing_mode')->first()?->value ?: 'auto';
            $vendor = $project->user;
            if ($routingMode === 'auto' && $vendor && $vendor->is_vendor && $vendor->razorpay_account_id) {
                $vendorShare = (int) ($amountInINR * 0.70 * 100); // 70% to vendor in paise
                $orderData['transfers'] = [
                    [
                        'account' => $vendor->razorpay_account_id,
                        'amount' => $vendorShare,
                        'currency' => 'INR',
                        'notes' => ['project_id' => $project->id],
                        'linked_account_notes' => ['project_id'],
                        'on_hold' => 0
                    ]
                ];
            }

            $order = $api->order->create($orderData);

            return response()->json([
                'gateway' => 'razorpay',
                'order_id' => $order['id'],
                'key' => $key,
                'amount' => $order['amount'],
                'project_id' => $project->id,
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

            if (!$mId || !$salt) return response()->json(['message' => 'PhonePe node offline.'], 500);

            // CURRENCY CONVERSION: USD to INR
            $exchangeRate = (float) (SiteSetting::where('key', 'usd_to_inr_rate')->first()?->value ?: 84.00);
            $amountInINR = $price * $exchangeRate;

            $txnId = 'PROJ_' . $project->id . '_' . $user->id . '_' . time();
            $payload = [
                'merchantId' => $mId,
                'merchantTransactionId' => $txnId,
                'merchantUserId' => 'U' . $user->id,
                'amount' => (int) ($amountInINR * 100), // in paise
                'redirectUrl' => route('purchase.status') . '?status=success&project_id=' . $project->id . '&gateway=phonepe&txnId=' . $txnId,
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
                Purchase::create([
                    'user_id' => $user->id,
                    'project_id' => $project->id,
                    'amount' => \Illuminate\Support\Facades\Cache::get("checkout_license_type_{$user->id}_{$project->id}") === 'Extended' ? clone($project)->price * 2.5 : $project->price,
                    'currency' => 'USD',
                    'payment_id' => $txnId,
                    'payment_method' => 'phonepe',
                    'status' => 'pending'
                ]);

                return response()->json(['url' => $response->json()['data']['instrumentResponse']['redirectInfo']['url']]);
            }

            return response()->json(['message' => 'PhonePe protocol failed.'], 500);
        }

        return response()->json(['message' => 'Gateway not supported.'], 400);
    }

    /**
     * Verify payment and record purchase.
     */
    public function verify(Request $request, LicenseService $licenseService)
    {
        $request->validate([
            'gateway' => 'required|string',
            'project_id' => 'required|exists:projects,id'
        ]);

        $user = Auth::user();
        $project = Project::findOrFail($request->project_id);
        $gateway = $request->gateway;
        $purchase = null;

        $isNewPayment = false;

        if ($gateway === 'test') {
            $purchase = Purchase::where('user_id', $user->id)->where('project_id', $project->id)->first();
            if (!$purchase) {
                $purchase = Purchase::create([
                    'user_id' => $user->id,
                    'project_id' => $project->id,
                    'amount' => $project->price,
                    'currency' => 'USD',
                    'payment_id' => 'TEST-' . strtoupper(Str::random(10)),
                    'payment_method' => 'test_gateway',
                    'status' => 'completed'
                ]);
                $isNewPayment = true;
            } elseif ($purchase->status !== 'completed') {
                $purchase->update([
                    'payment_id' => 'TEST-' . strtoupper(Str::random(10)),
                    'status' => 'completed'
                ]);
                $isNewPayment = true;
            }
        } elseif ($gateway === 'razorpay') {
            $key = SiteSetting::where('key', 'razorpay_key')->first()?->value;
            $secret = SiteSetting::where('key', 'razorpay_secret')->first()?->value;
            $api = new RazorpayApi($key, $secret);

            try {
                $api->utility->verifyPaymentSignature([
                    'razorpay_order_id' => $request->razorpay_order_id,
                    'razorpay_payment_id' => $request->razorpay_payment_id,
                    'razorpay_signature' => $request->razorpay_signature
                ]);

                // CRITICAL SECURITY CHECK: Fetch the order to ensure it was actually for THIS project.
                // Prevents a user from paying for a $1 project and sending the valid signature to unlock a $1000 project.
                $razorpayOrder = $api->order->fetch($request->razorpay_order_id);
                if (!isset($razorpayOrder->notes->project_id) || (int) $razorpayOrder->notes->project_id !== $project->id) {
                    return response()->json(['message' => 'Security Error: Payment Order does not match the requested Project.'], 403);
                }
                
                // Double check amount to be absolutely certain (using exchange rate)
                $exchangeRate = (float) (SiteSetting::where('key', 'usd_to_inr_rate')->first()?->value ?: 84.00);
                $cachedLicenseType = \Illuminate\Support\Facades\Cache::get("checkout_license_type_{$user->id}_{$project->id}");
                $expectedPrice = $cachedLicenseType === 'Extended' ? clone($project)->price * 2.5 : clone($project)->price;
                $expectedAmountInINR = (int) ($expectedPrice * $exchangeRate * 100);
                if ((int) $razorpayOrder->amount !== $expectedAmountInINR) {
                    return response()->json(['message' => 'Security Error: Payment amount mismatch.'], 403);
                }

                $purchase = Purchase::where('user_id', $user->id)->where('project_id', $project->id)->first();
                if (!$purchase) {
                    $purchase = Purchase::create([
                        'user_id' => $user->id,
                        'project_id' => $project->id,
                        'amount' => $expectedPrice,
                        'currency' => 'USD',
                        'payment_id' => $request->razorpay_payment_id,
                        'payment_method' => 'razorpay',
                        'status' => 'completed'
                    ]);
                    $isNewPayment = true;
                } elseif ($purchase->status !== 'completed') {
                    $purchase->update([
                        'payment_id' => $request->razorpay_payment_id,
                        'status' => 'completed'
                    ]);
                    $isNewPayment = true;
                }
            } catch (\Exception $e) {
                return response()->json(['message' => 'Verification failed.'], 400);
            }
        } elseif ($gateway === 'stripe') {
            $stripeSecret = SiteSetting::where('key', 'stripe_secret')->first()?->value;
            if (!$stripeSecret) return response()->json(['message' => 'Stripe offline.'], 500);

            $stripe = new StripeClient($stripeSecret);

            try {
                $session = $stripe->checkout->sessions->retrieve($request->session_id);

                if ($session->payment_status !== 'paid') {
                    return response()->json(['message' => 'Payment not completed.'], 400);
                }

                if (!isset($session->metadata->project_id) || (int) $session->metadata->project_id !== $project->id) {
                    return response()->json(['message' => 'Session mismatch.'], 400);
                }
            } catch (\Exception $e) {
                return response()->json(['message' => 'Session verification failed.'], 400);
            }

            $purchase = Purchase::where('user_id', $user->id)->where('project_id', $project->id)->first();
            if (!$purchase) {
                $purchase = Purchase::create([
                    'user_id' => $user->id,
                    'project_id' => $project->id,
                    'amount' => $project->price,
                    'currency' => 'USD',
                    'payment_id' => $request->session_id,
                    'payment_method' => 'stripe',
                    'status' => 'completed'
                ]);
                $isNewPayment = true;
            } elseif ($purchase->status !== 'completed') {
                $purchase->update([
                    'payment_id' => $request->session_id,
                    'status' => 'completed'
                ]);
                $isNewPayment = true;
            }
        } elseif ($gateway === 'phonepe') {
            // PhonePe frontend verification (the real logic happens in the callback)
            $purchase = Purchase::where('user_id', $user->id)
                ->where('project_id', $project->id)
                ->where('payment_id', $request->txnId)
                ->first();

            if (!$purchase || $purchase->status !== 'completed') {
                return response()->json(['message' => 'Payment is still processing or failed. Please check back later.'], 400);
            }
        } else {
            return response()->json(['message' => 'Verification protocol unknown.'], 400);
        }

        // If purchase was successful, generate a License Key
        if ($purchase && $purchase->status === 'completed') {
            
            // Handle Manual Payout Routing Logic
            if ($isNewPayment) {
                $routingMode = SiteSetting::where('key', 'payout_routing_mode')->first()?->value ?: 'auto';
                if ($routingMode === 'manual') {
                    $vendor = $project->user;
                    if ($vendor && $vendor->is_vendor) {
                        DB::transaction(function () use ($vendor, $project, $purchase) {
                            $lockedVendor = \App\Models\User::where('id', $vendor->id)->lockForUpdate()->first();
                            $vendorShare = $project->price * 0.70;
                            $lockedVendor->escrow_balance += $vendorShare;
                            $lockedVendor->save();

                            \App\Models\WalletTransaction::create([
                                'user_id' => $lockedVendor->id,
                                'type' => 'credit',
                                'amount' => $vendorShare,
                                'status' => 'escrow',
                                'clears_at' => now()->addDays(7),
                                'reference_type' => get_class($purchase),
                                'reference_id' => $purchase->id,
                                'description' => 'Project Sale (70% cut in Escrow): ' . $project->title
                            ]);
                        });
                    }
                }
            }

            // Generate License
            $license = License::firstOrCreate(
                ['purchase_id' => $purchase->id],
                [
                    'user_id' => $user->id,
                    'project_id' => $project->id,
                    'purchase_id' => $purchase->id,
                    'license_key' => $licenseService->generateLicenseKey(),
                    'type' => \Illuminate\Support\Facades\Cache::get("checkout_license_type_{$user->id}_{$project->id}") ?: 'standard',
                    'domain' => \Illuminate\Support\Facades\Cache::get("checkout_domain_{$user->id}_{$project->id}"),
                    'metadata' => \Illuminate\Support\Facades\Cache::get("checkout_metadata_{$user->id}_{$project->id}") ?: null,
                    'status' => 'active',
                    'support_duration' => $project->support_duration ?? '6_months',
                    // Default to 1 year expiry, can be adjusted based on product logic
                    'expires_at' => ($project->support_duration === 'lifetime') ? null : now()->addYear() 
                ]
            );

            // Notify Vendor
            if ($isNewPayment && $project->user) {
                $project->user->notify(new \App\Notifications\NewSaleNotification($purchase, $project));
            }

            // Notify Buyer & Email Invoice
            if ($isNewPayment) {
                $user->notify(new \App\Notifications\PurchaseReceiptNotification($purchase, $project, $license));
            }
            
            return response()->json([
                'message' => 'Purchase successful. Node Unlocked.',
                'license_key' => $license->license_key
            ]);
        }

        return response()->json(['message' => 'Purchase not found.'], 404);
    }

    /**
     * Get user's purchased projects.
     */
    public function myPurchases()
    {
        return Purchase::where('user_id', Auth::id())
            ->with(['project.user'])
            ->orderBy('created_at', 'desc')
            ->get()->map(function ($purchase) {
                // Attach license key info if it exists
                $license = License::where('purchase_id', $purchase->id)->first();
                $purchase->license_key = $license ? $license->license_key : null;
                return $purchase;
            });
    }

    /**
     * PhonePe Server-to-Server Callback Handler
     */
    public function phonepeCallback(Request $request, LicenseService $licenseService)
    {
        $response = $request->all();
        if (!isset($response['response'])) {
            return response()->json(['status' => 'invalid_payload'], 400);
        }

        $base64 = $response['response'];
        $decoded = json_decode(base64_decode($base64));

        $salt = SiteSetting::where('key', 'phonepe_salt_key')->first()?->value;
        $index = SiteSetting::where('key', 'phonepe_salt_index')->first()?->value ?: '1';

        // Verify Checksum
        $checksum = hash('sha256', $base64 . $salt) . '###' . $index;
        if ($request->header('x-verify') !== $checksum) {
            return response()->json(['status' => 'checksum_failed'], 403);
        }

        if ($decoded->code === 'PAYMENT_SUCCESS') {
            $txnId = $decoded->data->merchantTransactionId;
            $purchase = Purchase::where('payment_id', $txnId)->first();

            if ($purchase && $purchase->status === 'pending') {
                $project = Project::find($purchase->project_id);
                if (!$project) return response()->json(['status' => 'project_not_found']);

                // Verify Amount
                $exchangeRate = (float) (SiteSetting::where('key', 'usd_to_inr_rate')->first()?->value ?: 84.00);
                $expectedAmountInINR = (int) ($project->price * $exchangeRate * 100);
                if ((int) $decoded->data->amount !== $expectedAmountInINR) {
                    return response()->json(['status' => 'amount_mismatch'], 403);
                }

                $purchase->update(['status' => 'completed']);

                // Process Manual Routing Payouts
                $routingMode = SiteSetting::where('key', 'payout_routing_mode')->first()?->value ?: 'auto';
                if ($routingMode === 'manual') {
                    $vendor = $project->user;
                    if ($vendor && $vendor->is_vendor) {
                        DB::transaction(function () use ($vendor, $project, $purchase) {
                            $lockedVendor = \App\Models\User::where('id', $vendor->id)->lockForUpdate()->first();
                            $vendorShare = $project->price * 0.70;
                            $lockedVendor->escrow_balance += $vendorShare;
                            $lockedVendor->save();

                            \App\Models\WalletTransaction::create([
                                'user_id' => $lockedVendor->id,
                                'type' => 'credit',
                                'amount' => $vendorShare,
                                'status' => 'escrow',
                                'clears_at' => now()->addDays(7),
                                'reference_type' => get_class($purchase),
                                'reference_id' => $purchase->id,
                                'description' => 'Project Sale (70% cut in Escrow): ' . $project->title
                            ]);
                        });
                    }
                }

                // Generate License
                $license = License::firstOrCreate(
                    ['purchase_id' => $purchase->id],
                    [
                        'user_id' => $purchase->user_id,
                        'project_id' => $project->id,
                        'purchase_id' => $purchase->id,
                        'license_key' => $licenseService->generateLicenseKey(),
                        'type' => \Illuminate\Support\Facades\Cache::get("checkout_license_type_{$purchase->user_id}_{$project->id}") ?: 'standard',
                        'domain' => \Illuminate\Support\Facades\Cache::get("checkout_domain_{$purchase->user_id}_{$project->id}"),
                        'metadata' => \Illuminate\Support\Facades\Cache::get("checkout_metadata_{$purchase->user_id}_{$project->id}") ?: null,
                        'status' => 'active',
                        'expires_at' => now()->addYear() 
                    ]
                );

                // Notify Vendor
                if ($project->user) {
                    $project->user->notify(new \App\Notifications\NewSaleNotification($purchase, $project));
                }

                // Notify Buyer & Email Invoice
                $buyer = \App\Models\User::find($purchase->user_id);
                if ($buyer) {
                    $buyer->notify(new \App\Notifications\PurchaseReceiptNotification($purchase, $project, $license));
                }
            }
        }

        return response()->json(['status' => 'success']);
    }
}
