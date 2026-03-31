<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");

error_reporting(E_ALL);
ini_set('display_errors', 1);

include "db.php";

// Read input
$raw = file_get_contents("php://input");
$input = json_decode($raw, true);

// Validate
if (!$input || !isset($input['user_id']) || !isset($input['topic']) || !isset($input['answers'])) {
    echo json_encode([
        "success" => false,
        "error" => "Invalid input",
        "received" => $input
    ]);
    exit();
}

$user_id = intval($input['user_id']);
$answers = $input['answers'];

// Prepare insert
$stmt = $conn->prepare(
    "INSERT INTO user_answers (user_id, question_id, is_correct, answered_at)
     VALUES (?, ?, ?, NOW())"
);

if (!$stmt) {
    echo json_encode(["success"=>false,"error"=>$conn->error]);
    exit();
}

$correct = 0;

foreach ($answers as $ans) {
    $qid = $ans['question_id'];
    $is_correct = $ans['is_correct'] ? 1 : 0;

    if ($is_correct) $correct++;

    $stmt->bind_param("iii", $user_id, $qid, $is_correct);

    if (!$stmt->execute()) {
        echo json_encode(["success"=>false,"error"=>$stmt->error]);
        exit();
    }
}

$total = count($answers);
$percentage = ($total > 0) ? ($correct / $total) * 100 : 0;

// Update scores
$check = $conn->prepare("SELECT user_id FROM user_scores WHERE user_id=?");
$check->bind_param("i", $user_id);
$check->execute();
$res = $check->get_result();

if ($res->num_rows > 0) {
    $update = $conn->prepare(
        "UPDATE user_scores 
         SET total_points = total_points + ?, overall_accuracy = ? 
         WHERE user_id=?"
    );
    $update->bind_param("idi", $correct, $percentage, $user_id);
    $update->execute();
} else {
    $insert = $conn->prepare(
        "INSERT INTO user_scores (user_id, total_points, overall_accuracy)
         VALUES (?, ?, ?)"
    );
    $insert->bind_param("iid", $user_id, $correct, $percentage);
    $insert->execute();
}

echo json_encode([
    "success" => true,
    "score" => $correct,
    "total" => $total,
    "percentage" => $percentage
]);

$conn->close();
exit();
?>