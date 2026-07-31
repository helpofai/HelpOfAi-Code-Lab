<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LicenseDomain extends Model
{
    use HasFactory;

    protected $fillable = [
        'license_id',
        'domain_url',
    ];

    public function license(): BelongsTo
    {
        return $this->belongsTo(License::class);
    }
}
