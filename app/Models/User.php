<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Cashier\Billable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, Billable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
        protected $fillable = [
            'name',
            'email',
            'password',
            'role',
            'is_blocked',
            'pro_expires_at',
            'stripe_id',
            'pm_type',
            'pm_last_four',
            'trial_ends_at',
        ];
    
        /**
         * Role Constants
         */
        public const ROLE_ADMIN = 'admin';
        public const ROLE_PAID_USER = 'paid-user';
        public const ROLE_USER = 'user';
        public const ROLE_MEMBER = 'member';
    
        public function isAdmin(): bool
        {
            return $this->role === self::ROLE_ADMIN;
        }

        public function isPro(): bool
        {
            if ($this->isAdmin()) return true;
            if ($this->subscribed('default')) return true;
            
            if ($this->role === self::ROLE_PAID_USER) {
                return is_null($this->pro_expires_at) || $this->pro_expires_at->isFuture();
            }
            return false;
        }
    
        public function isPaid(): bool
        {
            return $this->role === self::ROLE_PAID_USER || $this->role === self::ROLE_ADMIN;
        }
    
        /**
         * The attributes that should be hidden for serialization.
         * 
         * @var list<string>
         */
        protected $hidden = [
            'password',
            'remember_token',
        ];
    
        /**
         * Get the attributes that should be cast.
         * 
         * @return array<string, string>
         */
        protected function casts(): array
        {
            return [
                'email_verified_at' => 'datetime',
                'password' => 'hashed',
                'is_blocked' => 'boolean',
                'pro_expires_at' => 'datetime',
                'personal_google_client_id' => 'encrypted',
                'personal_google_client_secret' => 'encrypted',
            ];
        }
    /**
     * Get the projects for the user.
     */
    public function projects(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Project::class);
    }

    public function assets(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Asset::class);
    }

    /**
     * Get the support tickets for the user.
     */
    public function supportTickets(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(SupportTicket::class);
    }

    /**
     * Get the posts for the user.
     */
    public function posts(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Post::class);
    }

    public function purchases(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Purchase::class);
    }

    /**
     * Get the teams the user belongs to.
     */
    public function teams(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(Team::class, 'team_user')
                    ->withPivot('role')
                    ->withTimestamps();
    }

    /**
     * Get the teams owned by the user.
     */
    public function ownedTeams(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Team::class);
    }

    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        static::created(function (User $user) {
            // Create personal team
            $user->ownedTeams()->create([
                'name' => explode(' ', $user->name, 2)[0] . "'s Team",
                'personal_team' => true,
            ]);
        });
    }
}
