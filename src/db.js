const mysql = require("mysql");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Risenme@20",
    database: "student_system"
});

connection.connect();

module.exports = connection;
