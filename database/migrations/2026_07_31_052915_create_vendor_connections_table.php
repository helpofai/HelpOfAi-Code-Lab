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
        if (!Schema::hasTable('vendor_connections')) {
            Schema::create('vendor_connections', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained()->cascadeOnDelete();
                $table->string('provider'); // github, gitlab, bitbucket
                $table->string('name')->nullable(); // e.g. "Personal Account"
                $table->text('token'); // Encrypted PAT
                $table->boolean('is_valid')->default(false);
                $table->timestamp('last_verified_at')->nullable();
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vendor_connections');
    }
};
