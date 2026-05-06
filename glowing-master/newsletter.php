<?php
session_start();

function set_flash($type, $message) {
    $_SESSION['flash'] = ['type' => $type, 'message' => $message];
}

function clean($input) {
    return htmlspecialchars(strip_tags(trim($input)));
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: index.html');
    exit;
}

$email    = clean($_POST['email_address'] ?? '');
$redirect = 'index.html';

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    header('Location: ' . $redirect . '?msg=invalid');
    exit;
}

$dir = __DIR__ . '/data/';
if (!is_dir($dir)) mkdir($dir, 0755, true);

$subsFile = $dir . 'subscribers.txt';
if (file_exists($subsFile)) {
    $lines = file($subsFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (trim($line) === $email) {
            header('Location: ' . $redirect . '?msg=already');
            exit;
        }
    }
}

file_put_contents($subsFile, date('Y-m-d H:i:s') . ' | ' . $email . PHP_EOL, FILE_APPEND | LOCK_EX);

header('Location: ' . $redirect . '?msg=success');
exit;
?>
