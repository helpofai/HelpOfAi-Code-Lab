<?php

namespace App\Services;

use App\Models\User;

class VendorLevelService
{
    /**
     * Evaluate and upgrade a user's level based on their metrics.
     * Rule: We NEVER auto-demote users to prevent extreme frustration.
     */
    public function evaluate(User $user)
    {
        // 1. Skip if admin has manually locked their level
        if ($user->manual_level) {
            return;
        }

        // 2. Aggregate Metrics
        $totalProjects = $user->projects()->count();
        $totalViews = $user->projects()->sum('views');
        
        $newLevel = 1;

        // 3. The Progression Logic
        if ($totalProjects >= 3 && $totalViews >= 500) {
            $newLevel = 2;
        }
        
        if ($totalProjects >= 10 && $totalViews >= 5000) {
            $newLevel = 3;
        }

        // 4. The Verification Gate for Level 4
        if ($newLevel >= 3 && $user->identity_status === 'verified') {
            $newLevel = 4;
        }

        // 5. The Financial Gate for Levels 5-7 (Only applies if they are already Level 4)
        if ($newLevel >= 4) {
            // Calculate total gross sales (Assuming 'sale' or 'credit' type in wallet transactions)
            $totalSales = $user->walletTransactions()
                               ->whereIn('type', ['sale', 'credit'])
                               ->where('status', 'cleared')
                               ->sum('amount');
            
            // Level 5: Rising Star ($1,000 in sales)
            if ($totalSales >= 1000) {
                $newLevel = 5;
            }

            // Level 6: Elite Vendor ($10,000 in sales)
            if ($totalSales >= 10000) {
                $newLevel = 6;
            }

            // Level 7: Legendary Vendor ($50,000 in sales)
            if ($totalSales >= 50000) {
                $newLevel = 7;
            }
        }

        // 6. Apply Upgrade (Only upgrade, never auto-downgrade)
        if ($newLevel > $user->level) {
            $user->update(['level' => $newLevel]);
        }
    }
}
