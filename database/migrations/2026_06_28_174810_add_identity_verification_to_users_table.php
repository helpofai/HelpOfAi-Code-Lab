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
            $table->string('identity_status')->default('unverified');
            $table->string('identity_selfie_path')->nullable();
            $table->string('identity_document_path')->nullable();
            $table->text('identity_rejected_reason')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'identity_status',
                'identity_selfie_path',
                'identity_document_path',
                'identity_rejected_reason'
            ]);
        });
    }
};
