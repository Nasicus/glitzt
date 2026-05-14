<?php
declare(strict_types=1);

// Server-side wrapper around index.html. Picks the GIF we want the browser to
// show *before* JS even parses, then injects a <link rel="preload"> + a global
// var into <head>. Net effect: GIF download starts on HTML parse, parallel to
// the JS bundle, instead of after React boots and does a fetch+redirect round
// trip. Drops LCP from ~11s to ~2-3s on slow connections.

$webroot = __DIR__;
$litzesDir = $webroot . '/assets/litzes';

$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?? '/';
$segments = array_map('rawurldecode', explode('/', trim($path, '/')));

// /würg is the uploader — no need to pre-pick anything for it.
$isUploader = ($segments[0] ?? '') === 'würg';

$imageId = null;

// If the route already names a specific .gif (e.g. /🤦/<guid>.gif), use it.
foreach ($segments as $seg) {
    if (preg_match('/^[A-Za-z0-9._-]+\.gif$/', $seg)
        && is_file($litzesDir . '/' . $seg)) {
        $imageId = $seg;
        break;
    }
}

// Otherwise pick a random one — same logic as random-litz.php.
if ($imageId === null && !$isUploader) {
    $files = glob($litzesDir . '/*.gif');
    if ($files) {
        $imageId = basename($files[array_rand($files)]);
    }
}

$template = @file_get_contents($webroot . '/index.html');
if ($template === false) {
    http_response_code(500);
    exit('Template missing');
}

if ($imageId !== null) {
    $safeHref = '/assets/litzes/' . rawurlencode($imageId);
    $jsId = json_encode($imageId, JSON_UNESCAPED_UNICODE | JSON_HEX_TAG);
    $injection = "    <link rel=\"preload\" as=\"image\" href=\""
        . htmlspecialchars($safeHref, ENT_QUOTES, 'UTF-8')
        . "\" fetchpriority=\"high\">\n"
        . "    <script>window.__INITIAL_LITZ__=$jsId;</script>\n  ";
    $template = str_replace('</head>', $injection . '</head>', $template);
}

header('Content-Type: text/html; charset=utf-8');
// Content varies per request (random pick) — never cache.
header('Cache-Control: no-store');
echo $template;
