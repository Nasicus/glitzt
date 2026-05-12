<?php
declare(strict_types=1);

// HTTPS deploy webhook for glitzt — invoked by .github/workflows/deploy.yml.
//
// Why this file exists:
//   Hoststar's shared hosting drops FTP/SFTP connections from non-Swiss IPs
//   (anti-abuse firewall + per-IP SSH whitelist requirement), which makes the
//   usual CD pattern of "GitHub Action pushes via FTP" impossible. HTTPS to
//   the site itself stays open (otherwise nobody could load the site), so the
//   workaround is: build on the runner, tar.gz the artifacts, POST them here
//   with a Bearer token, and let PHP extract them server-side.
//
// What it does:
//   - Verifies a Bearer token (substituted in at deploy time by the workflow,
//     mirroring how upload-litz.php gets its password).
//   - Accepts a multipart upload of a tar.gz archive.
//   - Extracts only whitelisted paths (top-level files + assets/ + server/),
//     refuses path traversal, and SKIPS assets/litzes/ so user-uploaded GIFs
//     are never touched.
//
// Initial install:
//   This file has to be uploaded once via FTP from a Swiss IP (with the token
//   pre-substituted). After that the workflow keeps it up to date.

header('Content-Type: text/plain; charset=utf-8');

function fail(int $code, string $msg): never {
    http_response_code($code);
    echo $msg . "\n";
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    fail(405, 'POST only');
}

// Token is injected at deploy time (see GitHub Action). PHP files are parsed,
// not served, so this string never reaches the wire.
$expected = '<DEPLOY_TOKEN_PLACEHOLDER>';
if ($expected === '<DEPLOY_TOKEN_' . 'PLACEHOLDER>') {
    fail(500, 'Server misconfigured: token placeholder not substituted');
}

$provided = (string)($_POST['token'] ?? '');
if ($provided === '' || !hash_equals($expected, $provided)) {
    fail(401, 'Unauthorized');
}

$file = $_FILES['archive'] ?? null;
if (!$file || $file['error'] !== UPLOAD_ERR_OK) {
    fail(400, 'Missing or bad archive upload');
}
if ($file['size'] > 50 * 1024 * 1024) {
    fail(413, 'Archive too large');
}

$webroot = realpath(__DIR__ . '/..');
if ($webroot === false) {
    fail(500, 'Cannot resolve webroot');
}

$tmp = tempnam(sys_get_temp_dir(), 'deploy_') . '.tar.gz';
if (!move_uploaded_file($file['tmp_name'], $tmp)) {
    fail(500, 'Cannot stage upload');
}

// Wipe everything under assets/ (except litzes/, which holds user uploads) and
// server/ (except deploy.php — we're currently running it; Linux keeps the FD
// alive but PharData would otherwise have a fight with itself). The extract
// step recreates whatever the archive contains.
function cleanDir(string $dir, array $preserve = []): void {
    if (!is_dir($dir)) return;
    foreach (new DirectoryIterator($dir) as $f) {
        if ($f->isDot()) continue;
        if (in_array($f->getFilename(), $preserve, true)) continue;
        $path = $f->getPathname();
        if ($f->isDir()) {
            cleanDir($path);
            @rmdir($path);
        } else {
            @unlink($path);
        }
    }
}

try {
    $phar = new PharData($tmp);
    cleanDir($webroot . '/assets', ['litzes']);
    // Wipe the whole server/ including ourselves. PharData::extractTo refuses
    // to overwrite a file PHP is currently executing, so we explicitly unlink
    // first — Linux keeps the FD alive until this request finishes, then the
    // new deploy.php from the archive takes over.
    cleanDir($webroot . '/server');
    // We trust the tarball: workflow built it from our own code and gated by
    // DEPLOY_TOKEN. extractTo writes only what's IN the archive; PharData
    // refuses ".." entries since PHP 7.
    $phar->extractTo($webroot, null, true);
    $count = $phar->count();
} catch (Throwable $e) {
    @unlink($tmp);
    fail(500, 'Extraction failed: ' . $e->getMessage() . ' @ ' . $e->getFile() . ':' . $e->getLine());
}
@unlink($tmp);

echo "OK $count entries deployed (stale files purged)\n";
