<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VendorConnection extends Model
{
    protected $fillable = [
        'user_id',
        'provider',
        'name',
        'token',
        'is_valid',
        'last_verified_at',
    ];

    protected $casts = [
        'token' => 'encrypted',
        'is_valid' => 'boolean',
        'last_verified_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
