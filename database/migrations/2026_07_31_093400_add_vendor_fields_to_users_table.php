<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'is_vendor')) {
                $table->boolean('is_vendor')->default(false);
            }
            if (!Schema::hasColumn('users', 'stripe_account_id')) {
                $table->string('stripe_account_id')->nullable();
            }
            if (!Schema::hasColumn('users', 'razorpay_account_id')) {
                $table->string('razorpay_account_id')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['is_vendor', 'stripe_account_id', 'razorpay_account_id']);
        });
    }
};
