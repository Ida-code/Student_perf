<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}


$host = "localhost";
$user = "root";
$pass = "your pswd";
$db   = "Student_Perf";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Connection failed");
}
