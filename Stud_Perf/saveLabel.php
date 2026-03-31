<?php
// Disable HTML errors
error_reporting(0);
ini_set('display_errors', 0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Include database connection
include "db.php";

// Check if db connection exists
if (!isset($conn) || $conn->connect_error) {
    echo json_encode(["error" => "Database connection failed"]);
    exit;
}

// Get JSON input
$input = file_get_contents("php://input");
$data = json_decode($input, true);

if (!$data) {
    echo json_encode(["error" => "Invalid JSON data"]);
    exit;
}

// Validate required fields
if (!isset($data['diagram_id']) || !isset($data['title'])) {
    echo json_encode(["error" => "Diagram ID and title are required"]);
    exit;
}

$diagram_id = intval($data['diagram_id']);
$title = $data['title'];
$description = isset($data['description']) ? $data['description'] : '';
$link = isset($data['link']) ? $data['link'] : '';
$x = isset($data['x']) ? intval($data['x']) : 0;
$y = isset($data['y']) ? intval($data['y']) : 0;

// First verify the diagram exists using prepared statement
$checkStmt = $conn->prepare("SELECT id FROM diagrams WHERE id = ?");
$checkStmt->bind_param("i", $diagram_id);
$checkStmt->execute();
$result = $checkStmt->get_result();

if (!$result || $result->num_rows === 0) {
    echo json_encode(["error" => "Diagram not found"]);
    $checkStmt->close();
    exit;
}
$checkStmt->close();

// Insert label using prepared statement
$stmt = $conn->prepare("INSERT INTO labels (diagram_id, title, description, link, x, y) VALUES (?, ?, ?, ?, ?, ?)");

if (!$stmt) {
    echo json_encode(["error" => "Prepare failed: " . $conn->error]);
    exit;
}

$stmt->bind_param("isssii", $diagram_id, $title, $description, $link, $x, $y);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "id" => $stmt->insert_id,
        "message" => "Label saved successfully"
    ]);
} else {
    echo json_encode([
        "success" => false,
        "error" => $stmt->error
    ]);
}

$stmt->close();

$conn->close();
?>