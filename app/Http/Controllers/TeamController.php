<?php

namespace App\Http\Controllers;

use App\Models\Team;
use App\Models\User;
use App\Models\TeamInvitation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Mail; // Will use for mock email or real if configured

class TeamController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = auth()->user();
        
        return Inertia::render('Teams/Index', [
            'ownedTeams' => $user->ownedTeams()->withCount('users')->get(),
            'memberTeams' => $user->teams()->with('owner')->get(),
            'invitations' => TeamInvitation::where('email', $user->email)->with('team.owner')->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $request->user()->ownedTeams()->create([
            'name' => $validated['name'],
            'personal_team' => false,
        ]);

        return back()->with('success', 'Team created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Team $team)
    {
        $this->authorize('view', $team);

        return Inertia::render('Teams/Show', [
            'team' => $team->load(['owner', 'users', 'invitations']),
            'isOwner' => $team->user_id === auth()->id(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Team $team)
    {
        $this->authorize('update', $team);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $team->update($validated);

        return back()->with('success', 'Team updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Team $team)
    {
        $this->authorize('delete', $team);

        if ($team->personal_team) {
            return back()->with('error', 'Cannot delete personal team.');
        }

        $team->delete();

        return redirect()->route('teams.index')->with('success', 'Team deleted successfully.');
    }

    /**
     * Add a member to the team (Send Invitation).
     */
    public function addMember(Request $request, Team $team)
    {
        $this->authorize('addMember', $team);

        $validated = $request->validate([
            'email' => 'required|email|exists:users,email',
            'role' => 'required|in:admin,editor,member',
        ]);

        $user = User::where('email', $validated['email'])->first();

        if ($team->users->contains($user) || $team->user_id === $user->id) {
            return back()->with('error', 'User is already in the team.');
        }

        if ($team->invitations()->where('email', $validated['email'])->exists()) {
            return back()->with('error', 'Invitation already sent.');
        }

        $invitation = $team->invitations()->create([
            'email' => $validated['email'],
            'role' => $validated['role'],
            'token' => Str::random(32),
        ]);

        // In a real app, send email here.
        // Mail::to($validated['email'])->send(new TeamInvitationMail($invitation));

        return back()->with('success', 'Invitation sent.');
    }

    /**
     * Remove a member from the team.
     */
    public function removeMember(Request $request, Team $team, User $user)
    {
        $this->authorize('removeMember', $team);

        if ($team->user_id === $user->id) {
            return back()->with('error', 'Cannot remove team owner.');
        }

        $team->users()->detach($user->id);

        return back()->with('success', 'User removed from team.');
    }

    /**
     * Cancel an invitation.
     */
    public function cancelInvitation(Request $request, Team $team, TeamInvitation $invitation)
    {
        $this->authorize('addMember', $team);

        $invitation->delete();

        return back()->with('success', 'Invitation canceled.');
    }

    /**
     * Accept an invitation.
     */
    public function acceptInvitation(Request $request, TeamInvitation $invitation)
    {
        if ($invitation->email !== $request->user()->email) {
            abort(403);
        }

        $invitation->team->users()->attach($request->user()->id, ['role' => $invitation->role]);
        $invitation->delete();

        return redirect()->route('teams.show', $invitation->team_id)->with('success', 'Joined team successfully.');
    }

    /**
     * Reject an invitation.
     */
    public function rejectInvitation(Request $request, TeamInvitation $invitation)
    {
        if ($invitation->email !== $request->user()->email) {
            abort(403);
        }

        $invitation->delete();

        return back()->with('success', 'Invitation rejected.');
    }
}