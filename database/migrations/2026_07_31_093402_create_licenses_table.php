<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('licenses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('project_id')->constrained()->cascadeOnDelete();
            $table->foreignId('purchase_id')->nullable()->constrained()->nullOnDelete();
            
            $table->string('license_key')->unique();
            $table->enum('status', ['active', 'suspended', 'expired'])->default('active');
            $table->timestamp('expires_at')->nullable();
            
            $table->timestamps();
            
            $table->index(['user_id', 'project_id']);
            $table->index('license_key');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('licenses');
    }
};
