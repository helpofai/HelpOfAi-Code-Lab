<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->string('project_type')->default('editor')->after('id'); // editor, downloadable, github_repo
            $table->string('github_repo_url')->nullable()->after('code');
            $table->string('version')->nullable()->after('github_repo_url');
        });
    }

    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn(['project_type', 'github_repo_url', 'version']);
        });
    }
};
