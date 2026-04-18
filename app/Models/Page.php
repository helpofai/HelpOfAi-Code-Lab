<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Page extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'content',
        'meta_title',
        'meta_description',
        'meta_keywords',
        'is_published',
        'is_system'
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'is_system' => 'boolean',
    ];
}
