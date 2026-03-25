<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

session_start();
include "db.php";

// Read JSON input
$data = json_decode(file_get_contents("php://input"), true);

// Validate input
if (!$data || !isset($data['username']) || !isset($data['password'])) {
    echo json_encode([
        "status" => "error",
        "message" => "Invalid input"
    ]);
    exit();
}

$username = $data['username'];
$password = $data['password'];

// Prepare query
$stmt = $conn->prepare("SELECT user_id, username, password, role FROM users WHERE username=?");

if (!$stmt) {
    echo json_encode([
        "status" => "error",
        "message" => "Query failed"
    ]);
    exit();
}

$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

// Check user
if ($result->num_rows > 0) {

    $user = $result->fetch_assoc();

    if (password_verify($password, $user['password'])) {

        // ✅ Set session
        $_SESSION['user_id'] = $user['user_id'];
        $_SESSION['role'] = $user['role'];
        $_SESSION['name'] = $user['username'];

        echo json_encode([
            "status" => "success",
            "id" => $user['user_id'],
            "name" => $user['username'],
            "role" => $user['role']
        ]);

    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Invalid password"
        ]);
    }

} else {
    echo json_encode([
        "status" => "error",
        "message" => "User not found"
    ]);
}

// Close
$stmt->close();
$conn->close();
?>