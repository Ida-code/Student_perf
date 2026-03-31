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
    echo json_encode(["success" => false, "error" => "Database connection failed"]);
    exit;
}

// Get JSON input
$input = file_get_contents("php://input");
$data = json_decode($input, true);

if (!$data) {
    echo json_encode(["success" => false, "error" => "Invalid JSON data"]);
    exit;
}

// Validate required fields
if (!isset($data['diagram_id']) || !isset($data['user_id'])) {
    echo json_encode(["success" => false, "error" => "Diagram ID and User ID are required"]);
    exit;
}

$diagram_id = mysqli_real_escape_string($conn, $data['diagram_id']);
$user_id = mysqli_real_escape_string($conn, $data['user_id']);

// First, verify the diagram belongs to the user
$checkSql = "SELECT id, image_path FROM diagrams WHERE id = '$diagram_id' AND user_id = '$user_id'";
$checkResult = $conn->query($checkSql);

if (!$checkResult || $checkResult->num_rows === 0) {
    echo json_encode(["success" => false, "error" => "Diagram not found or you don't have permission"]);
    exit;
}

$diagram = $checkResult->fetch_assoc();
$imagePath = $diagram['image_path'];

// Delete labels first (due to foreign key constraint)
$deleteLabels = "DELETE FROM labels WHERE diagram_id = '$diagram_id'";
$conn->query($deleteLabels);

// Delete diagram
$deleteDiagram = "DELETE FROM diagrams WHERE id = '$diagram_id' AND user_id = '$user_id'";

if ($conn->query($deleteDiagram)) {
    if ($conn->affected_rows > 0) {
        // Try to delete the actual file (optional)
        if (file_exists($imagePath)) {
            @unlink($imagePath);
        }
        echo json_encode(["success" => true, "message" => "Diagram deleted successfully"]);
    } else {
        echo json_encode(["success" => false, "error" => "No diagram was deleted"]);
    }
} else {
    echo json_encode(["success" => false, "error" => $conn->error]);
}

$conn->close();
?>