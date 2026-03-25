<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit();
}

include "db.php";

if (!isset($_FILES['image'])) {
    echo json_encode(["error" => "No file uploaded"]);
    exit();
}

$user_id = $_POST['user_id'];

$targetDir = "uploads/";

if (!file_exists($targetDir)) {
    mkdir($targetDir, 0777, true);
}

$fileName = time() . "_" . basename($_FILES["image"]["name"]);
$targetFile = $targetDir . $fileName;

if (move_uploaded_file($_FILES["image"]["tmp_name"], $targetFile)) {

    $fullPath = "http://localhost/Stud_Perf/" . $targetFile;

    $sql = "INSERT INTO diagrams (user_id, image_path)
            VALUES ('$user_id', '$targetFile')";

    if ($conn->query($sql)) {
        echo json_encode([
            "status" => "success",
            "path" => $fullPath,
            "diagram_id" => $conn->insert_id
        ]);
    } else {
        echo json_encode(["error" => "DB insert failed"]);
    }

} else {
    echo json_encode(["error" => "Upload failed"]);
}
?>