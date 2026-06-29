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

    public function stats()
    {
        return $this->hasMany(AdStat::class);
    }

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
