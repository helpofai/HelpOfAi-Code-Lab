<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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
}
