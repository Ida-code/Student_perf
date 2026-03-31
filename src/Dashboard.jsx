import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, BarChart3, Map, LogOut, Image, Route } from "lucide-react";
import "./Dashboard.css";
// Ensure 'React' is explicitly imported

function Dashboard() {
  const navigate = useNavigate();

  // Get user data from localStorage
  const user = (() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored && stored !== "undefined") {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.log("Invalid user data");
    }
    return null;
  })();

  function goToTopicSelection() {
    navigate("/topicselection");
  }

  function goToResults() {
    navigate("/resultchart");
  }

  function goToScope() {
    navigate("/scoperouter");
  }

  function logout() {
    fetch("http://localhost:8081/logoutstud.php", {
      credentials: "include",
    }).then(() => {
      navigate("/");
    });
  }

  // Determine scope content based on user role
  const getScopeContent = () => {
    if (user?.role === "college") {
      return {
        icon: <Route size={48} />,
        title: "Learning Roadmap",
        description: "Explore career paths in Developer, AI-ML, or DevOps",
        buttonText: "View Roadmap",
      };
    } else if (user?.role === "competitive") {
      return {
        icon: <Image size={48} />,
        title: "Label & Revise",
        description:
          "Upload diagrams and create interactive labels for learning",
        buttonText: "Try It Out",
      };
    } else {
      return {
        icon: <Map size={48} />,
        title: "Learning Scope",
        description: "Explore the curriculum roadmap and topics",
        buttonText: "View Scope",
      };
    }
  };

  const scopeContent = getScopeContent();

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome to Your Dashboard</h1>
        <p className="subtitle">Choose an option to get started</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card" onClick={goToTopicSelection}>
          <div className="card-icon">
            <BookOpen size={48} />
          </div>
          <h3>Pick A Topic</h3>
          <p>Select and practice topics to improve your skills</p>
          <button className="btn-primary">Start Learning</button>
        </div>

        <div className="dashboard-card" onClick={goToResults}>
          <div className="card-icon">
            <BarChart3 size={48} />
          </div>
          <h3>View Results</h3>
          <p>Check your performance and progress analytics</p>
          <button className="btn-primary">View Stats</button>
        </div>

        <div className="dashboard-card" onClick={goToScope}>
          <div className="card-icon">{scopeContent.icon}</div>
          <h3>{scopeContent.title}</h3>
          <p>{scopeContent.description}</p>
          <button className="btn-primary">{scopeContent.buttonText}</button>
        </div>
      </div>

      <button className="btn-logout" onClick={logout}>
        <LogOut size={18} />
        Logout
      </button>
    </div>
  );
}

export default Dashboard;
