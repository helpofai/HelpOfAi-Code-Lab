<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Invoice #{{ $purchase->payment_id ?? $purchase->id }}</title>
    <style>
        body { font-family: 'Helvetica', 'Arial', sans-serif; color: #333; margin: 0; padding: 20px; }
        .invoice-box { max-width: 800px; margin: auto; padding: 30px; border: 1px solid #eee; box-shadow: 0 0 10px rgba(0, 0, 0, 0.15); font-size: 16px; line-height: 24px; color: #555; }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #ddd; padding-bottom: 20px; margin-bottom: 20px; }
        .header .title { font-size: 28px; font-weight: bold; color: #000; }
        .header .invoice-details { text-align: right; }
        .details-grid { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        .details-grid td { width: 50%; padding: 5px; vertical-align: top; }
        .details-grid strong { color: #000; }
        table.items { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        table.items th, table.items td { padding: 10px; border-bottom: 1px solid #ddd; text-align: left; }
        table.items th { background: #f8f8f8; font-weight: bold; color: #000; }
        table.items .right { text-align: right; }
        .total-row { font-weight: bold; font-size: 18px; color: #000; }
        .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #888; border-top: 1px solid #eee; padding-top: 20px; }
        .license-box { background: #fdfdfd; border: 1px dashed #ccc; padding: 15px; margin-top: 30px; font-family: monospace; font-size: 14px; text-align: center; }
    </style>
</head>
<body>
    <div class="invoice-box">
        <table style="width: 100%;">
            <tr>
                <td>
                    <div class="title">INVOICE</div>
                    <div style="font-size: 12px; color: #888;">System-Generated Receipt</div>
                </td>
                <td style="text-align: right;">
                    <strong>Invoice #:</strong> {{ $purchase->payment_id ?? $purchase->id }}<br>
                    <strong>Date:</strong> {{ $purchase->created_at->format('F d, Y H:i:s') }}<br>
                    <strong>Payment Method:</strong> {{ strtoupper($purchase->payment_method) }}
                </td>
            </tr>
        </table>

        <hr style="border: 0; border-top: 2px solid #eee; margin: 30px 0;">

        <table class="details-grid">
            <tr>
                <td>
                    <strong>Billed To:</strong><br>
                    {{ $buyer->name }}<br>
                    {{ $buyer->email }}
                </td>
                <td>
                    <strong>Vendor / Author:</strong><br>
                    {{ $project->user->name }}<br>
                    {{ $project->user->email }}
                </td>
            </tr>
        </table>

        <table class="items">
            <thead>
                <tr>
                    <th>Item Description</th>
                    <th class="right">Price</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <strong>{{ $project->title }}</strong><br>
                        <small>Lifetime access and source code license.</small>
                    </td>
                    <td class="right">${{ number_format($purchase->amount, 2) }} {{ strtoupper($purchase->currency) }}</td>
                </tr>
                <tr>
                    <td style="text-align: right; padding-top: 20px;">Subtotal:</td>
                    <td class="right" style="padding-top: 20px;">${{ number_format($purchase->amount, 2) }}</td>
                </tr>
                <tr class="total-row">
                    <td style="text-align: right; border:none;">Total Paid:</td>
                    <td class="right" style="border:none;">${{ number_format($purchase->amount, 2) }}</td>
                </tr>
            </tbody>
        </table>

        <div class="license-box">
            <strong>OFFICIAL LICENSE KEY</strong><br><br>
            {{ $license->license_key ?? 'GENERATED-POST-TRANSACTION' }}
        </div>

        <div class="footer">
            Thank you for your business.<br>
            This is a computer-generated document. No signature is required.
        </div>
    </div>
</body>
</html>
