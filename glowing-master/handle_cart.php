<?php
session_start();
header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);
if ($data) {
    if (!isset($_SESSION['cart'])) { $_SESSION['cart'] = []; }
    $_SESSION['cart'][] = $data; // حفظ المنتج في السيرفر
    echo json_encode(["success" => true]);
}
?>