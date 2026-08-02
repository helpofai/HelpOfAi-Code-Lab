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

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SupportTicket;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SupportController extends Controller
{
    public function index()
    {
        $tickets = SupportTicket::with(['user:id,name,email', 'messages' => function($q) {
                $q->latest()->limit(1);
            }])
            ->orderBy('updated_at', 'desc')
            ->get();

        return Inertia::render('Admin/Support', [
            'tickets' => $tickets
        ]);
    }

    public function show(SupportTicket $ticket)
    {
        return response()->json($ticket->load(['messages.user', 'user']));
    }

    public function reply(Request $request, SupportTicket $ticket)
    {
        $validated = $request->validate([
            'message' => 'required|string',
            'attachment' => 'nullable|image|max:2048'
        ]);

        $attachmentPath = null;
        if ($request->hasFile('attachment')) {
            $attachmentPath = $request->file('attachment')->store('support-attachments', 'public');
        }

        $message = $ticket->messages()->create([
            'user_id' => $request->user()->id,
            'message' => $validated['message'],
            'attachment_path' => $attachmentPath
        ]);

        $ticket->touch();

        return response()->json($message->load('user'));
    }

    public function updateStatus(Request $request, SupportTicket $ticket)
    {
        $validated = $request->validate([
            'status' => 'required|in:open,in_progress,closed'
        ]);

        $ticket->update($validated);

        return response()->json(['message' => 'Status updated']);
    }

    public function destroy(SupportTicket $ticket)
    {
        $ticket->delete();
        return back()->with('success', 'Ticket deleted.');
    }
}
