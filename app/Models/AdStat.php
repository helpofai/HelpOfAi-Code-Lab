<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdStat extends Model
{
    use HasFactory;

    protected $fillable = ['ad_id', 'date', 'impressions', 'clicks', 'revenue'];

    protected $casts = [
        'date' => 'date',
        'revenue' => 'decimal:4',
    ];

    public function ad()
    {
        return $this->belongsTo(Ad::class);
    }
}
