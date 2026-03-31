import React, { useState } from "react"; // Ensure 'React' is explicitly imported
import { useParams, useNavigate } from "react-router-dom";

function Roadmap() {
  const { type } = useParams();
  const navigate = useNavigate();
  const [completed, setCompleted] = useState([]);

  const data = {
    developer: [
      {
        title: "HTML & CSS",
        link: "https://youtu.be/v8jDnBYc0bs?si=xrhKWGV891iX2K2R",
      },
      {
        title: "JavaScript",
        link: "https://youtu.be/nkB3_dIDC08?si=R68iuvbDWhZe3Pwr",
      },
      {
        title: "React",
        link: "https://youtu.be/BT1gpzX58bI?si=b5UXinE5XAftGys8",
      },
      {
        title: "Node.js",
        link: "https://youtu.be/yEHCfRWz-EI?si=MvIKalxKnhzUDNgy",
      },
      {
        title: "Database",
        link: "https://youtu.be/ZdQP1HUOEAU?si=nxn8ryehDmGf7LvM",
      },
      {
        title: "Deployment",
        link: "https://youtu.be/NBrQp6-721c?si=kuwt9qAi-MPravV4",
      },
    ],

    aiml: [
      { title: "Python Basics", link: "https://youtu.be/_uQrJ0TkZlc" },
      {
        title: "Math (Stats & Linear Algebra)",
        link: "https://youtu.be/QCPJ0VdpM00?si=GmrK_20w6odneyW1",
      },
      {
        title: "Data Analysis (Pandas, Numpy)",
        link: "https://youtu.be/vtgDGrUiUKk?si=akJ-BpbPXogCDBW7",
      },
      {
        title: "Machine Learning",
        link: "https://youtu.be/gmvvaobm7eQ?si=N-XPQRXXUb9wRR5T",
      },
      {
        title: "Deep Learning",
        link: "https://youtu.be/Mubj_fqiAv8?si=EpbsfN-jrlQFHGap",
      },
      {
        title: "Projects",
        link: "https://www.geeksforgeeks.org/machine-learning/machine-learning-projects/",
      },
    ],

    devops: [
      { title: "Linux Basics", link: "https://youtu.be/IVquJh3DXUA" },
      { title: "Git & GitHub", link: "https://youtu.be/RGOj5yH7evk" },
      { title: "Docker", link: "https://youtu.be/fqMOX6JJhGo" },
      { title: "CI/CD", link: "https://youtu.be/1er2cjUq1UI" },
      { title: "Kubernetes", link: "https://youtu.be/X48VuDVv0do" },
      { title: "Cloud (AWS/Azure)", link: "https://youtu.be/ulprqHHWlng" },
    ],
  };

  const steps = data[type] || data.developer;

  const points = [
    { x: "10%", y: "75%" },
    { x: "25%", y: "50%" },
    { x: "40%", y: "25%" },
    { x: "60%", y: "35%" },
    { x: "75%", y: "60%" },
    { x: "90%", y: "80%" },
  ];

  // Only allow marking once
  function markDone(index) {
    if (completed.indexOf(index) === -1) {
      setCompleted([...completed, index]);
    }
  }

  const [selectedStep, setSelectedStep] = useState(null);

  // Calculate positions for the wavy path
  const getPositions = () => {
    const positions = [];
    const startX = 60;
    const endX = 1300;
    const centerY = 300;
    const amplitude = 120;
    const frequency = 0.025;

    for (let i = 0; i < steps.length; i++) {
      const ratio = steps.length > 1 ? i / (steps.length - 1) : 0;
      const x = startX + ratio * (endX - startX);
      const y = centerY + amplitude * Math.sin(ratio * 12.566 * frequency);
      positions.push({ x, y });
    }
    return positions;
  };

  const positions = getPositions();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0066ff, #1dd1a1, #00cc99)",
        padding: "40px 20px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <button
        onClick={() => navigate(-1)}
        style={{
          top: "18px",
          left: "18px",
          zIndex: 50,
          minWidth: "140px",
          padding: "10px 16px",
          backgroundColor: "rgba(255, 255, 255, 0.25)",
          color: "white",
          border: "2px solid rgba(255, 255, 255, 0.65)",
          borderRadius: "10px",
          cursor: "pointer",
          fontWeight: "700",
          boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
          backdropFilter: "blur(10px)",
          transition: "all 0.25s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.35)";
          e.currentTarget.style.transform = "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.25)";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        ← Back
      </button>

      <div style={{ maxWidth: "1400px", margin: "0 auto", width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: "50px" }}>
          <h1
            style={{
              fontSize: "3rem",
              fontWeight: "700",
              color: "white",
              marginBottom: "15px",
              textShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
            }}
          >
            {type === "aiml"
              ? " AI/ML Roadmap"
              : type === "devops"
                ? " DevOps Roadmap"
                : " Software Developer Roadmap"}
          </h1>
          <p
            style={{
              fontSize: "1.1rem",
              color: "#e0f7ff",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            Follow your learning path. Click any marker to open resources or
            mark as done.
          </p>
        </div>

        {/* SVG Path Visualization */}
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            borderRadius: "20px",
            padding: "40px",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
            marginBottom: "30px",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
          }}
        >
          <svg
            width="100%"
            height="450"
            viewBox="0 0 1400 450"
            style={{ overflow: "visible" }}
          >
            {/* Wavy Path */}
            <defs>
              <linearGradient
                id="pathGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop
                  offset="0%"
                  style={{ stopColor: "#0066ff", stopOpacity: 0.6 }}
                />
                <stop
                  offset="100%"
                  style={{ stopColor: "#00cc99", stopOpacity: 0.6 }}
                />
              </linearGradient>
            </defs>

            {/* Generate wavy path */}
            <path
              d={`M ${positions[0]?.x || 60} ${positions[0]?.y || 300} ${positions
                .slice(1)
                .map((p) => `Q ${p.x - 30} ${p.y - 60}, ${p.x} ${p.y}`)
                .join(" ")}`}
              fill="none"
              stroke="url(#pathGradient)"
              strokeWidth="6"
              strokeLinecap="round"
            />

            {/* Draw markers along path */}
            {positions.map((pos, index) => {
              const done = completed.includes(index);
              return (
                <g key={index}>
                  {/* Shadow */}
                  <circle
                    cx={pos.x}
                    cy={pos.y + 3}
                    r="22"
                    fill="rgba(0, 0, 0, 0.1)"
                  />
                  {/* Main circle */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="20"
                    fill={done ? "#00cc99" : "#0066ff"}
                    stroke="white"
                    strokeWidth="3"
                    style={{
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      filter:
                        selectedStep === index
                          ? "drop-shadow(0 0 10px rgba(0,102,255,0.6))"
                          : "none",
                    }}
                    onClick={() =>
                      setSelectedStep(selectedStep === index ? null : index)
                    }
                  />
                  {/* Check or number */}
                  <text
                    x={pos.x}
                    y={pos.y}
                    textAnchor="middle"
                    dy="0.3em"
                    fill="white"
                    fontSize="14"
                    fontWeight="700"
                    pointerEvents="none"
                  >
                    {done ? "✓" : index + 1}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Step labels below path */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "30px",
              paddingTop: "20px",
              borderTop: "1px solid #e0e0e0",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            {steps.map((step, index) => (
              <div
                key={index}
                style={{
                  flex: "1 1 calc(33.333% - 10px)",
                  minWidth: "150px",
                  textAlign: "center",
                  cursor: "pointer",
                  padding: "12px",
                  borderRadius: "10px",
                  backgroundColor:
                    selectedStep === index ? "#f0f7ff" : "transparent",
                  border:
                    selectedStep === index
                      ? "2px solid #0066ff"
                      : "1px solid #e0e0e0",
                  transition: "all 0.2s ease",
                }}
                onClick={() =>
                  setSelectedStep(selectedStep === index ? null : index)
                }
              >
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: "600",
                    color: completed.includes(index) ? "#00cc99" : "#0066ff",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Step {index + 1}
                </div>
                <p
                  style={{
                    margin: "8px 0 0 0",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#333",
                  }}
                >
                  {step.title}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Step Panel */}
        {selectedStep !== null && (
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "16px",
              padding: "32px",
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15)",
              border: "2px solid #0066ff",
              animation: "slideUp 0.3s ease",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "start",
                marginBottom: "20px",
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: "28px",
                    fontWeight: "700",
                    color: "#0066ff",
                    margin: "0 0 8px 0",
                  }}
                >
                  {steps[selectedStep].title}
                </h2>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#666",
                    margin: 0,
                  }}
                >
                  Step {selectedStep + 1} of {steps.length}
                </p>
              </div>
              <button
                onClick={() => setSelectedStep(null)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "28px",
                  cursor: "pointer",
                  color: "#999",
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => window.open(steps[selectedStep].link, "_blank")}
                style={{
                  flex: 1,
                  padding: "14px 24px",
                  backgroundColor: "#0066ff",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "15px",
                  fontWeight: "700",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#00a86b";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#0066ff";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                📚 Open Learning Resource
              </button>
              {!completed.includes(selectedStep) && (
                <button
                  onClick={() => {
                    markDone(selectedStep);
                    setSelectedStep(null);
                  }}
                  style={{
                    flex: 1,
                    padding: "14px 24px",
                    backgroundColor: "#00cc99",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    fontSize: "15px",
                    fontWeight: "700",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#009966";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#00cc99";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  ✓ Mark as Done
                </button>
              )}
            </div>

            {completed.includes(selectedStep) && (
              <p
                style={{
                  marginTop: "16px",
                  padding: "12px 16px",
                  backgroundColor: "#e8f5e9",
                  color: "#009966",
                  borderRadius: "8px",
                  fontSize: "14px",
                  margin: "16px 0 0 0",
                }}
              >
                ✓ This step is complete. Great progress!
              </p>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default Roadmap;
