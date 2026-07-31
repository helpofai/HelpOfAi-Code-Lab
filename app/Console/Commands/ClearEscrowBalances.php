<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class ClearEscrowBalances extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'escrow:clear';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clears mature escrow balances and moves them to available balance';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $transactions = \App\Models\WalletTransaction::where('status', 'escrow')
                            ->where('clears_at', '<=', now())
                            ->get();

        $count = 0;
        foreach ($transactions as $txn) {
            \Illuminate\Support\Facades\DB::transaction(function () use ($txn, &$count) {
                $user = \App\Models\User::where('id', $txn->user_id)->lockForUpdate()->first();
                if ($user) {
                    $user->escrow_balance -= $txn->amount;
                    $user->available_balance += $txn->amount;
                    $user->save();

                    $txn->status = 'cleared';
                    $txn->save();
                    $count++;
                }
            });
        }

        $this->info("Cleared $count escrow transactions.");
    }
}
