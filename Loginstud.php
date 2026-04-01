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

// Debug: Log received data
error_log("Login attempt - Received data: " . $inputJSON);

// Validate input
if (!$input) {
    sendResponse(false, 'Invalid JSON data received');
}

// Check for required fields (username and password only - role is not needed for login)
if (!isset($input['username']) || empty($input['username'])) {
    sendResponse(false, 'Username is required');
}

if (!isset($input['password']) || empty($input['password'])) {
    sendResponse(false, 'Password is required');
}

$username = trim($input['username']);
$password = $input['password'];

// Check if connection exists
if (!isset($conn) || $conn->connect_error) {
    sendResponse(false, 'Database connection failed');
}

// Query user - search by username only
$stmt = $conn->prepare("SELECT user_id, username, email, password, role FROM users WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    $stmt->close();
    sendResponse(false, 'Invalid credentials');
}

$user = $result->fetch_assoc();

// Verify password (plain text comparison)
if ($password !== $user['password']) {
    $stmt->close();
    sendResponse(false, 'Invalid credentials');
}

// Login successful - return user data
sendResponse(true, null, [
    'id' => $user['user_id'],
    'name' => $user['username'],
    'role' => $user['role']
]);

$stmt->close();
?>