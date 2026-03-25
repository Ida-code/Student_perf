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

$diagram_id = mysqli_real_escape_string($conn, $data['diagram_id']);
$title = mysqli_real_escape_string($conn, $data['title']);
$description = isset($data['description']) ? mysqli_real_escape_string($conn, $data['description']) : '';
$link = isset($data['link']) ? mysqli_real_escape_string($conn, $data['link']) : '';
$x = isset($data['x']) ? intval($data['x']) : 0;
$y = isset($data['y']) ? intval($data['y']) : 0;

// First verify the diagram exists
$checkDiagram = "SELECT id FROM diagrams WHERE id = '$diagram_id'";
$result = $conn->query($checkDiagram);

if (!$result || $result->num_rows === 0) {
    echo json_encode(["error" => "Diagram not found"]);
    exit;
}

// Insert label
$sql = "INSERT INTO labels (diagram_id, title, description, link, x, y) 
        VALUES ('$diagram_id', '$title', '$description', '$link', '$x', '$y')";

if ($conn->query($sql)) {
    echo json_encode([
        "success" => true,
        "id" => $conn->insert_id,
        "message" => "Label saved successfully"
    ]);
} else {
    echo json_encode([
        "success" => false,
        "error" => $conn->error
    ]);
}

$conn->close();
?>