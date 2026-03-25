const mysql = require("mysql");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Risenme@20",
    database: "Stud_Perf"
});

connection.connect();

module.exports = connection;
