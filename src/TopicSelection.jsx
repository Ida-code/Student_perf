import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function TopicSelection() {
  const [completedTopics, setCompletedTopics] = useState([]);
  const navigate = useNavigate();

  // List of all your available topics (Match these to your SQL 'topic' column)
  const allTopics = [
    "Verbal Reasoning",
    "Coding-Decoding",
    "Deductive Reasoning",
  ];

  useEffect(() => {
    fetch("http://localhost/getCompletedTopics.php", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCompletedTopics(data);
        }
      })
      .catch((err) => console.error("Error checking progress:", err));
  }, []);

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h2>Select Your Topic</h2>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          alignItems: "center",
        }}
      >
        {allTopics.map((topic) => {
          const isDone = completedTopics.includes(topic);
          return (
            <button
              key={topic}
              onClick={() => navigate(`/questionspage/${topic}`)}
              disabled={isDone}
              style={{
                padding: "15px 30px",
                width: "300px",
                backgroundColor: isDone ? "#ccc" : "#4A90E2",
                color: "black",
                border: "none",
                borderRadius: "5px",
                cursor: isDone ? "not-allowed" : "pointer",
              }}
            >
              {topic} {isDone ? " ✅" : ""}
            </button>
          );
        })}
      </div>

      {/* Button to go back to Dashboard once they see their progress */}
      <button
        onClick={() => navigate("/dashboard")}
        style={{
          padding: "10px 20px",
          width: "200px",
          borderRadius: "5px",
          backgroundColor: "#ccc",
          marginTop: "30px",
          background: "none",
          border: "none",
          color: "black",
        }}
      >
        Back to Dashboard
      </button>
    </div>
  );
}

export default TopicSelection;
