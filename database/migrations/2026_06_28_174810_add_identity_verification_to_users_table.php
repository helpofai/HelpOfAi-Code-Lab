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
            if (!Schema::hasColumn('users', 'identity_status')) {
                $table->string('identity_status')->default('unverified');
            }
            if (!Schema::hasColumn('users', 'identity_selfie_path')) {
                $table->string('identity_selfie_path')->nullable();
            }
            if (!Schema::hasColumn('users', 'identity_document_path')) {
                $table->string('identity_document_path')->nullable();
            }
            if (!Schema::hasColumn('users', 'identity_rejected_reason')) {
                $table->text('identity_rejected_reason')->nullable();
            }
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
