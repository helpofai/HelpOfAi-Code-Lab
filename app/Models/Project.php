<?php

/*
|--------------------------------------------------------------------------
| HelpOfAi (HOA) Professional Software
|--------------------------------------------------------------------------
|
| Copyright (c) 2026 Rajib Adhikary. All Rights Reserved.
|
| This file is part of the HelpOfAi Professional Software Suite.
| Unauthorized copying, modification, redistribution, reverse engineering,
| decompilation, or commercial use of this source code, in whole or in part,
| is strictly prohibited without prior written permission from the copyright owner.
|
| Author      : Rajib Adhikary
| Organization: HelpOfAi (HOA)
| Website     : https://helpofai.com
| Location    : Basta Purba Para, Aranghata, Nadia, West Bengal, India
|
| This source code contains proprietary and confidential information.
| Any unauthorized access or distribution may violate applicable copyright laws.
|
|--------------------------------------------------------------------------
*/

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Services\SeoIndexingService;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'team_id',
        'title',
        'category',
        'tags',
        'slug',
        'code',
        'settings',
        'is_public',
        'is_for_sale',
        'price',
        'meta_title',
        'meta_description',
        'meta_keywords',
        'og_image',
        'canonical_url',
        'github_repo_url',
        'project_type',
        'version'
    ];

    protected $casts = [
        'code' => 'array',
        'settings' => 'array',
        'is_public' => 'boolean',
        'is_for_sale' => 'boolean',
        'price' => 'decimal:2',
        'tags' => 'array',
    ];

    protected $hidden = [
        'code',
    ];

    protected $appends = [
        'og_image_url',
    ];

    public function getOgImageUrlAttribute(): string
    {
        return route('projects.og-image', ['slug' => $this->slug]);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    public function assets(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(ProjectAsset::class);
    }

    public function collections(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(Collection::class);
    }

    public function revisions(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(ProjectRevision::class);
    }

    public function purchases(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Purchase::class);
    }

    public function reviews(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function getAverageRatingAttribute()
    {
        return round($this->reviews()->where('is_approved', true)->avg('rating') ?: 0, 1);
    }

    public function getReviewsCountAttribute()
    {
        return $this->reviews()->where('is_approved', true)->count();
    }

    protected static function booted()
    {
        static::saved(function ($project) {
            // Only ping if project is public
            if ($project->is_public) {
                try {
                    $service = new \App\Services\SeoIndexingService();
                    $service->submitUrlForIndexing(url('/project/' . $project->slug));
                } catch (\Exception $e) {
                    \Illuminate\Support\Facades\Log::error("SEO Ping failed: " . $e->getMessage());
                }
            }
        });
    }
}
