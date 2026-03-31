<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set headers
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Include database connection
require_once 'db.php';

// Function to send JSON response
function sendResponse($success, $error = null, $userData = null) {
    $response = ['success' => $success];
    if ($error) {
        $response['error'] = $error;
    }
    if ($userData) {
        $response['user'] = $userData;
    }
    echo json_encode($response);
    exit();
}

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, 'Only POST method allowed');
}

// Get JSON input
$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, true);

// Validate input
if (!$input) {
    sendResponse(false, 'Invalid JSON data received');
}

// Check for required fields
if (!isset($input['username']) || empty($input['username'])) {
    sendResponse(false, 'Username is required');
}

if (!isset($input['email']) || empty($input['email'])) {
    sendResponse(false, 'Email is required');
}

if (!isset($input['password']) || empty($input['password'])) {
    sendResponse(false, 'Password is required');
}

// Validate email format
if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
    sendResponse(false, 'Invalid email format');
}

$username = trim($input['username']);
$email = trim($input['email']);
$password = $input['password'];
$role = isset($input['role']) ? $input['role'] : 'college';

// Check database connection
if (!isset($conn) || $conn->connect_error) {
    sendResponse(false, 'Database connection failed');
}

// Check if username already exists
$stmt = $conn->prepare("SELECT user_id FROM users WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $stmt->close();
    sendResponse(false, 'Username already exists');
}
$stmt->close();

// Check if email already exists
$stmt = $conn->prepare("SELECT user_id FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $stmt->close();
    sendResponse(false, 'Email already registered');
}
$stmt->close();

// Insert new user into your existing users table
$sql = "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    sendResponse(false, 'Database error: ' . $conn->error);
}

$stmt->bind_param("ssss", $username, $email, $password, $role);

if ($stmt->execute()) {
    $user_id = $conn->insert_id;
    
    // Return success with user data
    sendResponse(true, null, [
        'id' => $user_id,
        'name' => $username,
        'email' => $email,
        'role' => $role
    ]);
} else {
    sendResponse(false, 'Registration failed: ' . $stmt->error);
}

$stmt->close();
$conn->close();
?>