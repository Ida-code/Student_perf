<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
session_start();
include "db.php";

if (!isset($_SESSION['user_id']) || !isset($_SESSION['role'])) {
    echo json_encode(["error" => "Unauthorized"]);
    exit();
}

$user_id = $_SESSION['user_id'];
$role = $_SESSION['role']; // Use the role from session

// Query to get user score vs total possible score per topic FOR THEIR ROLE
$sql = "SELECT 
            q.topic,
            -- Sum of weights for correctly answered questions
            SUM(CASE WHEN ua.is_correct = 1 THEN 
                (CASE WHEN q.difficulty = 'Easy' THEN 1 
                      WHEN q.difficulty = 'Medium' THEN 2 
                      WHEN q.difficulty = 'Hard' THEN 3 END) 
                ELSE 0 END) AS user_score,
            -- Sum of total possible weights for ALL questions in that topic for THIS ROLE
            (SELECT SUM(CASE WHEN q2.difficulty = 'Easy' THEN 1 
                             WHEN q2.difficulty = 'Medium' THEN 2 
                             WHEN q2.difficulty = 'Hard' THEN 3 END)
             FROM questions q2 
             WHERE q2.topic = q.topic AND q2.role = ?) AS total_possible
        FROM questions q
        LEFT JOIN user_answers ua ON q.id = ua.question_id AND ua.user_id = ?
        WHERE q.role = ?
        GROUP BY q.topic";

$stmt = $conn->prepare($sql);
$stmt->bind_param("sis", $role, $user_id, $role);
$stmt->execute();
$result = $stmt->get_result();

$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = [
        "topic" => $row['topic'],
        "percentage" => $row['total_possible'] > 0 ? ($row['user_score'] / $row['total_possible']) * 100 : 0
    ];
}

echo json_encode($data);
