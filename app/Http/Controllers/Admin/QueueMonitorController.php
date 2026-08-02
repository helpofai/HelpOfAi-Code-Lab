<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Support\Facades\Artisan;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class QueueMonitorController extends Controller
{
    public function index()
    {
        // Get pending jobs
        $pendingJobs = DB::table('jobs')->orderBy('id', 'desc')->get()->map(function ($job) {
            $payload = json_decode($job->payload, true);
            return [
                'id' => $job->id,
                'queue' => $job->queue,
                'name' => $payload['displayName'] ?? 'Unknown',
                'attempts' => $job->attempts,
                'reserved_at' => $job->reserved_at ? date('Y-m-d H:i:s', $job->reserved_at) : null,
                'created_at' => date('Y-m-d H:i:s', $job->created_at),
                'status' => $job->reserved_at ? 'processing' : 'pending'
            ];
        });

        // Get failed jobs
        $failedJobs = DB::table('failed_jobs')->orderBy('id', 'desc')->get()->map(function ($job) {
            $payload = json_decode($job->payload, true);
            return [
                'id' => $job->id,
                'uuid' => $job->uuid,
                'queue' => $job->queue,
                'name' => $payload['displayName'] ?? 'Unknown',
                'exception' => mb_substr($job->exception, 0, 150) . '...',
                'failed_at' => $job->failed_at,
                'status' => 'failed'
            ];
        });

        return Inertia::render('Admin/QueueMonitor', [
            'pendingJobs' => $pendingJobs,
            'failedJobs' => $failedJobs,
            'queueStats' => [
                'pending' => $pendingJobs->where('status', 'pending')->count(),
                'processing' => $pendingJobs->where('status', 'processing')->count(),
                'failed' => $failedJobs->count()
            ]
        ]);
    }

    public function retry($id)
    {
        $job = DB::table('failed_jobs')->where('id', $id)->first();
        if ($job) {
            // Artisan::call('queue:retry', ['id' => $job->uuid]);
            \Illuminate\Support\Facades\Artisan::call('queue:retry ' . $job->uuid);
        }
        return back()->with('success', 'Job added back to the queue.');
    }

    public function deleteFailed($id)
    {
        DB::table('failed_jobs')->where('id', $id)->delete();
        return back()->with('success', 'Failed job record deleted.');
    }

    public function clearPending()
    {
        DB::table('jobs')->truncate();
        return back()->with('success', 'All pending jobs cleared.');
    }

    public function processQueue()
    {
        // Run queue worker but stop when empty to prevent it from hanging the web request
        Artisan::call('queue:work', [
            '--stop-when-empty' => true,
            '--force' => true,
            '--max-time' => 50, // Prevent timing out the web server (usually max 60s)
        ]);

        return back()->with('success', 'Queue processed successfully. All jobs executed.');
    }
}
