<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;

class ProjectImageController extends Controller
{
    /**
     * Generate a dynamic OG image for a project.
     */
    public function show(string $slug)
    {
        $project = Project::where('slug', $slug)->with('user')->firstOrFail();

        // 1. Create Canvas (OG Standard: 1200x630)
        $width = 1200;
        $height = 630;
        $image = imagecreatetruecolor($width, $height);

        // 2. Define Colors (Neural / HOACodeLab Palette)
        $bgMain = imagecolorallocate($image, 5, 5, 5); // #050505
        $cyan = imagecolorallocate($image, 6, 182, 212); // #06b6d4
        $textMain = imagecolorallocate($image, 255, 255, 255); // #ffffff
        $textMuted = imagecolorallocate($image, 100, 116, 139); // #64748b

        // 3. Fill Background
        imagefill($image, 0, 0, $bgMain);

        // 4. Draw stylized grid pattern (background detail)
        $gridColor = imagecolorallocate($image, 20, 20, 20);
        for ($i = 0; $i < $width; $i += 40) {
            imageline($image, $i, 0, $i, $height, $gridColor);
        }
        for ($i = 0; $i < $height; $i += 40) {
            imageline($image, 0, $i, $width, $i, $gridColor);
        }

        // 5. Draw Neural Gradient Border (Simulated)
        for ($i = 0; $i < 4; $i++) {
            imagerectangle($image, $i, $i, $width - 1 - $i, $height - 1 - $i, $cyan);
        }

        // 6. Draw Text (Using standard fonts or fallback)
        // Note: For true professional grade, we would bundle a TTF font.
        // Falling back to internal GD fonts if TTF not found.
        $fontPath = 'C:/Windows/Fonts/arialbd.ttf'; // Windows default
        
        if (file_exists($fontPath)) {
            // Project Title
            imagettftext($image, 50, 0, 100, 250, $textMain, $fontPath, strtoupper($project->title));
            
            // Author Name
            imagettftext($image, 24, 0, 100, 320, $cyan, $fontPath, "CREATED BY // " . strtoupper($project->user->name));
            
            // Branding
            imagettftext($image, 20, 0, 100, 530, $textMuted, $fontPath, "HOACODELAB // TECHNICAL PROTOTYPING NODE");
            
            // Version / Metadata
            imagettftext($image, 16, 0, 1000, 530, $cyan, $fontPath, "V1.4.8 STABLE");
        } else {
            // Fallback for environments without the font
            imagestring($image, 5, 100, 200, strtoupper($project->title), $textMain);
            imagestring($image, 3, 100, 250, "BY " . strtoupper($project->user->name), $cyan);
            imagestring($image, 2, 100, 500, "HOACODELAB", $textMuted);
        }

        // 7. Draw stylized "Code" Icon (Brackets)
        $bracketColor = imagecolorallocate($image, 20, 20, 20);
        if (file_exists($fontPath)) {
            imagettftext($image, 300, 0, 850, 450, $bracketColor, $fontPath, "{}");
        }

        // 8. Output Image
        header('Content-Type: image/png');
        imagepng($image);
        imagedestroy($image);
        exit;
    }
}
