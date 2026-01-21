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
        Schema::table('projects', function (Blueprint $table) {
            $table->boolean('is_private')->default(false);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->timestamp('pro_expires_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn('is_private');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('pro_expires_at');
        });
    }
};
