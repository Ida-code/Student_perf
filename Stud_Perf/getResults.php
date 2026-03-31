<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Content-Type: application/json");

error_reporting(E_ALL);
ini_set('display_errors', 1);

include "db.php";

if (!isset($_GET['user_id']) || !isset($_GET['role'])) {
    echo json_encode([
        "success" => false,
        "error" => "Missing user_id or role"
    ]);
    exit();
}

$user_id = intval($_GET['user_id']);
$role = strtolower(trim($_GET['role']));

$sql = "SELECT 
    q.topic,
    SUM(CASE WHEN ua.is_correct = 1 THEN 
        CASE 
            WHEN q.difficulty = 'Easy' THEN 1 
            WHEN q.difficulty = 'Medium' THEN 2 
            WHEN q.difficulty = 'Hard' THEN 3 
        END
    ELSE 0 END) AS user_score,

    SUM(CASE 
        WHEN q.difficulty = 'Easy' THEN 1 
        WHEN q.difficulty = 'Medium' THEN 2 
        WHEN q.difficulty = 'Hard' THEN 3 
    END) AS total_possible

FROM questions q
LEFT JOIN user_answers ua 
    ON q.id = ua.question_id AND ua.user_id = ?
WHERE LOWER(q.role) = ?
GROUP BY q.topic";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode([
        "success" => false,
        "error" => $conn->error
    ]);
    exit();
}

$stmt->bind_param("is", $user_id, $role);
$stmt->execute();

$result = $stmt->get_result();

$data = [];

while ($row = $result->fetch_assoc()) {
    $percentage = ($row['total_possible'] > 0)
        ? ($row['user_score'] / $row['total_possible']) * 100
        : 0;

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