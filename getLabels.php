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

// Check if diagram_id is provided
if (!isset($_GET['id']) || empty($_GET['id'])) {
    echo json_encode([]);
    exit;
}

$diagram_id = mysqli_real_escape_string($conn, $_GET['id']);

// Query labels for this diagram
$sql = "SELECT id, id, title, description, link, x, y, created_at 
        FROM labels 
        WHERE diagram_id = '$id' 
        ORDER BY created_at ASC";

$result = $conn->query($sql);
$labels = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $labels[] = $row;
    }
}

echo json_encode($labels);
$conn->close();
?>