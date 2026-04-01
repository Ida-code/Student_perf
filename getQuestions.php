<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
session_start();
include "db.php";

$topic = isset($_GET['topic']) ? $_GET['topic'] : '';

// DEBUG: If role isn't in session, default to 'college' so it doesn't return []
$role = isset($_SESSION['role']) ? $_SESSION['role'] : 'college';

if (empty($topic)) {
    echo json_encode(["error" => "No topic provided"]);
    exit();
}

// Using BINARY or TRIM can help if there are hidden spaces in your DB
$sql = "SELECT id, question, optionA, optionB, optionC, optionD, correct_answer 
        FROM questions 
        WHERE TRIM(topic) = ? AND TRIM(role) = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $topic, $role);
$stmt->execute();
$result = $stmt->get_result();

$questions = [];
while ($row = $result->fetch_assoc()) {
    $questions[] = $row;
}

// If it's STILL empty, let's return a fake question so you can see it working
if (count($questions) === 0) {
    echo json_encode([[
        "id" => 0,
        "question" => "Debug Mode: No questions found for Topic: $topic and Role: $role. Check your SQL table!",
        "optionA" => "Checking DB...",
        "optionB" => "Checking SQL...",
        "optionC" => "Fixing Role...",
        "optionD" => "Fixed!",
        "correct_answer" => "Fixed!"
    ]]);
} else {
    echo json_encode($questions);
}
