<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
session_start();
include "db.php";

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["error" => "User not logged in"]);
    exit();
}

$user_id = $_SESSION['user_id'];

// SQL to find distinct topics the user has already answered
$sql = "SELECT DISTINCT q.topic 
        FROM questions q 
        JOIN user_answers ua ON q.id = ua.question_id 
        WHERE ua.user_id = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$completed = [];
while ($row = $result->fetch_assoc()) {
    $completed[] = $row['topic'];
}

echo json_encode($completed);
