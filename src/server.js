const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

/* -------- Login -------- */

app.post("/login", function(req, res) {

    const { email, password } = req.body;

    db.query(
        "SELECT * FROM users WHERE email = ? AND password = ?",
        [email, password],
        function(err, result) {

            if (result.length > 0) {
                res.json({
                    id: result[0].id,
                    role: result[0].role,
                    name: result[0].name
                });
            } else {
                res.json({ message: "Invalid credentials" });
            }
        }
    );
});


/* -------- Get Questions -------- */
app.get("/questions/:role", function(req, res) {
    const role = req.params.role;

    db.query(
        "SELECT * FROM questions WHERE role = ?",
        [role],
        function(err, result) {
            res.json(result);
        }
    );
});

/* -------- Submit Result -------- */
app.post("/submit", function(req, res) {
    const { userId, topicScores } = req.body;

    for (let i = 0; i < topicScores.length; i++) {
        db.query(
            "INSERT INTO results (user_id, topic, score) VALUES (?, ?, ?)",
            [userId, topicScores[i].topic, topicScores[i].score]
        );
    }

    res.json({ message: "Saved" });
});

/* -------- Get Results -------- */
app.get("/results/:userId", function(req, res) {
    const userId = req.params.userId;

    db.query(
        "SELECT topic, score FROM results WHERE user_id = ?",
        [userId],
        function(err, result) {
            res.json(result);
        }
    );
});

/* -------- Scope -------- */
app.get("/scope/:userId", function(req, res) {
    const userId = req.params.userId;

    db.query(
        "SELECT topic, score FROM results WHERE user_id = ? ORDER BY score DESC LIMIT 1",
        [userId],
        function(err, result) {

            const strongTopic = result[0].topic;

            let suggestion = "";
            let roadmap = "";

            if (strongTopic === "Logic") {
                suggestion = "Software Developer, Data Analyst";
                roadmap = "Learn Programming → Practice Coding → Build Projects";
            } else if (strongTopic === "Math") {
                suggestion = "Banking, SSC";
                roadmap = "Practice Arithmetic → Mock Tests → Time Management";
            } else {
                suggestion = "General Career";
                roadmap = "Improve core skills";
            }

            res.json({ suggestion, roadmap });
        }
    );
});

app.listen(5000, function() {
    console.log("Server running on port 5000");
});


/* -------- Register -------- */
app.post("/register", function(req, res) {

    const { name, email, password, role } = req.body;

    db.query(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
        [name, email, password, role],
        function(err, result) {

            if (err) {
                res.json({ message: "User already exists" });
            } else {
                res.json({ message: "Registered successfully" });
            }
        }
    );
});
