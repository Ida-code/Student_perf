<?php
// Include database connection
include 'db.php';

// Simple query to test MySQL
$sql = "SELECT 'Hello from MySQL!' AS message";
$result = $conn->query($sql);

// Prepare response
$data = array();
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
}

// Send JSON response
header('Content-Type: application/json');
echo json_encode($data);

$conn->close();
?>