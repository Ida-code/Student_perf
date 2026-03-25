import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ResultChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    if (!user || !user.user_id) {
      setError("User not logged in");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("Fetching results for:", user.user_id);

      const response = await fetch(
        `http://localhost/Stud_Perf/getResults.php?user_id=${user.user_id}`,
      );

      const text = await response.text();
      console.log("Raw response:", text);

      if (!text) {
        throw new Error("Empty response from server");
      }

      const json = JSON.parse(text);

      // ✅ FIX: HANDLE ARRAY RESPONSE
      let finalData = [];

      if (Array.isArray(json)) {
        finalData = json;
      } else if (json.success) {
        finalData = json.data;
      } else {
        throw new Error(json.error || "Failed to fetch results");
      }

      const mappedData = finalData.map((item) => ({
        topic: item.topic,
        percent: item.percentage,
      }));

      setData(mappedData);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const topicLinks = {
    "Verbal Reasoning":
      "https://www.indiabix.com/verbal-reasoning/questions-and-answers/",
    "Coding-Decoding":
      "https://www.indiabix.com/logical-reasoning/letter-and-symbol-series/",
    "Deductive Reasoning":
      "https://www.practiceaptitudetests.com/deductive-reasoning-tests/",
  };

  const getSuggestion = (percent, topic) => {
    if (percent <= 40)
      return (
        <div style={{ color: "red" }}>
          Topic is hard.{" "}
          <a href={topicLinks[topic]} target="_blank" rel="noreferrer">
            📘 Refer
          </a>
        </div>
      );

    if (percent <= 70)
      return <div style={{ color: "orange" }}>Keep practicing!</div>;

    return <div style={{ color: "green" }}>Excellent! 🌟</div>;
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
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h1>Your Progress</h1>

      {data.map((item, idx) => (
        <div key={idx} style={{ marginBottom: "20px" }}>
          <strong>{item.topic}</strong>

          <div
            style={{
              background: "#ddd",
              borderRadius: "10px",
              height: "25px",
            }}
          >
            <div
              style={{
                width: `${item.percent}%`,
                background:
                  item.percent <= 40
                    ? "red"
                    : item.percent <= 70
                      ? "orange"
                      : "green",
                height: "100%",
                borderRadius: "10px",
                textAlign: "right",
                paddingRight: "5px",
                color: "white",
              }}
            >
              {Math.round(item.percent)}%
            </div>
          </div>

          {getSuggestion(item.percent, item.topic)}
        </div>
      ))}

      <button onClick={() => navigate("/dashboard")}>Dashboard</button>
      <button onClick={() => navigate("/topicselection")}>Take Quiz</button>
    </div>
  );
}

export default ResultChart;
