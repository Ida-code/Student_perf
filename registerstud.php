<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include "db.php";

// Stop warnings from breaking JSON
error_reporting(0);

$data = json_decode(file_get_contents("php://input"));

if (!$data) {
    echo json_encode(["status" => "error", "message" => "No data received"]);
    exit();
}

$name = $data->username;
$email = $data->email;
$password = password_hash($data->password, PASSWORD_DEFAULT);
$role = $data->role;

$stmt = $conn->prepare("INSERT INTO users (username,email,password,role) VALUES (?,?,?,?)");

if (!$stmt) {
    echo json_encode(["status" => "error", "message" => $conn->error]);
    exit();
}

$stmt->bind_param("ssss", $name, $email, $password, $role);

if ($stmt->execute()) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "message" => $stmt->error]);
}
