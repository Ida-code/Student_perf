import { useEffect, useState } from "react";

function ResultChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetching the weighted results from your PHP script
    fetch("http://localhost/getResults.php", { credentials: "include" })
      .then((res) => res.json())
      .then((json) => {
        // Ensure we map the PHP "percentage" key to your "percent" key
        if (Array.isArray(json)) {
          const mappedData = json.map((item) => ({
            sub_topic: item.topic, // Mapping topic to your sub_topic display
            percent: item.percentage, // Mapping percentage to your percent variable
          }));
          setData(mappedData);
        }
      })
      .catch((err) => console.error("Error fetching results:", err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Progress Breakdown</h1>
      {data.map((item, idx) => (
        <div key={idx} style={{ marginBottom: "20px" }}>
          {/* Displays the Topic Name */}
          <p>{item.sub_topic}</p>

          {/* Progress Bar Container - Your Original CSS */}
          <div
            style={{
              background: "#eee",
              borderRadius: "10px",
              width: "100%",
              height: "20px",
            }}
          >
            {/* Colored Progress Fill - Your Original CSS */}
            <div
              style={{
                width: `${item.percent}%`,
                background: "linear-gradient(90deg, #4caf50, #8bc34a)",
                height: "100%",
                borderRadius: "10px",
                transition: "width 1s ease-in-out",
              }}
            />
          </div>
          <small>{Math.round(item.percent)}% Complete</small>
        </div>
      ))}
    </div>
  );
}

export default ResultChart;
