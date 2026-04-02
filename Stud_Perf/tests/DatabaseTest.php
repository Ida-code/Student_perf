<?php
use PHPUnit\Framework\TestCase;

class DatabaseTest extends TestCase {
    public function testDatabaseConnection() {
        // These should match your XAMPP/Docker Desktop settings
        $host = '127.0.0.1'; 
        $port = 3307; // The port we mapped in docker-compose
        $user = 'root';
        $pass = 'Risenme@20';
        $dbname = 'student_perf';

        // Attempt connection
        $mysqli = new mysqli($host, $user, $pass, $dbname, $port);

        // This is the "Assertion" - the actual test
        $this->assertNull($mysqli->connect_error, "Connection failed: " . $mysqli->connect_error);
        
        $mysqli->close();
    }
}