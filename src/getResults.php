<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

// ❌ DO NOT USE SESSION
// session_start();  ← REMOVE THIS IF EXISTS

include "db.php";

// ✅ GET user_id FROM URL (NOT SESSION)
if (!isset($_GET['user_id']) || empty($_GET['user_id'])) {
    echo json_encode([
        "success" => false,
        "error" => "User ID missing"
    ]);
    exit();
}

$user_id = intval($_GET['user_id']);

// SQL
$sql = "
SELECT 
    q.topic,
    COUNT(*) as total,
    SUM(CASE WHEN ua.is_correct=1 THEN 1 ELSE 0 END) as correct
FROM user_answers ua
JOIN questions q ON ua.question_id = q.id
WHERE ua.user_id = ?
GROUP BY q.topic
";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode([
        "success" => false,
        "error" => $conn->error
    ]);
    exit();
}

$stmt->bind_param("i", $user_id);
$stmt->execute();

$result = $stmt->get_result();

$data = [];

while ($row = $result->fetch_assoc()) {
    $total = $row['total'];
    $correct = $row['correct'];

    $percentage = ($total > 0) ? ($correct / $total) * 100 : 0;

    $data[] = [
        "topic" => $row['topic'],
        "percentage" => $percentage
    ];
}

echo json_encode([
    "success" => true,
    "data" => $data
]);

$stmt->close();
$conn->close();
?>