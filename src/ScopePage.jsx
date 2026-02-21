import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import QuestionsPage from "./QuestionsPage";
import ResultChart from "./ResultChart";
import ScopePage from "./ScopePage";

function Dashboard({ user }) {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);

  function loadResults() {
    fetch("http://localhost:5000/results/" + user.user_id)
      .then((res) => res.json())
      .then((data) => {
        setResults(data);
        navigate("results"); // Navigate to nested route
      });
  }

  return (
    <div>
      <h2>Dashboard</h2>

      <button onClick={() => navigate("questions")}>Questions</button>
      <button onClick={loadResults}>Results</button>
      <button onClick={() => navigate("scope")}>Scope</button>

      {/* Nested routes */}
      <Routes>
        <Route path="questions" element={<QuestionsPage user={user} />} />
        <Route path="results" element={<ResultChart results={results} />} />
        <Route path="scope" element={<ScopePage user={user} />} />
      </Routes>
    </div>
  );
}

export default Dashboard;
