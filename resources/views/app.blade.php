<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>
        
        <!-- Base SEO Meta Tags -->
        <meta name="description" content="Discover, buy, and sell premium source code, templates, and digital assets.">
        <meta name="keywords" content="source code, templates, software, marketplace, programming, react, laravel">
        <meta property="og:type" content="website">
        <meta property="og:site_name" content="{{ config('app.name', 'Laravel') }}">
        <meta name="twitter:card" content="summary_large_image">
        
        <!-- Automated Canonical Tag -->
        <link rel="canonical" href="{{ url()->current() }}" />

        <link rel="icon" type="image/svg+xml" href="/favicon.svg">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
        
        {!! \App\Models\SiteSetting::get('adsense_header_code') !!}
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
