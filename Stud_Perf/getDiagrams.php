<?php
// Disable HTML errors
error_reporting(0);
ini_set('display_errors', 0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json");

// Include database connection
include "db.php";

// Check DB connection
if (!isset($conn) || $conn->connect_error) {
    echo json_encode(["error" => "Database connection failed"]);
    exit;
}

// Check if user_id is provided
if (!isset($_GET['user_id']) || empty($_GET['user_id'])) {
    echo json_encode(["error" => "User ID is required"]);
    exit;
}

$user_id = $_GET['user_id'];

// ❗ Extra safety check (VERY IMPORTANT)
if ($user_id === "null" || $user_id === "undefined") {
    echo json_encode(["error" => "Invalid user ID"]);
    exit;
}

// ✅ Use prepared statement (FIXED)
$stmt = $conn->prepare("
    SELECT id, user_id, filename, image_path, full_path, created_at 
    FROM diagrams 
    WHERE user_id = ? 
    ORDER BY created_at DESC
");

if (!$stmt) {
    echo json_encode(["error" => "Prepare failed: " . $conn->error]);
    exit;
}

// VARCHAR → use "s"
$stmt->bind_param("s", $user_id);
$stmt->execute();

$result = $stmt->get_result();

$diagrams = [];

while ($row = $result->fetch_assoc()) {

    // Ensure full_path exists
    if (empty($row['full_path'])) {
        $row['full_path'] = "http://localhost/Stud_Perf/" . $row['image_path'];
    }

    // Ensure filename exists
    if (empty($row['filename'])) {
        $row['filename'] = "Diagram_" . $row['id'];
    }

    $diagrams[] = $row;
}

echo json_encode($diagrams);

$stmt->close();
$conn->close();
?>