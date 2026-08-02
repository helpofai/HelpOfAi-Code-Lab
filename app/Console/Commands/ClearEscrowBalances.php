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
