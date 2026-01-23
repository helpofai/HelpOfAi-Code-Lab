<?php

namespace App\Policies;

use App\Models\Team;
use App\Models\User;

class TeamPolicy
{
    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Team $team): bool
    {
        return $team->user_id === $user->id || $team->users->contains($user);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Team $team): bool
    {
        return $team->user_id === $user->id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Team $team): bool
    {
        return $team->user_id === $user->id;
    }

    /**
     * Determine whether the user can add members.
     */
    public function addMember(User $user, Team $team): bool
    {
        return $team->user_id === $user->id;
    }

    /**
     * Determine whether the user can remove members.
     */
    public function removeMember(User $user, Team $team): bool
    {
        return $team->user_id === $user->id;
    }
}