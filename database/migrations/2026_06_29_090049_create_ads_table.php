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
        if (!Schema::hasTable('ads')) {
            Schema::create('ads', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('provider')->default('adsense'); // adsense, facebook, custom
                $table->string('location')->index(); // top_banner, sidebar, footer, in_feed
                $table->string('client_id')->nullable();
                $table->string('slot_id')->nullable();
                $table->string('format')->default('auto');
                $table->text('custom_code')->nullable();
                $table->boolean('is_active')->default(true);
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ads');
    }
};
