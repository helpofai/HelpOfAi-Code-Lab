<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('is_vendor')->default(false)->after('role');
            $table->string('stripe_account_id')->nullable()->after('is_vendor');
            $table->string('razorpay_account_id')->nullable()->after('stripe_account_id');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['is_vendor', 'stripe_account_id', 'razorpay_account_id']);
        });
    }
};
