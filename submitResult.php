<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
session_start();
include "db.php";

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["error" => "User not logged in"]);
    exit();
}

$user_id = $_SESSION['user_id'];

// ... header and session code remains the same ...

$data = json_decode(file_get_contents("php://input"));

if (!$data || !isset($data->answers)) {
    echo json_encode(["error" => "No answers received"]);
    exit();
}

// Prepare statement once for performance
$stmt = $conn->prepare("INSERT INTO user_answers (user_id, question_id, is_correct) VALUES (?, ?, ?)");

foreach ($data->answers as $item) {
    // $item should contain { question_id: 101, is_correct: true }
    $correct = $item->is_correct ? 1 : 0;
    $stmt->bind_param("iii", $user_id, $item->question_id, $correct);
    $stmt->execute();
}

echo json_encode(["status" => "success", "message" => "Results recorded"]);
