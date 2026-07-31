<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'phonepe_merchant_id')) {
                $table->string('phonepe_merchant_id')->nullable();
            }
            if (!Schema::hasColumn('users', 'paytm_merchant_id')) {
                $table->string('paytm_merchant_id')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['phonepe_merchant_id', 'paytm_merchant_id']);
        });
    }
};
