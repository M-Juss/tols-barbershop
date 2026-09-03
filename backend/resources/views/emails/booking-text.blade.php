TOL Barbershop

{{ $heading }}

Hi {{ $customerName }},

{{ $intro }}

@isset($highlight)
{{ $highlight }}
@endisset

@foreach(($details ?? []) as $label => $value)
{{ $label }}: {{ $value }}
@endforeach

@if(!empty($actionUrl) && !empty($actionText))
{{ $actionText }}: {{ $actionUrl }}
@endif

{{ $footer ?? '' }}
