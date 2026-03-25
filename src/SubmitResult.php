<?php
// SubmitResult.php
session_start();

header('Content-Type: application/json');
error_reporting(0); // disable warnings
ini_set('display_errors', 0);

include "db.php"; // Make sure this defines $conn

// Get input
$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['answers'], $input['topic'], $input['user_id'])) {
    echo json_encode(['success' => false, 'error' => 'Missing required fields']);
    exit();
}

$user_id = intval($input['user_id']);
$topic = $input['topic'];
$answers = $input['answers'];
$score = $input['score'] ?? null;
$total = $input['total'] ?? null;
$percentage = $input['percentage'] ?? null;

if ($percentage === null && $score !== null && $total !== null) {
    $percentage = ($score / $total) * 100;
}

// Check DB
if (!$conn || $conn->connect_error) {
    echo json_encode(['success' => false, 'error' => 'Database connection failed']);
    exit();
}

// Insert or update topic result
$check_sql = "SELECT id FROM results WHERE user_id=? AND topic=?";
$stmt = $conn->prepare($check_sql);
$stmt->bind_param("is", $user_id, $topic);
$stmt->execute();
$res = $stmt->get_result();

if ($res->num_rows > 0) {
    $update_sql = "UPDATE results SET percentage=?, last_attempt=NOW() WHERE user_id=? AND topic=?";
    $stmt = $conn->prepare($update_sql);
    $stmt->bind_param("dis", $percentage, $user_id, $topic);
} else {
    $insert_sql = "INSERT INTO results (user_id, topic, percentage, attempt_date) VALUES (?, ?, ?, NOW())";
    $stmt = $conn->prepare($insert_sql);
    $stmt->bind_param("isd", $user_id, $topic, $percentage);
}

if (!$stmt->execute()) {
    echo json_encode(['success' => false, 'error' => 'Failed to save results']);
    exit();
}

// Save individual answers
$answer_sql = "INSERT INTO user_answers (user_id, question_id, is_correct, selected_answer, attempt_date) VALUES (?, ?, ?, ?, NOW())";
$answer_stmt = $conn->prepare($answer_sql);

foreach ($answers as $ans) {
    $question_id = $ans['question_id'];
    $is_correct = $ans['is_correct'] ? 1 : 0;
    $selected_answer = $ans['selected_answer'] ?? null;

    $answer_stmt->bind_param("iiis", $user_id, $question_id, $is_correct, $selected_answer);
    $answer_stmt->execute();
}

echo json_encode([
    'success' => true,
    'message' => 'Results saved successfully',
    'score' => $score,
    'total' => $total,
    'percentage' => $percentage
]);

$stmt->close();
$answer_stmt->close();
$conn->close();
exit();