const mysql = require("mysql");

const connection = mysql.createConnection({
    host: "mysql",
    port : 3306,
    user: "root",
    password: "Risenme@20",
    database: "student_perf"
});

connection.connect();

module.exports = connection;
