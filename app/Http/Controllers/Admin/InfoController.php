<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\File;

class InfoController extends Controller
{
    public function index()
    {
        $files = [
            'README.md',
            'CHANGELOG.md',
            'changelog.md',
            'PRODUCTION_GUIDE.md',
            'GUIDE.md',
            'DOCUMENTS.md',
            'documentation.md',
            'docoments.md',
            'gemini.md',
        ];

        $data = [];
        $foundNames = [];

        // Add System Environment Node
        $data[] = [
            'name' => 'SYSTEM_ENV',
            'display' => 'System Environment',
            'content' => $this->getSystemEnvMarkdown(),
        ];
        $foundNames[] = 'system_env';

        foreach ($files as $fileName) {
            $path = base_path($fileName);
            if (File::exists($path)) {
                $content = File::get($path);
                $displayName = str_replace('.md', '', $fileName);
                $displayName = str_replace('_', ' ', $displayName);
                $displayName = ucwords(strtolower($displayName));

                if (!in_array(strtolower($fileName), $foundNames)) {
                    $data[] = [
                        'name' => $fileName,
                        'display' => $displayName,
                        'content' => $content,
                    ];
                    $foundNames[] = strtolower($fileName);
                }
            }
        }

        return Inertia::render('Admin/Info', [
            'infoFiles' => $data
        ]);
    }

    private function getSystemEnvMarkdown()
    {
        $phpVersion = PHP_VERSION;
        $laravelVersion = app()->version();
        $serverAddr = $_SERVER['SERVER_ADDR'] ?? '127.0.0.1';
        $serverSoftware = $_SERVER['SERVER_SOFTWARE'] ?? 'N/A';
        $dbConnection = config('database.default');
        $os = PHP_OS;

        return "
# System Environment Intelligence
This node provides real-time telemetry from the HOACodeLab server matrix.

| Parameter | Operational Data |
| :--- | :--- |
| **Framework** | Laravel v{$laravelVersion} |
| **Runtime** | PHP {$phpVersion} |
| **Platform** | {$os} |
| **Web Server** | {$serverSoftware} |
| **Database** | {$dbConnection} |
| **Interface** | {$serverAddr} |
| **Status** | <span style='color: #10b981; font-weight: bold;'>ACTIVE_STABLE</span> |

## Infrastructure Nodes
- **Frontend Core:** React 19.x (Neural Implementation)
- **Editor Engine:** Monaco Editor (VS Code Kernel)
- **Styling Core:** Tailwind CSS (Optimized)
- **Cloud Uplink:** Google Drive API v3
- **Unit Sync:** Laravel WebSockets / Sanctum
";
    }
}
