import React, { useState } from "react"; // Ensure 'React' is explicitly imported
import { useNavigate } from "react-router-dom";
import { Code, Palette, Settings } from "lucide-react";

function ScopePageClg() {
  const navigate = useNavigate();

  const paths = [
    {
      title: "Software Developer",
      desc: "Frontend, Backend & Full Stack development roadmap",
      icon: <Code size={48} color="#0066ff" />,
      link: "/roadmap/developer",
      tags: ["React", "Node.js", "SQL"],
    },
    {
      title: "AI ML",
      desc: "Learn design thinking, wireframing and prototyping",
      icon: <Palette size={48} color="#00cc99" />,
      link: "/roadmap/aiml",
      tags: ["ML", "Computer Vision", "Projects"],
    },
    {
      title: "DevOps Engineer",
      desc: "Infrastructure, CI/CD pipelines and automation",
      icon: <Settings size={48} color="#00a86b" />,
      link: "/roadmap/devops",
      tags: ["Docker", "AWS", "Jenkins"],
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0066ff, #00cc99)",
        padding: "40px 20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Back Button */}
      <button
        onClick={() => navigate("/dashboard")}
        style={{
          top: "18px",
          left: "18px",
          zIndex: 50,
          minWidth: "150px",
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
          e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
          e.currentTarget.style.transform = "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        ← Back to Dashboard
      </button>

      {/* Header */}
      <div
        style={{ textAlign: "center", marginBottom: "50px", color: "white" }}
      >
        <h1
          style={{
            fontSize: "3rem",
            fontWeight: "700",
            marginBottom: "15px",
            textShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
          }}
        >
          Choose Your Career Path
        </h1>
        <p
          style={{
            fontSize: "1.2rem",
            opacity: 0.9,
            fontWeight: "300",
            letterSpacing: "0.5px",
          }}
        >
          Select a domain to view your personalized learning roadmap.
        </p>
      </div>

      {/* Cards Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "30px",
          maxWidth: "1200px",
          width: "100%",
        }}
      >
        {paths.map((path, index) => (
          <div
            key={index}
            onClick={() => navigate(path.link)}
            style={{
              backgroundColor: "white",
              borderRadius: "20px",
              padding: "40px 30px",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
              cursor: "pointer",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-10px)";
              e.currentTarget.style.boxShadow =
                "0 20px 40px rgba(0, 0, 0, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 10px 30px rgba(0, 0, 0, 0.15)";
            }}
          >
            {/* Icon Container */}
            <div
              style={{
                width: "80px",
                height: "80px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f8f9fa",
                borderRadius: "16px",
                marginBottom: "25px",
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.1) rotate(5deg)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1) rotate(0deg)";
              }}
            >
              {path.icon}
            </div>

            {/* Title */}
            <h2
              style={{
                fontSize: "1.6rem",
                fontWeight: "700",
                color: "#333",
                marginBottom: "15px",
                marginTop: 0,
              }}
            >
              {path.title}
            </h2>

            {/* Description */}
            <p
              style={{
                fontSize: "1rem",
                color: "#666",
                marginBottom: "25px",
                lineHeight: "1.5",
                flexGrow: 1,
              }}
            >
              {path.desc}
            </p>

            {/* Tags */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              {path.tags.map((tag, tagIndex) => (
                <span
                  key={tagIndex}
                  style={{
                    padding: "6px 12px",
                    backgroundColor: "#f0f7ff",
                    color: "#0066ff",
                    fontSize: "0.8rem",
                    fontWeight: "600",
                    borderRadius: "20px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ScopePageClg;
