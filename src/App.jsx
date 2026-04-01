import React, { useState } from "react"; // Ensure 'React' is explicitly imported
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import TopicSelection from "./TopicSelection";
import QuestionsPage from "./QuestionsPage";
import ResultChart from "./ResultChart";

import Logout from "./logout";
import Roadmap from "./Roadmap";
import ScopeRouter from "./ScopeRouter";
import ScopePageClg from "./ScopePageClg";
import ScopePageCmp from "./ScopePageCmp";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/topicselection" element={<TopicSelection />} />
        <Route path="/questionspage/:topic" element={<QuestionsPage />} />
        <Route path="/resultchart" element={<ResultChart />} />
        <Route path="/logout" element={<logout />} />
        <Route path="/scoperouter" element={<ScopeRouter />} />
        <Route path="/scope/clg" element={<ScopePageClg />} />
        <Route path="/scope/cmp" element={<ScopePageCmp />} />

        {/*<Route path="/roadmap/:role" element={<RoleRoadmap />} />*/}

        <Route path="/roadmap/:type" element={<Roadmap />} />
      </Routes>
    </Router>
  );
}

export default App;
