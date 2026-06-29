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
            if (Schema::hasColumn('users', 'personal_google_client_id')) {
                $table->text('personal_google_client_id')->nullable()->change();
            }
            if (Schema::hasColumn('users', 'personal_google_client_secret')) {
                $table->text('personal_google_client_secret')->nullable()->change();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'personal_google_client_id')) {
                $table->string('personal_google_client_id', 255)->nullable()->change();
            }
            if (Schema::hasColumn('users', 'personal_google_client_secret')) {
                $table->string('personal_google_client_secret', 255)->nullable()->change();
            }
        });
    }
};
