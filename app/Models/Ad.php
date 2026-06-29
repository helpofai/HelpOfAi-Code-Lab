<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ad extends Model
{
    protected $fillable = [
        'name',
        'provider',
        'location',
        'client_id',
        'slot_id',
        'format',
        'custom_code',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
