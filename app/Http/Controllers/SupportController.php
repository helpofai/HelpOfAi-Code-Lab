<?php

namespace App\Http\Controllers;

use App\Models\SupportTicket;
use App\Models\SupportMessage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SupportController extends Controller
{
    public function index(Request $request)
    {
        $tickets = $request->user()->supportTickets()
            ->with(['messages' => function($query) {
                $query->latest()->limit(1); // Get last message preview
            }])
            ->orderBy('updated_at', 'desc') // Sort by recent activity
            ->get();

        return Inertia::render('Support', [
            'tickets' => $tickets
        ]);
    }

    public function show(Request $request, SupportTicket $ticket)
    {
        if ($ticket->user_id !== $request->user()->id) {
            abort(403);
        }

        return response()->json($ticket->load(['messages.user']));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
            'priority' => 'required|in:low,medium,high',
            'attachment' => 'nullable|image|max:2048'
        ]);

        $ticket = $request->user()->supportTickets()->create([
            'subject' => $validated['subject'],
            'priority' => $validated['priority'],
            'status' => 'open'
        ]);

        $attachmentPath = null;
        if ($request->hasFile('attachment')) {
            $attachmentPath = $request->file('attachment')->store('support-attachments', 'public');
        }

        // Create initial message
        $ticket->messages()->create([
            'user_id' => $request->user()->id,
            'message' => $validated['message'],
            'attachment_path' => $attachmentPath
        ]);

        return back()->with('success', 'Ticket initialized.');
    }

    public function reply(Request $request, SupportTicket $ticket)
    {
        if ($ticket->user_id !== $request->user()->id) {
            abort(403);
        }

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

        $ticket->touch(); // Update updated_at to bump thread

        return response()->json($message->load('user'));
    }
}
