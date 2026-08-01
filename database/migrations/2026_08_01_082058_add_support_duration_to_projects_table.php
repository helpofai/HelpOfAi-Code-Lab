<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            if (!Schema::hasColumn('projects', 'support_duration')) {
                // Allows vendors to set default support model for their product
                $table->enum('support_duration', ['6_months', 'lifetime'])->default('6_months');
            }
            if (!Schema::hasColumn('projects', 'latest_commit_hash')) {
                $table->string('latest_commit_hash')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn(['support_duration', 'latest_commit_hash']);
        });
    }
};
