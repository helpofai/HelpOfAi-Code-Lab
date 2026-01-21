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
        Schema::table('users', function (Blueprint $blueprint) {
            if (!Schema::hasColumn('users', 'personal_google_client_id')) {
                $blueprint->string('personal_google_client_id')->nullable();
            }
            if (!Schema::hasColumn('users', 'personal_google_client_secret')) {
                $blueprint->text('personal_google_client_secret')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $blueprint) {
            $blueprint->dropColumn(['personal_google_client_id', 'personal_google_client_secret']);
        });
    }
};