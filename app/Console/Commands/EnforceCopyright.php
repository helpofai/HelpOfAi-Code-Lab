<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class EnforceCopyright extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'copyright:enforce';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Automatically enforces the proprietary HOA copyright on all files';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Running automatic copyright enforcement in PHP...');
        
        $copyrightText = "/*\n|--------------------------------------------------------------------------\n| HelpOfAi (HOA) Professional Software\n|--------------------------------------------------------------------------\n|\n| Copyright (c) 2026 Rajib Adhikary. All Rights Reserved.\n|\n| This file is part of the HelpOfAi Professional Software Suite.\n| Unauthorized copying, modification, redistribution, reverse engineering,\n| decompilation, or commercial use of this source code, in whole or in part,\n| is strictly prohibited without prior written permission from the copyright owner.\n|\n| Author      : Rajib Adhikary\n| Organization: HelpOfAi (HOA)\n| Website     : https://helpofai.com\n| Location    : Basta Purba Para, Aranghata, Nadia, West Bengal, India\n|\n| This source code contains proprietary and confidential information.\n| Any unauthorized access or distribution may violate applicable copyright laws.\n|\n|--------------------------------------------------------------------------\n*/\n";

        $directories = [
            base_path('app'),
            base_path('config'),
            base_path('routes'),
            base_path('database'),
            base_path('resources/js'),
            base_path('resources/css'),
        ];

        $extensions = ['php', 'js', 'jsx', 'ts', 'tsx', 'css'];
        $modifiedCount = 0;

        foreach ($directories as $directory) {
            if (!File::exists($directory)) continue;

            $files = File::allFiles($directory);

            foreach ($files as $file) {
                if (in_array($file->getExtension(), $extensions)) {
                    $content = File::get($file->getPathname());

                    if (strpos($content, 'HelpOfAi (HOA) Professional Software') === false) {
                        if ($file->getExtension() === 'php') {
                            if (str_starts_with(trim($content), '<?php')) {
                                $content = preg_replace('/^<\?php\s*/', "<?php\n\n" . $copyrightText . "\n", $content);
                            } else {
                                $content = "<?php\n\n" . $copyrightText . "?>\n" . $content;
                            }
                        } else {
                            $content = $copyrightText . "\n" . $content;
                        }

                        File::put($file->getPathname(), $content);
                        $modifiedCount++;
                    }
                }
            }
        }

        $this->info("Successfully checked and added copyright to {$modifiedCount} new files.");
    }
}
