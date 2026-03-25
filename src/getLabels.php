<?php
include "db.php";

$diagram_id = $_GET['diagram_id'];

$result = $conn->query("SELECT * FROM labels WHERE diagram_id='$diagram_id'");

$labels = [];

while($row = $result->fetch_assoc()) {
    $labels[] = $row;
}

echo json_encode($labels);
?>