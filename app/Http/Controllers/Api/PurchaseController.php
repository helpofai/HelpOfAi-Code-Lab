<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Purchase;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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

        $project = Project::findOrFail($request->project_id);
        $user = Auth::user();

        if ($project->user_id === $user->id) {
            return response()->json(['message' => 'You already own this project.'], 400);
        }

        if ($project->purchases()->where('user_id', $user->id)->exists()) {
            return response()->json(['message' => 'You have already purchased this project.'], 400);
        }

        $gateway = $request->gateway;
        $price = (float) $project->price;

        // 0. Test Gateway (Neural Test Bridge)
        if ($gateway === 'test') {
            $testEnabled = SiteSetting::where('key', 'test_enabled')->first()?->value;
            if ($testEnabled !== '1') return response()->json(['message' => 'Test Gateway disabled.'], 403);

            Purchase::firstOrCreate([
                'user_id' => $user->id,
                'project_id' => $project->id,
                'payment_method' => 'test_gateway',
            ], [
                'amount' => $project->price,
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

            $checkout = $user->checkoutCharge($price * 100, $project->title, 1, [
                'success_url' => route('purchase.status') . '?status=success&project_id=' . $project->id . '&session_id={CHECKOUT_SESSION_ID}',
                'cancel_url' => route('purchase.status') . '?status=failed&project_id=' . $project->id,
                'metadata' => [
                    'project_id' => $project->id,
                    'user_id' => $user->id,
                    'type' => 'project_purchase'
                ]
            ]);

            // Create a pending purchase record so we don't lose the intent
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
            $order = $api->order->create([
                'receipt' => 'project_' . $project->id . '_' . $user->id,
                'amount' => $price * 100,
                'currency' => 'INR',
                'notes' => [
                    'project_id' => $project->id,
                    'type' => 'project_purchase'
                ]
            ]);

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

            $txnId = 'PROJ_' . $project->id . '_' . $user->id . '_' . time();
            $payload = [
                'merchantId' => $mId,
                'merchantTransactionId' => $txnId,
                'merchantUserId' => 'U' . $user->id,
                'amount' => $price * 100,
                'redirectUrl' => route('purchase.status') . '?status=success&project_id=' . $project->id . '&gateway=phonepe',
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
                    'amount' => $project->price,
                    'currency' => 'INR',
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
    public function verify(Request $request)
    {
        $request->validate([
            'gateway' => 'required|string',
            'project_id' => 'required|exists:projects,id'
        ]);

        $user = Auth::user();
        $project = Project::findOrFail($request->project_id);
        $gateway = $request->gateway;

        if ($gateway === 'test') {
            Purchase::firstOrCreate([
                'user_id' => $user->id,
                'project_id' => $project->id,
                'payment_method' => 'test_gateway',
            ], [
                'amount' => $project->price,
                'currency' => 'USD',
                'payment_id' => 'TEST-' . strtoupper(Str::random(10)),
                'status' => 'completed'
            ]);

            return response()->json(['message' => 'Test Handshake Verified. Node Unlocked.']);
        }

        if ($gateway === 'razorpay') {
            $key = SiteSetting::where('key', 'razorpay_key')->first()?->value;
            $secret = SiteSetting::where('key', 'razorpay_secret')->first()?->value;
            $api = new RazorpayApi($key, $secret);

            try {
                $api->utility->verifyPaymentSignature([
                    'razorpay_order_id' => $request->razorpay_order_id,
                    'razorpay_payment_id' => $request->razorpay_payment_id,
                    'razorpay_signature' => $request->razorpay_signature
                ]);

                // Create Purchase Record
                Purchase::create([
                    'user_id' => $user->id,
                    'project_id' => $project->id,
                    'amount' => $project->price,
                    'currency' => 'INR',
                    'payment_id' => $request->razorpay_payment_id,
                    'payment_method' => 'razorpay',
                    'status' => 'completed'
                ]);

                return response()->json(['message' => 'Purchase successful. Node Unlocked.']);
            } catch (\Exception $e) {
                return response()->json(['message' => 'Verification failed.'], 400);
            }
        }

        // Stripe: verify with Stripe API before recording purchase
        if ($gateway === 'stripe') {
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

            Purchase::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'project_id' => $project->id,
                ],
                [
                    'amount' => $project->price,
                    'currency' => 'USD',
                    'payment_id' => $request->session_id,
                    'payment_method' => 'stripe',
                    'status' => 'completed'
                ]
            );

            return response()->json(['message' => 'Purchase confirmed.']);
        }

        return response()->json(['message' => 'Verification protocol unknown.'], 400);
    }

    /**
     * Get user's purchased projects.
     */
    public function myPurchases()
    {
        return Purchase::where('user_id', Auth::id())
            ->with('project.user')
            ->orderBy('created_at', 'desc')
            ->get();
    }
}
