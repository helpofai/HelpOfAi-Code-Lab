<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            if (!Schema::hasColumn('projects', 'project_type')) {
                $table->string('project_type')->default('editor'); // editor, downloadable, github_repo
            }
            if (!Schema::hasColumn('projects', 'github_repo_url')) {
                $table->string('github_repo_url')->nullable();
            }
            if (!Schema::hasColumn('projects', 'version')) {
                $table->string('version')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn(['project_type', 'github_repo_url', 'version']);
        });
    }
};
