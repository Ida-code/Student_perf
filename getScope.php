<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
session_start();
include "db.php";

$user_id = $_SESSION['user_id'];

$sql = "SELECT weak_area FROM results WHERE user_id='$user_id' ORDER BY id DESC LIMIT 1";
$result = mysqli_query($conn, $sql);
$row = mysqli_fetch_assoc($result);

$weak_area = $row['weak_area'];

$suggestion = "";
$roadmap = "";

if ($weak_area == "Aptitude") {
    $suggestion = "Practice logical reasoning daily.";
    $roadmap = "Solve 20 questions per day → Take mock tests → Analyze mistakes.";
} elseif ($weak_area == "Technical") {
    $suggestion = "Strengthen core programming skills.";
    $roadmap = "Revise basics → Practice coding → Build small projects.";
}

echo json_encode([
    "weak_area" => $weak_area,
    "suggestion" => $suggestion,
    "roadmap" => $roadmap
]);
