<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubscriptionController extends Controller
{
    public function index()
    {
        $settings = SiteSetting::where('group', 'subscription')->get()->mapWithKeys(function ($item) {
            return [$item->key => $item->value];
        });

        // Ensure defaults if not set
        $defaults = [
            'pro_monthly_price' => '9.99',
            'pro_yearly_price' => '99.00',
            'pro_trial_days' => '7',
            'enable_public_signups' => '1',
            'enforce_pro_privacy' => '1',
            'free_project_limit' => '10',
            'max_upload_size_mb' => '5',
            'require_email_verification' => '1',
            'maintenance_bypass_key' => 'HOA-' . strtoupper(\Illuminate\Support\Str::random(8)),
            'global_rate_limit' => '60',
            'allow_guest_preview' => '1',
            
            // Gateway Status
            'stripe_enabled' => '0',
            'razorpay_enabled' => '0',
            'paytm_enabled' => '0',
            'phonepe_enabled' => '0',

            // Stripe
            'stripe_key' => '',
            'stripe_secret' => '',
            'stripe_webhook_secret' => '',
            'stripe_pro_price_id' => '',
            
            // Razorpay
            'razorpay_key' => '',
            'razorpay_secret' => '',
            
            // Paytm
            'paytm_merchant_id' => '',
            'paytm_merchant_key' => '',
            'paytm_website' => 'WEBSTAGING',
            
            // PhonePe
            'phonepe_merchant_id' => '',
            'phonepe_salt_key' => '',
            'phonepe_salt_index' => '1',
            'phonepe_env' => 'UAT',
        ];

        return Inertia::render('Admin/SubscriptionSettings', [
            'settings' => array_merge($defaults, $settings->toArray())
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'settings' => 'required|array'
        ]);

        foreach ($validated['settings'] as $key => $value) {
            SiteSetting::updateOrCreate(
                ['key' => $key, 'group' => 'subscription'],
                ['value' => $value]
            );
        }

        return back()->with('success', 'Subscription protocols updated.');
    }

    /**
     * Test Payment Gateway Connection.
     */
    public function testGateway(Request $request)
    {
        $gateway = $request->gateway;
        $settings = SiteSetting::where('group', 'subscription')->pluck('value', 'key');

        try {
            switch ($gateway) {
                case 'stripe':
                    if (empty($settings['stripe_secret'])) throw new \Exception('Stripe secret key missing.');
                    \Stripe\Stripe::setApiKey($settings['stripe_secret']);
                    \Stripe\Account::retrieve();
                    break;

                case 'razorpay':
                    if (empty($settings['razorpay_key']) || empty($settings['razorpay_secret'])) throw new \Exception('Razorpay credentials missing.');
                    $api = new \Razorpay\Api\Api($settings['razorpay_key'], $settings['razorpay_secret']);
                    $api->order->all(['count' => 1]);
                    break;

                case 'paytm':
                    if (empty($settings['paytm_merchant_id']) || empty($settings['paytm_merchant_key'])) throw new \Exception('Paytm credentials missing.');
                    break;

                case 'phonepe':
                    if (empty($settings['phonepe_merchant_id']) || empty($settings['phonepe_salt_key'])) throw new \Exception('PhonePe credentials missing.');
                    break;

                default:
                    throw new \Exception('Unknown gateway.');
            }

            return response()->json(['status' => 'success', 'message' => "Handshake with " . strtoupper($gateway) . " successful."]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 422);
        }
    }
}