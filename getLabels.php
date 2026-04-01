<?php
// Disable HTML errors
error_reporting(0);
ini_set('display_errors', 0);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Include database connection
include "db.php";

// Check if db connection exists
if (!isset($conn) || $conn->connect_error) {
    echo json_encode(["error" => "Database connection failed"]);
    exit;
}

// Check if diagram_id is provided (accept both 'id' and 'diagram_id' for compatibility)
$diagram_id = isset($_GET['diagram_id']) ? $_GET['diagram_id'] : (isset($_GET['id']) ? $_GET['id'] : null);

if (!isset($diagram_id) || empty($diagram_id)) {
    echo json_encode([]);
    exit;
}

// Use prepared statement to prevent SQL injection
$stmt = $conn->prepare("
    SELECT id, title, description, link, x, y, created_at
    FROM labels
    WHERE diagram_id = ?
    ORDER BY created_at ASC
");

if (!$stmt) {
    echo json_encode(["error" => "Prepare failed: " . $conn->error]);
    exit;
}

// Bind the diagram_id parameter
$stmt->bind_param("i", $diagram_id);
$stmt->execute();
$result = $stmt->get_result();

$labels = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $labels[] = $row;
    }
}

echo json_encode($labels);
$stmt->close();
$conn->close();
?>