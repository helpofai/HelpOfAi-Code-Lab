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
            $sm = Schema::getConnection()->getDoctrineSchemaManager();
            $indexesFound = $sm->listTableIndexes('users');
            
            if (!array_key_exists('users_role_index', $indexesFound)) {
                $table->index('role');
            }
            if (!array_key_exists('users_created_at_index', $indexesFound)) {
                $table->index('created_at');
            }
        });

        Schema::table('projects', function (Blueprint $table) {
            $sm = Schema::getConnection()->getDoctrineSchemaManager();
            $indexesFound = $sm->listTableIndexes('projects');
            
            if (!array_key_exists('projects_is_public_index', $indexesFound)) {
                $table->index('is_public');
            }
            if (!array_key_exists('projects_is_for_sale_index', $indexesFound)) {
                $table->index('is_for_sale');
            }
            if (!array_key_exists('projects_created_at_index', $indexesFound)) {
                $table->index('created_at');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['role']);
            $table->dropIndex(['created_at']);
        });

        Schema::table('projects', function (Blueprint $table) {
            $table->dropIndex(['is_public']);
            $table->dropIndex(['is_for_sale']);
            $table->dropIndex(['created_at']);
        });
    }
};
