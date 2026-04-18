<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Asset extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'path',
        'type',
        'size',
    ];

    protected $appends = [
        'url',
    ];

    public function getUrlAttribute(): string
    {
        return asset('storage/' . $this->path);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
