<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProjectAsset extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'file_path',
        'version',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
