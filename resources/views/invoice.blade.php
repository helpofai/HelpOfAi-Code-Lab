<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice - #{{ $purchase->id }}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; }
        @media print {
            .no-print { display: none !important; }
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
    </style>
</head>
<body class="bg-gray-50 p-8">
    <div class="max-w-3xl mx-auto bg-white p-12 border border-gray-200 rounded-lg shadow-sm">
        <div class="flex justify-between items-start mb-12">
            <div>
                <h1 class="text-4xl font-black text-gray-900 tracking-tighter">INVOICE</h1>
                <p class="text-sm font-bold text-gray-400 tracking-widest mt-1">#INV-{{ str_pad($purchase->id, 6, '0', STR_PAD_LEFT) }}</p>
            </div>
            <div class="text-right">
                <div class="text-2xl font-black text-emerald-500">HOA CodeLab</div>
                <p class="text-sm text-gray-500 mt-1">contact@hoacodelab.com</p>
            </div>
        </div>

        <div class="grid grid-cols-2 gap-12 mb-12">
            <div>
                <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Billed To</h3>
                <p class="font-bold text-gray-900">{{ $purchase->user->name }}</p>
                <p class="text-sm text-gray-600">{{ $purchase->user->email }}</p>
            </div>
            <div class="text-right">
                <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Details</h3>
                <p class="text-sm text-gray-600"><span class="font-bold">Date:</span> {{ $purchase->created_at->format('F j, Y') }}</p>
                <p class="text-sm text-gray-600"><span class="font-bold">Method:</span> <span class="capitalize">{{ $purchase->payment_method ?: 'Card' }}</span></p>
                <p class="text-sm text-gray-600"><span class="font-bold">Transaction ID:</span> <span class="font-mono text-xs">{{ $purchase->payment_id ?: 'N/A' }}</span></p>
            </div>
        </div>

        <table class="w-full mb-12 border-collapse">
            <thead>
                <tr class="border-b-2 border-gray-200">
                    <th class="py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Item Description</th>
                    <th class="py-3 text-right text-xs font-bold text-gray-400 uppercase tracking-widest">Amount</th>
                </tr>
            </thead>
            <tbody>
                <tr class="border-b border-gray-100">
                    <td class="py-6">
                        <p class="font-bold text-gray-900">{{ $purchase->project ? $purchase->project->title : 'Deleted Project' }}</p>
                        <p class="text-sm text-gray-500 mt-1">Software Source Code License</p>
                        @if($purchase->license)
                            <p class="text-xs font-mono text-gray-400 mt-2">License: {{ $purchase->license->license_key }} ({{ ucfirst($purchase->license->type) }})</p>
                            @php 
                                $meta = is_string($purchase->license->metadata) ? json_decode($purchase->license->metadata, true) : $purchase->license->metadata;
                            @endphp
                            @if($meta)
                                <div class="mt-2 text-[10px] text-gray-400 border-l-2 border-gray-100 pl-2">
                                    @if(isset($meta['project_name']) && $meta['project_name']) <p>Project: {{ $meta['project_name'] }}</p> @endif
                                    @if(isset($meta['use_case']) && $meta['use_case']) <p>Use Case: {{ $meta['use_case'] }}</p> @endif
                                    @if(isset($meta['phone']) && $meta['phone']) <p>Phone: {{ $meta['phone'] }}</p> @endif
                                </div>
                            @endif
                        @endif
                    </td>
                    <td class="py-6 text-right font-mono font-bold text-gray-900">
                        {{ strtoupper($purchase->currency) }} {{ number_format($purchase->amount, 2) }}
                    </td>
                </tr>
            </tbody>
        </table>

        <div class="flex justify-end">
            <div class="w-1/2">
                <div class="flex justify-between py-2 border-b border-gray-100">
                    <span class="text-sm font-bold text-gray-500">Subtotal</span>
                    <span class="font-mono font-bold">{{ strtoupper($purchase->currency) }} {{ number_format($purchase->amount, 2) }}</span>
                </div>
                <div class="flex justify-between py-2 border-b border-gray-100">
                    <span class="text-sm font-bold text-gray-500">Tax</span>
                    <span class="font-mono font-bold">{{ strtoupper($purchase->currency) }} 0.00</span>
                </div>
                <div class="flex justify-between py-4 mt-2">
                    <span class="text-lg font-black text-gray-900">Total</span>
                    <span class="text-2xl font-black text-emerald-500 font-mono">{{ strtoupper($purchase->currency) }} {{ number_format($purchase->amount, 2) }}</span>
                </div>
            </div>
        </div>
        
        <div class="mt-16 pt-8 border-t border-gray-200 text-center no-print">
            <button onclick="window.print()" class="px-6 py-3 bg-gray-900 text-white rounded-lg font-bold text-sm tracking-widest uppercase hover:bg-gray-800 transition-colors">
                Print / Save PDF
            </button>
        </div>
    </div>
</body>
</html>
