<?php
include "db.php";

$data = json_decode(file_get_contents("php://input"), true);

$diagram_id = $data['diagram_id'];
$x = $data['x'];
$y = $data['y'];
$title = $data['title'];
$desc = $data['description'];
$link = $data['link'];

$sql = "INSERT INTO labels (diagram_id, x, y, title, description, link)
        VALUES ('$diagram_id', '$x', '$y', '$title', '$desc', '$link')";

if($conn->query($sql)) {
    echo json_encode(["status" => "saved"]);
}
?>