<?php
include 'db.php';

if ($conn->connect_error) {
    echo 'DB Connection Failed: ' . $conn->connect_error . PHP_EOL;
    exit;
}

echo 'DB Connected Successfully' . PHP_EOL;

// Check if tables exist
$tables = ['diagrams', 'labels'];
foreach ($tables as $table) {
    $result = $conn->query('SHOW TABLES LIKE "' . $table . '"');
    if ($result->num_rows > 0) {
        echo 'Table ' . $table . ' exists' . PHP_EOL;
    } else {
        echo 'Table ' . $table . ' does NOT exist' . PHP_EOL;
    }
}

// Check labels table structure
$result = $conn->query('DESCRIBE labels');
if ($result) {
    echo 'Labels table structure:' . PHP_EOL;
    while ($row = $result->fetch_assoc()) {
        echo '  ' . $row['Field'] . ' - ' . $row['Type'] . PHP_EOL;
    }
} else {
    echo 'Could not describe labels table' . PHP_EOL;
}

// Check if there are any labels in the database
$result = $conn->query('SELECT COUNT(*) as count FROM labels');
if ($result) {
    $row = $result->fetch_assoc();
    echo 'Total labels in database: ' . $row['count'] . PHP_EOL;
}

// Check if there are any diagrams
$result = $conn->query('SELECT COUNT(*) as count FROM diagrams');
if ($result) {
    $row = $result->fetch_assoc();
    echo 'Total diagrams in database: ' . $row['count'] . PHP_EOL;
}

$conn->close();
?>