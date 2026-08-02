<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SocialMediaLog extends Model
{
    protected $fillable = ['platform', 'project_id', 'status', 'error_message'];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
