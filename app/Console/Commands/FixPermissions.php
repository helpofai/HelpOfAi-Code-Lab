<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;
use FilesystemIterator;

class FixPermissions extends Command
{
    protected $signature = 'app:fix-permissions';
    protected $description = 'Recursively fix storage directory permissions to 755 (dirs) / 644 (files)';

    public function handle()
    {
        $path = storage_path();

        $this->info("Fixing permissions in: {$path}");

        $iterator = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($path, FilesystemIterator::SKIP_DOTS),
            RecursiveIteratorIterator::SELF_FIRST
        );

        $dirs = 0;
        $files = 0;

        foreach ($iterator as $item) {
            try {
                if ($item->isDir()) {
                    chmod($item->getPathname(), 0755);
                    $dirs++;
                } else {
                    chmod($item->getPathname(), 0644);
                    $files++;
                }
            } catch (\Throwable $e) {
                $this->warn("Failed: {$item->getPathname()} — {$e->getMessage()}");
            }
        }

        $this->info("Done. Directories: {$dirs} (755), Files: {$files} (644).");
        return Command::SUCCESS;
    }
}