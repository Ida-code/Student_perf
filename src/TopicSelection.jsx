import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function TopicSelection() {
  const [completedTopics, setCompletedTopics] = useState([]);
  const navigate = useNavigate();

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
        background:
          "linear-gradient(135deg, #667eea 0%, #764ba2 25%, #4facfe 75%, #00f2fe 100%)",
        backgroundSize: "400% 400%",
        animation: "gradient 15s ease infinite",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      <div style={{ position: "relative", zIndex: 1 }}>
        <h1
          style={{
            color: "white",
            marginBottom: "10px",
            fontSize: "2.5em",
            textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
          }}
        >
          Choose Your Topic
        </h1>
        <p
          style={{
            color: "rgba(255,255,255,0.9)",
            marginBottom: "40px",
            fontSize: "1.1em",
          }}
        >
          Complete each topic to unlock your potential!
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            alignItems: "center",
            maxWidth: "400px",
            margin: "0 auto",
          }}
        >
          {allTopics.map((topic, index) => {
            const isDone = completedTopics.includes(topic);
            return (
              <button
                key={topic}
                onClick={() => navigate(`/questionspage/${topic}`)}
                disabled={isDone}
                style={{
                  padding: "18px 30px",
                  width: "320px",
                  backgroundColor: isDone
                    ? "#888"
                    : ["#45b7d1", "#45b7d1", "#45b7d1"][index],
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  cursor: isDone ? "not-allowed" : "pointer",
                  fontWeight: "700",
                  fontSize: "1em",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                  transform: isDone ? "scale(0.95)" : "scale(1)",
                  opacity: isDone ? 0.6 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!isDone) {
                    e.target.style.transform = "translateY(-3px)";
                    e.target.style.boxShadow = "0 6px 20px rgba(0,0,0,0.3)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isDone) {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 4px 15px rgba(0,0,0,0.2)";
                  }
                }}
              >
                {topic} {isDone ? " ✅" : ""}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          style={{
            padding: "12px 24px",
            marginTop: "40px",
            borderRadius: "8px",
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            border: "2px solid white",
            color: "white",
            fontWeight: "600",
            fontSize: "1em",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "rgba(255, 255, 255, 0.4)";
            e.target.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
            e.target.style.transform = "translateY(0)";
          }}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default TopicSelection;
