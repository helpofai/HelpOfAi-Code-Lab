<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            if (!Schema::hasColumn('projects', 'is_for_sale')) {
                $table->boolean('is_for_sale')->default(false)->after('is_public');
            }
            if (!Schema::hasColumn('projects', 'price')) {
                $table->decimal('price', 10, 2)->default(0.00)->after('is_for_sale');
            }
        });
    }

    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn(['is_for_sale', 'price']);
        });
    }
};
