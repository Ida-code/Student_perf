<?php
// Disable HTML errors
error_reporting(0);
ini_set('display_errors', 0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json");

// Include database connection
include "db.php";

// Check if db connection exists
if (!isset($conn) || $conn->connect_error) {
    echo json_encode(["error" => "Database connection failed"]);
    exit;
}

// Check if user_id and image are provided
if (!isset($_POST['user_id']) || empty($_POST['user_id'])) {
    echo json_encode(["error" => "User ID is required"]);
    exit;
}

if (!isset($_FILES['image'])) {
    echo json_encode(["error" => "No image file uploaded"]);
    exit;
}

$user_id = mysqli_real_escape_string($conn, $_POST['user_id']);
$filename = isset($_POST['filename']) ? mysqli_real_escape_string($conn, $_POST['filename']) : basename($_FILES["image"]["name"]);

// Create uploads directory if it doesn't exist
$targetDir = "uploads/";
if (!file_exists($targetDir)) {
    if (!mkdir($targetDir, 0777, true)) {
        echo json_encode(["error" => "Failed to create upload directory"]);
        exit;
    }
}

// Generate unique filename
$fileExtension = pathinfo($_FILES["image"]["name"], PATHINFO_EXTENSION);
$uniqueFilename = time() . "_" . preg_replace('/[^a-zA-Z0-9._-]/', '', basename($_FILES["image"]["name"]));
$targetFile = $targetDir . $uniqueFilename;

// Move uploaded file
if (move_uploaded_file($_FILES["image"]["tmp_name"], $targetFile)) {
    $full_path = "http://localhost/Stud_Perf/" . $targetFile;
    
    // Insert with user_id
    $stmt = $conn->prepare("INSERT INTO diagrams (user_id, filename, image_path, full_path) VALUES (?, ?, ?, ?)");
    
    if (!$stmt) {
        echo json_encode(["error" => "Database prepare failed: " . $conn->error]);
        exit;
    }
    
    $stmt->bind_param("ssss", $user_id, $filename, $targetFile, $full_path);
    
    if ($stmt->execute()) {
        echo json_encode([
            "status" => "success",
            "path" => $targetFile,
            "full_path" => $full_path,
            "diagram_id" => $stmt->insert_id,
            "filename" => $filename,
            "user_id" => $user_id
        ]);
    } else {
        echo json_encode(["error" => "Database insert failed: " . $stmt->error]);
    }
    
    $stmt->close();
} else {
    echo json_encode(["error" => "Failed to move uploaded file"]);
}

$conn->close();
?>