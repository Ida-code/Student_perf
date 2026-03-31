import React, { useState } from "react";
import { useEffect } from "react";
// Ensure 'React' is explicitly imported
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
    fetch("http://localhost:8081/getCompletedTopics.php", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCompletedTopics(data);
        }
      })
      .catch((err) => console.error("Error checking progress:", err));
  }, []);

  return (
    <div
      style={{
        padding: "40px",
        textAlign: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0066ff, #00cc99)",
      }}
    >
      <h2 style={{ color: "white", marginBottom: "30px" }}>
        Select Your Topic
      </h2>
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
                backgroundColor: isDone ? "#ccc" : "#0066ff",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: isDone ? "not-allowed" : "pointer",
                fontWeight: "600",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) =>
                !isDone && (e.target.style.backgroundColor = "#00a86b")
              }
              onMouseLeave={(e) =>
                !isDone && (e.target.style.backgroundColor = "#0066ff")
              }
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
          backgroundColor: "rgba(255, 255, 255, 0.3)",
          marginTop: "30px",
          border: "2px solid white",
          color: "white",
          fontWeight: "600",
          cursor: "pointer",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) =>
          (e.target.style.backgroundColor = "rgba(255, 255, 255, 0.5)")
        }
        onMouseLeave={(e) =>
          (e.target.style.backgroundColor = "rgba(255, 255, 255, 0.3)")
        }
      >
        Back to Dashboard
      </button>
    </div>
  );
}

export default TopicSelection;
