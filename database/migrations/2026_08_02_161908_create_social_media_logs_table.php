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
        if (!Schema::hasTable('social_media_logs')) {
            Schema::create('social_media_logs', function (Blueprint $table) {
                $table->id();
                $table->string('platform'); // 'telegram' or 'whatsapp'
                $table->unsignedBigInteger('project_id')->nullable();
                $table->index('project_id');
                $table->string('status'); // 'success' or 'failed'
                $table->text('error_message')->nullable();
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('social_media_logs');
    }
};
