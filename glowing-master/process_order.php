<?php
header('Content-Type: application/json');

// استقبال البيانات من JavaScript
$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(['success' => false, 'message' => 'No data received']);
    exit;
}

// استخراج البيانات
$address  = htmlspecialchars($data['address']  ?? '');
$phone    = htmlspecialchars($data['phone']    ?? '');
$payment  = htmlspecialchars($data['paymentMethod'] ?? 'cash_on_delivery');
$items    = $data['items'] ?? [];

// Validation
if (empty($address) || empty($phone)) {
    echo json_encode(['success' => false, 'message' => 'Please fill all fields']);
    exit;
}

// توليد Order ID
$order_id = 'GLW-' . strtoupper(substr(uniqid(), -6));

// حفظ الطلب في flat file
$dir = __DIR__ . '/data/';
if (!is_dir($dir)) mkdir($dir, 0755, true);

$line = date('Y-m-d H:i:s') . ' | ' . $order_id . ' | ' . $phone . ' | ' . $address . ' | ' . $payment . ' | ' . json_encode($items) . PHP_EOL;
file_put_contents($dir . 'orders.txt', $line, FILE_APPEND | LOCK_EX);

// رد بالنجاح
echo json_encode([
    'success' => true,
    'id'      => $order_id,
    'message' => 'Order placed successfully'
]);
?>
