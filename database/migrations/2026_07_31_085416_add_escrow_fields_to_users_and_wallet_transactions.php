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
            if (!Schema::hasColumn('users', 'escrow_balance')) {
                $table->decimal('escrow_balance', 12, 2)->default(0)->after('available_balance');
            }
        });

        Schema::table('wallet_transactions', function (Blueprint $table) {
            if (!Schema::hasColumn('wallet_transactions', 'status')) {
                $table->enum('status', ['cleared', 'escrow'])->default('cleared')->after('amount');
            }
            if (!Schema::hasColumn('wallet_transactions', 'clears_at')) {
                $table->timestamp('clears_at')->nullable()->after('status');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users_and_wallet_transactions', function (Blueprint $table) {
            //
        });
    }
};
