<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

error_reporting(E_ALL);
ini_set('display_errors', 1);

$host = "mysql";
$user = "root";
$port = 3306;    
$pass = "Risenme@20";
$db   = "student_perf";

$conn = new mysqli($host, $user, $pass, $db,$port);

// Only output JSON when this file is accessed directly, not when included
if (basename(__FILE__) === basename($_SERVER['SCRIPT_FILENAME'])) {
    if ($conn->connect_error) {
        echo json_encode([
            "success" => false,
            "error" => "Database connection failed: " . $conn->connect_error
        ]);
    } else {
        echo json_encode([
            "success" => true,
            "message" => "Database connection successful",
            "database" => $db
        ]);
    }
}
?>