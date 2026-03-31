import React, { useState } from "react"; // Ensure 'React' is explicitly imported
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ResultChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // ✅ SAFE USER PARSE
  let user = null;
  try {
    const stored = localStorage.getItem("user");
    if (stored && stored !== "undefined") {
      user = JSON.parse(stored);
    }
  } catch (e) {
    console.log("Invalid user data");
  }

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    if (!user || !user.user_id || !user.role) {
      setError("User not logged in properly");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("Fetching results:", user);

      // ✅ SEND ROLE ALSO (VERY IMPORTANT)
      const response = await fetch(
        `http://localhost:8081/getResults.php?user_id=${user.user_id}&role=${user.role}`,
      );

      if (!response.ok) {
        throw new Error("Server error: " + response.status);
      }

      const text = await response.text();
      console.log("Raw response:", text);

      if (!text || text.trim() === "") {
        throw new Error("Empty response from server");
      }

      const json = JSON.parse(text);

      if (json.error) {
        throw new Error(json.error);
      }

      if (!json.success) {
        throw new Error("Failed to fetch results");
      }

      const mappedData = json.data.map((item) => ({
        topic: item.topic,
        percent: item.percentage || 0,
      }));

      setData(mappedData);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ RESOURCE LINKS
  const topicLinks = {
    "Verbal Reasoning":
      "https://www.indiabix.com/verbal-reasoning/questions-and-answers/",
    "Coding-Decoding":
      "https://www.indiabix.com/logical-reasoning/coding-decoding/",
    "Deductive Reasoning":
      "https://www.practiceaptitudetests.com/deductive-reasoning-tests/",
    "Logical Reasoning":
      "https://www.indiabix.com/logical-reasoning/questions-and-answers/",
    "Quantitative Aptitude":
      "https://www.indiabix.com/aptitude/questions-and-answers/",
  };

  const getSuggestion = (percent, topic) => {
    if (percent <= 40) {
      return (
        <div style={{ color: "#dc3545", marginTop: "8px", fontSize: "14px" }}>
          ⚠️ Topic needs improvement.{" "}
          <a
            href={topicLinks[topic]}
            target="_blank"
            rel="noreferrer"
            style={{ color: "#dc3545" }}
          >
            📘 Refer Resources
          </a>
        </div>
      );
    }

    if (percent <= 70) {
      return (
        <div style={{ color: "#fd7e14", marginTop: "8px", fontSize: "14px" }}>
          📈 Good progress! Keep practicing to master this topic.
        </div>
      );
    }

    return (
      <div style={{ color: "#28a745", marginTop: "8px", fontSize: "14px" }}>
        🌟 Excellent! You've mastered this topic.
      </div>
    );
  };

  if (loading) return <p>Loading your progress...</p>;

  if (error)
    return (
      <div>
        <p style={{ color: "red" }}>{error}</p>
        <button onClick={fetchResults}>Retry</button>
        <button onClick={() => navigate("/dashboard")}>Dashboard</button>
      </div>
    );

  if (data.length === 0)
    return (
      <div>
        <p>No quiz results yet!</p>
        <button onClick={() => navigate("/topicselection")}>Start Quiz</button>
      </div>
    );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0066ff, #00cc99)",
        paddingTop: "40px",
        paddingBottom: "40px",
      }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
        <h1
          style={{
            textAlign: "center",
            marginBottom: "10px",
            color: "white",
            fontSize: "32px",
            fontWeight: "700",
          }}
        >
          Your Progress
        </h1>
        <p
          style={{
            textAlign: "center",
            color: "#e0f7ff",
            marginBottom: "40px",
          }}
        >
          Track your performance across all topics
        </p>

        {data.map((item, idx) => {
          const percent = Math.min(Math.round(item.percent), 100);
          let barColor;
          let statusText;

          if (percent <= 40) {
            barColor = "#dc3545";
            statusText = "Needs Improvement";
          } else if (percent <= 70) {
            barColor = "#fd7e14";
            statusText = "Good Progress";
          } else {
            barColor = "#28a745";
            statusText = "Excellent";
          }

          return (
            <div
              key={idx}
              style={{
                marginBottom: "25px",
                padding: "20px",
                backgroundColor: "white",
                borderRadius: "12px",
                boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow =
                  "0 12px 30px rgba(0, 0, 0, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 6px 20px rgba(0, 0, 0, 0.15)";
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "15px",
                }}
              >
                <strong style={{ fontSize: "18px", color: "#0066ff" }}>
                  {item.topic}
                </strong>
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: "bold",
                    color: "white",
                    backgroundColor: barColor,
                    padding: "6px 12px",
                    borderRadius: "20px",
                  }}
                >
                  {statusText}
                </span>
              </div>

              <div
                style={{
                  background: "#e9ecef",
                  borderRadius: "20px",
                  height: "40px",
                  marginTop: "12px",
                  overflow: "hidden",
                  position: "relative",
                  boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                <div
                  style={{
                    width: `${percent}%`,
                    background: `linear-gradient(90deg, ${barColor}, ${barColor}cc)`,
                    height: "100%",
                    borderRadius: "20px",
                    textAlign: "center",
                    lineHeight: "40px",
                    color: "white",
                    fontSize: "14px",
                    fontWeight: "bold",
                    transition: "width 1s ease-in-out",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  }}
                >
                  {percent > 15 ? `${percent}%` : ""}
                </div>
              </div>

              {getSuggestion(item.percent, item.topic)}
            </div>
          );
        })}

        <div
          style={{
            display: "flex",
            gap: "15px",
            justifyContent: "center",
            marginTop: "40px",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              padding: "12px 24px",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              color: "white",
              border: "2px solid white",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "15px",
              fontWeight: "600",
              transition: "all 0.3s ease",
              backdropFilter: "blur(10px)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                "rgba(255, 255, 255, 0.3)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor =
                "rgba(255, 255, 255, 0.2)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate("/topicselection")}
            style={{
              padding: "12px 24px",
              backgroundColor: "white",
              color: "#0066ff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "15px",
              fontWeight: "600",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 15px rgba(0, 102, 255, 0.3)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 6px 20px rgba(0, 102, 255, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 4px 15px rgba(0, 102, 255, 0.3)";
            }}
          >
            Take Quiz
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResultChart;
