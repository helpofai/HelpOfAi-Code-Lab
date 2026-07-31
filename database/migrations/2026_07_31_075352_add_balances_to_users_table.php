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
            if (!Schema::hasColumn('users', 'available_balance')) {
                $table->decimal('available_balance', 12, 2)->default(0);
            }
            if (!Schema::hasColumn('users', 'pending_balance')) {
                $table->decimal('pending_balance', 12, 2)->default(0);
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['available_balance', 'pending_balance']);
        });
    }
};
