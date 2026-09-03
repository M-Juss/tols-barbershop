<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ $heading }}</title>
</head>
<body style="background-color:#143c62;margin:0;padding:0;width:100%;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#143c62">
    <tr><td align="center" style="padding:40px 16px;">
        <table role="presentation" width="448" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="background:#fff;border:1px solid #d9dfe5;border-radius:8px;max-width:448px;overflow:hidden;width:100%;">
            <tr><td style="font-family:Poppins,Arial,sans-serif;padding:32px 40px;">
                <p style="color:#143c62;font-size:20px;font-weight:700;margin:0 0 20px;text-align:center;">TOL Barbershop</p>
                <h1 style="color:#0f171f;font-size:24px;font-weight:600;line-height:1.3;margin:0 0 20px;text-align:center;">{{ $heading }}</h1>
                <p style="color:#0f171f;font-size:15px;line-height:1.6;margin:0 0 12px;">Hi {{ $customerName }},</p>
                <p style="color:#5b646f;font-size:15px;line-height:1.6;margin:0 0 20px;">{{ $intro }}</p>
                @isset($highlight)
                    <p style="background:#f3f6f8;border-radius:8px;color:#143c62;font-size:26px;font-weight:700;letter-spacing:6px;margin:0 0 20px;padding:16px;text-align:center;">{{ $highlight }}</p>
                @endisset
                @if(!empty($details))
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:8px;margin-bottom:20px;padding:14px;">
                        @foreach($details as $label => $value)
                            <tr><td style="color:#5b646f;font-size:13px;padding:5px;">{{ $label }}</td><td align="right" style="color:#0f171f;font-size:13px;font-weight:600;padding:5px;">{{ $value }}</td></tr>
                        @endforeach
                    </table>
                @endif
                @if(!empty($actionUrl) && !empty($actionText))
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;"><tr><td align="center" bgcolor="#de3b3d" style="border-radius:6px;"><a href="{{ $actionUrl }}" style="color:#fff;display:block;font-size:15px;font-weight:600;padding:13px 20px;text-decoration:none;">{{ $actionText }}</a></td></tr></table>
                @endif
                @isset($footer)
                    <p style="color:#5b646f;font-size:13px;line-height:1.6;margin:0;text-align:center;">{{ $footer }}</p>
                @endisset
                <div style="border-top:1px solid #d9dfe5;margin-top:24px;padding-top:18px;text-align:center;">
                    <p style="color:#7a838d;font-size:11px;line-height:1.6;margin:0;">&copy; {{ date('Y') }} TOL Barbershop. All rights reserved.</p>
                </div>
            </td></tr>
        </table>
    </td></tr>
</table>
</body>
</html>
